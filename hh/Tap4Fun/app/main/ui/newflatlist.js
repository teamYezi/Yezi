import React,{Component} from 'react'
import {FlatList, Text, View, Dimensions, Image, TouchableOpacity, AsyncStorage, PixelRatio,RefreshControl} from 'react-native'

import DoubleTap from 'react-native-hardskilled-double-tap';
import {getinfoSaga, loginSaga} from "../../login/saga";
import {getmainpageSaga, starSage} from "../saga";
import {showToast} from "../../common/util";
import {getState} from "../../store";
import {showTime} from "../../common/common";
import {navToRoute} from "../../nav";

const {width, height} = Dimensions.get('window');

export class NewFlatlist extends Component{
    constructor(){
        super();
        this.state={
            singleclick:false,
            doubleclick:false,
            refreshing:false,
            RCisStar:{},
            starNum:{},
            lastPress: 0,
            isLogin:null,
            phone:"NuLl",
            currpage:1,
            totalpage:1,
            loadmore:false,
            data:[]
        }
    }

    onPressHandler(id,likesNum,star,imgID) {
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(result[0][1]!=null){
                navToRoute('ImageDetail',{id:imgID,likesNum:likesNum,star2:star,phone:result[0][1],imgID:id,star:this.handleRCStar.bind(this)})
            }else {
                navToRoute('LoginScreen')

            }
        })
    }

    componentDidMount(){
        AsyncStorage.getItem('isLogin').then(value => {
            console.log("isLogin=>>>",value)
            const succ=()=>{
                if(this.state.isLogin!=null){
                    let keys=['phone','password'];
                    AsyncStorage.multiGet(keys,(errs,result)=>{
                        if(errs){
                            return
                        }else if(result[0][1]!=null&&result[1][1]!=null){
                            const succ=()=>{
                                const state=getState();
                                console.log("getinfo===>",JSON.parse(state.mainpage.getinfo.data));
                                let data=JSON.parse(state.mainpage.getinfo.data)
                                this.setState({data:data.data})
                            }
                            getmainpageSaga.getinfo(result[0][1],1,succ)
                            this.setState({phone:result[0][1]})
                        }

                    })
                }
            }
            if(value!=null){
                this.setState({isLogin:value},succ)
            }else {
                console.log("aaaa")
                getmainpageSaga.getinfo('NuLl',1)
            }
        })


    }

    //控制推荐页star

    handleRCStar(id,num,star,imgID){
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(result[0][1]!=null){
                const {RCisStar,starNum}=this.state;
                starSage.star(imgID,this.state.phone)
                if(RCisStar[id]){
                    this.setState({
                        RCisStar:{...RCisStar,[id]:false}
                    })
                }else {
                    this.setState({
                        RCisStar:{...RCisStar,[id]:true},
                        starNum:{...starNum,[id]:num-star},
                    })
                }
            }else {
                navToRoute('LoginScreen')

            }
        })
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        const succ=()=>{
            const state=getState();
            console.log("getinfo===>",JSON.parse(state.mainpage.getinfo.data));
            let data=JSON.parse(state.mainpage.getinfo.data)
            this.setState({refreshing:false,currpage:1,data:data.data})
        }
        getmainpageSaga.getinfo(this.state.phone,1,succ)
    };

    _onLoadMore=()=>{
        console.log("this.state",this.state)
        if(!this.state.loadmore){
            const success=()=>{
                const state=getState();
                let data=JSON.parse(state.mainpage.getinfo.data)
                let page=data.page_num;
                console.log("endreach start",page)

                if(this.state.currpage<page){
                    let currpage=this.state.currpage+1;
                    let Data=this.state.data;
                    const succ=()=>{
                        const state=getState();
                        let data=JSON.parse(state.mainpage.getinfo.data);
                        Data=Data.concat(data.data)
                        console.log("789",Data,data.data)
                        this.setState({currpage:currpage,loadmore:false,data:Data})
                    }
                    getmainpageSaga.getinfo(this.state.phone,currpage,succ)
                }
            }
            this.setState({loadmore:true},success)
        }
    }


    isRCisStar(id){
        const {RCisStar}=this.state
        return RCisStar[id]
    }


    _NewItem=((item)=>{
        // console.log("item===>",item)
        item=item.item;
        let {imgID}=item
        let {Author}=item
        let {avatar}=item
        let {description}=item
        let {id}=item
        let {time}=item
        let {star}=item
        let {likesNum}=item
        let {src}=item
        let {target_id}=item
        let isStar=this.isRCisStar(id)
        return  <View>
                    <View onAccessibilityTap={()=>{showToast("双击666")}} accessible={true}>
                {/*<Image style={{width:20,height:20,position:'relative',top:40}} source={require('../../assert/img/isstar.png')}></Image>*/}
                        <TouchableOpacity
                            onPress={() => this.onPressHandler(id,likesNum,star,imgID)} // Handler after double tap on button
                            activeOpacity={1}
                        >
                            <Image style={{width:width-80/PixelRatio.get(),height:width/1.6-40/1.6,marginTop:15,marginBottom:10,borderRadius:10,marginLeft:40/PixelRatio.get()}} source={{url:src}}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:width,alignItems:'center'}}>
                        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                            <TouchableOpacity onPress={()=>{navToRoute("UserMainPage",{id:target_id})}} style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <Image style={{width:22,height:22,borderRadius:11}} source={(avatar==null)?require('../../assert/img/avatar.png'):{url:avatar}}></Image>
                                {/*<Image style={{width:44/PixelRatio.get(),height:44/PixelRatio.get(),borderRadius:22/PixelRatio.get()}} source={(avatar==null)?require('../../assert/img/avatar.png'):{url:avatar}}></Image>*/}

                            <Text style={{marginLeft:5,fontSize:width*0.04, opacity:0.8}}>{Author}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{width:width-280/PixelRatio.get(),marginTop:100/PixelRatio.get()}}>
                            <Text style={{opacity:0.8, lineHeight:20, fontSize:15}}>{description}</Text>
                        </View>
                        <View style={{marginTop:20,flexDirection:'row',justifyContent:'space-between',width:width-40,marginBottom:10}}>
                            <Text style={{fontSize:12,opacity:0.4}}>{showTime(time)}</Text>
                            <View style={{flexDirection:'row',}}>
                                <TouchableOpacity onPress={()=>{this.handleRCStar(id,likesNum,star,imgID)}} style={{flexDirection:'row'}}>
                                    {(!isStar)?
                                        <Image style={{width:14.5,height:13.5,marginRight:5}} source={(star==1)?require('../../assert/img/isstar.png'):require('../../assert/img/unstar.png')}></Image>
                                        :
                                        <Image style={{width:14.5,height:13.5,marginRight:5}} source={(star==1)?require('../../assert/img/unstar.png'):require('../../assert/img/isstar.png')}></Image>
                                    }

                                {(!isStar)?
                                    <Text style={{fontSize:12, opacity:0.4}}>{likesNum}</Text>:
                                    <Text style={{fontSize:12, opacity:0.4}}>{likesNum-star}</Text>
                                }
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </View>
    })
    _separator=(()=>{
        return <View style={{width:width-40,height:1,backgroundColor:'#000',opacity:0.1,marginBottom:20,marginLeft:20}}></View>
    })

    render(){
        let NewData=[];
        if(this.state.data!=null){
            data=this.state.data;
            for(let i=0;i<data.length;i++){
                NewData.push({id:i,avatar:data[i].avatar,Author:data[i].name,time:data[i].pubdate,src:data[i].imgURL,description:data[i].description,cmtNum:data[i].cmtNum,likesNum:data[i].likesNum,star:data[i].likedOrNot,imgID:data[i].imgID,target_id:data[i].phone})
            }
        }

        return(

            <FlatList
                ref={(newList)=>this._newList=newList}
                initialNumToRender={2}
                initialScrollIndex={0}
                onEndReachedThreshold={0.2}
                renderItem={this._NewItem}
                ItemSeparatorComponent={this._separator}
                data={NewData}
                onEndReached={this._onLoadMore}
                style={{marginTop:0}}
                refreshControl={
                    <RefreshControl
                        tintColor="#71d9d1"
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                }
            >
            </FlatList>

        )
    }

}
