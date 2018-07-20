'use strict'

/*
* 登录接口Controller
* */

const Controller = require('egg').Controller;


class SignController extends Controller{
    async index(){
        let phone=this.ctx.params.phone;
        let code=this.ctx.params.code;
        let password=this.ctx.params.password;
        const preInfo = await this.app.mysql.get('authCode', {id: phone});


        //-------------------检查用户填写的验证码是否正确， 如果正确， 存储用户电话和密码----------------
        /*
        *短信验证码正确        返回1
        *短信验证码错误        返回0
        */
        let stateCode = 0
        if(preInfo!=null){
           let preCode = preInfo.id;
           if(preCode == code){
               stateCode = 1
           }
        }

        // let post={"phone":phone,"password":password};


        this.ctx.body=stateCode;
    }
}

module.exports = SignController;