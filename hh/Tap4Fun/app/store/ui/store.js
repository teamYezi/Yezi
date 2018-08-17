import React,{Component} from 'react'
import {FlatList, Text, View, Dimensions, Image, TouchableOpacity, ScrollView, AsyncStorage} from 'react-native'
import Swiper from 'react-native-swiper'
import {storeSaga} from "../saga";
import {getState} from "../../store";
import {navToRoute} from "../../nav";
import {isIphoneX} from "../../common/common";

const {width, height} = Dimensions.get('window');

export class Store extends Component{
    constructor(){
        super();
        this.state={
            data:null,
        }
    }

    componentDidMount(){
        const succ=()=>{
            // showToast("获取信息成功")
            const success=()=>{
                console.log("success")
            }
            const state=getState();
            let data=JSON.parse(state.store.store.data);
            // let {[getmainpageSaga.name]:getinfo}=this.props;
            console.log("store===>",data);
            this.setState({data:data},success)
        }
        storeSaga.getstore(succ)
    }

    //跳转到作品详情，先判断是否登录，若没有跳转登录页面
    navToDetail(imgID){
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(result[0][1]!=null){
                navToRoute('ImageDetail',{id:imgID,phone:result[0][1]})
            }else {
                navToRoute('LoginScreen')
            }
        })
    }

    navToMainStore(name){
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(result[0][1]!=null){
                navToRoute('MainStore',{id:name})
            }else {
                navToRoute('LoginScreen')
            }
        })
    }

    _StoreItem=((Data,i)=>{
        item=Data[i]
        let {name}=item
        let {url1}=item
        let {url2}=item
        let {url3}=item
        let {id1}=item
        let {id2}=item
        let {id3}=item
        return   <View>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:20}}>
                        <TouchableOpacity onPress={()=>{this.navToMainStore(name)}}>
                            <Text style={{marginLeft:20,fontSize:18}}>{name}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row',marginTop:10,width:width-40,marginLeft:20}}>
                        <TouchableOpacity onPress={()=>{this.navToDetail(id1)}}>
                            <Image source={{url:url1}} style={{width:width/3-20,height:width/3-20,borderRadius:5}}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.navToDetail(id2)}}>
                            <Image source={{url:url2}} style={{width:width/3-20,height:width/3-20,borderRadius:5,marginLeft:10}}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.navToDetail(id3)}}>
                            <Image source={{url:url3}} style={{width:width/3-20,height:width/3-20,borderRadius:5,marginLeft:10}}/>
                        </TouchableOpacity>
                    </View>
                 </View>
    })

    render(){


        let StoreData=[];
        if(this.state.data!=null){
            for(let i=1;i<11;i++){
                StoreData.push({i:i,name:this.state.data[i].name,url1:this.state.data[i].value[0].imgURL,url2:this.state.data[i].value[1].imgURL,url3:this.state.data[i].value[2].imgURL,id1:this.state.data[i].value[0].id,id2:this.state.data[i].value[1].id,id3:this.state.data[i].value[2].id})
            }
        }

        console.log('storedata===>',StoreData,this.state.data)

        return(
            <View style={{width:width,height:height-180,backgroundColor:"#fff"}}>
                <ScrollView style={{marginBottom:(isIphoneX)?80:10}}>
                <Swiper
                    style={{marginTop:10,marginLeft:20}}
                    horizontal={true}
                    index={0}
                    height={200}
                    width={width}
                    autoplay={true}
                    showsPagination={true}
                    autoplayTimeout={3}
                    paginationStyle={{marginTop: -1400}}
                    activeDot={<View style={{backgroundColor: '#71d9d1', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
                >
                    <Image source={(!this.state.data)?require('../../assert/img/showimg.jpg'):{url:this.state.data[0].ads[0]}} style={{width:width-40,height:width/2-20,borderRadius:10}}/>
                    <Image source={(!this.state.data)?require('../../assert/img/showimg.jpg'):{url:this.state.data[0].ads[1]}} style={{width:width-40,height:width/2-20,borderRadius:10}}/>
                    <Image source={(!this.state.data)?require('../../assert/img/showimg.jpg'):{url:this.state.data[0].ads[2]}} style={{width:width-40,height:width/2-20,borderRadius:10}}/>
                </Swiper>
                    {(this.state.data!=null)? this._StoreItem(StoreData,0):null}
                    {(this.state.data!=null)? this._StoreItem(StoreData,1):null}
                    {(this.state.data!=null)? this._StoreItem(StoreData,2):null}
                    {(this.state.data!=null)? this._StoreItem(StoreData,3):null}
                    {(this.state.data!=null)? this._StoreItem(StoreData,4):null}
                    {(this.state.data!=null)? this._StoreItem(StoreData,5):null}
                    {(this.state.data!=null)? this._StoreItem(StoreData,6):null}
                    {(this.state.data!=null)? this._StoreItem(StoreData,7):null}
                    {(this.state.data!=null)? this._StoreItem(StoreData,8):null}
                    {(this.state.data!=null)? this._StoreItem(StoreData,9):null}
                </ScrollView>
            </View>
        )
    }
}