/**
 * Created by yayowd on 2018/2/6.
 */
import {Net} from "../net";

export class Store extends Net {
    static store = {
        r: new Store().api_('store', 'getstoreinfo'),
        p: () => ({}),
    };
    static storecate = {
        r: new Store().api_('store/cate', 'cate'),
        p: (cate, page) => ({
            cate,
            page
        })
    };
    static storecart = {
        r: new Store().api_('store/cart', 'cart'),
        p: (phone, page) => ({
            phone,
            page
        })
    }
    static add2cart = {
        r: new Store().api_('imgDetail/add2cart'),
        p: (id, phone) => ({
            id,
            phone
        })
    }
    static storepay = {
        r: new Store().api_('store/pay'),
        p: (phone, imgID) => ({
            phone,
            imgID
        })
    }
    static otherpay = {
        r: new Store().api_('other/pay'),
        p: (order_number) => ({
            order_number
        })
    };
    static catesearch={
        r:new Store().api_('store/cate/search'),
        p:(cate,input)=>({
            cate,
            input
        })
    }
}