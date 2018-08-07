'use strict';

const Controller = require('./my');


class otherController extends Controller {
    //订单支付接口  账户余额够直接扣款
    async index() {
        const query = this.ctx.query;
        let order_number = query.order_number;
        let time = new Date().getTime();
        let message = '';
        //buyer_phone
        // const order = await this.app.mysql.get('orders', {order_number: order_number});
        const order = await this.app.mysql.query(`select * from orders where order_number = ${order_number}`);

        //计算订单总价格
        if(order.length===0){
            message = -1;
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
            message = -2;
        }else{
            const phone = order[0].buyer_phone;
            let user_balance = (await this.app.mysql.query(`select * from transaction  where phone = ${phone} order by id desc`))[0].balance;
            if(user_balance >= order_price){
                //order status变1
                for(var i=0; i<order.length; i++){
                    const order_update = await this.app.mysql.update('orders', {id:order[i].id, status:1, deal_time:time});
                }
                //transaction加一笔
                let new_tran = {
                    phone: phone,
                    order_number :order[0].order_number,
                    transaction: '+'+order_price,
                    balance: user_balance-order_price,
                    time: time,
                }
                const update_tran = await this.app.mysql.insert('transaction', new_tran);
                message = (1);
            }else{
                message = (-3);
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
}
module.exports = otherController;
