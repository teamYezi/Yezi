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
        let imgFull = 'http://pc99io518.bkt.clouddn.com/' + curTime + postfix;
        let img_return = curTime + postfix;
        let index1 = postfix.lastIndexOf(".")+1;
        let index2 = postfix.length;
        let img_postfix = (postfix.substring(index1,index2)).toUpperCase();
        let price = query.price;
        let imgName = query.imgName;
        let description = query.description;
        let forsale = query.forsale;
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
            forsale: forsale,
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
            img_url: img_return,
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

    //人工审核
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
                if(raw!=null){
                    let raw_url = 'http://pctyardz8.bkt.clouddn.com/'+raw.img_url;
                    let MD5 = raw.MD5;
                    let raw_time = raw.time;
                    let data = {
                        "id":raw.id,
                        "img_url": img_url,
                        "raw_url": raw_url,
                        "raw_time": raw_time,
                        "MD5": MD5,
                        "img_id": img_id,
                        "img_name": img_name,
                        "phone": phone,
                        "author_name": author_name,
                    };
                    console.log(img_url);
                    console.log(raw_url);
                    result.push(data);
                }
            }
        }
        this.ctx.body = result;
    }

    //人工审核 （1通过 -1驳回）
    async dmc(){
        const query = this.ctx.query;
        let type = query.type;
        let img_id = query.img_id;
        const update = await this.app.mysql.update('imgInfo', {id:img_id, status: type});
        const img_info = await this.app.mysql.get('imgInfo', {id: img_id});
        //如果审核通过， 给用户发通知
        if(Number(type) == 1){
            let phone = img_info.phone;
            let add_notification = {
                type: 1,
                time: new Date().getTime(),
                content: "管理员通过了您发布的原创作品， 快去首页查看吧",
                phone: phone,
            };
            const update_notification = await this.app.mysql.insert('notification', add_notification);
        }else{
            //如果审核未通过， 作品数-1, 给用户发通知
            let phone = img_info.phone;
            let cur_img_num = (await this.app.mysql.get('userInfo', {id: phone})).imgNum;
            const update_img_num = await this.app.mysql.update('userInfo', {id: phone, imgNum: cur_img_num-1});
            let img_name = img_info.imgName;
            let add_notification = {
                type: 1,
                time: new Date().getTime(),
                content: `非常抱歉， 您的作品《${img_name}》没有通过审核`,
                phone: phone,
            };
            const update_notification = await this.app.mysql.insert('notification', add_notification);

        }
        this.ctx.body =update;
    }
}
module.exports = uploadimgController;