'use strict'

/*
* 首页推荐Controller
* */

const Controller = require('./my');

function build_order_no(){
    var outTradeNo="";
    for(var i=0;i<6;i++){
        outTradeNo += Math.floor(Math.random()*10);
    }
    outTradeNo = new Date().getTime() + outTradeNo;
    return outTradeNo;
}

function isContains(str, substr){
    return str.indexOf(substr)>=0;
}

class mainpageController extends Controller{

    //首页推荐界面
    async index(){
        const query=this.ctx.query;
        let phone = query.phone;
        let page = query.page;


        const images = await this.app.mysql.query('select * from imgInfo where status=1 order by pubdate desc');

        var result = [];
        for (var i = 0; i< images.length; i++){
            const name = (await this.app.mysql.get('userInfo', { id:images[i].phone})).name;
            const avatar = (await this.app.mysql.get('userInfo', { id:images[i].phone})).avatar;
            let liked = -1;
            const check = await this.app.mysql.get('likes',{phone:phone, imgLikesID:images[i].id});
            if(check!=null){
                liked = 1;
            }
            if(phone=="NuLl"){//游客模式
                liked = -1;
            }
            const eachImg = {
                "imgURL":images[i].imgURL,
                "imgID":images[i].id,
                "description":images[i].description,
                "name":name,
                "phone":images[i].phone,
                "avatar":avatar,
                "pubdate":images[i].pubdate,
                "cmtNum":images[i].comments,
                "likesNum":images[i].likes,
                "likedOrNot":liked,
            };
            result[i]=eachImg;
        }
        // console.log(this.convertTags('fjdksjf'));
        let page_num = Math.ceil(result.length/10);
        let data ={
          "data": this.paging(page, result, 10),
            "page_num": page_num,
        };
        this.ctx.body=data;
    }

    //点赞或取消赞
    async likeOrUnlike(){
        const query=this.ctx.query;
        let id = query.id;//这张图的id
        let phone = query.phone;
        let message = "";

        const check = await this.app.mysql.get('likes', {phone: phone, imgLikesID: id});
        if (check==null){//如果还没有点赞
            //点赞数+1
            let likes = (await this.app.mysql.get('imgInfo', {id: id})).likes;
            if(likes==null){
                likes = 1;
            }else{
                likes += 1;
            }
            const imgUpdated = {id: id, likes: likes};
            const imgResult = await this.app.mysql.update('imgInfo', imgUpdated);
            //likes表更新
            const likesUpdated = {phone: phone, imgLikesID: id, time: Date.now()};
            const likesResult = await this.app.mysql.insert('likes', likesUpdated);
            message = "点赞成功";
        }else{//如果已点赞
            let likes = (await this.app.mysql.get('imgInfo', {id: id})).likes;
            if((likes==null)||(likes<1)){
                console.log('ERROR: 点赞数小于一')
            }else{
                //点赞数-1
                const imgUpdated = {id: id, likes: likes-1};
                const imgResult = await this.app.mysql.update('imgInfo', imgUpdated);
                //likes表更新
                const likesResult = await this.app.mysql.delete('likes', {imgLikesID: id});
                message = "取消赞成功";
            }
        }
        this.ctx.body = message;
    }

    //添加评论
    async addcomment(){
        const query = this.ctx.query;
        let img_id = query.id;
        let phone = query.phone;
        let cmt = query.cmt;
        //添加评论
        let cur_time = new Date().getTime();
        let comment = {
            imgID: img_id,
            comment: cmt,
            phone: phone,
            pubdate: cur_time,
        };
        const add_comment = await this.app.mysql.insert('cmtInfo', comment);
        //更改评论数
        const modify_cmt_num = await this.app.mysql.query(`update imgInfo set comments = comments+1 where id=${img_id}`);
        this.ctx.body = comment;
    }

