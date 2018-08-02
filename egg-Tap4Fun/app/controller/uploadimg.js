'use strict'

const Controller = require('./my');


class uploadimgController extends Controller{

    async index(){
        const query=this.ctx.query;
        let phone = query.phone;
        let postfix = query.postfix;
        let curTime = new Date().getTime();
        let imgFull = "http://pcf456fjj.bkt.clouddn.com/"+curTime + postfix;
        //TODO
        //链接， 时间， 电话
        // const img = {
        //     phone: phone,
        //     imgURL: imgFull,
        //     pubdate: curTime,
        //
        // };
        // //存入数据库
        // const updatedRawInfo = await this.app.mysql.insert('raw_img_info', img);
        // //返回给前端
        // const imgReturn = {
        //     img_url: rawFull,
        //     time: curTime,
        // };
        // this.ctx.body=imgReturn;
    }


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
