/**
 * Created by yayowd on 2018/2/6.
 */
import React, {Component} from 'react';
import {View, Platform, ActivityIndicator, Text} from 'react-native';
import RootSiblings from 'react-native-root-siblings';

export class Loader {
    static show = (backgroundColor = '#3333', size = 35, color = '#71d9d1', type = 'FadingCircle') => {
        return new RootSiblings(
            <View style={{top: Platform.OS === 'android' ? 0 : 0, right: 0, bottom: 0, left: 0, position: 'absolute', backgroundColor, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{backgroundColor: 'rgba(0, 0, 0, 0.6)', width: 100, height: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 10}}>
                    <ActivityIndicator style={{alignItems: 'center', justifyContent: 'center', height: size, width: size}}
                                       animating={true} color={color} size='small'/>
                    <Text style={{color, fontSize: 11}}>加载中...</Text>
                </View>
            </View>
        );
    };

    static hide = sibling => sibling && sibling.destroy();
}
