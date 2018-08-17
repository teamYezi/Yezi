import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage,CameraRoll} from 'react-native'

import {isIphoneX} from "../../common/common";
import {navBack, navToRoute} from "../../nav";
import {showToast} from "../../common/util";

const {width, height} = Dimensions.get('window');

export class SuccPay extends Component{


    componentDidMount(){
        console.log("succpay",this.props)
        //获取phoenNum
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(errs){
                return
            }else if(result[0][1]!=null&&result[1][1]!=null){

                this.setState({phone:result[0][1]})
            }

        })

    }

    DownLoad(){
        let url=this.props.navigation.state.params.url;
        for(let i=0;i<url.length;i++){
            CameraRoll.saveToCameraRoll(url[i]).then(function(result) {

            }).catch(function(error) {

            });;
        }
        showToast("保存成功")
    }

    render(){
        // let balance=1111
        return(
            <View style={{width:width,height:height,backgroundColor:'#fff'}}>
                <View style={{flexDirection:'row',width:width-40,alignItems:'center',justifyContent:'flex-end',height:80,marginTop:(isIphoneX)?20:0}}>
                    <TouchableOpacity onPress={()=>{this.props.navigation.popToTop()}} style={{marginLeft:20,height:80,justifyContent:'flex-end'}}>
                        <Image style={{width:15,height:15}} source={require('../../assert/img/cancel.png')}></Image>
                    </TouchableOpacity>
                </View>
                <View style={{alignItems:'center',marginTop:height/6,width:width}}>
                    <Image style={{width:width/3.5,height:width/3.5}} source={require('../../assert/img/succpay.png')}></Image>
                    <Text style={{fontSize:20,opacity:0.8,marginTop:30}}>支付成功</Text>
                    <View style={{width:width-40,flexDirection:'row',justifyContent:'space-around',marginTop:height/6}}>
                        <TouchableOpacity style={{padding:10,paddingLeft:35,paddingRight:35,borderColor:'#71d9d1',borderWidth:1,borderRadius:17}}
                                          onPress={()=>{navToRoute("MyOrder",{id:2})}}>
                            <Text style={{color:'#71d9d1'}}>查看订单</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{padding:10,paddingLeft:35,paddingRight:35,borderColor:'#71d9d1',borderWidth:1,borderRadius:17,backgroundColor:'#71d9d1'}}
                                          onPress={()=>{this.DownLoad()}}>
                            <Text style={{color:'white'}}>一键下载</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}