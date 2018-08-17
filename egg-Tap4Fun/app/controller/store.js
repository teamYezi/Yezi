'use strict';

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

function isContains(str, substr){
    let s1 = str.toString();
    let s2 = substr.toString();
    // console.log("12345".indexOf("123")+"aaa");
    return s1.indexOf(s2)>=0;
}

class storeController extends Controller {
    //商城首页
    async index() {
        let result = [];
        //广告信息
        let ads = {
            "ads":["http://pcenv09jq.bkt.clouddn.com/a1.jpg", "http://pcenv09jq.bkt.clouddn.com/a2new.jpeg", "http://pcenv09jq.bkt.clouddn.com/a3.jpg"],
        };
        result[0] = ads;

        //旅拍
        let lp = await this.app.mysql.query('select imgURL, id, price from imgInfo where (id in (select id from imgTag where lvpai =1) and status = 1 and forsale = 1)');
        //选取最新三条数据
        if(lp.length>3){
            lp = lp.slice(lp.length-3,lp.length);
        }
        result[1] = {"name": "旅拍", "value": lp};

        //单色
        let ds = await this.app.mysql.query('select imgURL, id, price from imgInfo where id in (select id from imgTag where danse =1) and status = 1 and forsale = 1');
        if(ds.length>3){
            ds = ds.slice(ds.length-3,ds.length);
        }
        result[2] = {"name": "单色", "value": ds};

        //冷淡
        let ld = await this.app.mysql.query('select imgURL, id, price from imgInfo where id in (select id from imgTag where lengdan =1) and status = 1 and forsale = 1');
        if(ld.length>3){
            ld = ld.slice(ld.length-3,ld.length);
        }
        result[3] = {"name": "冷淡", "value": ld};


        //清新
        let qx = await this.app.mysql.query('select imgURL, id, price from imgInfo where id in (select id from imgTag where qingxin =1) and status = 1 and forsale = 1');
        if(qx.length>3){
            qx = qx.slice(qx.length-3,qx.length);
        }
        result[4] = {"name": "清新", "value": qx};

        //文艺
        let wy = await this.app.mysql.query('select imgURL, id, price from imgInfo where id in (select id from imgTag where wenyi =1) and status = 1 and forsale = 1');
        if(wy.length>3){
            wy = wy.slice(wy.length-3,wy.length);
        }
        result[5] = {"name": "文艺", "value": wy};

        //色感
        let sg = await this.app.mysql.query('select imgURL, id, price from imgInfo where id in (select id from imgTag where segan =1) and status = 1 and forsale = 1');
        if(sg.length>3){
            sg = sg.slice(sg.length-3,sg.length);
        }
        result[6] = {"name": "色感", "value": sg};

        //瞬间
        let sj = await this.app.mysql.query('select imgURL, id, price from imgInfo where id in (select id from imgTag where shunjian =1) and status = 1 and forsale = 1');
        if(sj.length>3){
            sj = sj.slice(sj.length-3,sj.length);
        }
        result[7] = {"name": "瞬间", "value": sj};

        //空气
        let kq = await this.app.mysql.query('select imgURL, id, price from imgInfo where id in (select id from imgTag where kongqi =1) and status = 1 and forsale = 1');
        if(kq.length>3){
            kq = kq.slice(kq.length-3,kq.length);
        }
        result[8] = {"name": "空气", "value": kq};

        //元气
        let yq = await this.app.mysql.query('select imgURL, id, price from imgInfo where id in (select id from imgTag where yuanqi =1) and status = 1 and forsale = 1');
        if(yq.length>3){
            yq = yq.slice(yq.length-3,yq.length);
        }
        result[9] = {"name": "元气", "value": yq};

        //远方
        let yf = await this.app.mysql.query('select imgURL, id, price from imgInfo where id in (select id from imgTag where yuanfang =1) and status = 1 and forsale = 1');
        if(yf.length>3){
            yf = yf.slice(yf.length-3,yf.length);
        }
        result[10] = {"name": "远方", "value": yf};

        this.ctx.body = result;
    }

