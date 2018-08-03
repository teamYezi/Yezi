'use strict';

const Controller = require('./my');


class otherController extends Controller {
    //订单支付接口
    async index() {
        const query = this.ctx.query;
        let order_number = query.order_number;
        let time = new Date().getTime();
        // let balance = await this.app.mysql.query(`select balance from transaction where phone = $`);
        this.ctx.body = 1;
    }
}
module.exports = otherController;
