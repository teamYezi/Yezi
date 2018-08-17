/**
 * Created by yayowd on 2018/2/2.
 */
import React, {Component} from "react";
import {View, Text, TouchableOpacity} from 'react-native';

import {navBack} from '../../nav';

export class Route2 extends Component {
    navBack() {
        navBack();
    }

    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                <Text style={{fontSize: 19,}}>RouteTest2</Text>
                <TouchableOpacity style={{justifyContent: 'center', minWidth: 66, minHeight: 44, backgroundColor: '#3c9'}}
                                  onPress={this.navBack.bind(this)}>
                    <Text style={{fontSize: 12,}}>navBack</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