    //商城分类
    async cate() {
        let result = [];
        const query = this.ctx.query;
        let cate=query.cate;//e.g. 'danse'
        let page = query.page;

        const all = await this.app.mysql.query(`select id from imgTag where ${cate} = 1`);
        for (var i =0; i< all.length; i++){
            let id = all[i].id;
            let image = await this.app.mysql.get('imgInfo', {id: id});
            if (image === null){//如果标签存在图片却不存在
                this.ctx.body = `ERROR: 图片不存在， id：${id}`;
                return;
            }else{
                if ((Number(image.status)===1)&&(Number(image.forsale)===1)){//确保图片已上架并且审核通过
                    //图片url
                    let url = image.imgURL;
                    //图片名字
                    let img_name = image.imgName;
                    //作者名字
                    let auth_name = (await this.app.mysql.get('userInfo', {id: image.phone})).name;
                    //图片价格
                    let price = image.price;
                    let forsale = image.forsale;
                    if(Number(forsale) === 1){
                        let imageInfo = {
                            "imgID": image.id,
                            "imgURL": url,
                            "imgName": img_name,
                            "author_name": auth_name,
                            "price": price,
                        };
                        result.push(imageInfo);
                    }
                }else{
                    console.log(image);
                }
            }
        }

        result = this.paging(page, result, 100);
        this.ctx.body = result;
    }

    //商城分类的搜索
    async cateSearch(){
        const query = this.ctx.query;
        let cate = query.cate;
        let input = query.input;


        //先搜索出类别下所有图片
        let result = [];
        const all = await this.app.mysql.query(`select id from imgTag where ${cate} = 1`);
        for (var i =0; i< all.length; i++){
            let id = all[i].id;
            let image = await this.app.mysql.get('imgInfo', {id: id});
            if (image === null){//如果标签存在图片却不存在
                this.ctx.body = `ERROR: 图片不存在， id：${id}`;
                return;
            }else{
                if ((Number(image.status)===1)&&(Number(image.forsale)===1)){//确保图片已上架并且审核通过
                    //图片url
                    let url = image.imgURL;
                    //图片名字
                    let img_name = image.imgName;
                    //作者名字
                    let auth_name = (await this.app.mysql.get('userInfo', {id: image.phone})).name;
                    //图片价格
                    let price = image.price;

                    //判断图片信息是否符合搜索条件
                    let check_id = isContains(image.id, input);//图片ID
                    let check_name = isContains(img_name, input);//图片名字
                    let check_description = isContains(image.description, input);
                    if((check_id == true)||(check_name==true)||(check_description==true)){
                        let imageInfo = {
                            "imgID": image.id,
                            "imgURL": url,
                            "imgName": img_name,
                            "author_name": auth_name,
                            "price": price,
                            "description": image.description,
                        };
                        result.push(imageInfo);
                    }
                }
            }
        }

        this.ctx.body = result;
    }

    //购物车
    async cart(){
        const query = this.ctx.query;
        let inputPhone = query.phone;
        let page = query.page;
        let result = [];
        const images = await this.app.mysql.query(`select imgID from shoppingCart where phone = ${inputPhone}`);
        for (var i = 0; i<images.length; i++){
            let imgInfo = (await this.app.mysql.query(`select * from imgInfo where id = ${images[i].imgID}`))[0];
            // console.log(imgInfo);
            let img_url = imgInfo.imgURL;
            // console.log(img_url)
            let img_name = imgInfo.imgName;
            let img_price = imgInfo.price;
            let img = {
                "image_id": images[i].imgID,
                "image_url": img_url,
                "image_name": img_name,
                "image_price": img_price,
            };
            result[i] = img;
        }
        result = this.paging(page, result, 100);
        this.ctx.body = result;
    }

    //购物车删除商品
    async rmvcart(){
        const query = this.ctx.query;
        let phone = query.phone;
        let imgID = query.imgID;
        const rmv = await this.app.mysql.query(`delete from shoppingCart where phone=${phone} and imgID=${imgID}`);
        this.ctx.body = '删除'+ imgID;
    }

    //购物车结算
    async pay(){
        const query = this.ctx.query;
        let phone = query.phone;
        let idlist = query.imgID;
        console.log(phone);
        console.log(idlist);
        //生成一个订单号
        let order_number = build_order_no();
        let cur_time = new Date().getTime();
        if(idlist.length>0){
            let tags = idlist.split(',');
            for(var i=0; i<tags.length; i++){
                //图片信息
                const img_info = await this.app.mysql.get('imgInfo', {id: tags[i]});
                let order_per_img = {
                    order_number: order_number,
                    buyer_phone: phone,
                    seller_phone: img_info.phone,
                    status:0,
                    order_time: cur_time,
                    imgID: tags[i],
                };
                console.log(order_per_img);
                const store_order = await this.app.mysql.insert('orders', order_per_img);
            }
        }
        this.ctx.body = order_number;
    }
}
module.exports = storeController;
