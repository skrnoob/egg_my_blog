const Service = require('egg').Service
const fs = require('fs')
const uuidvl = require('uuid/v1')

const NodeRSA = require('node-rsa')
const utility = require('utility')

var jwt = require('jsonwebtoken')
var svgCaptcha = require('svg-captcha')
const constant = require('../public/constant')
const codeStatus = require('../public/codestatus')

class UserService extends Service {
    async checkLogin(authorization){

        const { app,ctx } = this;
        let body;

        try {
            const decoded = jwt.verify(authorization,this.config.privateKey),
            { username,id,secret } = decoded,
            userSecret = await app.redis.get('SECRET:USER:ID:'+id);

            if(userSecret !== secret) throw '验证失败';
            
            const hasThisUser = await ctx.model.User.findUser(username,id)

            if(!hasThisUser) throw '验证失败';

            const uuid = uuidvl()
            const token = jwt.sign({ username,id,secret:uuid }, this.config.privateKey, { expiresIn: 60 * 60 * 72 });
            await app.redis.set('SECRET:USER:ID:'+ id,uuid,'EX',60 * 60 * 72)

            body = {
                code:codeStatus[constant.IS_LOGIN].code,
                msg:codeStatus[constant.IS_LOGIN].msg,
                data:{
                    username,
                    id,
                    token,
                    key:this.config.publicKey
                }
            }
        } catch (error) {
            console.log(error)
            body = {
                code:codeStatus[constant.UN_LOGIN].code,
                msg:codeStatus[constant.UN_LOGIN].msg,
                data:{
                    key:this.config.publicKey
                }
            }
        } finally{
            return body
        }
    }

    async checkImg(ip){
        const { app } = this
        var captcha = svgCaptcha.create({
            size: 4, // 验证码长度
            width:100,
            height:32,
            fontSize: 28,
            ignoreChars: '0oO1ilI', // 验证码字符中排除 0o1i
            noise: 2, // 干扰线条的数量
            color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
            background: '#eee' // 验证码图片背景颜色
        });

        await app.redis.set(ip,captcha.text,'EX',60)

        return captcha.data

    }

    async signUp({username,password,email,captcha,ip}){
        const { app,ctx } = this;
        let body;
        const redisCaptcha =  await app.redis.get(ip);
        if(redisCaptcha.toLowerCase() !== captcha.toLowerCase()){
            return body = {
                code:codeStatus[constant.CAPTCHA_WRONG].code,
                msg:status[constant.CAPTCHA_WRONG].msg
            }
        }
        const key = new NodeRSA(this.config.privateKey);
        key.setOptions({encryptionScheme:'pkcs1'})
        username = key.decrypt(username,'utf8')
        password = key.decrypt(password,'utf8')
        email = key.decrypt(email,'utf8')
        password = utility.md5(utility.md5(password))
        let sameName = await ctx.model.User.findSameName(username)
        let sameEmail = await ctx.model.User.findSameEmail(email)

        if(sameName&&sameEmail){
            return body = {
                code:codeStatus[constant.SAME_NAME_MAIL].code,
                msg:codeStatus[constant.SAME_NAME_MAIL].msg
            }
        }

        if(sameName){
            return body = {
                code:codeStatus[constant.sameName].code,
                msg:codeStatus[constant.sameName].msg
            }
        }

        if(sameEmail){
            return body = {
                code:codeStatus[constant.SAME_MAIL].code,
                msg:codeStatus[constant.SAME_MAIL].msg
            }
        }

        try {
            let result =  await ctx.model.User.createUser({username,password,email})
            console.log('create result',result)
            const { result_username,result_id } = result
            const uuid = uuidvl()
            var token = jwt.sign({
                username:result_username,
                id:result_id,
                secret:uuid
            })
            await app.redis.set('SECRET:USER:ID:'+ result_id,uuid,'EX',60 * 60 * 72)
            await app.redis.del(ip)
            return body = {
                code:codeStatus[constant.SIGN_UP_SUCCEED].code,
                msg:codeStatus[constant.SIGN_UP_SUCCEED].msg,
                data:{
                    username:result_username,
                    id:result_id,
                    token
                }
            }

        } catch (error) {
            console.log('error',error)
            return body = {
                code:codeStatus[constant.SIGN_UP_FAIL].code,
                msg:codeStatus[constant.SIGN_UP_FAIL].msg
            }
        }

    }