    //图片详情
    async imgDetail(){
        const query = this.ctx.query;
        let id = query.id;//图片的id
        let inputphone = query.phone;//本人的电话

        const img = await this.app.mysql.get('imgInfo', {id:id});
        //图片URL
        let imgURL = img.imgURL;
        //图片名字
        let imgName = img.imgName;
        //图片id
        let fid = id;
        //图片标签
        let tags = await this.app.mysql.query(`select * from imgTag where id = ${id}`);
        let data=[];
        tags=tags[0];
        Object.keys(tags).forEach((key)=>{
            if(tags[key]===1){
                data.push(this.convertTags(key));
            }
        });
        //图片描述
        let description = img.description;
        //发布日期
        let pubdate = img.pubdate;
        //图片价格
        let price = img.price;
        //评论数
        let numComments = img.comments;
        //点赞数
        let likes = img.likes;
        //作者头像
        const phone = (await this.app.mysql.get('imgInfo', {id:id})).phone;
        const author = await this.app.mysql.get('userInfo', {id:phone});
        let avatar = author.avatar;
        //作者名字
        let authorName = author.name;
        //作者电话
        let authorPhone = author.id;
        //作者签名
        let authorSig = author.signature;
        //作品格式
        let imgType = img.postfix;
        //作品大小
        let imgSize = img.size;
        //图片分辨率
        let imgResolution = img.resolution;


        //3条以内评论（评论人名字，头像URL， 评论发布日期， 评论内容 ）
        let cmts = [];
        const cmtsData = await this.app.mysql.query(`select * from cmtInfo where imgID = ${id} order by id desc`);
        let index = 0;
        while ((index<cmtsData.length)&&(index<3)) {
            let phone = cmtsData[index].phone;
            let time = cmtsData[index].pubdate;
            const p = await this.app.mysql.get('userInfo', {id: phone});
            let pname = p.name;
            let pavatar = p.avatar;
            let person = {
                "comment":cmtsData[index].comment,
                "time": time,
                "name": pname,
                "avatar": pavatar,
            };

            index += 1;
            cmts.push(person);
        }

        //是否对此图片已点赞
        let likedornot = 0;
        const lon = await this.app.mysql.get('likes', {phone:inputphone, imgLikesID:id});
        if(lon != null){
            likedornot = 1;
        }
        //本人头像
        const myAvatar = (await this.app.mysql.get('userInfo', {id: inputphone})).avatar;

        //作品状态
        let status = 1;//可以加入购物车
        if(img.forsale==0){
            status = 2;//作品未上架
        }
        if(img.phone==inputphone){
            status = 3;//是自己的作品
        }
        const cart = await this.app.mysql.get('shoppingCart', {phone:inputphone, imgID: id});
        if(cart!=null){
            status = 4;//购物车已有此作品
        }
        const purchased = await this.app.mysql.get('orders', {imgID: id, buyer_phone: inputphone, status: 1});
        if(purchased!=null){
            status =5;//已购买
        }
        let result = {
            "imgURL": imgURL,
            "imgName": imgName,
            "imgID": fid,
            "imgTag": data,
            "imgDescription": description,
            "pubdate": pubdate,
            "price": price,
            "number_of_comments": numComments,
            "number_of_likes": likes,
            "avatar": avatar,
            "authorName": authorName,
            "authorPhone": authorPhone,
            "signature": authorSig,
            "image_size": imgSize,
            "image_resolution": imgResolution,
            "image_type": imgType,
            "comments": cmts,
            "my_avatar": myAvatar,
            "likedornot":likedornot,
            "status": status,
        };
        this.ctx.body = result;

        // function padding(num, length) {
        //     for(var len = (num + "").length; len < length; len = num.length) {
        //         num = "0" + num;
        //     }
        //     return num;
        // }
    }

