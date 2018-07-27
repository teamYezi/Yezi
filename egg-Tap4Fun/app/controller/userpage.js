'use strict'

/*
* 用户信息界面接口Controller
* */

/*
*返回对象用户头像id， 关注人数， 粉丝人数， 是否已关注此人（是1否-1），所有作品的id
*/
// import {paging} from "./mainpage";

const Controller = require('egg').Controller;

class userpageController extends Controller{
    async index(){
        const query = this.ctx.query;
        let selfID=query.selfID;
        let targetID=query.targetID;
        let page = query.page;

        //对象用户头像id
        let avatar = null;
        const targetInfo = await this.app.mysql.get('userInfo', { id:targetID });
        if(targetInfo!=null){
            avatar = targetInfo.avatar;
        }

        //对象用户的关注人数
        let following = 0;
        const targetFollow = await this.app.mysql.select('follow', {
            where: {user_id: targetID}
        });
        if (targetFollow != null){
            following = targetFollow.length;
        }
        console.log('following:',following);

        //对象用户的粉丝人数
        let fans = 0;
        const targetFans = await this.app.mysql.select('fans', {
            where: {user_id:targetID}
        });
        if(targetFans != null){
            fans = targetFans.length;
        }
        console.log('fans:',fans);

        //检查是否已关注对象用户
        let followed = 1;
        const selfFollow = await this.app.mysql.get('follow', {
            user_id: selfID,
            followed_user: targetID
        });
        if(selfFollow == null){
            followed = -1;
        }

        //对象用户的所有的作品id和URL
        const targetImages = await this.app.mysql.query(`select imgURL, id from imgInfo where phone = ${targetID}`);
        let targetimg = 1;
        console.log(targetimg);
        let data= {
            "avatar":avatar,
            "following": following,
            "fans": fans,
            "followed":followed,
            "imagesInfo": targetimg,
        };

        this.ctx.body=data;
    }

    async follow(){
        const query = this.ctx.query;
        let selfID=query.selfID;
        let targetID=query.targetID;

        const fCheck = await this.app.mysql.get('follow', {
            user_id: selfID,
            followed_user: targetID
        });

        let status = '';
        var curTime = new Date().getTime();
        if (fCheck == null){//未关注： 关注， 更新关注表和粉丝表
            status = '未关注， 即将关注';
            const newFollowRecord = {
                user_id: selfID,
                followed_user: targetID,
                updated_at: curTime
            };
            const newFollow = await this.app.mysql.insert('follow', newFollowRecord);
            const newFansRecord = {
                user_id: targetID,
                follower: selfID,
                updated_at: curTime
            }
            const newFans = await this.app.mysql.insert('fans', newFansRecord);

        }else{//已关注了: 删除关注表和粉丝表
            status = '已关注，即将取关';
            const unfollow = await this.app.mysql.delete('follow',{
               user_id: selfID,
               followed_user: targetID
            });
            const unfans = await this.app.mysql.delete('fans',{
                user_id: targetID,
                follower: selfID
            });
        }
        this.ctx.body = status;
    }
}
module.exports = userpageController;
