'use strict'

/*
* 登录接口Controller
* */

/*
*短信验证码正确        返回1
*短信验证码错误        返回0
*验证码过期（5分钟）    返回-1
*/


const Controller = require('egg').Controller;


class SignController extends Controller{
    async index(){
        const query=this.ctx.query;
        let phone=query.phone;
        let code=query.code;
        let password=query.password;
        const preInfo = await this.app.mysql.get('authCode', {id: phone});


        //-------------------检查用户填写的验证码是否正确， 如果正确， 存储用户电话和密码----------------
        let stateCode = 0
        if(preInfo!=null){
            //检测验证码是否过期（5分钟）
            var curTime = new Date().getTime();
            let preTime = preInfo.time;
            if((curTime - preTime)/1000 < 300){//验证码未过期
                let preCode = preInfo.testNum;
                console.log(preCode)
                if(preCode == code){
                    stateCode = 1
                    //存储电话和密码到用户表, 初始作品上传数为0
                    const user = {
                        id: phone,
                        password: password,
                        imgNum: 0,
                    };
                    const newUser = await this.app.mysql.insert('userInfo', user);
                }
            }else{//验证码过期了
                stateCode = -1;
            }
        }

        this.ctx.body=stateCode;
    }
}

module.exports = SignController;