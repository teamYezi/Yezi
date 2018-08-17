import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage} from 'react-native'
import ScrollableTabView,{DefaultTabBar} from 'react-native-scrollable-tab-view'

import {isIphoneX} from "../../common/common";
import {navBack} from "../../nav";
import {ZanList} from "./zanlist";
import {CommentList} from "./commentlist";
import {Notification} from "./msgnotifica";
import {AllOrder} from "./allorder";
import {Payed} from "./payed";
import {Unpayed} from "./unpayed";
import {balanceSaga, depositSaga} from "../saga";
import {showToast} from "../../common/util";

const {width, height} = Dimensions.get('window');

export class Deposit extends Component{
    constructor(){
        super();
        this.state={
            phone:null,
            id:0
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
    Deposit(){
        let data=[20,50,80,100,200,500]
        const succ=()=>{
            showToast("充值成功")
            balanceSaga.getbalance(this.state.phone)
        }
        depositSaga.deposit(this.state.phone,data[this.state.id],succ)
    }

    render(){
        let balance=JSON.parse(this.props.balance.data)
        if(balance!=null){
            balance=balance.balance;
        }
        let data=[20,50,80]
        let data2=[100,200,500]
        return(
            <View style={{width:width,height:height,backgroundColor:"white"}}>
                <View style={{flexDirection:'row',width:width-40,marginLeft:20,alignItems:'center',justifyContent:'center',height:80,marginTop:(isIphoneX)?20:0}}>
                    <View style={{position:'absolute',left:0,top:35}}>
                        <TouchableOpacity onPress={()=>{navBack()}}>
                            <Image source={require('../../assert/img/backicon.png')} style={{width:10.5,height:19}}></Image>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:18,fontWeight:"bold",marginTop:10}}>充值</Text>
                </View>
                <Text style={{fontSize:16, marginLeft:20, marginTop:40, opacity:0.8}}>账户余额</Text>
                <View style={{justifyContent:"center", marginTop:20,flexDirection:'row',alignItems:"center"}}>
                    <Text style={{fontSize:25, opacity:0.8}}>￥</Text>
                    <Text style={{fontSize:45, opacity:0.8}}>{balance}</Text>
                </View>
                <Text style={{fontSize:16, marginLeft:20, marginTop:100, opacity:0.8}}>充值金额</Text>
                <View style={{flexDirection:'row',width:width-40,marginLeft:20,justifyContent:"space-between",marginTop:20}}>
                    {data.map((item,index)=>{
                        return(this.state.id==index)?<TouchableOpacity style={{width:width/3-25,padding:10,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#71d9d1',borderRadius:20,backgroundColor:"#71d9d1"}}
                        onPress={()=>{this.chooseMoney(index)}}>
                            <Text style={{color:"white", fontSize:13, fontWeight:"bold"}}>{item}元</Text>
                        </TouchableOpacity>:<TouchableOpacity style={{width:width/3-25,padding:10,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#71d9d1',borderRadius:20}}
                                                              onPress={()=>{this.chooseMoney(index)}}>
                            <Text style={{color:"#71d9d1", fontSize:13, fontWeight:"bold"}}>{item}元</Text>
                        </TouchableOpacity>
                    })}
                </View>
                <View style={{flexDirection:'row',width:width-40,marginLeft:20,justifyContent:"space-between",marginTop:20}}>
                    {data2.map((item,index)=>{
                        return(this.state.id==index+3)?<TouchableOpacity style={{width:width/3-25,padding:10,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#71d9d1',borderRadius:20,backgroundColor:"#71d9d1"}}
                                                                       onPress={()=>{this.chooseMoney(index+3)}}>
                            <Text style={{color:"white", fontSize:13, fontWeight:"bold"}}>{item}元</Text>
                        </TouchableOpacity>:<TouchableOpacity style={{width:width/3-25,padding:10,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#71d9d1',borderRadius:20}}
                                                              onPress={()=>{this.chooseMoney(index+3)}}>
                            <Text style={{color:"#71d9d1", fontSize:13, fontWeight:"bold"}}>{item}元</Text>
                        </TouchableOpacity>
                    })}
                </View>

                <View style={{marginTop:(isIphoneX)?height/6:height/7, alignItems:"center"}}>
                    <TouchableOpacity style={{padding:10,paddingLeft:50,paddingRight:50,borderWidth:1, borderRadius:21.35, backgroundColor:"#71d9d1", borderColor:"#71d9d1"}}
                    onPress={()=>{this.Deposit()}}>
                        <Text style={{fontSize:15, color:"white"}}>立即充值</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}