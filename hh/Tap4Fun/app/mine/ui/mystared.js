import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage,FlatList} from 'react-native'
import ScrollableTabView,{DefaultTabBar} from 'react-native-scrollable-tab-view'

import {isIphoneX, showTime} from "../../common/common";
import {navBack, navToRoute} from "../../nav";
import {ZanList} from "./zanlist";
import {CommentList} from "./commentlist";
import {Notification} from "./msgnotifica";
import {mylikesSaga} from "../saga";

const {width, height} = Dimensions.get('window');

export class MyStared extends Component{
    constructor(){
    super()
        this.state={
        phone:null
        }
    }

    componentDidMount() {
        let keys = ['phone', 'password'];
        AsyncStorage.multiGet(keys, (errs, result) => {
            if (errs) {
                return
            } else if (result[0][1] != null && result[1][1] != null) {
                mylikesSaga.mylikes(result[0][1])
                this.setState({phone: result[0][1]})
            }

        })

    }
    _Item = (item) => {
        item = item.item;
        let {img_id,i,img_description,img_url,name,time,user_avatar}=item
        return <View>
            <View style={{flexDirection: 'row', marginTop: 15}}>
                <Image style={{width: 40, height: 40, borderRadius: 20}}
                       source={(user_avatar==null)?require('../../assert/img/avatar.png'):{url:user_avatar}}></Image>
                <View style={{justifyContent: 'center', marginTop: 3}}>
                    <View style={{flexDirection: 'row', marginLeft: 10, alignItems: 'center'}}>
                        <Text style={{fontSize: 14, opacity: 0.8}}>{name}</Text>
                    </View>
                    <Text style={{
                        color: "#797979",
                        fontSize: 12,
                        marginLeft: 10,
                        marginTop: 3
                    }}>{showTime(time)}</Text>
                </View>
            </View>
            <View style={{width: width - 50, marginLeft: 5, marginTop: 15}}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 0}}>
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
                        <Image style={{width: 90, height: 90, borderRadius: 3}} source={{url:img_url}}></Image>
                    </TouchableOpacity>
                    <Text style={{marginLeft: 6, fontSize: 13, opacity: 0.65}}>{img_description}</Text>
                </View>
            </View>
        </View>
    }

    _separator = (() => {
        return <View style={{
            width: width - 50,
            marginLeft: 5,
            height: 1,
            backgroundColor: '#000',
            opacity: 0.1,
            marginTop: 15
        }}></View>
    })

    render(){
        let data=JSON.parse(this.props.mylikes.data)
        console.log("mylikes",data)
        let Data=[];
        if(data!=null){
            for(let i=0;i<data.length;i++){
                Data.push({i:i,img_id:data[i].img_id,img_description:data[i].img_description,img_url:data[i].img_url,name:data[i].name,time:data[i].time,user_avatar:data[i].user_avatar})
            }
        }

        return(
            <View style={{width:width,height:height,backgroundColor:"white"}}>
                <View style={{flexDirection:'row',width:width-40,marginLeft:20,alignItems:'center',justifyContent:'center',height:80,marginTop:(isIphoneX)?20:0}}>
                    <View style={{position:'absolute',left:-20,top:0}}>
                        <TouchableOpacity onPress={()=>{navBack()}} style={{marginTop:35,marginLeft:20,marginRight:20,marginBottom:20}}>
                            <Image source={require('../../assert/img/backicon.png')} style={{width:10.5,height:19}}></Image>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:18,fontWeight:"bold",marginTop:10}}>我赞过的</Text>
                </View>
                <FlatList
                    style={{width: width - 40, marginLeft: 20,marginTop:-10}}
                    renderItem={this._Item}
                    ItemSeparatorComponent={this._separator}
                    data={Data}
                >

                </FlatList>
            </View>
        )
    }
}