    //图片详情->立即购买 （如果此作品已经购买过或者是自己的作品则不能立即购买）
    async pay(){
        const query = this.ctx.query;
        let id = query.id;//图片id
        let inputPhone = query.phone;//我的手机号

        const check_if_paid = await this.app.mysql.get('orders', {buyer_phone: inputPhone, imgID:id, status: 1});
        const check_my_img = await this.app.mysql.get('imgInfo', {phone: inputPhone, id: id});
        //检查是否是自己的作品
        if (check_my_img === null){//不是自己的作品
            if (check_if_paid === null){//没有购买过
                //生成一个订单号
                let order_number = build_order_no();
                //作品名字
                const image = await this.app.mysql.get('imgInfo', {id: id});
                let seller_phone = image.phone;
                let image_name = image.imgName;
                //作品id
                let image_id = image.id;
                //作品价格
                let image_price = image.price;

                let data = {
                    "order_number": order_number,
                    "image_name": image_name,
                    "image_id": image_id,
                    "image_price": image_price,
                };
                const store_info = await this.app.mysql.insert('orders', {order_number: order_number, buyer_phone: inputPhone, seller_phone: seller_phone, status: '0', imgID: id});
                this.ctx.body = data;
            }else{
                this.ctx.body = -2;//此作品已购买过
            }
        }else{
            this.ctx.body = -1;//是自己的作品 不能购买
        }
    }

    //如果这个作品没有被购买过，且不在购物车内，且不是自己的，可以加入购物车  (待付款可以加购物车)
    async add2cart(){
        let status = '';
        const query = this.ctx.query;
        let id = query.id;//图片id
        let inputPhone = query.phone;//我的手机号
        const purchased = await this.app.mysql.get('orders', {imgID: id, buyer_phone: inputPhone, status: 1});
        //图片已上架
        const forsale = (await this.app.mysql.get('imgInfo', {id:id})).forsale;
        //没有购买记录
        if(Number(forsale)==1){
            if (purchased === null){
                //购物车里也没有这个图片
                const cart = await this.app.mysql.get('shoppingCart', {phone:inputPhone, imgID: id});
                if (cart === null){
                    //且不是自己的作品
                    const myimg = await this.app.mysql.get('imgInfo', {phone: inputPhone, id: id});
                    if(myimg === null){
                        //加入购物车
                        status = 1;//加入购物车成功： 1
                        const add = await this.app.mysql.insert('shoppingCart', {phone: inputPhone, imgID: id});
                    }else{
                        status = 5; //是自己的作品， 无法加入购物车： 5
                    }
                }else{
                    status = 2;//购物车已存在此作品，无法加入购物车： 2
                }
            }else{
                status = 3;//用户已购买， 无法加入购物车： 3
            }
        }else{
            status = 4;//作品未上架， 无法加入购物车 4
        }
        this.ctx.body = status;
    }

    //评论展开
    async comments(){
        const query = this.ctx.query;
        let img_id = query.id;
        // let phone = query.phone; //我自己的电话
        let page = query.page;
        let result = [];
        const all = await this.app.mysql.query(`select * from cmtInfo where imgID=${img_id} order by pubdate desc`);
        for (var i=0; i<all.length; i++){
            const user = await this.app.mysql.get('userInfo', {id: all[i].phone});
            let j = {
                "avatar": user.avatar,
                "user_name": user.name,
                "time": all[i].pubdate,
                "comment": all[i].comment,
            };
            result.push(j);
        }
        result = this.paging(page, result, 100);
        this.ctx.body = result;
    }

    //搜索
    async searchAll(){
        const query = this.ctx.query;
        let input = query.input;
        let page = query.page;

        let user_result = [];
        //------搜索作者-------
        //作者名字+作者标签
        const users = await this.app.mysql.query(` select avatar, name, signature, id from userInfo where name like '%${input}%' or signature like '%${input}%' order by fans_num desc`);
        user_result = this.paging(page, users, 100);

        //------搜索作品-------
        //图片名字， 图片id， 图片描述（按点赞排序）
        let image_result = [];
        const images = await this.app.mysql.query(`select imgURL, imgName, id, forsale from imgInfo where (id like '%${input}%' or imgName like '%${input}%' or description like '%${input}%') and status=1 order by likes desc`);
        image_result = this.paging(page, images, 100);
        let data = {
            "user": user_result,
            "images": image_result,
        };

        this.ctx.body = data;
    }