    async login({ username, password, captcha, ip}){
        const { app,ctx } = this;
        let body;

        try {
            let redisCaptcha = await app.redis.get(ip)
            if(redisCaptcha.toLowerCase() !== captcha.toLowerCase()) throw 'captcha wrong';
            try {
                const key = new NodeRSA(this.config.privateKey);
                key.setOptions({encryptionScheme:'pkcs1'})
                username = key.decrypt(username,'utf8')
                password = key.decrypt(password,'utf8')
                password = utility.md5(utility.md5(password))
                
                let result = ctx.model.User.login({username,password})

                if(!result) throw 'psw wrong'
                
                try {
                    const { result_username, result_id } = result
                    const uuid = uuidvl()
                    var token = jwt.sign({
                        username:result_username,
                        id:result_id,
                        secret:uuid
                    })
                    await app.redis.set('SECRET:USER:ID:'+ result_id,uuid,'EX',60 * 60 * 72)
                    await app.redis.del(ip)

                    return body = {
                        code:codeStatus[constant.LOGIN_SUCCEED].code,
                        msg:codeStatus[constant.LOGIN_SUCCEED].msg,
                        data:{
                            username:result_username,
                            id:result_id,
                            token
                        }
                    }
                } catch (error) {
                    return body = {
                        code:codeStatus[constant.UNKNOW_WRONG].code,
                        msg:codeStatus[constant.UNKNOW_WRONG].msg
                    }
                }
                
            } catch (error) {
                return body = {
                    code:codeStatus[constant.LOGIN_FAIL].code,
                    msg:codeStatus[constant.LOGIN_FAIL].msg
                }
            }

        } catch (error) {
            console.log('login error',error)
            return body = {
                code:codeStatus[constant.CAPTCHA_WRONG].code,
                msg:status[constant.CAPTCHA_WRONG].msg
            }
        }

        // let redisCaptcha = await app.redis.get(ip)
        // if(redisCaptcha.toLowerCase() !== captcha.toLowerCase()){
        //     return body = {
        //         code:codeStatus[constant.CAPTCHA_WRONG].code,
        //         msg:status[constant.CAPTCHA_WRONG].msg
        //     }
        // }
        // const key = new NodeRSA(this.config.privateKey);
        // key.setOptions({encryptionScheme:'pkcs1'})
        // username = key.decrypt(username,'utf8')
        // password = key.decrypt(password,'utf8')
        // password = utility.md5(utility.md5(password))

        // let result = ctx.model.User.login({username,password})

        // if(!result){
        //     return body = {
        //         code:codeStatus[constant.LOGIN_FAIL].code,
        //         msg:codeStatus[constant.LOGIN_FAIL].msg
        //     }
        // }

        // const { result_username, result_id } = result
        // const uuid = uuidvl()
        // var token = jwt.sign({
        //     username:result_username,
        //     id:result_id,
        //     secret:uuid
        // })
        // await app.redis.set('SECRET:USER:ID:'+ result_id,uuid,'EX',60 * 60 * 72)
        // await app.redis.del(ip)

        // return body = {
        //     code:codeStatus[constant.LOGIN_SUCCEED].code,
        //     msg:codeStatus[constant.LOGIN_SUCCEED].msg,
        //     data:{
        //         username:result_username,
        //         id:result_id,
        //         token
        //     }
        // }

    }
}

module.exports = UserService