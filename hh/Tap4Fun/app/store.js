/**
 * Created by yayowd on 2017/4/17.
 */
import {Platform} from "react-native";
import {applyMiddleware, combineReducers, createStore} from "redux";
import {createAction, handleAction} from 'redux-actions';
import createSagaMiddleware from "redux-saga";
import {take, put, call, takeEvery, takeLatest, select} from "redux-saga/effects";
import {createLogger} from "redux-logger";
import {composeWithDevTools} from "remote-redux-devtools";
import R from "ramda";

import {isEmpty} from './common/util';
import {setDispatch, Actors, Sagas} from './saga';

let store = null;

// action相关
const namespace = 'store';
const actionReset = createAction(`${namespace}/reset`);
const actionResetName = actionReset.toString();
export const getState = () => {
    if (store != null) {
        return store.getState();
    }
    return {};
};
export const dispatch = (action) => {
    if (store != null) {
        store.dispatch(action);
    }
};
// 将派发函数复制到action中
setDispatch(dispatch);
export const reset = () => {
    dispatch(actionReset());
};

// reducer相关
const rootReducer = () => {
    const reducer = Actors.rootActors.reducer;
    return (state, action) => {
        if (action.type === actionResetName) { // 响应store reset
            state = {};
            console.log('store', 'reset', 'state', '='.repeat(19), state);
        }
        return reducer(state, action);
    }
};

// 创建store
const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger();
const composeEnhancers = composeWithDevTools({
    name: Platform.OS,
    hostname: 'localhost',
    port: 5678,
    realtime: true
});
export const getStore = () => {
    if (store == null) {
        store = createStore(
            rootReducer(),
            undefined,
            composeEnhancers(
                applyMiddleware(
                    sagaMiddleware,
                    loggerMiddleware,
                ),
                // other store enhancers if any
            )
        );
        sagaMiddleware.run(Sagas.rootSagas.runner);
    }
    return store;
};
