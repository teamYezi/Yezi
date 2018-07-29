'use strict';

const Controller = require('./my');

class storeController extends Controller {
    async index() {
        let result = [];
        //广告信息
        let ads = {
            "ads":["http://pcenv09jq.bkt.clouddn.com/ad1.png", "http://pcenv09jq.bkt.clouddn.com/ad2.png", "http://pcenv09jq.bkt.clouddn.com/ad3.png"],
        };
        result[0] = ads;

        //旅拍
        let lp = await this.app.mysql.query('select imgURL, id, price from imgInfo where (id in (select id from imgTag where lvpai =1) and status = 1)');
        //选取最新三条数据
        if(lp.length>3){
            lp = lp.slice(lp.length-3,lp.length);
        }
        result[1] = {"name": "旅拍", "value": lp};

        //单色
        let ds = await this.app.mysql.query('select imgURL, id, price from imgInfo where id in (select id from imgTag where danse =1) and status = 1');
        if(ds.length>3){
            ds = ds.slice(ds.length-3,ds.length);
        }
        result[2] = {"name": "单色", "value": ds};

        //冷淡
        let ld = await this.app.mysql.query('select imgURL, id, price from imgInfo where id in (select id from imgTag where lengdan =1) and status = 1');
        if(ld.length>3){
            ld = ld.slice(ld.length-3,ld.length);
        }
        result[3] = {"name": "冷淡", "value": ld};


        //清新
        let qx = await this.app.mysql.query('select imgURL, id, price from imgInfo where id in (select id from imgTag where qingxin =1) and status = 1');
        if(qx.length>3){
            qx = qx.slice(qx.length-3,qx.length);
        }
        result[4] = {"name": "清新", "value": qx};

        //文艺
        let wy = await this.app.mysql.query('select imgURL, id, price from imgInfo where id in (select id from imgTag where wenyi =1) and status = 1');
        if(wy.length>3){
            wy = wy.slice(wy.length-3,wy.length);
        }
        result[5] = {"name": "文艺", "value": wy};

        //色感
        let sg = await this.app.mysql.query('select imgURL, id, price from imgInfo where id in (select id from imgTag where segan =1) and status = 1');
        if(sg.length>3){
            sg = sg.slice(sg.length-3,sg.length);
        }
        result[6] = {"name": "色感", "value": sg};

        //瞬间
        let sj = await this.app.mysql.query('select imgURL, id, price from imgInfo where id in (select id from imgTag where shunjian =1) and status = 1');
        if(sj.length>3){
            sj = sj.slice(sj.length-3,sj.length);
        }
        result[7] = {"name": "瞬间", "value": sj};

        //空气
        let kq = await this.app.mysql.query('select imgURL, id, price from imgInfo where id in (select id from imgTag where kongqi =1) and status = 1');
        if(kq.length>3){
            kq = kq.slice(kq.length-3,kq.length);
        }
        result[8] = {"name": "空气", "value": kq};

        //元气
        let yq = await this.app.mysql.query('select imgURL, id, price from imgInfo where id in (select id from imgTag where yuanqi =1) and status = 1');
        if(yq.length>3){
            yq = yq.slice(yq.length-3,yq.length);
        }
        result[9] = {"name": "元气", "value": yq};

        //远方
        let yf = await this.app.mysql.query('select imgURL, id, price from imgInfo where id in (select id from imgTag where yuanfang =1) and status = 1');
        if(yf.length>3){
            yf = yf.slice(yf.length-3,yf.length);
        }
        result[10] = {"name": "远方", "value": yf};

        this.ctx.body = result;
    }

    async cate() {
        let result = [];
        const query = this.ctx.query;
        let cate=query.cate;//e.g. 'danse'
        let page = query.page;

        const all = await this.app.mysql.query(`select id from imgTag where ${cate} = 1`);
        for (var i =0; i< all.length; i++){
            //图片id
            let id = all[i].id;
            let image = await this.app.mysql.get('imgInfo', {id: id});
            if (image === null){
                this.ctx.body = `ERROR: 图片不存在， id：${id}`;
                return;
            }else{
                //图片url
                let url = image.imgURL;
                //图片名字
                let img_name = image.imgName;
                //作者名字
                let auth_name = (await this.app.mysql.get('userInfo', {id: image.phone})).name;
                //图片价格
                let price = image.price;
                let imageInfo = {
                    "imgID": image.id,
                    "imgURL": url,
                    "imgName": img_name,
                    "author_name": auth_name,
                    "price": price,
                }
                result[i] = imageInfo;
            }
        }

        result = this.paging(page, result, 12);
        this.ctx.body = result;

    }
}
module.exports = storeController;