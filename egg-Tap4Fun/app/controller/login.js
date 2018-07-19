'use strict'

/*
* 登录接口Controller
* created by LoveMei 19/7/2018
* */

const Controller = require('egg').Controller;


class LoginController extends Controller{
    async index(){
        let phone=this.ctx.params.phone
        let password=this.ctx.params.passwordß
        const userInfo = await this.app.mysql.get('userInfo', { phone:phone });

        //如果用户输入合法且存在，返回1， 反之0
        let stateCode=1
        if(userInfo==null){
            stateCode=0
        }else {
            let userPassword=userInfo.password
            if(userPassword!=password){
                stateCode=0
            }
        }

        // let post={"phone":phone,"password":password};
        this.ctx.body=stateCode;
    }
}

//connect to MySQL database server
// let mysql =  require("mysql");
// let connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : '11111111',
//     database : 'tap4fun'
// });
// connection.connect(function(err) {
//     if (err) {
//         return console.error('error: ' + err.message);
//     }
//
//     console.log('Connected to the MySQL server.');
// });



module.exports = LoginController;