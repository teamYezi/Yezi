import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage} from 'react-native'

import {isIphoneX} from "../../common/common";
import {navBack, navToRoute} from "../../nav";
import {balanceSaga, mineSaga} from "../saga";
import {MoneyDetail} from "./moneydetail";

const {width, height} = Dimensions.get('window');

export class Wallet extends Component{


    componentDidMount(){

        //获取phoenNum
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(errs){
                return
            }else if(result[0][1]!=null&&result[1][1]!=null){
                const succ=()=>{
                    balanceSaga.getbalance(this.state.phone)
                }
                this.setState({phone:result[0][1]},succ)
            }

        })

    }

    render(){
        console.log("aaaaa",JSON.parse(this.props.balance.data))
        let balance=JSON.parse(this.props.balance.data)
        if(balance!=null){
            balance=balance.balance;
        }
        // let balance=1111
        return(
            <View style={{width:width,height:height,backgroundColor:'#fff'}}>
                <View style={{flexDirection:'row',width:width-40,marginLeft:20,alignItems:'center',justifyContent:'space-between',height:80,marginTop:(isIphoneX)?20:0}}>
                        <TouchableOpacity onPress={()=>{navBack()}}>
                            <Image source={require('../../assert/img/backicon.png')} style={{width:10.5,height:19}}></Image>
                        </TouchableOpacity>
                    <Text style={{fontSize:18,fontWeight:"bold",marginTop:10}}>我的钱包</Text>
                    <TouchableOpacity onPress={()=>{navToRoute("MoneyDetail")}}>
                        <Text style={{fontSize:14,marginTop:10}}>明细</Text>
                    </TouchableOpacity>
                </View>
                <View style={{alignItems:'center',marginTop:height/6,width:width}}>
                    <View style={{borderWidth:5,borderColor:"#71d9d1",padding:10,borderRadius:46}}>
                        <Text style={{fontSize:60,color:'#71d9d1',fontWeight:'bold'}}>￥</Text>
                    </View>
                    <Text style={{fontSize:12,marginTop:20,opacity:0.8}}>账户余额</Text>
                    <Text style={{fontSize:22,marginTop:20}}>￥{balance}</Text>
                    <View style={{width:width-40,flexDirection:'row',justifyContent:'space-around',marginTop:height/6}}>
                        <TouchableOpacity onPress={()=>{navToRoute("Withdraw")}} style={{padding:10,paddingLeft:35,paddingRight:35,borderColor:'#71d9d1',borderWidth:1,borderRadius:17}}>
                            <Text style={{color:'#71d9d1'}}>提现</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{navToRoute("Deposit")}} style={{padding:10,paddingLeft:35,paddingRight:35,borderColor:'#71d9d1',borderWidth:1,borderRadius:17,backgroundColor:'#71d9d1'}}>
                            <Text style={{color:'white'}}>充值</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}