/**
 * Created by yayowd on 2018/2/2.
 */
import {take, put, call, takeEvery, takeLatest, select} from "redux-saga/effects";

import {namespace, actors} from './actor';
import {Saga, SimpleSaga, Sagas} from '../saga';
import {Store, Test} from './fetch';

class StoreSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Store.store.r, params);
    }

    getstore(cb) {
        this.call({...Store.store.p(), cb});
    }
}

class StoreCateSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Store.storecate.r, params);
    }

    getcate(cate,cb) {
        this.call({...Store.storecate.p(cate,1), cb});
    }
}

class StoreCartSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Store.storecart.r, params);
    }

    getcart(phone,cb) {
        this.call({...Store.storecart.p(phone,1), cb});
    }
}

class Add2CartSaga extends SimpleSaga{
    * runner(params) {
        return yield call(Store.add2cart.r, params);
    }

    add2cart(id,phone,cb) {
        this.call({...Store.add2cart.p(id,phone), cb});
    }

}

class StorePaySaga extends SimpleSaga{
    * runner(params) {
        return yield call(Store.storepay.r, params);
    }

    storepay(phone,imgId,cb) {
        this.call({...Store.storepay.p(phone,imgId), cb});
    }

}

class OtherPaySaga extends SimpleSaga{
    * runner(params) {
        return yield call(Store.otherpay.r, params);
    }

    otherpay(order_number,cb) {
        this.call({...Store.otherpay.p(order_number), cb});
    }
}

class CateSearchSaga extends SimpleSaga{
    * runner(params) {
        return yield call(Store.catesearch.r, params);
    }

    search(cate,input,cb) {
        this.call({...Store.catesearch.p(cate,input), cb});
    }
}
export const sagas = new Sagas(namespace);
export const storeSaga = new StoreSaga(namespace, 'store', sagas, actors);
export const storecateSaga=new StoreCateSaga(namespace,'storecate',sagas,actors);
export const storecartSaga=new StoreCartSaga(namespace,'storecart',sagas,actors);
export const add2cartSaga=new Add2CartSaga(namespace,'add2cart',sagas,actors);
export const storepaySaga=new StorePaySaga(namespace,'storepay',sagas,actors);
export const otherpaySaga=new OtherPaySaga(namespace,'otherpay',sagas,actors);
export const catesearchSaga=new CateSearchSaga(namespace,'catesearch',sagas,actors);