'use strict'

/*
* 首页推荐Controller
* */

/*
*
*/
const Controller = require('egg').Controller;

//返回所有图片的（图片URL+图片id+图片描述+作者名字+作者头像+发布日期+评论数+点赞数+是否为这个作品点过赞(点过1没点过-1)） 按点赞数排序
class mainpageController extends Controller{
    async index(){
        const query=this.ctx.query;
        let phone = query.phone;
        //读取三个表的数据
        const images = await this.app.mysql.select('imgInfo',{
            orders:[['likes', 'desc']],
        });
        // const cmts = await this.app.mysql.select('cmtInfo',{});
        // const likes = await this.app.mysql.select('likes',{});
        var result = [];
        for (var i = 0; i< images.length; i++){
            const name = (await this.app.mysql.get('userInfo', { id:images[i].phone})).name;
            const avatar = (await this.app.mysql.get('userInfo', { id:images[i].phone})).avatar;
            let liked = -1;
            const check = await this.app.mysql.get('likes',{phone:phone, imgLikesID:images[i].id});
            if(check!=null){
                liked = 1;
            }
            const eachImg = {
                "imgURL":images[i].imgURL,
                "imgID":images[i].id,
                "description":images[i].description,
                "name":name,
                "avatar":avatar,
                "pubdate":images[i].pubdate,
                "cmtNum":images[i].comments,
                "likesNum":images[i].likes,
                "likedOrNot":liked,
            };
            result[i]=eachImg;
        }




        this.ctx.body=result;
    }
}

module.exports = mainpageController;