    //他人的关注
    async targetFollow(){
        const query=this.ctx.query;
        let self_phone = query.selfID;
        let target_phone = query.targetID;
        let page = query.page;
        let result = [];

        //搜索target的关注人
        let followedUser = await this.app.mysql.query(`select avatar, name, signature, id from userInfo where id in (select followed_user from follow where user_id = ${target_phone})`);
        //检测我有没有关注这些人
        let followed = 0;
        let itsme = 0;
        if(followedUser!=null){
            for(var i=0; i<followedUser.length; i++){
                let t_id = followedUser[i].id;
                const check = await this.app.mysql.get('follow', {user_id:self_phone, followed_user: t_id});
                if(check!=null){
                    followed = 1;
                }
                if(t_id === self_phone){
                    itsme = 1;
                }
                let data_for_each = {
                    "user": followedUser[i],
                    "followed": followed,
                    "its_me": itsme,//是否是本人
                };
                result.push(data_for_each);
            }
        }
        result = this.paging(page, result, 100);
        this.ctx.body = result;
    }

    //搜索他人的关注人
    async targetFollowSearch(){
        const query=this.ctx.query;
        let self_phone = query.selfID;
        let target_phone = query.targetID;
        let page = query.page;
        let input = query.input;
        let result = [];

        //搜索target的关注人
        let followedUser = await this.app.mysql.query(`select avatar, name, signature, id from userInfo where id in (select followed_user from follow where user_id = ${target_phone})`);
        //检测我有没有关注这些人
        let followed = 0;
        let itsme = 0;
        if(followedUser!=null){
            for(var i=0; i<followedUser.length; i++){
                let t_id = followedUser[i].id;
                const check = await this.app.mysql.get('follow', {user_id:self_phone, followed_user: t_id});
                if(check!=null){
                    followed = 1;
                }
                if(t_id === self_phone){
                    itsme = 1;
                }
                if(isContains(followedUser[i].name, input) === true){//如果这个人的名字符合搜索条件
                    let data_for_each = {
                        "user": followedUser[i],
                        "followed": followed,
                        "its_me": itsme,//是否是本人
                    };
                    result.push(data_for_each);
                }
            }
        }
        result = this.paging(page, result, 100);
        this.ctx.body = result;
    }

    //他人的粉丝
    async targetFans(){
        const query=this.ctx.query;
        let self_phone = query.selfID;
        let target_phone = query.targetID;
        let page = query.page;
        let result = [];

        //搜索target的粉丝
        let fans = await this.app.mysql.query(`select avatar, name, signature, id from userInfo where id in (select follower from fans where user_id = ${target_phone})`);
        console.log(fans.length);
        //检测我有没有关注这些粉丝
        let followed = 0;
        let itsme = 0;
        if(fans!=null){
            for(var i=0; i<fans.length; i++){
                let t_id = fans[i].id;
                const check = await this.app.mysql.get('follow', {user_id:self_phone, followed_user: t_id});
                if(check!=null){
                    followed = 1;
                }
                if(t_id === self_phone){
                    itsme = 1;
                }
                let data_for_each = {
                    "user": fans[i],
                    "followed": followed,
                    "its_me": itsme,//是否是本人
                };
                result.push(data_for_each);
            }
        }
        result = this.paging(page, result, 100);
        this.ctx.body=result;
    }

    //搜索他人的粉丝
    async targetFansSearch(){
        const query=this.ctx.query;
        let self_phone = query.selfID;
        let target_phone = query.targetID;
        let page = query.page;
        let input = query.input;
        let result = [];

        //搜索target的粉丝
        let fans = await this.app.mysql.query(`select avatar, name, signature, id from userInfo where id in (select follower from fans where user_id = ${target_phone})`);
        console.log(fans.length);
        //检测我有没有关注这些粉丝
        let followed = 0;
        let itsme = 0;
        if(fans!=null){
            for(var i=0; i<fans.length; i++){
                let t_id = fans[i].id;
                const check = await this.app.mysql.get('follow', {user_id:self_phone, followed_user: t_id});
                if(check!=null){
                    followed = 1;
                }
                if(t_id === self_phone){
                    itsme = 1;
                }

                if(isContains(fans[i].name, input) === true){//如果这个人的名字符合搜索条件
                    let data_for_each = {
                        "user": fans[i],
                        "followed": followed,
                        "its_me": itsme,//是否是本人
                    };
                    result.push(data_for_each);
                }
            }
        }
        result = this.paging(page, result, 100);
        this.ctx.body = result;
    }
}

module.exports = mainpageController;
