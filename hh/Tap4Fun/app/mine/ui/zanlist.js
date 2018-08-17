import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage,FlatList,RefreshControl} from 'react-native'
import {getmainpageSaga} from "../../main/saga";
import {incomeSaga, messagelikeSage} from "../saga";
import {getState} from "../../store";
import moment from 'moment'
import {navToRoute} from "../../nav";
import {showTime} from "../../common/common";

const {width, height} = Dimensions.get('window');

export class ZanList extends Component{
    constructor(){
        super();
        this.state={
            phone:null,
            refreshing:false,
        }
    }

    componentDidMount(){
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(errs){
                return
            }else if(result[0][1]!=null&&result[1][1]!=null){
                messagelikeSage.like(result[0][1])
                this.setState({phone:result[0][1]})
            }

        })

    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        const succ=()=>{
            this.setState({refreshing:false})
        }
        messagelikeSage.like(this.state.phone,succ)
    };

    _separator=(()=>{
        return <View style={{width:width-50,marginLeft:5,height:1,backgroundColor:'#000',opacity:0.1,marginTop:4}}></View>
    })

    _Item=(item)=>{
        item=item.item;
        let {i,img_url,time,user_avatar,user_name,img_id}=item;
        return<View style={{flexDirection:'row',justifyContent:"space-between",alignItems:"center",marginTop:8}}>
            <View style={{flexDirection:'row'}}>
                <Image style={{width:40,height:40,borderRadius:20}} source={(user_avatar==null)?require('../../assert/img/avatar.png'):{url:user_avatar}}></Image>
                <View style={{justifyContent:'center',marginTop:3}}>
                     <View style={{flexDirection:'row',marginLeft:10,alignItems:'center'}}>
                         <Text style={{fontSize:14,opacity:0.8}}>{user_name}</Text>
                         <Text style={{marginLeft:5,fontSize:12,color:'#797979'}}>赞了你的作品</Text>
                     </View>
                    <Text style={{color:"#797979",fontSize:12,marginLeft:10,marginTop:3}}>{showTime(time)}</Text>
                </View>
            </View>
            <TouchableOpacity style={{shadowColor: "#cacaca",
                marginRight:4,
                shadowOffset: { width: 2,height:2},
                shadowOpacity: 0.5,
                shadowRadius:5,
            marginBottom:4}}
            onPress={()=>{
                navToRoute('ImageDetail',{id:img_id,phone:this.state.phone})
            }}
            >
                <Image style={{width:60,height:60,borderRadius:2}} source={{url:img_url}} ></Image>
            </TouchableOpacity>
        </View>
    }

    render(){
        const state=getState();
        let data=JSON.parse(state.mine.messagelike.data);
        let Data=[]
        if(data!=null){
            for(let i=0;i<data.length;i++){
                Data.push({i:i,img_url:data[i].img_url,time:data[i].time,user_avatar:data[i].user_avatar,user_name:data[i].user_name,img_id:data[i].img_id,user_id:data[i].user_id})
            }
        }
        return(
            <View>
                <FlatList
                    style={{width:width-40,marginLeft:20}}
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