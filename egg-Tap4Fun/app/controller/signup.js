'use strict'

/*
* 登录接口Controller
* */

const Controller = require('egg').Controller;


class SignController extends Controller{
    async index(){
        let phone=this.ctx.params.phone;
        let code=this.ctx.params.code;
        let password=this.ctx.params.passwordß
        const precode = await this.app.mysql.select('authCode',{
            where: { phone: phone },
            orders: [['count','desc']],
            limit: 1,
            offset: 0
        });

        /*
        *账号正确    密码正确   返回1
        *账号正确    密码错误   返回2
        *账号不存在            返回3
        */
        // let stateCode=1
        // if(userInfo==null){
        //     stateCode=3
        // }else {
        //     let userPassword=userInfo.password
        //     if(userPassword!=password){
        //         stateCode=2
        //     }
        // }

        // let post={"phone":phone,"password":password};
        this.ctx.body=precode;
    }
}

module.exports = SignController;