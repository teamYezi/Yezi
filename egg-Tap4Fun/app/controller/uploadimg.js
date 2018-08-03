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
        let imgFull = "http://pcf456fjj.bkt.clouddn.com/"+curTime + postfix;
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
        let curTime = new Date().getTime();
        let rawFull = "http://pctyardz8.bkt.clouddn.com/"+curTime + postfix;
        //链接， 时间， 电话
        const img = {
            img_url: rawFull,
            time: curTime,
            phone: phone,
        };
        //存入数据库
        const updatedRawInfo = await this.app.mysql.insert('raw_img_info', img);
        //返回给前端
        const imgReturn = {
            img_url: rawFull,
            time: curTime,
        };
        this.ctx.body=imgReturn;
    }
}

module.exports = uploadimgController;
