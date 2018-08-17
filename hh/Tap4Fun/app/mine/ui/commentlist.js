import React, {Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage, FlatList} from 'react-native'
import moment from 'moment'

import {getState} from "../../store";
import {msgcommentSaga} from "../saga";
import {isIphoneX, showTime} from "../../common/common";
import {navToRoute} from "../../nav";

const {width, height} = Dimensions.get('window');

export class CommentList extends Component {
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
                msgcommentSaga.comments(result[0][1])
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
        let {i, cmt_time, img_description, comment, img_url, user_avatar, user_name, user_id, img_id} = item;
        return <View>
            <View style={{flexDirection: 'row', marginTop: 20}}>
                <Image style={{width: 40, height: 40, borderRadius: 20}}
                       source={(user_avatar == null) ? require('../../assert/img/avatar.png') : {url: user_avatar}}></Image>
                <View style={{justifyContent: 'center', marginTop: 3}}>
                    <View style={{flexDirection: 'row', marginLeft: 10, alignItems: 'center'}}>
                        <Text style={{fontSize: 14, opacity: 0.8}}>{user_name}</Text>
                    </View>
                    <Text style={{
                        color: "#797979",
                        fontSize: 12,
                        marginLeft: 10,
                        marginTop: 3
                    }}>{showTime(cmt_time)}</Text>
                </View>
            </View>
            <View style={{width: width - 50, marginLeft: 5, marginTop: 15}}>
                <Text style={{opacity: 0.8}}>{comment}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                    <TouchableOpacity style={{
                        shadowColor: "#cacaca",
                        marginRight: 4,
                        shadowOffset: {width: 2, height: 2},
                        shadowOpacity: 0.5,
                        shadowRadius: 5,
                        marginBottom: 4
                    }}

                                      onPress={() => {
                                          navToRoute('ImageDetail', {id: img_id, phone: this.state.phone})
                                      }}
                    >
                        <Image style={{width: 90, height: 90, borderRadius: 3}} source={{url: img_url}}></Image>
                    </TouchableOpacity>
                    <Text style={{marginLeft: 6, fontSize: 13, opacity: 0.65}}>{img_description}</Text>
                </View>
            </View>
        </View>
    }

    render() {
        const state = getState();
        let data = JSON.parse(state.mine.msgcomments.data);
        let Data = []
        if (data != null) {
            console.log("123==", data)
            for (let i = 0; i < data.length; i++) {
                Data.push({
                    i: i,
                    img_url: data[i].img_url,
                    cmt_time: data[i].cmt_time,
                    user_avatar: data[i].user_avatar,
                    user_name: data[i].user_name,
                    comment: data[i].comment,
                    img_description: data[i].img_description,
                    img_id: data[i].img_id,
                    user_id: data[i].user_id
                })
            }
        }
        return (
            <View>
                <FlatList
                    style={{width: width - 40, marginLeft: 20,marginBottom:(isIphoneX)?115:88}}
                    renderItem={this._Item}
                    ItemSeparatorComponent={this._separator}
                    data={Data}
                >

                </FlatList>
            </View>
        )
    }
}