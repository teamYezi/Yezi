'use strict'

/*
* 更改个人信息Controller
*/



const Controller = require('egg').Controller;
const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');
// const sendToWormhole = require('stream-wormhole');

class personInfoController extends Controller{
    async index(){
        const query = this.ctx.query;
        let postfix = query.postfix;
        let name = query.name;
        let gender = query.gender;
        let birthday = query.birthday;
        let signature = query.signature;
        let id = query.id;//手机号

        const preInfo = await this.app.mysql.get('userInfo', {id: id});

        //------------------------------存储或更新个人资料------------------------------------
        if(preInfo!=null){
            var curTime = new Date().getTime();
            let avatar = curTime + postfix;
            let avatarFull = "http://pc9byzxgk.bkt.clouddn.com/"+curTime + postfix;
            if(postfix=="null"){
                avatar = null;
                avatarFull = null;
            }
            //昵称， 性别， 生日， 个人标签
            const user = {
                avatar: avatarFull,
                name: name,
                gender: gender,
                birthday: birthday,
                signature: signature,
                id: id,
            };
            //存入数据库
            const updatedUser = await this.app.mysql.update('userInfo', user);
            //返回给前端
            const userReturn = {
                avatar: avatar,
                name: name,
                gender: gender,
                birthday: birthday,
                signature: signature,
                id: id,
            };
            this.ctx.body=userReturn;

        }else{
            console.log('此用户不存在，存储用户信息出错')
        }
    }
    async getInfo(){
        const query = this.ctx.query;
        let id = query.phone;//手机号
        const preInfo = await this.app.mysql.get('userInfo', {id: id});
        this.ctx.body=preInfo;
    }
}

module.exports = personInfoController;
