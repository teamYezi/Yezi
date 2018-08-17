//别人的主页
import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage,FlatList} from 'react-native'

import ScrollableTabView,{DefaultTabBar} from 'react-native-scrollable-tab-view'
import {loginSaga} from "../../login/saga";
import {mineSaga, userpageSaga} from "../saga";
import {navBack, navToRoute} from "../../nav";
import {isIphoneX, showTime} from "../../common/common";
import {onfollowSaga} from "../../mine/saga";

const {width, height} = Dimensions.get('window');

export class UserMainPage extends Component{
    constructor(){
        super();
        this.state={
            phone:null,
            data:null,
        }
    }


    componentDidMount(){

        let target_id=this.props.navigation.state.params.id
        //获取phoneNum
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(errs){
                return
            }else if(result[0][1]!=null&&result[1][1]!=null){
                const succ=()=>{
                    const success=()=>{
                        this.setState({
                            data:JSON.parse(this.props.userpage.data)
                        })
                    }
                    userpageSaga.userpage(result[0][1],target_id,1,success)
                }
                this.setState({phone:result[0][1]},succ)
            }

        })

    }
    _Item=((item)=>{
        let i=item
        return  <View>
            <Image source={{url:i.item.imgURL}} style={{width:width/3-20,height:width/3-20,borderRadius:5,marginLeft:10,marginTop:20}}/>
        </View>
    })

    onFollow(){
        if(this.state.data.followed==-1){
            let data=this.state.data
            data.followed=1;
            data.fans+=1;
            this.setState({data:data})
        }else {
            let data=this.state.data
            data.followed=-1
            data.fans-=1
            this.setState({data:data})
        }
        const succ=()=>{
            userpageSaga.userpage(this.state.phone,this.props.navigation.state.params.id,1)
        }
        onfollowSaga.onfollow(this.state.phone,this.props.navigation.state.params.id,succ);
    }

    render(){
        console.log("this.state",this.state);
        let Data=[];
        let data={}
        if(this.state.data!=null){
            data=this.state.data
            for(let i=0;i<data.imagesInfo.length;i++){
                Data.push({i:i,id:data.imagesInfo[i].id,imgURL:data.imagesInfo[i].imgURL})
            }
        }
        return(
                <View style={{backgroundColor:'#ffffff',width:width,height:height}}>
                    <View style={{position:'absolute',left:0,top:(isIphoneX)?40:10}}>
                        <TouchableOpacity onPress={()=>{navBack()}} style={{marginLeft:20,marginTop:30}}>
                            <Image source={require('../../assert/img/backicon.png')} style={{width:10,height:20,marginRight:30}}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row',width:width-160,marginLeft:80,justifyContent:"space-between",alignItems:"center",marginTop:(isIphoneX)?110:70}}>
                        <TouchableOpacity onPress={()=>{navToRoute('Product')}}>
                            <View style={{alignItems:'center',justifyContent:'center'}}>
                                <Text style={{fontSize:18,fontWeight:'bold',opacity:0.8}}>{data.following}</Text>
                                <Text style={{fontSize:12,marginTop:5,opacity:0.8}}>关注</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{flexDirection:"row",marginTop:0,justifyContent:'center',alignItems:'center'}}>
                            <Image style={{width:80,height:80,borderRadius:40}} source={(data.avatar==null)?require('../../assert/img/avatar.png'):{url:data.avatar}}></Image>
                        </View>
                        <TouchableOpacity onPress={()=>{navToRoute('Product')}}>
                            <View style={{alignItems:'center',justifyContent:'center'}}>
                                <Text style={{fontSize:18,fontWeight:'bold',opacity:0.8}}>{data.fans}</Text>
                                <Text style={{fontSize:12,marginTop:5,opacity:0.8}}>粉丝</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{alignItems:'center',marginTop:10}}>
                        <Text style={{fontSize:16,opacity:0.8}}>{data.name}</Text>
                        <Text style={{fontSize:12,marginTop:10,opacity:0.55}}>{data.signature}</Text>
                    </View>
                    {(this.state.phone==this.props.navigation.state.params.id)?null
                        :
                        (data.followed==1)?
                            <View style={{width:width,alignItems:'center',marginTop:10}}>
                                <TouchableOpacity style={{padding:5,paddingLeft:10,paddingRight:10,borderWidth:1,borderColor:"#71d9d1",borderRadius:13.3,alignItems:'center'}}
                                onPress={()=>{this.onFollow()}}>
                                    <Text style={{textAlign:"center",fontSize:13,color:"#71d9d1"}}>已关注</Text>
                                </TouchableOpacity>
                            </View>:
                            <View style={{width:width,alignItems:'center',marginTop:10}}>
                                <TouchableOpacity style={{padding:5,paddingLeft:10,paddingRight:10,borderWidth:1,borderColor:"#71d9d1",borderRadius:13.3,alignItems:'center',backgroundColor:"#71d9d1"}}
                                onPress={()=>{this.onFollow()}}>
                                    <Text style={{textAlign:"center",fontSize:13,color:"white"}}>关注</Text>
                                </TouchableOpacity>
                            </View>
                    }
                    <FlatList
                        style={{width:width-30,marginLeft:10,marginTop:10,marginBottom:0}}
                        renderItem={this._Item}
                        numColumns={3}
                        data={Data}
                    >

                    </FlatList>

                </View>
        )
        // return(

        // )
    }

}