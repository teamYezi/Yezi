/**
 * Created by yayowd on 2017/4/17.
 */
import React, {Component} from "react";
import {connect, Provider} from "react-redux";
import codePush from "react-native-code-push";

import {config} from "./config";
import {getNavApp} from './nav';
import {getStore} from './store';
// import SplashScreen from 'react-native-splash-screen'


// import push from './push';
// import login from './login';
// import main from './main/index';
import store from './store'
import test from './test';
import login from './login'
import home from  './home'
import upload from './upload'

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };

class App_ extends Component {

    componentDidMount() {
        // do anything while splash screen keeps, use await to wait for an async task.
        // SplashScreen.hide();//关闭启动屏幕
    }

    render() {

        // 注意：导航需要添加reducer，所以需要先执行
        const Nav = getNavApp();
        // 使用添加的reducer及saga生成store
        const store = getStore();
        return (
            <Provider store={store}>
                <Nav/>
            </Provider>
        );
    }
}

export default App = codePush(codePushOptions)(App_);
// export default App_;
