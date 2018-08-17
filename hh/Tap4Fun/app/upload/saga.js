/**
 * Created by LoveM3I on 2018/8/6.
 */
import {take, put, call, takeEvery, takeLatest, select} from "redux-saga/effects";

import {namespace, actors} from './actor';
import {Saga, SimpleSaga, Sagas} from '../saga';
import {Test, Upload} from './fetch';

class UploadSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Upload.upload.r, params);
    }

    upload(phone, price,imgName,postfix,size,resolution,description,imgTag,ctag,forsale, cb) {
        this.call({...Upload.upload.p(phone,price,imgName,postfix,size,resolution,description,imgTag,ctag,forsale), cb});
    }
}
class UploadRawSaga extends SimpleSaga {
    * runner(params) {
        return yield call(Upload.uploadraw.r, params);
    }

    uploadraw(phone,postfix,img_id,MD5 ,cb) {
        this.call({...Upload.uploadraw.p(phone,postfix,img_id,MD5), cb});
    }
}

export const sagas = new Sagas(namespace);
export const uploadSaga = new UploadSaga(namespace, 'upload', sagas, actors);
export const uploadrawSaga=new UploadRawSaga(namespace,'uploadraw',sagas,actors)
