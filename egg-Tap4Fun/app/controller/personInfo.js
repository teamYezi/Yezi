'use strict'

/*
* 更改个人信息Controller
* */


const Controller = require('egg').Controller;

class personInfoController extends Controller{
    async index(){
        let avatar = this.ctx.params.avatar;
        let name = this.ctx.params.name;
        let gender = this.ctx.params.gender;
        let birthday = this.ctx.params.birthday;
        let signature = this.ctx.params.signature;
        let id = this.ctx.params.id;//手机号

        const preInfo = await this.app.mysql.get('userInfo', {id: id});


        //------------------------------存储或更新个人资料------------------------------------
        if(preInfo!=null){
            //头像！！！！！！！！！！！！！！！！！！！
            //昵称， 性别， 生日， 个人标签
            const user = {
                name: name,
                gender: gender,
                birthday: birthday,
                signature: signature,
                id: id,
            };
            const updatedUser = await this.app.mysql.update('userInfo', user);
        }else{
            console.log('此用户不存在，存储用户信息出错')
        }
        //
        this.ctx.body=id;
    }
}

module.exports = personInfoController;