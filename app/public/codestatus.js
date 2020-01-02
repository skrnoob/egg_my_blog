
const constant = require('./constant')
const codeStatus = {
    [constant.CAPTCHA_WRONG]:{
        code:201,
        msg:'验证码错误'
    },
    [constant.SAME_NAME_MAIL]:{
        code:202,
        msg:'用户名和邮箱已存在'
    },
    [constant.SAME_NAME]:{
        code:203,
        msg:'用户名已存在'
    },
    [constant.SAME_MAIL]:{
        code:204,
        msg:'邮箱已存在'
    },
    [constant.SIGN_UP_SUCCEED]:{
        code:200,
        msg:'注册成功'
    },
    [constant.SIGN_UP_FAIL]:{
        code:205,
        msg:'注册失败'
    },
    [constant.LOGIN_SUCCEED]:{
        code:200,
        msg:'登录成功'
    },
    [constant.LOGIN_FAIL]:{
        code:206,
        msg:'登录失败，账号或密码错误'
    },
    [constant.IS_LOGIN]:{
        code:200,
        msg:'已登录'
    },
    [constant.UN_LOGIN]:{
        code:207,
        msg:'未登录'
    },
    [constant.UNKNOW_WRONG]:{
        code:208,
        msg:'未知错误'
    }
}

module.exports = codeStatus