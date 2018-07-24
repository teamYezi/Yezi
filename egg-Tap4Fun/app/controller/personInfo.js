'use strict'

/*
* 更改个人信息Controller
*/

/*
* 返回头像ID, 头像id = 电话号
*/


const Controller = require('egg').Controller;
const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');
// const sendToWormhole = require('stream-wormhole');

class personInfoController extends Controller{
    async index(){
        //-----------------/personInfo/:postfix/:name/:gender/:birthday/:signature/:id
        let postfix = this.ctx.params.postfix;
        console.log('aaaaaaaaaaaa', postfix);
        let name = this.ctx.params.name;
        let gender = this.ctx.params.gender;
        let birthday = this.ctx.params.birthday;
        let signature = this.ctx.params.signature;
        let id = this.ctx.params.id;//手机号

        const preInfo = await this.app.mysql.get('userInfo', {id: id});

        //------------------------------存储或更新个人资料------------------------------------
        if(preInfo!=null){
            //昵称， 性别， 生日， 个人标签
            const user = {
                name: name,
                gender: gender,
                birthday: birthday,
                signature: signature,
                id: id,
                avatar: id,
            };

            const updatedUser = await this.app.mysql.update('userInfo', user);

        }else{
            console.log('此用户不存在，存储用户信息出错')
        }

        this.ctx.body=id;
    }
    async getInfo(){
        const query = this.ctx.query;
        let id = query.phone;//手机号
        const preInfo = await this.app.mysql.get('userInfo', {id: id});
        this.ctx.body=preInfo;
    }
}

module.exports = personInfoController;
