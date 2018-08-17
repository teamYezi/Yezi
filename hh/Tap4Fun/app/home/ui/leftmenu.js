import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, AsyncStorage, Dimensions,PixelRatio} from 'react-native'
import {navToRoute} from "../../nav";
import {getState} from "../../store";
import {mineSaga} from "../../mine/saga";
import {reset} from "../../store.js";
import {isIphoneX} from "../../common/common";
import {showToast} from "../../common/util";
const {width, height} = Dimensions.get('window');
export class SideBar extends Component{
    constructor(){
        super();
        this.state={
            phone:null
        }
    }


    componentDidMount(){
        console.log("222222",this.props)
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(errs){
                return
            }else if(result[0][1]!=null&&result[1][1]!=null){
                const succ=()=>{
                    console.log("aaaaa");
                    mineSaga.getmign(this.state.phone)
                }
                this.setState({phone:result[0][1]},succ)
            }

        })
    }

    logOut(){
        AsyncStorage.clear();
        reset
        this.props.close();
        showToast("退出成功")
    }

    render(){
        let data=JSON.parse(this.props.mine.data)||[];

        console.log("dataleftbar",data)

        return(
            <View style={{backgroundColor:'#fff',height:height}}>
                <Image source={(data.avatar==null)?require('../../assert/img/avatar.png'):{url:data.avatar}} style={{width:80,height:80,borderRadius:40,marginTop:(isIphoneX)?160:110,marginLeft:width*0.15}}></Image>
            <View style={{width:width*0.48,alignItems:'center'}}>
                <Text style={{marginTop:20,fontSize:18}}>
                    {data.name}
                </Text>
                <Text style={{marginTop:height*0.005,fontWeight:'100', opacity:0.75}}>
                    {data.signature}
                </Text>
            </View>
                <View style={{flexDirection:'row',marginTop:(isIphoneX)?height/25:height/20,alignItems:'center'}}>
                    <Image style={{width:width*0.07,height:width*0.07,marginLeft:50}} source={require('../../assert/img/side_edit.png')} resizeMode='stretch'></Image>
                    <TouchableOpacity onPress={()=>{navToRoute('PersonInfoScreen')}} style={{marginLeft:5}}><Text style={{fontSize:width*0.04, opacity: 0.8}}>编辑资料</Text></TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',marginTop:height/30,alignItems:'center'}}>
                    <Image style={{width:width*0.07,height:width*0.07,marginLeft:50}} source={require('../../assert/img/side_store.png')} resizeMode='stretch'></Image>
                    <TouchableOpacity style={{marginLeft:5}}><Text style={{fontSize:width*0.04, opacity: 0.8}}>积分商城</Text></TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',marginTop:height/30,alignItems:'center'}}>
                    <Image style={{width:width*0.07,height:width*0.07,marginLeft:50}} source={require('../../assert/img/side_huiyuan.png')} resizeMode='stretch'></Image>
                    <TouchableOpacity style={{marginLeft:5}}><Text style={{fontSize:width*0.04, opacity: 0.8}}>会员中心</Text></TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',marginTop:height/30,alignItems:'center'}}>
                    <Image style={{width:width*0.07,height:width*0.07,marginLeft:50}} source={require('../../assert/img/side_aboutus.png')} resizeMode='stretch'></Image>
                    <TouchableOpacity style={{marginLeft:5}}
                    onPress={()=>{navToRoute("AboutUs")}}><Text style={{fontSize:width*0.04, opacity: 0.8}}>关于我们</Text></TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',marginTop:height/30,alignItems:'center'}}>
                    <Image style={{width:width*0.07,height:width*0.07,marginLeft:50}} source={require('../../assert/img/side_suggestion.png')} resizeMode='stretch'></Image>
                    <TouchableOpacity style={{marginLeft:5}}><Text style={{fontSize:width*0.04, opacity: 0.8}}>意见反馈</Text></TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',marginTop:height/30,alignItems:'center'}}>
                    <Image style={{width:width*0.07,height:width*0.07,marginLeft:50}} source={require('../../assert/img/side_setting.png')} resizeMode='stretch'></Image>
                    <TouchableOpacity style={{marginLeft:5}}><Text style={{fontSize:width*0.04, opacity: 0.8}}>设置</Text></TouchableOpacity>
                </View>


                <View style={{width:width*0.5,alignItems:'center', marginTop:(isIphoneX)?110:(PixelRatio.get()==2)?50:80}}>
                    <TouchableOpacity style={{marginLeft:0}}><Text style={{fontSize:14,opacity:0.5}}
                    onPress={()=>{this.logOut()}}>退出登录</Text></TouchableOpacity>
                </View>
            </View>
        )
    }
    //marginTop:(isIphoneX)?150:100,
//marginLeft:(isIphoneX)?-21:-10
}