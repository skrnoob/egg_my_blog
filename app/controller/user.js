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
}

module.exports = UserController;