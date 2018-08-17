import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage} from 'react-native'

import {isIphoneX} from "../../common/common";
import {navBack, navToRoute} from "../../nav";

const {width, height} = Dimensions.get('window');

export class FailPay extends Component{


    componentDidMount(){

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

    render(){
        // let balance=1111
        return(
            <View style={{width:width,height:height,backgroundColor:'#fff'}}>
                <View style={{flexDirection:'row',width:width-40,marginLeft:20,alignItems:'center',justifyContent:'flex-end',height:80,marginTop:(isIphoneX)?20:0}}>
                </View>
                <View style={{alignItems:'center',marginTop:height/6,width:width}}>
                    <Image style={{width:width/3.5,height:width/3.5}} source={require('../../assert/img/failpay.png')}></Image>
                    <Text style={{fontSize:20,opacity:0.8,marginTop:30}}>支付失败</Text>
                    <View style={{width:width-40,flexDirection:'row',justifyContent:'space-around',marginTop:height/6}}>
                        <TouchableOpacity style={{padding:10,paddingLeft:35,paddingRight:35,borderColor:'#71d9d1',borderWidth:1,borderRadius:17}}
                                          onPress={()=>{navBack()}}>
                            <Text style={{color:'#71d9d1'}}>返回购物车</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{padding:10,paddingLeft:35,paddingRight:35,borderColor:'#71d9d1',borderWidth:1,borderRadius:17,backgroundColor:'#71d9d1'}}
                                          onPress={()=>{navToRoute("Deposit")}}>
                            <Text style={{color:'white'}}>前往充值</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}