'use strict';

const Controller = require('./my');


class otherController extends Controller {
    //订单支付接口  账户余额够直接扣款  并给卖家们发送系统通知
    async index() {
        const query = this.ctx.query;
        let order_number = query.order_number;
        let time = new Date().getTime();
        let message = '';
        const order = await this.app.mysql.query(`select * from orders where order_number = ${order_number}`);
        //计算订单总价格
        if(order.length===0){
            message = -1;//订单不存在
            return;
        }
        let order_price = 0;
        for(var i=0; i<order.length; i++){
            let img_id = order[i].imgID;
            let img_price = (await this.app.mysql.get('imgInfo', {id: img_id})).price;
            order_price += img_price;
        }
        //检测订单是否已付款
        if(order[0].status != 0){
            message = -2;//订单已付款
        }else{
            const buyer_phone = order[0].buyer_phone;
            const seller_phone = order[0].seller_phone;
            let buyer_balance = (await this.app.mysql.query(`select * from transaction  where phone = ${buyer_phone} order by id desc`))[0].balance;
            let seller_balance = (await this.app.mysql.query(`select * from transaction  where phone = ${seller_phone} order by id desc`))[0].balance;
            if(buyer_balance >= order_price){
                //order status变1
                for(var i=0; i<order.length; i++){
                    const order_update = await this.app.mysql.update('orders', {id:order[i].id, status:1, deal_time:time});
                }
                //transaction加一笔, buyer扣钱, seller加钱
                let buyer_new_tran = {
                    phone: buyer_phone,
                    order_number :order[0].order_number,
                    transaction: '-'+order_price,
                    balance: Number(buyer_balance)-Number(order_price),
                    time: time,
                };
                const buyer_update_tran = await this.app.mysql.insert('transaction', buyer_new_tran);

                let seller_new_tran={
                    phone: seller_phone,
                    order_number :order[0].order_number,
                    transaction: '+'+order_price,
                    balance: Number(seller_balance)+Number(order_price),
                    time: time,
                };
                const seller_update_tran = await this.app.mysql.insert('transaction', seller_new_tran);

                message = (1);//订单支付成功

                //从购物车里删除此订单的商品
                for(var i=0; i<order.length; i++){
                    let img_id = order[i].imgID;
                    const rmv_from_cart = await this.app.mysql.delete('shoppingCart', {phone:buyer_phone, imgID:img_id});
                }

                //消息推送
                const buyer = await this.app.mysql.get('userInfo', {id:buyer_phone});
                let buyer_name = buyer.name;
                for(var i=0; i<order.length; i ++){
                    let seller_phone = order[i].seller_phone;
                    let img_id = order[i].imgID;
                    let img_name = (await this.app.mysql.get('imgInfo', {id: img_id})).imgName;//根据图片id找到这张图片的图片名字
                    let new_messsage = {
                        type: 2,
                        time: new Date().getTime(),
                        content: `${buyer_name}购买了您的"${img_name}", 快去首页查看吧`,
                        phone: seller_phone,
                    }
                    const addtuisong = await this.app.mysql.insert('notification', new_messsage);
                }
            }else{
                message = (-3);//余额不足， 订单支付失败
            }
        }
        this.ctx.body = message;
    }

    //存款接口
    async deposit(){
        const query = this.ctx.query;
        let phone = query.phone;
        let rmb = query.rmb;
        let time = new Date().getTime();
        const balance = (await this.app.mysql.query(`select balance from transaction where phone = ${phone} order by id desc`))[0].balance;
        console.log(balance);
        let new_deposit = {
            phone: phone,
            transaction: '+'+ rmb,
            balance: Number(balance) + Number(rmb),
            time: time,
        };
        const result = await this.app.mysql.insert('transaction', new_deposit);
        this.ctx.body = new_deposit;
    }

    //提现接口
    async withdraw(){
        const query = this.ctx.query;
        let phone = query.phone;
        let rmb = query.rmb;
        let time = new Date().getTime();
        const balance = (await this.app.mysql.query(`select balance from transaction where phone = ${phone} order by id desc`))[0].balance;
        let new_withdraw = {
            phone: phone,
            transaction: '-' + rmb,
            balance: Number(balance) - Number(rmb),
            time: time,
        };
        const result = await this.app.mysql.insert('transaction', new_withdraw);
        this.ctx.body = new_withdraw;
    }

    //给所有用户发系统通知
    async notification(){
        const query = this.ctx.query;
        let message = query.message;
        const phone = await this.app.mysql.query(`select id from userInfo`);//所有人的电话
        if(phone!=null){
            for(var i=0; i<phone.length; i++){
                let add_notification = {
                    type: 3,
                    time: new Date().getTime(),
                    content: message,
                    phone: phone[i],
                };
                const update_notification = await this.app.mysql.insert('notification', add_notification);
            }
        }
        this.ctx.body = 1;
    }
}
module.exports = otherController;
