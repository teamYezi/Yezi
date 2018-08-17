import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage} from 'react-native'
import ScrollableTabView,{DefaultTabBar} from 'react-native-scrollable-tab-view'

import {isIphoneX} from "../../common/common";
import {navBack} from "../../nav";
import {ZanList} from "./zanlist";
import {CommentList} from "./commentlist";
import {Notification} from "./msgnotifica";

const {width, height} = Dimensions.get('window');

export class MyMessage extends Component{


    render(){
        return(
            <View style={{width:width,height:height,backgroundColor:"white"}}>
                <View style={{flexDirection:'row',width:width-40,marginLeft:20,alignItems:'center',justifyContent:'center',height:80,marginTop:(isIphoneX)?20:0}}>
                    <View style={{position:'absolute',left:-20,top:0}}>
                        <TouchableOpacity onPress={()=>{navBack()}} style={{marginTop:35,marginLeft:20,marginRight:20,marginBottom:20}}>
                            <Image source={require('../../assert/img/backicon.png')} style={{width:10.5,height:19}}></Image>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:18,fontWeight:"bold",marginTop:10}}>消息</Text>
                </View>
                <View style={{width:width,height:height}}>
                    <ScrollableTabView
                        style={{marginTop:0}}
                        locked={false}
                        tabBarTextStyle={{fontSize:16}}
                        tabBarActiveTextColor="#71D9D1"
                        tabBarUnderlineStyle={{backgroundColor:"#fff",width:40}}
                        initialPage={0}
                        renderTabBar={()=><DefaultTabBar/>}
                    >
                        <View tabLabel='赞' style={{backgroundColor:'#fff',height:height,width:width}}>
                            <ZanList/>
                        </View>
                        <View tabLabel='评论' style={{flex:1,backgroundColor:'#fff'}}>
                            <CommentList/>
                        </View>
                        <View tabLabel='通知' style={{flex:1,backgroundColor:'#fff'}}>
                            <Notification/>
                        </View>
                    </ScrollableTabView>
                </View>
            </View>
        )
    }
}