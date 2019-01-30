import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage,FlatList,RefreshControl} from 'react-native'
import {fansSaga, followSaga, onfollowSaga, pendingSaga, publishedSaga} from "../saga";
import {isIphoneX} from "../../common/common";
import {navBack, navToRoute} from "../../nav";

const {width, height} = Dimensions.get('window');

export class Fans extends Component{
    constructor(){
        super();
        this.state={
            phone:null,
            followback:{},
            refreshing:false,
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
                    fansSaga.fans(this.state.phone)
                }
                this.setState({phone:result[0][1]},succ)
            }

        })
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        const succ=()=>{
            this.setState({refreshing:false})
        }
        fansSaga.fans(this.state.phone,succ)
    };

    //control follow and unfollow

    handlefollow(id,targetID){
        const {followback}=this.state;
        onfollowSaga.onfollow(this.state.phone,targetID);
        if(followback[id]){
            this.setState({
                followback:{...followback,[id]:false}
            })
        }else {
            this.setState({
                followback:{...followback,[id]:true},
            })
        }
    }

    _separator=(()=>{
        return <View style={{width:width-40,height:1,backgroundColor:'#000',opacity:0.1,marginLeft:20,marginTop:20}}></View>
    })

    _Item=((item)=>{
        item=item.item
        console.log(item)
        let i=item.i;
        let name=item.name;
        let avatar=item.avatar;
        let id=item.id;
        let follow_back=item.follow_back;
        let signature=item.signature;
        return <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:width-40,marginLeft:20,marginTop:20}}>
            <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>{navToRoute("UserMainPage",{id:id})}}>
                <Image style={{width:40,height:40,borderRadius:20}} source={(avatar==null)?require('../../assert/img/avatar.png'):{url:avatar}}></Image>
                <View style={{marginLeft:10}}>
                    <Text style={{fontSize:17,fontWeight:'bold',marginTop:0}}>{name}</Text>
                    <Text style={{fontSize:12,opacity:0.8,marginTop:5}}>{signature}</Text>
                </View>
            </TouchableOpacity>
            {(follow_back==1)?
                (this.state.followback[i])?
                    <TouchableOpacity onPress={()=>{this.handlefollow(i,id)}}>
                        <View style={{padding:5,paddingLeft:10,paddingRight:10,backgroundColor:'#71d9d1',borderRadius:20}}>
                            <Text style={{fontSize:15,color:'white'}}>+ 关注</Text>
                        </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={()=>{this.handlefollow(i,id)}}>
                        <View style={{padding:5,paddingLeft:10,paddingRight:10,borderWidth:1,borderColor:"#71d9d1",borderRadius:20}}>
                            <Text style={{fontSize:15,color:'#71d9d1'}}>已关注</Text>
                        </View>
                    </TouchableOpacity>

                :
                (this.state.followback[i])?
                    <TouchableOpacity onPress={()=>{this.handlefollow(i,id)}}>
                        <View style={{padding:5,paddingLeft:10,paddingRight:10,borderWidth:1,borderColor:"#71d9d1",borderRadius:20}}>
                            <Text style={{fontSize:15,color:'#71d9d1'}}>已关注</Text>
                        </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={()=>{this.handlefollow(i,id)}}>
                        <View style={{padding:5,paddingLeft:10,paddingRight:10,backgroundColor:'#71d9d1',borderRadius:20}}>
                            <Text style={{fontSize:15,color:'white'}}>+ 关注</Text>
                        </View>
                    </TouchableOpacity>

                }


        </View>



    })

    render(){
        let Data=[];
        let data=JSON.parse(this.props.fans.data)
        console.log("fans",data)
        if(data!=null){
            for(let i=0;i<data.length;i++){
                Data.push({i:i,avatar:data[i].avatar,id:data[i].id,name:data[i].name,signature:data[i].signature,follow_back:data[i].follow_back})
            }
        }


        return(
            <View style={{width:width,height:height,backgroundColor:'#ffffff'}}>
                <View style={{flexDirection:'row',width:width-40,marginLeft:20,alignItems:'center',justifyContent:'center',height:80,marginTop:(isIphoneX)?20:0}}>
                    <View style={{position:'absolute',left:-20,top:0}}>
                        <TouchableOpacity onPress={()=>{navBack()}} style={{marginTop:35,marginLeft:20,marginRight:20,marginBottom:20}}>
                            <Image source={require('../../assert/img/backicon.png')} style={{width:10.5,height:19}}></Image>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:18,fontWeight:"bold",marginTop:10}}>我的粉丝</Text>
                </View>
                <TextInput style={{marginLeft:20,width:width-40,height:30,backgroundColor:"#e7e7e7",borderRadius:10,marginTop:20}}></TextInput>
                <FlatList
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