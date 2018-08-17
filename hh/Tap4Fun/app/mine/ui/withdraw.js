import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage,ScrollView} from 'react-native'
import ScrollableTabView,{DefaultTabBar} from 'react-native-scrollable-tab-view'

import {isIphoneX} from "../../common/common";
import {navBack} from "../../nav";
import {ZanList} from "./zanlist";
import {CommentList} from "./commentlist";
import {Notification} from "./msgnotifica";
import {AllOrder} from "./allorder";
import {Payed} from "./payed";
import {Unpayed} from "./unpayed";
import {balanceSaga, depositSaga, withdrawSaga} from "../saga";
import {showToast} from "../../common/util";

const {width, height} = Dimensions.get('window');

export class Withdraw extends Component{
    constructor(){
        super();
        this.state={
            phone:null,
            id:0,
            balance:0
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
                    balanceSaga.getbalance(this.state.phone)
                }
                this.setState({phone:result[0][1]},succ)
            }

        })
    }

    chooseMoney(index){
        this.setState({id:index})
    }
    WithDraw(){
        let balance=JSON.parse(this.props.balance.data)
        if(balance!=null){
            balance=balance.balance;
        }
        if(this.state.balance>balance){
            showToast("余额不足")
        }else {
            const succ=()=>{
                showToast("提现成功")
                balanceSaga.getbalance(this.state.phone)
            }
            withdrawSaga.withdraw(this.state.phone,this.state.balance,succ)
        }
    }

    render(){
        let balance=JSON.parse(this.props.balance.data)
        if(balance!=null){
            balance=balance.balance;
        }
        return(
            <ScrollView>
                <View style={{width:width,height:height,backgroundColor:"white"}}>
                <View style={{flexDirection:'row',width:width-40,marginLeft:20,alignItems:'center',justifyContent:'center',height:80,marginTop:(isIphoneX)?20:0}}>
                    <View style={{position:'absolute',left:0,top:35}}>
                        <TouchableOpacity onPress={()=>{navBack()}}>
                            <Image source={require('../../assert/img/backicon.png')} style={{width:10.5,height:19}}></Image>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:18,fontWeight:"bold",marginTop:10}}>提现</Text>
                </View>
                <View style={{marginLeft:20, marginTop:30,flexDirection:'row',alignItems:'center'}}>
                    <Text style={{fontSize:16,  opacity:0.8}}>提现账户</Text>
                    <Image style={{width:30, height:30, marginLeft:20}} source={require('../../assert/img/wechatpay.png')}></Image>
                    <Text style={{fontSize:16,  opacity:0.55, marginLeft:10}}>微信</Text>
                </View>
                <View style={{marginLeft:20, marginTop:50,flexDirection:'row',alignItems:'center'}}>
                    <Text style={{fontSize:16,  opacity:0.8}}>账户余额</Text>
                    <Text style={{fontSize:16,  opacity:0.8, marginLeft:20}}>￥ {balance}</Text>
                </View>
                <View style={{marginLeft:20, marginTop:50,width:width-40,flexDirection:'row',alignItems:'center',justifyContent:"space-between"}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{fontSize:16,  opacity:0.8}}>提现金额</Text>
                        <Text style={{fontSize:16,  opacity:0.8, marginLeft:20}}>￥ </Text>
                        <TextInput placeholder='请输入提现的金额' style={{width:width-250,marginLeft:0 ,fontSize:16,opacity:0.8}} maxLength={6} keyboardType="number-pad" value={this.state.balance}
                                   onChangeText={(balance) => this.setState({balance})}>
                        </TextInput>
                    </View>


                    <TouchableOpacity style={{fontSize:16,  opacity:0.8, marginLeft:20,color:"#71d9d1"}} onPress={()=>{this.setState({balance:balance})}}><Text>全部提现</Text></TouchableOpacity>
                </View>


                <View style={{marginTop:(isIphoneX)?height/2.5:height/3, alignItems:"center"}}>
                    <TouchableOpacity style={{padding:10,paddingLeft:50,paddingRight:50,borderWidth:1, borderRadius:21.35, backgroundColor:"#71d9d1", borderColor:"#71d9d1"}}
                                      onPress={()=>{this.WithDraw()}}>
                        <Text style={{fontSize:15, color:"white"}}>立即提现</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
        )
    }
}