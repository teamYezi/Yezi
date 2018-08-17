/**
 * Created by yayowd on 2018/2/4.
 */
import R from 'ramda';
import {applyMiddleware, combineReducers, createStore} from "redux";
import {createAction, createActions, handleAction, handleActions} from "redux-actions";
import {take, put, call, takeEvery, takeLatest, select} from "redux-saga/effects";

import {error, defReducer, isEmpty, cfCb, showToast} from "./common/util";
import {Loader} from "./common/ui/loader"


/////////////////////////////////////////////
// 避免循环引用
//  store中dispatch副本
//  用于action中集成action派发
let dispatch_ = undefined;
export const setDispatch = dispatch => dispatch_ = dispatch;


/////////////////////////////////////////////
// redux意义上的action
//  仅声明定义，不包含处理函数
class Action {
    constructor(namespace, name) {
        this.namespace = namespace;
        this.name = name;
    }

    get namespace() {
        return this.namespace_;
    }

    set namespace(val) {
        // action名称前缀，避免各个业务中action的名称冲突
        //  不用于store中
        this.namespace_ = val;
        // 检查命名空间
        if (isEmpty(this.namespace)) {
            error('actor 命名空间为空：', this);
        }
    }

    get name() {
        return this.name_;
    }

    set name(val) {
        // action名称，具有实际业务操作意义
        //  作为store节点名称
        this.name_ = val;
        // 检查名称
        if (isEmpty(this.name)) {
            error('actor 名称为空：', this);
        }
    }

    get type() {
        return `${this.namespace}/${this.name}`;
    }

    // 返回redux action
    get action() {
        if (isEmpty(this.action_)) {
            // console.log('action 被创建', this);
            this.action_ = createAction(this.type);
        }
        return this.action_;
    }

    dispatch(payload) {
        if (R.is(Function, dispatch_)) {
            dispatch_(this.action(payload));
        }
    }
}

// 获取actor/s在store中对应的数据
//  s开头表示与store相关
const spath = actor => {
    if (!R.isNil(actor)) {
        if (R.isNil(actor.parent)) {
            return isEmpty(actor.name) ? [] : [actor.name];
        } else {
            return [...spath(actor.parent), actor.name];
        }
    }
    return [];
};
const sdata = (actor, state) => {
    const path = spath(actor);
    if (!isEmpty(path) && !R.isNil(state)) {
        return R.path(path, state);
    }
};
const prop = (actor, state) => {
    if (!R.isNil(actor)) {
        if (isEmpty(actor.name)) {
            error('actor/s 映射数据到ui时，名称不能为空', '也无法映射root actors', actor);
        }
        return {[actor.name]: sdata(actor, state)};
    }
    return {};
};

// redux意义上的reducer
//  仅仅处理某个action
//  简单业务处理
export class Actor extends Action {
    constructor(namespace, name, parent: Actors = Actors.rootActors, def) {
        super(namespace, name);
        // console.log('actor 被创建', this);
        this.parent = parent;
        this.def = def;
    }

    get parent(): Actors {
        return this.parent_;
    }

    set parent(val: Actors) {
        this.parent_ = val;

        if (R.isNil(this.parent)) {
            error('actor 必须指定一个有效的parent：', this);
        } else {
            this.parent.add(this);
        }
    }

    get def() {
        return this.def_ || null;
    }

    set def(val) {
        this.def_ = val;
    }

    // store中actor存储的数据
    //  s开头表示与store相关
    sdata(state) {
        return sdata(this, state);
    }

    prop(state) {
        return prop(this, state);
    }

    proc(state, action) {
        // console.log('Actor', 'proc(def)', this, 'action', action);
        return defReducer(state, action);
    }

    get reducer() {
        // console.log('actor 处理action', this);
        return handleAction(this.type, this.proc.bind(this), this.def);
    }

    store(data) {
        this.dispatch(data);
    }
}

// actor列表
export class Actors {
    // root actors核查
    static rootActors: Actors = undefined;

    // 核查root：超过一个时报错
    static setRoot(root: Actors) {
        if (!R.isNil(root)) {
            if (R.isNil(this.rootActors)) {
                this.rootActors = root;
                this.rootActors.root = true;
            } else if (this.rootActors !== root) {
                error('rootActors 只能有一个', '当前', this.rootActors, '新的', root);
            }
        }
    }

    constructor(name: String, parent: Actors = Actors.rootActors) {
        // console.log('actors 被创建', this);
        this.name = name;
        this.parent = parent;
        this.actors = {};
    }

