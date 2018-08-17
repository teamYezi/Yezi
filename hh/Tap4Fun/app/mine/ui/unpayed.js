import React, {Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage, FlatList,RefreshControl} from 'react-native'
import moment from 'moment'

import {getState} from "../../store";
import {msgcommentSaga, myordersSaga, unpayedSaga} from "../saga";
import {isIphoneX, showTime} from "../../common/common";
import {navToRoute} from "../../nav";
import {otherpaySaga} from "../../store/saga";

const {width, height} = Dimensions.get('window');

export class Unpayed extends Component {
    constructor() {
        super();
        this.state = {
            phone: null,
            refreshing:false,
        }
    }


    componentDidMount() {
        let keys = ['phone', 'password'];
        AsyncStorage.multiGet(keys, (errs, result) => {
            if (errs) {
                return
            } else if (result[0][1] != null && result[1][1] != null) {
                unpayedSaga.myorders(result[0][1],2)
                this.setState({phone: result[0][1]})
            }

        })

    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        const succ=()=>{
            this.setState({refreshing:false})
        }
        unpayedSaga.myorders(this.state.phone,2,succ)
    };

    onPay(orderid){
        const success=()=>{
            const state = getState();
            let result = JSON.parse(state.store.otherpay.data);
            if(result==1){
                const succ=()=>{
                    navToRoute("SuccPay",{url:this.state.selected_url})
                }
                this.setState({modalvisible:false},succ)
            }else {
                const succ=()=>{
                    navToRoute("FailPay")
                }
                this.setState({modalvisible:false},succ)
            }

        }
        otherpaySaga.otherpay(orderid,success)
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
        let {i, images, order_number, payment_status, time_ordered,time_paid} = item;
        let time=new moment().format('X')
        time=time-time_paid;
        time=moment(time).format("HH小时mm分")
        return <View>
            {images.map((item,index)=>{
                return<View style={{width: width - 50, marginLeft: 5, marginTop: 10}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                            <TouchableOpacity style={{
                                shadowColor: "#cacaca",
                                marginRight: 4,
                                shadowOffset: {width: 2, height: 2},
                                shadowOpacity: 0.5,
                                shadowRadius: 5,
                                marginBottom: 4
                            }}

                                              onPress={() => {
                                                  navToRoute('ImageDetail', {id: item.img_id, phone: this.state.phone})
                                              }}
                            >
                                <Image style={{width: 90, height: 90, borderRadius: 3}} source={{url: item.img_url}}></Image>
                            </TouchableOpacity>
                            <View style={{height:90,justifyContent:"flex-start"}}>
                                <Text style={{marginLeft: 6, fontSize: 15, opacity: 0.8}}>{item.img_name}</Text>
                                <Text style={{marginLeft: 6, fontSize: 13, opacity: 0.55,marginTop:2}}>作品ID:{item.img_id}</Text>
                            </View>
                        </View>
                        <Text style={{fontSize:15,opacity:0.8,fontWeight:"bold"}}>￥{item.img_price}</Text>
                    </View>

                    <View style={{
                        width: width - 50,
                        marginLeft: 5,
                        height: 1,
                        backgroundColor: '#000',
                        opacity: 0.1,
                        marginTop: 10
                    }}></View>
                </View>

            })}
            <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:'center',marginTop:10}}>
                <View>
                    <Text style={{fontSize:13,opacity:0.8}}>订单号：{order_number}</Text>
                    <Text style={{fontSize:12,opacity:0.55,marginTop:2}}>创建时间：{showTime(time_ordered)}</Text>
                    <Text style={{fontSize:12,opacity:0.55,marginTop:1}}>剩余时间：{time}</Text>
                </View>
            </View>
            <View style={{
                width: width - 50,
                marginLeft: 5,
                height: 1,
                backgroundColor: '#000',
                opacity: 0.1,
                marginTop: 10
            }}></View>
            <View style={{alignItems:'center'}}>
                <TouchableOpacity style={{alignItems:'center',width:width/3,marginTop:15,padding:10,borderRadius:30,backgroundColor:'#71d9d1',flexDirection:"row",justifyContent:'center'}}
                onPress={()=>{this.onPay(order_number)}}>
                    <Text style={{fontSize:15,color:'white'}}>支付</Text>
                </TouchableOpacity>
            </View>
        </View>
    }

    render() {
        const state = getState();
        let data = JSON.parse(state.mine.unpayed.data);
        console.log("allorders",data)
        let Data = [];
        if (data != null) {
            console.log("123==", data)
            for (let i = 0; i < data.length; i++) {
                Data.push({
                    i: i,
                    images: data[i].images,
                    order_number: data[i].order_number,
                    payment_status: data[i].payment_status,
                    time_ordered: data[i].time_ordered,
                    time_paid: data[i].time_paid,
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
                    refreshControl={
                        <RefreshControl
                            tintColor="#71d9d1"
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                >

                </FlatList>
            </View>
        )
    }
}