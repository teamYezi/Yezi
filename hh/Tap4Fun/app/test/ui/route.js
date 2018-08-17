/**
 * Created by yayowd on 2018/2/2.
 */
import React, {Component} from "react";
import {View, Text, TouchableOpacity} from 'react-native';

import {navToRoute} from '../../nav';
import {addActor, identicalActor, storeActor} from '../actor';
// import {test, buy} from './saga';
import {yySaga, loginSaga} from '../saga';
import {showToast} from "../../common/util";

export class Route extends Component {
    navToRouteTest2() {
        navToRoute('routeTest2');
    }

    actorAdd() {
        addActor.add(12, 24);
    }
    actorIdentical() {
        identicalActor.identical('yayowd');
    }
    actorStore() {
        storeActor.store({name: 'mm', age: 26, desc: 'ooh, my love'});
        // storeActor.store('ooh, my love');
    }

    sagaYY() {
        yySaga.call({a1: 12, a2: 'mm'});
    }
    sagaLogin() {
        const succ = (payload, data) => {
            console.log('aaa', payload, data);
            showToast('登录成功！');
        };
        // loginSaga.login('haha', '123456', succ);
        // loginSaga.login('wb001', 'haha', succ);
        loginSaga.login('wb001', '123456', succ);
    }
    sagaTest() {
        // test('yayowd', 36);
    }
    sagaBuy() {
        // buy(99, 19, 5);
    }

    render() {
        const {[addActor.name]: add} = this.props;
        const {[identicalActor.name]: identical} = this.props;
        const {[storeActor.name]: store} = this.props;
        const {[yySaga.name]: yy} = this.props;
        const {[loginSaga.name]: login} = this.props;
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                <Text style={{fontSize: 19,}}>RouteTest</Text>
                <Text style={{fontSize: 19,}}>actor result: {`${add}, ${identical}, ${JSON.stringify(store)}`}</Text>
                <Text style={{fontSize: 19,}}>saga result: {`${JSON.stringify(yy)}`}</Text>
                <Text style={{fontSize: 19,}}>saga result: {`${JSON.stringify(login)}`}</Text>
                <TouchableOpacity style={{justifyContent: 'center', minWidth: 66, minHeight: 44, backgroundColor: '#3c9'}}
                                  onPress={this.navToRouteTest2.bind(this)}>
                    <Text style={{fontSize: 12,}}>Enter RouteTest2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{justifyContent: 'center', minWidth: 66, minHeight: 44, backgroundColor: '#3c9'}}
                                  onPress={this.actorAdd.bind(this)}>
                    <Text style={{fontSize: 12,}}>Actor Add</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{justifyContent: 'center', minWidth: 66, minHeight: 44, backgroundColor: '#3c9'}}
                                  onPress={this.actorIdentical.bind(this)}>
                    <Text style={{fontSize: 12,}}>Actor Identical</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{justifyContent: 'center', minWidth: 66, minHeight: 44, backgroundColor: '#3c9'}}
                                  onPress={this.actorStore.bind(this)}>
                    <Text style={{fontSize: 12,}}>Actor Store</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{justifyContent: 'center', minWidth: 66, minHeight: 44, backgroundColor: '#3c9'}}
                                  onPress={this.sagaYY.bind(this)}>
                    <Text style={{fontSize: 12,}}>Sage YY</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{justifyContent: 'center', minWidth: 66, minHeight: 44, backgroundColor: '#3c9'}}
                                  onPress={this.sagaLogin.bind(this)}>
                    <Text style={{fontSize: 12,}}>Sage Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{justifyContent: 'center', minWidth: 66, minHeight: 44, backgroundColor: '#3c9'}}
                                  onPress={this.sagaTest.bind(this)}>
                    <Text style={{fontSize: 12,}}>Sage Test</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{justifyContent: 'center', minWidth: 66, minHeight: 44, backgroundColor: '#3c9'}}
                                  onPress={this.sagaBuy.bind(this)}>
                    <Text style={{fontSize: 12,}}>Sage Buy</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
