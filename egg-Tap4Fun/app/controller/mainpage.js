'use strict'

/*
* 首页推荐Controller
* */

const Controller = require('./my');

function build_order_no(){
    var outTradeNo="";
    for(var i=0;i<6;i++)
    {
        outTradeNo += Math.floor(Math.random()*10);
    }
    outTradeNo = new Date().getTime() + outTradeNo;
    return outTradeNo;
}

class mainpageController extends Controller{

    //返回所有图片的（图片URL+图片id+图片描述+作者名字+作者头像+发布日期+评论数+点赞数+是否为这个作品点过赞(点过1没点过-1)） 按点赞数排序
    async index(){
        const query=this.ctx.query;
        let phone = query.phone;
        let page = query.page;


        const images = await this.app.mysql.query('select * from imgInfo where status=1 order by likes desc');

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
                "avatar":avatar,
                "pubdate":images[i].pubdate,
                "cmtNum":images[i].comments,
                "likesNum":images[i].likes,
                "likedOrNot":liked,
            };
            result[i]=eachImg;
        }
        // console.log(this.convertTags('fjdksjf'));
        this.ctx.body=this.paging(page, result, 10);
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

    //返回当前图片的URL，
    // async search(){
    //     const query = this.ctx.query;
    //     let input = query.input;  //用户输入的关键词
    //     this.ctx.body = "图片信息界面";
    // }

    //返回
    //图片的URL，图片名字，图片id， 图片标签， 作者头像， 作者名字， 作者签名， 图片描述， 发布日期
    //图片价格， 评论数， 点赞数
    //3条以内评论（评论人名字，头像URL， 评论发布日期， 评论内容 ） + 评论总数量
    //有没有对此作品点赞 （点过赞了返回1 没点过赞返回-1）
    //自己的头像
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
        let fid = padding(id, 5);
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
        const cmtsData = await this.app.mysql.query(`select * from cmtInfo where imgID = ${id}`);
        let index = numComments-1;
        while ((index >= 0)&&(index >= numComments-3)) {
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

            index -= 1;
            cmts.push(person);
        }

        // 是否对此图片已点赞
        let likedornot = 0;
        const lon = await this.app.mysql.get('likes', {phone:inputphone, imgLikesID:id});
        if(lon != null){
            likedornot = 1;
        }
        // 本人头像
        const myAvatar = (await this.app.mysql.get('userInfo', {id: inputphone})).avatar;


        let result = {
            "imgURL": imgURL,
            "imgName": imgName,
            "imgID": fid,
            "imgTag": data,
            "imgDescription": description,
            "pubdate": pubdate,
            "price": price,
            "number of comments": numComments,
            "number of likes": likes,
            "avatar": avatar,
            "authorName": authorName,
            "signature": authorSig,
            "image_size": imgSize,
            "image_resolution": imgResolution,
            "image_type": imgType,
            "comments": cmts,
            "my_avatar": myAvatar,
        }
        this.ctx.body = result;


        function padding(num, length) {
            for(var len = (num + "").length; len < length; len = num.length) {
                num = "0" + num;
            }
            return num;
        }
    }

    async pay(){
        const query = this.ctx.query;
        let id = query.id;//图片id
        let inputPhone = query.phone;//我的手机号

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

    }

    //如果这个作品没有被购买过，且不在购物车内，可以加入购物车  (待付款可以加购物车)
    async add2cart(){
        let status = '';
        const query = this.ctx.query;
        let id = query.id;//图片id
        let inputPhone = query.phone;//我的手机号
        const purchased = await this.app.mysql.get('orders', {imgID: id, buyer_phone: inputPhone, status: 1});
        //没有购买记录
        if (purchased === null){
            //购物车里也没有这个图片
            const cart = await this.app.mysql.get('shoppingCart', {phone:inputPhone, imgID: id});
            if (cart === null){
                //加入购物车
                status = '加入购物车成功';
                const add = await this.app.mysql.insert('shoppingCart', {phone: inputPhone, imgID: id});
            }else{
                status = '购物车已存在此作品，无法加入购物车';
            }
        }else{
            status = '用户已购买， 无法加入购物车';
        }
        this.ctx.body = status;
    }
}

module.exports = mainpageController;
