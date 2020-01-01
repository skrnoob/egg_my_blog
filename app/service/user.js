const Service = require('egg').Service
const fs = require('fs')
const uuidvl = require('uuid/v1')
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
}

module.exports = UserService