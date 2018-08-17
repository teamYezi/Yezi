import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage,FlatList,RefreshControl} from 'react-native'
import {navBack, navToRoute} from "../../nav";
import {isIphoneX, showTime} from "../../common/common";
import {incomeSaga, messagelikeSage, payedSaga} from "../saga";

const {width, height} = Dimensions.get('window');

export class Income extends Component{
    constructor() {
        super();
        this.state = {
            phone: null,
            refreshing:false,
        }
    }

    componentDidMount(){
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(errs){
                return
            }else if(result[0][1]!=null&&result[1][1]!=null){
                incomeSaga.income(result[0][1])
                this.setState({phone:result[0][1]})
            }

        })

    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        const succ=()=>{
            this.setState({refreshing:false})
        }
        incomeSaga.income(this.state.phone,succ)
    };

    _separator = (() => {
        return <View style={{
            width: width - 50,
            marginLeft: 5,
            height: 1,
            backgroundColor: '#000',
            opacity: 0.1,
            marginTop: 16
        }}></View>
    })

    _Item = (item) => {
        item = item.item;
        let {i,buyer_avatar,buyer_name,deal_time,img_name,img_id,img_url,order_number,price}=item
        // let {i, cmt_time, img_description, comment, img_url, user_avatar, user_name, user_id, img_id} = item;
        return <View style={{width:width-40,marginLeft:20}}>
            <View style={{flexDirection: 'row', marginTop: 20}}>
                <Image style={{width: 40, height: 40, borderRadius: 20}}
                       source={(buyer_avatar==null)?require('../../assert/img/avatar.png'):{url:buyer_avatar}}></Image>
                <View style={{justifyContent: 'center', marginTop: 3}}>
                    <View style={{flexDirection: 'row', marginLeft: 10, alignItems: 'center'}}>
                        <Text style={{fontSize: 14, opacity: 0.8}}>{buyer_name}</Text>
                        <Text style={{marginLeft:5,fontSize:12,color:'#797979'}}>买入你的作品</Text>
                    </View>
                    <Text style={{
                        color: "#797979",
                        fontSize: 12,
                        marginLeft: 10,
                        marginTop: 3
                    }}>{showTime(deal_time)}</Text>
                </View>
            </View>
            <View style={{width: width - 50, marginLeft: 5, marginTop: 15}}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 0,justifyContent:'space-between'}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
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
                        <View style={{height:90,justifyContent:'flex-start'}}>
                            <Text style={{marginLeft: 8, fontSize: 15, opacity: 0.8}}>{img_name}</Text>
                            <Text style={{marginLeft: 8, fontSize: 12, opacity: 0.55,marginTop:5}}>作品ID:{img_id}</Text>
                            <Text style={{marginLeft: 8, fontSize: 12, opacity: 0.55,marginTop:1}}>订单号:{order_number}</Text>
                        </View>
                    </View>
                    <View style={{height:90,justifyContent:'flex-start'}}>
                        <Text style={{fontSize:15,fontWeight:'bold',opacity:0.8,textAlign:"right"}}>￥{price}</Text>
                    </View>
                </View>
            </View>
        </View>
    }

    render(){
        let data=JSON.parse(this.props.mine.income.data);
        console.log("income",data)
        let Data=[];
        if(data!=null){
            for(let i=0;i<data.length;i++){
                Data.push({i:i,buyer_avatar:data[i].buyer_avatar,buyer_name:data[i].buyer_name,deal_time:data[i].deal_time,img_id:data[i].img_id,img_name:data[i].img_name,img_url:data[i].img_url,order_number:data[i].order_number,price:data[i].price})
            }
        }

        return(
            <View style={{width:width,height:height,backgroundColor:"#fff"}}>
                <View style={{flexDirection:'row',width:width,alignItems:'center',justifyContent:'space-between',height:80,marginTop:(isIphoneX)?20:0}}>
                    <TouchableOpacity onPress={()=>{navBack()}} style={{marginLeft:20,marginRight:20,height:50,height:80,justifyContent:'center'}}>
                        <Image source={require('../../assert/img/backicon.png')} style={{width:10.5,height:19}}></Image>
                    </TouchableOpacity>
                    <Text style={{fontSize:18,fontWeight:"bold",marginTop:10}}>我的收入</Text>
                    <TouchableOpacity onPress={()=>{navToRoute("Wallet")}} style={{marginRight:20,marginLeft:20,height:80,justifyContent:'center'}}>
                        <Image style={{width:20,height:15,marginTop:10}} source={require('../../assert/img/wallet.png')}></Image>
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={{width: width,marginTop:-10}}
                    renderItem={this._Item}
                    ItemSeparatorComponent={this._separator}
                    data={Data}
                    refreshControl={
                        <RefreshControl
                            tintColor="#71d9d1"
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                >

                </FlatList>
            </View>
        )
    }
}