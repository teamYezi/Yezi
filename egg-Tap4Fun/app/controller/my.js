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

    async orders(){
        const query = this.ctx.query;
        let inputPhone = query.phone;
        let page = query.page;
        let category = query.category; //1全部 2待付款 3已付款
        let result = [];
        if (category == 1){//全部订单， 按下单时间排序
            const images = await this.app.mysql.query(`select * from orders where buyer_phone = ${inputPhone} order by order_time asc`);
            console.log(images);
            if (images.length > 0) {
                let order_number = images[0].order_number;
                let index= 0;
                while (index<images.length){
                    let cur_order = [];//属于同一个order的不同图片
                    while(images[index].order_number == order_number){
                        let cur_img_id = images[index].imgID;
                        let cur_img_info = (await this.app.mysql.query(`select * from imgInfo where id = ${cur_img_id}`))[0];
                        let cur_img = {
                            "img_id":cur_img_id,
                            "img_url": cur_img_info.imgURL,
                            "img_name": cur_img_info.imgName,
                            "img_price": cur_img_info.price,
                        };
                        cur_order.push(cur_img);
                        index += 1;
                        if(index >= images.length){
                            break;
                        }
                    }
                    let cur_order_all = {
                        "order_number": order_number,
                        "time_ordered": images[index-1].order_time,
                        "time_paid": images[index-1].deal_time,
                        "payment_status": images[index-1].status,
                        "images": cur_order,
                    };
                    result.push(cur_order_all);
                    if(index >= images.length){
                        break;
                    }
                    order_number = images[index].order_number;
                }
            }
        }

        if (category == 2){//未付款订单， 按下单时间排序
            const images = await this.app.mysql.query(`select * from orders where status = 0 and buyer_phone = ${inputPhone} order by order_time asc`);
            if (images.length > 0) {
                let order_number = images[0].order_number;
                let index= 0;
                while (index<images.length){
                    let cur_order = [];//属于同一个order的不同图片
                    while(images[index].order_number == order_number){
                        let cur_img_id = images[index].imgID;
                        let cur_img_info = (await this.app.mysql.query(`select * from imgInfo where id = ${cur_img_id}`))[0];
                        let cur_img = {
                            "img_id":cur_img_id,
                            "img_url": cur_img_info.imgURL,
                            "img_name": cur_img_info.imgName,
                            "img_price": cur_img_info.price,
                        };
                        cur_order.push(cur_img);
                        index += 1;
                        if(index >= images.length){
                            break;
                        }
                    }
                    let cur_order_all = {
                        "order_number": order_number,
                        "time_ordered": images[index-1].order_time,
                        "time_paid": images[index-1].deal_time,
                        "images": cur_order,
                    };
                    result.push(cur_order_all);
                    if(index >= images.length){
                        break;
                    }
                    order_number = images[index].order_number;
                }
            }
        }

        if (category == 3){//已付款订单，按付款时间排序
            const images = await this.app.mysql.query(`select * from orders where status = 1 and buyer_phone = ${inputPhone} order by deal_time asc`);
            if (images.length > 0) {
                let order_number = images[0].order_number;
                let index= 0;
                while (index<images.length){
                    let cur_order = [];//属于同一个order的不同图片
                    while(images[index].order_number == order_number){
                        let cur_img_id = images[index].imgID;
                        let cur_img_info = (await this.app.mysql.query(`select * from imgInfo where id = ${cur_img_id}`))[0];
                        let cur_img = {
                            "img_id":cur_img_id,
                            "img_url": cur_img_info.imgURL,
                            "img_name": cur_img_info.imgName,
                            "img_price": cur_img_info.price,
                        };
                        cur_order.push(cur_img);
                        index += 1;
                        if(index >= images.length){
                            break;
                        }
                    }
                    let cur_order_all = {
                        "order_number": order_number,
                        "time_ordered": images[index-1].order_time,
                        "time_paid": images[index-1].deal_time,
                        "images": cur_order,
                    };
                    result.push(cur_order_all);
                    if(index >= images.length){
                        break;
                    }
                    order_number = images[index].order_number;
                }
            }
        }
        result = this.paging(page, result, 8);//每页显示八个订单
        this.ctx.body = result;
    }

    async transaction(){
        const query = this.ctx.query;
        let inputPhone = query.phone;
        let page = query.page;
        let result = [];
        const all = await this.app.mysql.query(`select * from orders where seller_phone = ${inputPhone} and status = 1 order by order_time desc`);
        if(all.length>0){
            for (var i=0; i<all.length; i++){
                //购入时间
                let deal_time = all[i].deal_time;
                //作品ID
                let img_id = all[i].imgID;
                //作品订单号
                let order_number = all[i].order_number;
                const img = await this.app.mysql.get('imgInfo', {id: img_id});
                //作品价格
                let price = img.price;
                //作品名字
                let img_name = img.imgName;
                //作品URL
                let img_URL = img.imgURL;
                const buyer = await this.app.mysql.get('userInfo', {id: all[i].buyer_phone});
                //买家名字
                let buyer_name = buyer.name;
                //买家头像
                let buyer_avatar = buyer.avatar;
                let deal = {
                    "deal_time": deal_time,
                    "img_id": img_id,
                    "order_number": order_number,
                    "price": price,
                    "img_name": img_name,
                    "img_url": img_URL,
                    "buyer_name": buyer_name,
                    "buyer_avatar": buyer_avatar,
                }
                result.push(deal);
            }
        }
        result = this.paging(page, result, 10);
        this.ctx.body = result;
    }

    async mylikes(){
        const query = this.ctx.query;
        let inputPhone = query.phone;
        let page  = query.page;
        let result = [];
        let all = await this.app.mysql.query(`select * from likes where phone = ${inputPhone} order by time asc`);
        if(all.length>0){
            for(var i=0; i<all.length; i++){
                let img_info = await this.app.mysql.query(`select * from imgInfo where id = ${all[i].imgLikesID}`);
                // console.log(img_info);
                let img = {
                    "time": all[i].time,
                    "img_name": img_info[0].imgName,
                    "img_id": img_info[0].id,
                    "img_url": img_info[0].imgURL,
                };
                result.push(img);
            }
        }
        result = this.paging(page, result, 10);
        this.ctx.body = result;
    }

    async balance(){
        const query = this.ctx.query;
        let inputPhone = query.phone;
        // let balance = await this.app.mysql.get('userInfo',{id: inputPhone});
        let balance = await this.app.mysql.query(`select balance from transaction where phone = ${inputPhone} order by id desc`);
        this.ctx.body=balance[0];
    }

    async transactionDetails(){
        const query = this.ctx.query;
        let inputPhone = query.phone;
        let page = query.page;
        let result = await this.app.mysql.query(`select transaction, balance, time from transaction where phone = ${inputPhone} order by time desc`);
        result = this.paging(page, result, 10);
        this.ctx.body = result;
    }

    async likemessage() {
        const query = this.ctx.query;
        let inputPhone = query.phone;
        let page = query.page;
        let result = [];
        const all = await this.app.mysql.query(`select * from likes where imgLikesID in (select id from imgInfo where phone = ${inputPhone}) order by time desc`);
        //作者名字， 作者头像url， 点赞时间， 图片url
        if(all.length>0){
            for(var i=0; i<all.length; i++){
                const user = await this.app.mysql.get('userInfo', {id: all[i].phone});
                const image = await this.app.mysql.get('imgInfo', {id: all[i].imgLikesID});
                console.log(image);
                let info = {
                    "user_name": user.name,
                    "user_avatar": user.avatar,
                    "time": all[i].time,
                    "img_url": image.imgURL,
                }
                result.push(info);
            }
        }
        result = this.paging(page, result, 10);
        this.ctx.body = result;
    }

}
module.exports = myController;
