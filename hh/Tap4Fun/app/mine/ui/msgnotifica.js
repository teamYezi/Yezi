import React, {Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage, FlatList} from 'react-native'
import moment from 'moment'

import {getState} from "../../store";
import {msgcommentSaga, notificationSaga} from "../saga";
import {showTime} from "../../common/common";
import {navToRoute} from "../../nav";

const {width, height} = Dimensions.get('window');

export class Notification extends Component {
    constructor() {
        super();
        this.state = {
            phone: null
        }
    }


    componentDidMount() {
        let keys = ['phone', 'password'];
        AsyncStorage.multiGet(keys, (errs, result) => {
            if (errs) {
                return
            } else if (result[0][1] != null && result[1][1] != null) {
                notificationSaga.notification(result[0][1])
                this.setState({phone: result[0][1]})
            }

        })

    }

    _separator = (() => {
        return <View style={{
            width: width - 50,
            marginLeft: 5,
            height: 1,
            backgroundColor: '#000',
            opacity: 0.1,
            marginTop: 16
        }}></View>
    })

    _Item = (item) => {
        item = item.item;
        let {i, time,  content, avatar_url, notification_type} = item;
        return <View>
            <View style={{flexDirection: 'row', marginTop: 20}}>
                <Image style={{width: 40, height: 40, borderRadius: 20}}
                       source={(avatar_url == null) ? require('../../assert/img/avatar.png') : {url: avatar_url}}></Image>
                <View style={{justifyContent: 'center', marginTop: 3}}>
                    <View style={{flexDirection: 'row', marginLeft: 10, alignItems: 'center'}}>
                        <Text style={{fontSize: 14, opacity: 0.8}}>{notification_type}</Text>
                    </View>
                    <Text style={{
                        color: "#797979",
                        fontSize: 12,
                        marginLeft: 10,
                        marginTop: 3
                    }}>{showTime(time)}</Text>
                </View>
            </View>
            <View style={{width: width - 95, marginLeft: 50, marginTop: 15}}>
                <Text style={{opacity: 0.8}}>{content}</Text>
            </View>
        </View>
    }

    render() {
        const state = getState();
        let data = JSON.parse(state.mine.notification.data);
        let Data = []
        if (data != null) {
            console.log("123==", data)
            for (let i = 0; i < data.length; i++) {
                Data.push({
                    i: i,
                    time: data[i].time,
                    avatar_url: data[i].avatar_url,
                    notification_type: data[i].notification_type,
                    content: data[i].content,
                })
            }
        }
        return (
            <View>
                <FlatList
                    style={{width: width - 40, marginLeft: 20}}
                    renderItem={this._Item}
                    ItemSeparatorComponent={this._separator}
                    data={Data}
                >

                </FlatList>
            </View>
        )
    }
}