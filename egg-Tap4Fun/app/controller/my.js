'use strict'

const {Controller} = require('egg');

function noti_type(num){
    switch(num){
        case 1: return "版权消息";
        case 2: return "交易消息";
        case 3: return "公告";
        default: return "";
    }
}

function isContains(str, substr){
    return str.indexOf(substr)>=0;
}

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
        publishedImg = this.paging(page, publishedImg, 100);
        this.ctx.body=publishedImg;
    }

    //我待审核作品的id和url
    async pending(){
        const query=this.ctx.query;
        let phone = query.phone;
        let page = query.page;
        let pendingImg = await this.app.mysql.query(`select imgURL, id from imgInfo where phone = ${phone} and status = 0`);
        pendingImg = this.paging(page, pendingImg, 100);
        this.ctx.body=pendingImg;
    }

    //我关注的人的头像, 名字, 签名, 电话号(id)
    async follow(){
        const query=this.ctx.query;
        let phone = query.phone;
        let page = query.page;
        let followedUser = await this.app.mysql.query(`select avatar, name, signature, id from userInfo where id in (select followed_user from follow where user_id = ${phone})`);
        followedUser = this.paging(page, followedUser, 100);
        this.ctx.body = followedUser;
    }

    //搜索关注人
    async followsearch(){
        const query = this.ctx.query;
        let input = query.input;
        let inputPhone = query.phone;
        let page = query.page;
        let result = [];
        let followedUser = await this.app.mysql.query(`select avatar, name, signature, id from userInfo where id in (select followed_user from follow where user_id = ${inputPhone})`);
        if(followedUser.length>0){
            for(var i=0; i<followedUser.length; i++){
                if(isContains(followedUser[i].name, input) === true){
                    result.push(followedUser[i]);
                }
            }
        }
        result = this.paging(page, result, 100);
        this.ctx.body = result;
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

    async fanssearch(){
        const query=this.ctx.query;
        let phone = query.phone;
        let page = query.page;
        let input = query.input;
        //所有粉丝
        let fans = await this.app.mysql.query(`select avatar, name, signature, id from userInfo where id in (select follower from fans where user_id = ${phone})`);
        let data = [];
        let result = [];
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
        if(data.length>0){
            for(var i=0; i<data.length; i++){
                if(isContains(data[i].name, input) === true){
                    result.push(data[i]);
                }
            }
        }
        result = this.paging(page, result, 30);
        this.ctx.body = result;
    }

    async orders(){
        const query = this.ctx.query;
        let inputPhone = query.phone;
        let page = query.page;
        let category = query.category; //1全部 2待付款 3已付款
        let result = [];
        if (category == 1){//全部订单， 按下单时间排序
            const images = await this.app.mysql.query(`select * from orders where buyer_phone = ${inputPhone} order by order_time desc`);
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
            const images = await this.app.mysql.query(`select * from orders where status = 0 and buyer_phone = ${inputPhone} order by order_time desc`);
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
            const images = await this.app.mysql.query(`select * from orders where status = 1 and buyer_phone = ${inputPhone} order by deal_time desc`);
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
        console.log(all);
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
        let all = await this.app.mysql.query(`select * from likes where phone = ${inputPhone} order by time desc`);
        // console.log(all);
        if(all.length>0){
            for(var i=0; i<all.length; i++){
                console.log(all[i].imgLikesID);
                let img_info = await this.app.mysql.query(`select * from imgInfo where id = ${all[i].imgLikesID}`);//我点赞的图片的id
                let user_phone = (await this.app.mysql.get('imgInfo', {id: all[i].imgLikesID})).phone;//图片所属人的电话
                let user = await this.app.mysql.get('userInfo', {id: user_phone});
                let img = {
                    "name":user.name,
                    "user_avatar": user.avatar,
                    "time": all[i].time,
                    "img_description": img_info[0].description,
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
        let data =[];
        let result = await this.app.mysql.query(`select order_number, transaction, balance, time from transaction where phone = ${inputPhone} order by time desc`);
        if(result.length>0){
            for(var i=0; i<result.length; i++){
                let temp = result[i];
                if(result[i].order_number==null) {//充值或者提现
                    if(Number(temp.transaction)>=0){//充值
                        temp['cate']='充值';
                        data.push(temp);
                    }else{//提现
                        temp['cate']='提现';
                        data.push(temp);
                    }
                }else{//收入或支出
                    if(Number(temp.transaction)>=0){//收入
                        temp['cate']='收入';
                        data.push(temp);
                    }else{//支出
                        temp['cate']='支出';
                        data.push(temp);
                    }
                }
            }
        }
        data = this.paging(page, data, 10);
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
                // console.log(image);
                let info = {
                    "user_name": user.name,
                    "user_avatar": user.avatar,
                    "user_id": user.id,
                    "time": all[i].time,
                    "img_url": image.imgURL,
                    "img_id":image.id,
                };
                result.push(info);
            }
        }
        result = this.paging(page, result, 10);
        this.ctx.body = result;
    }

    async cmtmessage() {
        const query = this.ctx.query;
        let inputPhone = query.phone;
        let page = query.page;
        let result = [];
        //评论人头像，名字，评论时间，评论内容，我的作品url，作品描述。按时间排序
        const all = await this.app.mysql.query(`select * from cmtInfo where imgID in (select id from imgInfo where phone = ${inputPhone} order by pubdate desc)`);
        if(all.length>0){
            for(var i=0; i<all.length; i++){
                const user = await this.app.mysql.get('userInfo', {id:all[i].phone});//评论人的信息
                const img = await this.app.mysql.get('imgInfo', {id: all[i].imgID});
                let info = {
                    "user_avatar": user.avatar,
                    "user_name": user.name,
                    "user_id": user.id,
                    "cmt_time": all[i].pubdate,
                    "comment": all[i].comment,
                    "img_url": img.imgURL,
                    "img_id": img.id,
                    "img_description": img.description,
                }
                result.push(info);
            }
        }
        result = this.paging(page, result, 10);
        this.ctx.body = result;
    }

    async notification() {
        const query = this.ctx.query;
        let inputPhone = query.phone;
        let page = query.page;
        let result = [];
        const all = await this.app.mysql.query(`select * from notification where phone = ${inputPhone} order by time desc`);
        if(all.length>0){
            for(var i=0; i<all.length; i++){
                let noti = {
                    "avatar_url": 'http://pc9byzxgk.bkt.clouddn.com/LOGO.jpg',
                    "notification_type": noti_type(all[i].type),
                    "time": all[i].time,
                    "content": all[i].content,
                }
                result.push(noti);
            }
        }

        result = this.paging(page, result, 10);
        this.ctx.body = result;
    }
}
module.exports = myController;
