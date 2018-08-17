import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage,FlatList} from 'react-native'
import {navBack} from "../../nav";
import {isIphoneX, showTime} from "../../common/common";
import {balanceSaga, moneydetailSage} from "../saga";
import moment from 'moment'

const {width, height} = Dimensions.get('window');

export class MoneyDetail extends Component{

    componentDidMount(){

        //获取phoenNum
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(errs){
                return
            }else if(result[0][1]!=null&&result[1][1]!=null){
                const succ=()=>{
                    moneydetailSage.getdetai(this.state.phone)
                }
                this.setState({phone:result[0][1]},succ)
            }

        })

    }

    _separator=(()=>{
        return <View style={{width:width-40,height:1,backgroundColor:'#000',opacity:0.1,marginLeft:20,marginTop:20}}></View>
    })

    _Item=(item)=>{
        item=item.item;
        let {balance,time,transaction,cate}=item
        return<View style={{flexDirection:"row",justifyContent:'space-between',alignItems:'center',marginTop:20,width:width-40,marginLeft:20}}>
            <View>
                <Text style={{fontSize:17}}>{cate}</Text>
                <Text style={{opacity:0.8,marginTop:10}}>余额：{balance}</Text>
            </View>
            <View>
                <Text style={{opacity:0.8}}>{showTime(time)}</Text>
                <Text style={{fontSize:17,fontWeight:"bold",marginTop:10,textAlign:'right'}}>{transaction}</Text>
            </View>
        </View>
    }

    render(){
        let Data=[];

        console.log("detail",JSON.parse(this.props.moneydetail.data))
        // console.log("detail",this.props.moneydetail.data)
        let data=JSON.parse(this.props.moneydetail.data);
        if(data!=null){
            for(let i=0;i<data.length;i++){
                Data.push({i:i,balance:data[i].balance,time:data[i].time,transaction:data[i].transaction,cate:data[i].cate})
            }
        }
        return(
            <View style={{width:width,height:height,backgroundColor:"#fff"}}>
                <View style={{flexDirection:'row',width:width-40,marginLeft:20,alignItems:'center',justifyContent:'center',height:80,marginTop:(isIphoneX)?20:0}}>
                    <View style={{position:'absolute',left:0,top:35}}>
                        <TouchableOpacity onPress={()=>{navBack()}}>
                            <Image source={require('../../assert/img/backicon.png')} style={{width:10.5,height:19}}></Image>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:18,fontWeight:"bold",marginTop:10}}>收支明细</Text>
                </View>
                <FlatList
                    style={{width:width}}
                    renderItem={this._Item}
                    ItemSeparatorComponent={this._separator}
                    data={Data}
                >

                </FlatList>
            </View>
        )
    }
}