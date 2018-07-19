'use strict'

/*
* 登录接口Controller
* created by LoveMei 19/7/2018
* */

const Controller = require('egg').Controller;


class LoginController extends Controller{
    async index(){
        let phone=this.ctx.params.phone
        let password=this.ctx.params.password
        let post={"phone":phone,"password":password};
        this.ctx.body=post;
    }

}

module.exports = LoginController;