'use strict'

/*
* 上传图片接口Controller
* */

/*
*返回
* 1. 上传的图片id
* 2. 当前时间
* 3. TODO: 点赞数
*/

const Controller = require('egg').Controller;


class UploadImgController extends Controller{
    //TODO
    // async index(){
    //     let phone=this.ctx.params.phone;
    //     const preInfo = await this.app.mysql.get('authCode', {id: phone});
    //
    //
    //     //-------------------检查用户填写的验证码是否正确， 如果正确， 存储用户电话和密码----------------
    //     let stateCode = 0
    //     if(preInfo!=null){
    //         //检测验证码是否过期（5分钟）
    //         var curTime = new Date().getTime();
    //         let preTime = preInfo.time;
    //         if((curTime - preTime)/1000 < 300){//验证码未过期
    //             let preCode = preInfo.testNum;
    //             console.log(preCode)
    //             if(preCode == code){
    //                 stateCode = 1
    //                 //存储电话和密码到用户表
    //                 const user = {
    //                     id: phone,
    //                     password: password,
    //                 };
    //                 const newUser = await this.app.mysql.insert('userInfo', user);
    //             }
    //         }else{//验证码过期了
    //             stateCode = -1;
    //         }
    //     }
    //
    //     this.ctx.body=stateCode;
    // }
}

module.exports = UploadImgController;