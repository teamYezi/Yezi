import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage,FlatList} from 'react-native'
import {isIphoneX} from "../../common/common";
import {navBack, navToRoute} from "../../nav";
import {searchSaga} from "../saga";
import {getState} from "../../store";
import {storeSaga} from "../../store/saga";
const {width, height} = Dimensions.get('window');

export class Search extends Component{
    constructor(){
        super()
        this.state={
            input:"",
            data:null,
            phone:null
        }

    }

    componentDidMount(){

        //获取phoenNum
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(errs){
                return
            }else if(result[0][1]!=null&&result[1][1]!=null){

                this.setState({phone:result[0][1]})
            }

        })

    }

    _UserItem=(item)=>{
        item=item.item;
        let {avatar,id,name,signature}=item
        return <View style={{flexDirection:"row",alignItems:"center",width:width/4,marginRight:20}}>
            <TouchableOpacity onPress={()=>{navToRoute("UserMainPage",{id:id})}} style={{flexDirection:'row'}}>
            <Image style={{width:40,height:40,borderRadius:20}} source={(avatar==null)?require('../../assert/img/avatar.png'):{url:avatar}}></Image>
            <View style={{marginLeft:5}}>
                <Text style={{opacity:0.8}}>{name}</Text>
                <Text style={{fontSize:10,opacity:0.55,marginTop:5}}>{signature}</Text>
            </View>
            </TouchableOpacity>
        </View>
    };

    _Item=(item)=>{
        item=item.item;
        let {imgURL,imgName,id,forsale}=item
        return<View style={{flexDirection:"row",alignItems:"center",width:width/2-40,marginRight:40,marginTop:20}}>
            <TouchableOpacity onPress={()=>{navToRoute('ImageDetail',{id:id,phone:this.state.phone})}}>
                <Image style={{width:50,height:50,borderRadius:5}} source={{url:imgURL}}></Image>
            </TouchableOpacity>
            <View style={{marginLeft:5}}>
                <Text style={{opacity:0.8}}>{imgName}</Text>
                <Text style={{fontSize:10,opacity:0.55,marginTop:10}}>作品ID:{id}</Text>
            </View>
        </View>
    }

    onSearch(){
        const cb=()=>{
            console.log("ui sb",this.props)
            this.setState({data:JSON.parse(this.props.search.data)})
        }
        searchSaga.search(this.state.input,cb)
    }

    render(){
        let AvatarData=[];
        let ProductData=[];
        let data=this.state.data
        console.log("123456",data)
        if(data!=null){
            for(let i=0;i<data.user.length;i++){
                AvatarData.push({i:i,avatar:data.user[i].avatar,id:data.user[i].id,name:data.user[i].name,signature:data.user[i].signature})
            }
            for(let i=0;i<data.images.length;i++){
                ProductData.push({i:i,imgURL:data.images[i].imgURL,imgName:data.images[i].imgName,id:data.images[i].id,forsale:data.images[i].forsale})
            }
        }

        return(
            <View style={{width:width, height:height, backgroundColor:"white"}}>
                <View style={{position:'absolute',top:(isIphoneX)?63:33,left:30,zIndex:10000,}}>
                    <Image style={{width:25, height:25, opacity:1}} source={require('../../assert/img/grey-search.png')}></Image>
                </View>
                <View style={{flexDirection:"row", width:width-20, marginLeft:20, justifyContent:"space-between", marginTop:(isIphoneX)?60:30, alignItems:'center'}}>
                    <TextInput style={{width:width*0.8, height:35, borderRadius:15, backgroundColor:"#f5f5f5", paddingLeft:30}}
                    placeholder="搜索用户名，作品ID"
                               onChangeText={(input) => this.setState({input})}
                               returnKeyType="done"
                               onSubmitEditing={()=>{this.onSearch()}}

                    >
                    </TextInput>
                    <TouchableOpacity onPress={()=>{navBack()}} style={{marginRight:20,width:width*0.2-40,alignItems:"flex-end"}}>
                        <Image style={{width:15, height:15, opacity:0.8}} source={require('../../assert/img/cancel.png')}></Image>
                    </TouchableOpacity>
                </View>

                <View style={{width:width-40, marginLeft: 20, marginTop:10,justifyContent:"center"}}>
                    <View style={{flexDirection:"row",marginTop:10}}>
                        <Text style={{opacity:0.8}}>用户</Text>
                        <Image source={require('../../assert/img/open.png')} style={{width:15,height:15}}></Image>
                    </View>
                    {(AvatarData.length==0)?<View style={{width:width-40,height:100,justifyContent:'center',alignItems:"center"}}>
                        <Text style={{opacity:0.6}}>没有搜到相关用户</Text>
                    </View>
                        : <FlatList
                        style={{height:80,marginTop:0}}
                        data={AvatarData}
                        renderItem={this._UserItem}
                        horizontal={true}
                        >
                        </FlatList>}

                    <View style={{flexDirection:"row",marginTop:10}}>
                        <Text style={{opacity:0.8}}>作品</Text>
                        <Image source={require('../../assert/img/open.png')} style={{width:15,height:15}}></Image>
                    </View>
                    {(ProductData.length==0)?<View style={{width:width-40,height:100,justifyContent:'center',alignItems:"center"}}>
                        <Text style={{opacity:0.6}}>没有搜到相关作品</Text>
                        </View>:
                        <FlatList
                        renderItem={this._Item}
                        style={{}}
                        numColumns={2}
                        data={ProductData}
                        >
                        </FlatList>}

                </View>
                <View style={{width:width-40, marginLeft: 20, marginTop:10, backgroundColor:'pink'}}>

                </View>

            </View>
        )
    }

}