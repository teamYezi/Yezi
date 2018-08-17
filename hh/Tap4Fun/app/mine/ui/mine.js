import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage} from 'react-native'

import ScrollableTabView,{DefaultTabBar} from 'react-native-scrollable-tab-view'
import {loginSaga} from "../../login/saga";
import {mineSaga} from "../saga";
import {navToRoute} from "../../nav";
import {isIphoneX} from "../../common/common";

const {width, height} = Dimensions.get('window');

export class Mine extends Component{
    constructor(){
        super();
        this.state={
            phone:null
        }
    }


    componentDidMount(){

        //获取phoenNum
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(errs){
                return
            }else if(result[0][1]!=null&&result[1][1]!=null){
                const succ=()=>{
                    console.log("aaaaa")
                    mineSaga.getmign(this.state.phone)
                }
                this.setState({phone:result[0][1]},succ)
            }

        })

    }


    render(){
        console.log("this.props",this.props)
        let data=JSON.parse(this.props.mine.data)||[];
        console.log("data",data)
        return(
            <View style={{backgroundColor:'#fff',width:width,height:height}}>
                <View style={{position:'absolute',right:0,top:(isIphoneX)?50:20}}>
                    <TouchableOpacity onPress={()=>{navToRoute('ShoppingCart')}} style={{marginTop:20,marginRight:20}}>
                        <Image source={require('../../assert/img/shopingcar.png')} style={{width:22,height:20}}></Image>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:"row",marginTop:80,width:width-100,justifyContent:'center',alignItems:'center',marginLeft:50}}>
                    <Image style={{width:80,height:80,borderRadius:40}} source={(data.avatar==null)?require('../../assert/img/avatar.png'):{url:data.avatar}}></Image>
                </View>
                <View style={{alignItems:'center',marginTop:10}}>
                    <Text style={{fontSize:16,opacity:0.8}}>{data.name}</Text>
                    <Text style={{fontSize:12,marginTop:10,opacity:0.55}}>{data.signature}</Text>
                </View>
                <View style={{width:width-40,marginLeft:20,height:1,backgroundColor:'#000',opacity:0.1,marginTop:10}}></View>
                <View style={{flexDirection:'row',width:width-40,marginLeft:20,alignItems:'center',marginTop:10}}>
                    <TouchableOpacity onPress={()=>{navToRoute('Product')}}>
                        <View style={{alignItems:'center',justifyContent:'center',width:width/3-40/3}}>
                            <Text style={{fontSize:18,fontWeight:'bold',opacity:0.8}}>{data.imgNum}</Text>
                            <Text style={{fontSize:12,marginTop:5,opacity:0.8}}>作品</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{height:40,width:1,backgroundColor:'#000',opacity:0.1}}></View>
                    <TouchableOpacity onPress={()=>{navToRoute('Followed')}}>
                        <View style={{alignItems:'center',justifyContent:'center',width:width/3-40/3}}>
                            <Text style={{fontSize:18,fontWeight:'bold',opacity:0.8}}>{data.numFollows}</Text>
                            <Text style={{fontSize:12,marginTop:5,opacity:0.8}}>关注</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{height:40,width:1,backgroundColor:'#000',opacity:0.1}}></View>
                    <TouchableOpacity onPress={()=>{navToRoute('Fans')}}>
                        <View style={{alignItems:'center',justifyContent:'center',width:width/3-40/3}}>
                            <Text style={{fontSize:18,fontWeight:'bold',opacity:0.8}}>{data.numFans}</Text>
                            <Text style={{fontSize:12,marginTop:5,opacity:0.8}}>粉丝</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={()=>{navToRoute('MyOrder')}}>
                    <View style={{flexDirection:'row',width:width-40,height:60,alignItems:'center',marginLeft:20,justifyContent:'space-between',marginTop:20}}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:16,opacity:0.8}}>我的订单</Text>
                        </View>
                        <Image style={{width:10,height:20}} source={require('../../assert/img/editicon.png')}></Image>
                    </View>
                </TouchableOpacity>
                <View style={{height:1,width:width-40,marginLeft:20,backgroundColor:'#000',opacity:0.1}}></View>
                <TouchableOpacity onPress={()=>{navToRoute('Income')}}>
                    <View style={{flexDirection:'row',width:width-40,height:60,alignItems:'center',marginLeft:20,justifyContent:'space-between'}}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:16,opacity:0.8}}>我的收入</Text>
                        </View>
                        <Image style={{width:10,height:20}} source={require('../../assert/img/editicon.png')}></Image>
                    </View>
                </TouchableOpacity>
                <View style={{height:1,width:width-40,marginLeft:20,backgroundColor:'#000',opacity:0.1}}></View>
                <TouchableOpacity onPress={()=>{navToRoute("MyMessage")}}>
                    <View style={{flexDirection:'row',width:width-40,height:60,alignItems:'center',marginLeft:20,justifyContent:'space-between'}}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:16,opacity:0.8}}>我的消息</Text>
                        </View>
                        <Image style={{width:10,height:20}} source={require('../../assert/img/editicon.png')}></Image>
                    </View>
                </TouchableOpacity>
                <View style={{height:1,width:width-40,marginLeft:20,backgroundColor:'#000',opacity:0.1}}></View>
                <TouchableOpacity onPress={()=>{navToRoute("MyStared")}}>
                    <View style={{flexDirection:'row',width:width-40,height:60,alignItems:'center',marginLeft:20,justifyContent:'space-between'}}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:16,opacity:0.8}}>我赞过的</Text>
                        </View>
                        <Image style={{width:10,height:20}} source={require('../../assert/img/editicon.png')}></Image>
                    </View>
                </TouchableOpacity>
                <View style={{height:1,width:width-40,marginLeft:20,backgroundColor:'#000',opacity:0.1}}></View>

                {/*<ScrollableTabView*/}
                    {/*style={{marginTop:20}}*/}
                    {/*locked={false}*/}
                    {/*tabBarActiveTextColor="#71D9D1"*/}
                    {/*tabBarUnderlineStyle={{backgroundColor:"#71d9d1",width:40}}*/}
                    {/*initialPage={0}*/}
                    {/*renderTabBar={()=><DefaultTabBar/>}*/}
                {/*>*/}
                    {/*<View tabLabel='已发布' style={{backgroundColor:'#fff',height:height,width:width}}>*/}
                        {/*<Text style={{marginTop:20}}>赞</Text>*/}
                    {/*</View>*/}
                    {/*<View tabLabel='待审核' style={{flex:1,backgroundColor:'#fff'}}>*/}
                        {/*<Text>消息</Text>*/}
                    {/*</View>*/}
                {/*</ScrollableTabView>*/}
            </View>
        )
    }

}