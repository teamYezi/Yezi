/**
 * Created by yayowd on 2018/2/2.
 */
import {take, put, call, takeEvery, takeLatest, select} from "redux-saga/effects";

import {namespace, actors} from './actor';
import {Saga, SimpleSaga, Sagas} from '../saga';
import {Test} from './fetch';

class LoginSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Test.login.r, params);
    }

    login(name, password, cb) {
        this.call({...Test.login.p(name, password), cb});
    }
}

export const sagas = new Sagas(namespace);
export const yySaga = new SimpleSaga(namespace, 'yy', sagas, actors, 'haha, yy');
export const loginSaga = new LoginSaga(namespace, 'login', sagas, actors, 'unknow user');
