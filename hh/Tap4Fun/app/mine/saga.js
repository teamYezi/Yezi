/**
 * Created by yayowd on 2018/2/2.
 */
import {take, put, call, takeEvery, takeLatest, select} from "redux-saga/effects";

import {namespace, actors} from './actor';
import {Saga, SimpleSaga, Sagas, Actors} from '../saga';
import {Mine, Test} from './fetch';

class MineSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Mine.mine.r, params);
    }

    getmign(phone, cb) {
        this.call({...Mine.mine.p(phone), cb});
    }
}

class PublishedSaga extends SimpleSaga {
    constructor(namespace, name, parentSagas: Sagas, parentActors: Actors, def, hasLoader = true) {
        super(namespace, name, parentSagas, parentActors, def);
        // 是否显示加载等待标识
        this.hasLoader = null;
    }

    * runner(params) {
        return yield call(Mine.published.r, params);
    }

    published(phone, cb) {
        this.call({...Mine.published.p(phone,1), cb});
    }
}

class PendingSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Mine.pending.r, params);
    }

    pending(phone, cb) {
        this.call({...Mine.pending.p(phone,1), cb});
    }
}

class FollowSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Mine.follow.r, params);
    }

    follow(phone, cb) {
        this.call({...Mine.follow.p(phone,1), cb});
    }
}

class FansSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Mine.fans.r, params);
    }

    fans(phone, cb) {
        this.call({...Mine.fans.p(phone,1), cb});
    }
}

class onFollowSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Mine.onfollow.r, params);
    }

    onfollow(selfID,targetId, cb) {
        this.call({...Mine.onfollow.p(selfID,targetId), cb});
    }
}

class BalanceSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Mine.mybalance.r, params);
    }

    getbalance(phone, cb) {
        this.call({...Mine.mybalance.p(phone), cb});
    }
}
class MonyeDetailSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Mine.moneydetail.r, params);
    }

    getdetai(phone, cb) {
        this.call({...Mine.moneydetail.p(phone,1), cb});
    }
}

class MessageLikeSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Mine.messagelikes.r, params);
    }

    like(phone, cb) {
        this.call({...Mine.messagelikes.p(phone,1), cb});
    }
}

class MsgComments extends SimpleSaga {
    * runner(params) {
        return yield call(Mine.msgcomments.r, params);
    }

    comments(phone, cb) {
        this.call({...Mine.msgcomments.p(phone,1), cb});
    }
}

class NotificationSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Mine.notification.r, params);
    }

    notification(phone, cb) {
        this.call({...Mine.notification.p(phone,1), cb});
    }
}

class IncomeSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Mine.income.r, params);
    }

    income(phone, cb) {
        this.call({...Mine.income.p(phone,1), cb});
    }
}

class MylikesSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Mine.mylikes.r, params);
    }

    mylikes(phone, cb) {
        this.call({...Mine.mylikes.p(phone,1), cb});
    }
}
class MyOrdersSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Mine.myorder.r, params);
    }

    myorders(phone,category, cb) {
        this.call({...Mine.myorder.p(phone,1,category), cb});
    }
}
class DepositSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Mine.deposit.r, params);
    }

    deposit(phone,rmb, cb) {
        this.call({...Mine.deposit.p(phone,rmb), cb});
    }
}
class WithdrawSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Mine.withdraw.r, params);
    }

    withdraw(phone,rmb, cb) {
        this.call({...Mine.withdraw.p(phone,rmb), cb});
    }
}

export const sagas = new Sagas(namespace);
export const mineSaga = new MineSaga(namespace, 'mine', sagas, actors);
export const publishedSaga = new PublishedSaga(namespace, 'published', sagas, actors);
export const pendingSaga = new PendingSaga(namespace, 'pending', sagas, actors);
export const followSaga = new FollowSaga(namespace, 'follow', sagas, actors);
export const onfollowSaga = new onFollowSaga(namespace, 'onfollow', sagas, actors);
export const fansSaga = new FansSaga(namespace, 'fans', sagas, actors);
export const balanceSaga = new BalanceSaga(namespace, 'balance', sagas, actors);
export const moneydetailSage=new MonyeDetailSaga(namespace,'moneydetail',sagas,actors);
export const messagelikeSage=new MessageLikeSaga(namespace,'messagelike',sagas,actors);
export const msgcommentSaga=new MsgComments(namespace,'msgcomments',sagas,actors);
export const notificationSaga=new NotificationSaga(namespace,'notification',sagas,actors);
export const incomeSaga=new IncomeSaga(namespace,'income',sagas,actors);
export const mylikesSaga=new MylikesSaga(namespace,'mylikes',sagas,actors);
export const myordersSaga=new MyOrdersSaga(namespace,'myorders',sagas,actors);
export const unpayedSaga=new MyOrdersSaga(namespace,'unpayed',sagas,actors);
export const payedSaga=new MyOrdersSaga(namespace,'payed',sagas,actors);
export const depositSaga=new DepositSaga(namespace,'deposit',sagas,actors);
export const withdrawSaga=new WithdrawSaga(namespace,'withdraw',sagas,actors);