    get name() {
        return this.name_;
    }

    set name(val) {
        // actions名称
        //  子actors时，作为store节点名称
        this.name_ = val;

        if (isEmpty(this.name)) {
            // console.warn('actors name 为空，将作为root actors使用', this);
            Actors.setRoot(this);
        }
    }

    get parent(): Actors {
        return this.parent_;
    }

    set parent(val: Actors) {
        this.parent_ = val;

        if (R.isNil(this.parent)) {
            // console.warn('actors parent 为空，将作为root actors使用', this);
            Actors.setRoot(this);
        } else {
            this.parent.add(this);
        }
    }

    // store中actors存储的数据
    //  s开头表示与store相关
    sdata(state) {
        return sdata(this, state);
    }

    prop(state) {
        return prop(this, state);
    }

    add(actor) {
        // console.log('actor/s 被添加', this, actor);
        // 检查 actor 为空
        if (R.isNil(actor)) {
            error('actor/s 为空：', this, actor);
        }
        // 检查名称为空
        if (isEmpty(actor.name)) {
            error('actor/s 名称为空：', this, actor);
        }
        // 检查名称重复
        if (R.has(actor.name, this.actors)) {
            error('actor/s 名称重复：', this, actor);
        }
        this.actors[actor.name] = actor;
    }

    get reducer() {
        // console.log('actors 合并reducers', this);
        // 在子actor不为空时有效
        if (isEmpty(this.actors)) {
            error('子actor 为空：', this);
        }
        return combineReducers(R.map(actor => actor.reducer, this.actors));
    }
}

// root actors: no name, no parent
new Actors();


/////////////////////////////////////////////
// 一次复杂业务
//  将某个action映射为saga进行业务封装：异步转同步
//  包含一个或多个其它actor
export class Saga extends Action {
    constructor(namespace, name, parentSagas: Sagas = Sagas.rootSagas, parentActors: Actors = Actors.rootActors, def) {
        super(namespace, name);
        // console.log('Saga 被创建', this);
        this.parentSagas = parentSagas;
        this.parentActors = parentActors;
        // 业务数据默认值
        this.def = def;

        this.initActors();
    }

    set parentSagas(val: Sagas) {
        if (R.isNil(val)) {
            error('saga 必须指定一个有效的 parentSagas', this);
        }
        val.add(this);
    }

    get parentActors(): Actors {
        return this.parentActors_;
    }

    set parentActors(val: Actors) {
        this.parentActors_ = val;

        if (R.isNil(this.parentActors)) {
            error('saga 必须指定一个有效的 parentActors', this);
        }
    }

    // 默认数据，放到 * data 中
    //  初始或业务操作成功但未返回数据时使用
    get def() {
        return this.def_ || null;
    }

    set def(val) {
        this.def_ = val;
    }

    // 初始化本saga依赖的actors
    //  注意store的reducer依赖这些actor
    //  APP运行之前初始化，构造函数中调用
    initActors() {
    }

    getActor(name, def, pname = `actor_${name}`) {
        if (R.isNil(this[pname])) {
            if (R.isNil(this.actors)) {
                this.actors = new Actors(this.name, this.parentActors);
            }
            this[pname] = new Actor(`${this.namespace}/${this.name}`, name, this.actors, def);
        }
        return this[pname];
    }

    // store中 saga 存储的数据
    //  s开头表示与store相关
    sdata(state) {
        return sdata(this.actors, state);
    }

    prop(state) {
        return prop(this.actors, state);
    }

    // saga模式
    get mode() {
        return takeLatest;
    }

    * run() {
        // console.log('saga run', this);
        yield this.mode(this.type, this.proc.bind(this));
    }

    * proc({payload}) {
        console.log("SimpleSage proc begin",this.def)
        try {
            yield this.doing(true);
            const {start: start_ = this.start} = payload;
            const sdata = yield start_(payload, yield select());
            if (sdata) {
                yield this.data(sdata);
            }

            const params = yield this.prev(payload, yield select());
            console.log("params==>>",params)
            if (params) {
                console.log("if(params) begin")
                let res = yield call(this.runner, params);
                console.log("res1===",res)
                const {data = this.def} = res || {};
                const data2 = yield this.succ(data, payload, yield select());
                console.log("data==",data,"res==",res,"data2===",data2)
                yield this.data(data2);
                yield this.finish(data, payload, yield select());

                try {
                    cfCb(payload, data);
                } catch (e) {
                    // console.log('saga', 'cfCb', 'error', e);
                }
            }
        } catch (e) {
            // console.log('saga', 'error', e);
            yield this.error(e);
        } finally {
            const {end: end_ = this.end} = payload;
            const edata = yield end_(payload, yield select());
            if (edata) {
                yield this.data(edata);
            }
            yield this.doing(false);
        }
    }

