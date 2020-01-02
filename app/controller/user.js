'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async checkLogin() {
    const { ctx } = this;
    const authorization = ctx.get('authorization')
    let body = await ctx.service.user.checkLogin(authorization)
    console.log(body)
    ctx.body = body
  }
  async checkImg(){
    const { ctx } = this;
    let body = await ctx.service.user.checkImg(ctx.request.ip)
    ctx.response.type = 'image/svg+xml'
    ctx.body = body
  }

  async signUp(){
    const { ctx } = this;
    console.log('body',ctx.request.body)
    let { username,password,email,captcha } = ctx.request.body
    let ip = ctx.request.ip
    let body = await ctx.service.user.signUp({ username,password,email,captcha,ip })
    ctx.body = body
  }

  async login(){
    const { ctx } = this;
    let { username,password,captcha } = ctx.request.body
    let ip = ctx.request.ip
    let body = await ctx.service.user.login({ username, password, captcha, ip})

    ctx.body = body
  }

}
module.exports = UserController;