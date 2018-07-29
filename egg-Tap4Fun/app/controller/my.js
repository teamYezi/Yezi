'use strict'

const {Controller} = require('egg');

class myController extends Controller{
    paging(pageNum, arr, num){
        return(arr.slice((pageNum-1)*num, (pageNum)*num));
    }

    convertTags(tag){
        switch (tag){
            case 'lvpai':return "旅拍";
            case 'danse':return "单色";
            case 'lengdan': return "冷淡";
            case 'qingxin': return "清新";
            case 'wenyi': return "文艺";
            case 'segan': return "色感";
            case 'shunjian': return "瞬间";
            case 'kongqi': return "空气";
            case 'yuanqi': return "元气";
            case 'yuanfang': return "远方";
            default:return 'other';
        }
    }

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

    //我已发布作品的id和url
    async published(){
        const query=this.ctx.query;
        let phone = query.phone;
        let page = query.page;
        let publishedImg = await this.app.mysql.query(`select imgURL, id from imgInfo where phone = ${phone} and status = 1`);
        publishedImg = this.paging(page, publishedImg, 15);
        this.ctx.body=publishedImg;
    }

    //我待审核作品的id和url
    async pending(){
        const query=this.ctx.query;
        let phone = query.phone;
        let page = query.page;
        let pendingImg = await this.app.mysql.query(`select imgURL, id from imgInfo where phone = ${phone} and status = 0`);
        pendingImg = this.paging(page, pendingImg, 15);
        this.ctx.body=pendingImg;
    }

    //我关注的人的头像, 名字, 签名, 电话号(id)
    async follow(){
        const query=this.ctx.query;
        let phone = query.phone;
        let page = query.page;
        let followedUser = await this.app.mysql.query(`select avatar, name, signature, id from userInfo where id in (select followed_user from follow where user_id = ${phone})`);
        followedUser = this.paging(page, followedUser, 30);
        this.ctx.body = followedUser;
    }

    //我粉丝的头像, 名字, 签名, 电话号(id), 是否关注对方（是返回1， 不是返回0）
    async fans(){
        const query=this.ctx.query;
        let phone = query.phone;
        let page = query.page;
        //所有粉丝
        let fans = await this.app.mysql.query(`select avatar, name, signature, id from userInfo where id in (select follower from fans where user_id = ${phone})`);
        let data = [];
        for (var i=0; i<fans.length; i++){
            let followBack = await this.app.mysql.query(`select * from follow where user_id = ${phone} and followed_user = ${fans[i].id}`);
            let follow_back = 1;
            if(followBack.length === 0){//没有回粉
                follow_back = 0;
            }
            data[i]={
                "avatar": fans[i].avatar,
                "name": fans[i].name,
                "signature": fans[i].signature,
                "id": fans[i].id,
                "follow_back": follow_back,
            };

        }
        data = this.paging(page, data, 30);
        this.ctx.body = data;
    }
}
module.exports = myController;
