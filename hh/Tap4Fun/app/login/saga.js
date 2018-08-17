/**
 * Created by yayowd on 2018/2/2.
 */
import {take, put, call, takeEvery, takeLatest, select} from "redux-saga/effects";

import {namespace, actors} from './actor';
import {Saga, SimpleSaga, Sagas} from '../saga';
import {Login} from './fetch';
import {mineSaga} from "../mine/saga";

class LoginSaga extends SimpleSaga {
    * runner(params) {
        console.log("loginSaga.runner begin")
        return yield call(Login.login.r, params);
    }

    login(name, password, cb) {
        this.call({...Login.login.p(name, password), cb});
    }
}

class SmsSaga extends SimpleSaga {
    * runner(params) {
        console.log("loginSaga.runner begin")
        return yield call(Login.sms.r, params);
    }

    getsms(phone, cb) {
        this.call({...Login.sms.p(phone), cb});
    }
}

class SignupSaga extends SimpleSaga {
    * runner(params) {
        console.log("loginSaga.runner begin")
        return yield call(Login.signup.r, params);
    }

    signup(phone, code,password,cb) {
        this.call({...Login.signup.p(phone,code,password), cb});
    }
}
class UpInfoSaga extends SimpleSaga{
    * runner(params) {
        return yield call(Login.personinfo.r, params);
    }

    upinfo(postfix,name,gender,birthday,signature,id,check,cb) {
        this.call({...Login.personinfo.p(postfix,name,gender,birthday,signature,id,check), cb});
    }
}

class GetInfoSaga extends SimpleSaga{
    * runner(params) {
        return yield call(Login.getinfo.r, params);
    }

    getinfo(phone,cb) {
        this.call({...Login.getinfo.p(phone), cb});
    }
}

export const sagas = new Sagas(namespace);
export const loginSaga = new LoginSaga(namespace, 'login', sagas, actors);
export const smsSaga = new SmsSaga(namespace, 'sms', sagas, actors);
export const signupSaga = new SignupSaga(namespace, 'signup', sagas, actors);
export const getinfoSaga = new GetInfoSaga(namespace, 'getinfo', sagas, actors);
export const upinfoSage = new UpInfoSaga(namespace, 'upinfo', sagas, actors);
