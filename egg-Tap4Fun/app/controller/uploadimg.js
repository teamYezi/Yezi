'use strict'

const Controller = require('./my');


class uploadimgController extends Controller{

    //上传作品图
    async index(){
        const query=this.ctx.query;
        let phone = query.phone;
        let postfix = query.postfix;
        let img_size = query.size;
        let img_resolution = query.resolution;
        let curTime = new Date().getTime();
        let imgFull = curTime + postfix;
        let index1 = postfix.lastIndexOf(".")+1;
        let index2 = postfix.length;
        let img_postfix = (postfix.substring(index1,index2)).toUpperCase();
        let price = query.price;
        let imgName = query.imgName;
        let description = query.description;
        //链接， 时间， 电话
        const img = {
            phone: phone,
            imgURL: imgFull,
            pubdate: curTime,
            description: description,
            price: price,
            imgName: imgName,
            size: img_size,
            postfix: img_postfix,
            resolution: img_resolution,
        };
        let imgTag = query.imgTag;
        let ctag = query.ctag; //自定义的标签

        let tag_info = {};
        if(imgTag.length>0){
            let tags = imgTag.split(',');
            for(var i=0; i<tags.length; i++){
                tag_info[tags[i]] = 1;
            }
        }
        if(ctag!=null){
            tag_info['other'] = ctag;
        }

        console.log(imgTag);
        console.log(tag_info);
        //存入数据库
        const updatedImgInfo = await this.app.mysql.insert('imgInfo', img);
        let cur_img_num = (await this.app.mysql.get('userInfo', {id: phone})).imgNum;
        console.log(cur_img_num);
        const update_img_num = await this.app.mysql.update('userInfo', {id: phone, imgNum: cur_img_num+1});
        const updatedImg = await this.app.mysql.get('imgInfo', {imgURL: imgFull});
        tag_info['id'] = updatedImg.id;
        const updatedTagInfo = await this.app.mysql.insert('imgTag', tag_info);

        //返回给前端
        const imgReturn = {
            img_url: imgFull,
            time: curTime,
            img_id: updatedImg.id,
        };
        this.ctx.body=imgReturn;
    }

    //上传raw文件
    async raw(){
        const query=this.ctx.query;
        let phone = query.phone;
        let postfix = query.postfix;
        let img_id = query.img_id;
        let MD5 = query.MD5;
        let curTime = new Date().getTime();
        let rawFull = curTime + postfix;
        //链接， 时间， 电话
        const img = {
            img_url: rawFull,
            time: curTime,
            phone: phone,
            img_id: img_id,
            MD5: MD5,
        };
        //存入数据库
        const updatedRawInfo = await this.app.mysql.insert('raw_img_info', img);
        //返回给前端
        const imgReturn = {
            img_url: rawFull,
            time: curTime,
            img_id: img_id,
        };
        this.ctx.body=imgReturn;
    }

    //人工审核 (图片url raw文件url raw文件发布时间 raw文件MD5 图片id 图片名字 作者电话 作者名字)
    async mc(){
        const query = this.ctx.query;
        let type = query.type; //(0待审核, 1已发布, -1被驳回)
        let result = [];
        const images = await this.app.mysql.query(`select * from imgInfo where status = ${type} order by pubdate asc`);
        if(images.length>0){
            for(var i=0; i<images.length; i++){
                let img_url = images[i].imgURL;
                let img_id = images[i].id;
                let img_name = images[i].imgName;
                let phone = images[i].phone;
                const author = await this.app.mysql.get('userInfo', {id:phone});
                let author_name = author.name;
                const raw = await this.app.mysql.get('raw_img_info', {img_id: img_id});
                let raw_url = raw.img_url;
                let MD5 = raw.MD5;
                let raw_time = raw.time;
                let data = {
                    "img_url": img_url,
                    "raw_url": raw_url,
                    "raw_time": raw_time,
                    "MD5": MD5,
                    "img_id": img_id,
                    "img_name": img_name,
                    "phone": phone,
                    "author_name": author_name,
                }
                result.push(data);
            }
        }
        this.ctx.body = result;
    }

    // //上链
    // //https://mp.weixin.qq.com/s/_cJ1W9fFMAHR7KjwKwg1Gg
    // //https://zhuanlan.zhihu.com/p/36709518
    // //https://www.imooc.com/article/29216
    // async neb(){
    //     const query = this.ctx.query;
    //     let img_id = query.img_id;
    //     var dappAddressFrom = 'n1PNy9Hd7Qb36FcvmNzLnJrBUvVCxyxaYSN';
    //     var dappAddressTo ="n1PNy9Hd7Qb36FcvmNzLnJrBUvVCxyxaYSN";
    //     // var nebulas = require("nebulas"),
    //     //     Account = nebulas.Account,
    //     //     neb = new nebulas.Neb();
    //     // neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));
    //     //
    //
    // }
}
module.exports = uploadimgController;