    // 是否正在处理业务的标识
    * doing(flag) {
    }

    // 开始处理业务，返回非空数据则存入store
    * start(payload, state) {
    }

    // 参数调整，默认返回原参数
    * prev(payload, state) {
        return payload;
    }

    // 业务处理函数
    * runner(params) {
        return {};
    }

    // 获取业务数据成功后调用，用于将数据处理后再存入store
    //  默认直接返回原数据
    * succ(data, payload, state) {
        return data;
    }

    // 数据获取和存入store成功后调用
    //  data为原数据，非succ处理后的数据
    * finish(data, payload, state) {
    }

    // 将数据存入store
    * data(data) {
    }

    // 业务出错时调用
    * error(err) {
    }

    // 结束处理业务，返回非空数据则存入store
    * end(payload, state) {
    }

    // 调用本saga
    call(params) {
        this.dispatch(params);
    }
}

export class SimpleSaga extends Saga {
    constructor(namespace, name, parentSagas: Sagas, parentActors: Actors, def, hasLoader = true) {
        super(namespace, name, parentSagas, parentActors, def);
        // 是否显示加载等待标识
        this.hasLoader = false;
    }

    initActors() {
        // 业务内actor
        this.acDoing = this.getActor('doing');
        this.acData = this.getActor('data', this.def);
    }

    // store中 saga 存储的详细数据
    //  sa开头表示与 store + actor 相关
    saDoing(state) {
        return sdata(this.acDoing, state);
    }

    saData(state) {
        return sdata(this.acData, state);
    }

    * doing(flag) {
        // console.log('SimpleSaga', 'doing', flag);
        this.acDoing.store(flag);

        if (this.hasLoader) {
            if (flag) {
                this.sibling = Loader.show();
            } else {
                Loader.hide(this.sibling);
            }
        }
    }

    * start(payload, state) {
        // console.log('SimpleSaga', 'start', payload);
    }

    * prev(payload, state) {
        // console.log('SimpleSaga', 'prev', payload);
        return payload;
    }

    * runner(params) {
        // console.log('SimpleSaga', 'runner', params);
    }

    * succ(data, payload, state) {
        // console.log('SimpleSaga', 'succ', data);
        return data;
    }

    * finish(data, payload, state) {
        // console.log('SimpleSaga', 'finish', data);
    }

    * data(data) {
        // console.log('SimpleSaga', 'data', data);
        this.acData.store(data);
    }

    * error(err) {
        // console.log('SimpleSaga', 'error', err);
        const {message = ''} = err;
        showToast(message);
    }

    * end(payload, state) {
        // console.log('SimpleSaga', 'end', payload);
    }
}

// 多个saga组合
export class Sagas {
    // root sagas 核查
    static rootSagas: Sagas = undefined;

    // 核查root：超过一个时报错
    static setRoot(root: Sagas) {
        if (!R.isNil(root)) {
            if (R.isNil(this.rootSagas)) {
                this.rootSagas = root;
                this.rootSagas.root = true;
            } else if (this.rootSagas !== root) {
                error('rootSagas 只能有一个', '当前', this.rootSagas, '新的', root);
            }
        }
    }

    constructor(name, parent: Sagas = Sagas.rootSagas) {
        // console.log('Sagas 被创建', this);
        this.name = name;
        this.parent = parent;
        this.sagas = [];
    }

    * [Symbol.iterator]() {
        yield* this.sagas.values;
    }

    set parent(val: Sagas) {
        if (R.isNil(val)) {
            // console.warn('sagas parent 为空，将作为root sagas 使用', this);
            Sagas.setRoot(this);
        } else {
            val.add(this);
        }
    }

    add(saga) {
        // console.log('saga/s 被添加', this, saga);
        // 检查saga为空
        if (R.isNil(saga)) {
            error('saga为空：', saga);
        }
        this.sagas.push(saga);
    }

    * run() {
        // console.log('sagas run', this);
        for (const saga of this.sagas) {
            yield* saga.run();
        }
    }

    get runner() {
        return this.run.bind(this);
    }
}

// root sagas: no parent
new Sagas();
