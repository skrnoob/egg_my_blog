
const constant = require('./constant')
const { CAPTCHA_WRONG,
    SAME_NAME_MAIL,
    SAME_NAME,
    SAME_MAIL,
    SIGN_UP_SUCCEED,
    SIGN_UP_FAIL,
    LOGIN_SUCCEED,
    LOGIN_FAIL,
    IS_LOGIN,
    UN_LOGIN
 } = constant
const codeStatus = {
    [CAPTCHA_WRONG]:{
        code:201,
        msg:'验证码错误'
    },
    [SAME_NAME_MAIL]:{
        code:202,
        msg:'用户名和邮箱已存在'
    },
    [SAME_NAME]:{
        code:203,
        msg:'用户名已存在'
    },
    [SAME_MAIL]:{
        code:204,
        msg:'邮箱已存在'
    },
    [SIGN_UP_SUCCEED]:{
        code:200,
        msg:'注册成功'
    },
    [SIGN_UP_FAIL]:{
        code:205,
        msg:'注册失败'
    },
    [LOGIN_SUCCEED]:{
        code:200,
        msg:'登录成功'
    },
    [LOGIN_FAIL]:{
        code:206,
        msg:'登录失败，账号或密码错误'
    },
    [IS_LOGIN]:{
        code:200,
        msg:'已登录'
    },
    [UN_LOGIN]:{
        code:207,
        msg:'未登录'
    }
}

module.exports = codeStatus