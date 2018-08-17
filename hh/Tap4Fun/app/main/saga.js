/**
 * Created by yayowd on 2018/2/2.
 */
import {take, put, call, takeEvery, takeLatest, select} from "redux-saga/effects";

import {namespace, actors} from './actor';
import {Saga, SimpleSaga, Sagas, Actors} from '../saga';
import {MainPage, Test} from './fetch';

class GetMainPageSage extends SimpleSaga {
    constructor(namespace, name, parentSagas: Sagas, parentActors: Actors, def, hasLoader = true) {
        super(namespace, name, parentSagas, parentActors, def);
        // 是否显示加载等待标识
        this.hasLoader = false;
    }
    * runner(params) {
        return yield call(MainPage.getmainpage.r, params);
    }

    getinfo(phone,page,cb) {
        this.call({...MainPage.getmainpage.p(phone,page), cb});
    }
}

class StarSage extends SimpleSaga {
    constructor(namespace, name, parentSagas: Sagas, parentActors: Actors, def, hasLoader = true) {
        super(namespace, name, parentSagas, parentActors, def);
        // 是否显示加载等待标识
        this.hasLoader = false;
    }

    * runner(params) {
        return yield call(MainPage.star.r, params);
    }

    star(id,phone, cb) {
        this.call({...MainPage.star.p(id,phone), cb});
    }
}

class ImgDetailSage extends SimpleSaga {

    * runner(params) {
        return yield call(MainPage.imagedetail.r, params);
    }

    getdetail(id,phone, cb) {
        this.call({...MainPage.imagedetail.p(id,phone), cb});
    }
}

class UserPageSage extends SimpleSaga {

    * runner(params) {
        return yield call(MainPage.userpage.r, params);
    }

    userpage(selfID,targetID,page, cb) {
        this.call({...MainPage.userpage.p(selfID,targetID,page), cb});
    }
}

class CommentsSage extends SimpleSaga {
    * runner(params) {
        return yield call(MainPage.comments.r, params);
    }

    comments(id, cb) {
        this.call({...MainPage.comments.p(id,1), cb});
    }
}

class AddCommentSage extends SimpleSaga {
    * runner(params) {
        return yield call(MainPage.addcomment.r, params);
    }

    addcomment(id, phone,cmt,cb) {
        this.call({...MainPage.addcomment.p(id,phone,cmt), cb});
    }
}

class SearchSage extends SimpleSaga {
    * runner(params) {
        return yield call(MainPage.search.r, params);
    }

    search(input,cb) {
        this.call({...MainPage.search.p(input,1), cb});
    }
}
export const sagas = new Sagas(namespace);
export const getmainpageSaga = new GetMainPageSage(namespace, 'getinfo', sagas, actors);
export const starSage = new StarSage(namespace, 'star', sagas, actors);
export const imgdetailSage = new ImgDetailSage(namespace, 'imgdetail', sagas, actors);
export const userpageSaga = new UserPageSage(namespace, 'userpage', sagas, actors);
export const commentsSaga = new CommentsSage(namespace, 'comments', sagas, actors);
export const addcommentSaga = new AddCommentSage(namespace, 'addcomment', sagas, actors);
export const searchSaga = new SearchSage(namespace, 'search', sagas, actors);
