'use strict'

/*
* 登录接口Controller
* created by LoveMei 19/7/2018
* */

/*
*账号正确    密码正确   返回1
*账号正确    密码错误   返回2
*账号不存在            返回3
*/
const Controller = require('egg').Controller;

class LoginController extends Controller{
    async index(){
        const query=this.ctx.query;
        console.log(query)
        let phone=query.phone;
        let password=query.password;
        const userInfo = await this.app.mysql.get('userInfo', { id:phone });

        let stateCode=1;
        if(userInfo==null){
            stateCode=3
        }else {
            let userPassword=userInfo.password
            if(userPassword!=password){
                stateCode=2
            }
        }

        this.ctx.body=stateCode;
    }
}

module.exports = LoginController;