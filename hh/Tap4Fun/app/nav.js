/**
 * Created by yayowd on 2018/2/2.
 */
import React, {Component} from 'react';
import {NativeModules, Platform, BackHandler, AppState,} from "react-native";
import {StackNavigator, addNavigationHelpers, NavigationActions} from 'react-navigation';
import {applyMiddleware, combineReducers, createStore} from "redux";
import {connect, Provider} from 'react-redux';
import R from 'ramda';

import {isEmpty, error} from './common/util';
import {Actor} from './saga';
import {dispatch, getState} from "./store";
import {
    createReduxBoundAddListener,
    createReactNavigationReduxMiddleware,
    createNavigationReducer,
} from 'react-navigation-redux-helpers';

// 添加各个页面到路由器列表中
let routes = {};
let routeStart = null;
let routeMain = null;
export const addRoute = (name, route, {start = false, main = false, header = null, gesturesEnabled = true,gestureResponseDistance={horizontal:100}, ...config} = {}) => {
    // 检查名称为空
    if (isEmpty(name)) {
        error('route名称为空：', name, route);
    }
    // 检查组件为空
    if (isEmpty(route)) {
        error('route组件为空：', name, route);
    }
    // 检查名称重复
    if (R.has(name, routes)) {
        error('route名称重复：', name, route);
    }

    route.navigationOptions = {
        header,
        gesturesEnabled,
        gestureResponseDistance,
        ...config,
    };
    routes[name] = {screen: route};

    if (start) {
        if (!isEmpty(routeStart) && routeStart !== name) {
            error('导航器中只能设置一个开始页：', '当前', routeStart, '新的', name);
        }
        routeStart = name;
    }
    if (main) {
        if (!isEmpty(routeMain) && routeMain !== name) {
            error('导航器中只能设置一个主页：', '当前', routeMain, '新的', name);
        }
        routeMain = name;
    }
};

// 构建路由器
let AppNavigator = null;
const getNavigator = () => AppNavigator || (AppNavigator = StackNavigator(routes));

// 路由器 Actor
class NavActor extends Actor {
    proc(state = this.initialState(), action) {
        const {getStateForAction} = getNavigator().router;
        const nextState = getStateForAction(action, state);
        // Simply return the original `state` if `nextState` is null or undefined.
        return nextState || state;
    }

    get reducer() {
        this.initialState = () => {
            const {getStateForAction, getActionForPathAndParams} = getNavigator().router;
            if (isEmpty(routeStart)) {
                error('导航器中未设置开始页：', this, routeStart);
            }
            return getStateForAction(getActionForPathAndParams(routeStart));
        };

        return this.proc.bind(this);
    }
}

const navActor = new NavActor('nav', 'nav');
const middleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
);
const addListener = createReduxBoundAddListener("root");
// 路由器组件
export const getNavApp = () => {
    class Nav extends Component {
        componentDidMount() {
            if (Platform.OS === 'android') {
                BackHandler.addEventListener("hardwareBackPress", this.onBackAndroid);
            }
        }

        componentWillUnmount() {
            if (Platform.OS === 'android') {
                BackHandler.removeEventListener("hardwareBackPress", this.onBackAndroid);
            }
        }

        onBackAndroid = () => {
            const {dispatch, [navActor.name]: {index, routes}} = this.props;
            const {routeName, params = {}} = routes[index];
            console.log('onBackAndroid', index, routeName, params);
            if (index === 0) {
                return false;
            } else if (routeName === routeMain) {
                return false;
            } else {
                const {back} = params;
                if (R.is(Function)(back)) {
                    back();
                } else {
                    // 默认：导航到上一页
                    dispatch(NavigationActions.back());
                }
                return true;
            }
        };

        render() {
            const Navigator = getNavigator();
            const {dispatch, [navActor.name]: state} = this.props;
            return (
                <Navigator navigation={addNavigationHelpers({
                    dispatch,
                    state,
                    addListener,
                })}/>
            );
        }
    }

    const mapStateToProps = (state) => ({
        [navActor.name]: state[navActor.name]
    });
    return connect(mapStateToProps)(Nav);
};

// 导航辅助函数
export const navToRoute = (routeName, params = {}, action = {}) => {
    dispatch(NavigationActions.navigate({routeName, params, action}));
};
export const navBack = (key) => {
    dispatch(NavigationActions.back({key}));
};
export const navBackToRoute = (routeName) => {
    const {routes = []} = R.propOr({}, navActor.name, getState());
    const pos = R.findLastIndex(R.propEq('routeName', routeName))(routes);
    if (pos >= 0) {
        const pos1 = pos + 1;
        if (pos1 < routes.length) {
            const {key} = routes[pos1];
            navBack(key);
        }
    }
};
