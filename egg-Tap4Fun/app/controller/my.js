'use strict'

const Controller = require('egg').Controller;

class myController extends Controller{
    //返回我的头像， 名字， 签名， 作品数， 关注的人数， 粉丝的人数
    async index(){
        const query=this.ctx.query;
        let phone = query.phone;
        const me = await this.app.mysql.get('userInfo', {id:phone});
        const follow = await this.app.mysql.query(`select * from follow where user_id = ${phone}`);
        const fans = await this.app.mysql.query(`select * from fans where user_id = ${phone}`);
        let data = {
            "avatar": me.avatar,
            "name": me.name,
            "signature": me.signature,
            "imgNum": me.imgNum,
            "numFollows": follow.length,
            "numFans": fans.length,
        };
        this.ctx.body=data;
    }
}

module.exports = myController;