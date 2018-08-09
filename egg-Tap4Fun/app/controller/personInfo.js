'use strict'

/*
* 更改个人信息Controller
*/

const Controller = require('./my');

class personInfoController extends Controller{
    async index(){
        const query = this.ctx.query;
        let postfix = query.postfix;
        let name = query.name;
        let gender = query.gender;
        let birthday = query.birthday;
        let signature = query.signature;
        let id = query.id;//手机号
        let check = query.check;

        const preInfo = await this.app.mysql.get('userInfo', {id: id});

        //------------------------------存储或更新个人资料------------------------------------
        if(preInfo!=null){
            var curTime = new Date().getTime();
            let avatar = curTime + postfix;
            let avatarFull = preInfo.avatar;
            if(Number(check)!=0){
                avatarFull = "http://pc9byzxgk.bkt.clouddn.com/"+curTime + postfix;
            }
            console.log(avatarFull);
            // if(postfix=="null"){
            //     avatar = null;
            //     avatarFull = null;
            // }
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

    async userpage(){
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
        const targetImages = await this.app.mysql.query(`select imgURL, id from imgInfo where phone = ${targetID} and status = 1`);
        let targetimg = this.paging(page, targetImages, 15);

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
            //增加关注数和对象粉丝数
            const fo = await this.app.mysql.query(`update userInfo set follower_num =  follower_num + 1 where id = ${selfID}`);
            const fan = await this.app.mysql.query(`update userInfo set fans_num =  fans_num + 1 where id = ${targetID}`);

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
            //减少关注数和对象粉丝数
            const fo = await this.app.mysql.query(`update userInfo set follower_num =  follower_num - 1 where id = ${selfID}`);
            const fan = await this.app.mysql.query(`update userInfo set fans_num =  fans_num - 1 where id = ${targetID}`);
        }
        this.ctx.body = status;
    }
}

module.exports = personInfoController;
