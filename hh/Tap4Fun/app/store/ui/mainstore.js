import React,{Component} from "react"
import {View,Image,Text,TextInput,TouchableOpacity,Dimensions,FlatList,AsyncStorage} from 'react-native'
import ScrollableTabView,{ScrollableTabBar} from 'react-native-scrollable-tab-view'

const {width, height} = Dimensions.get('window');

import {isIphoneX} from "../../common/common";
import {navBack, navToRoute} from "../../nav";
import {StoreList} from "./storelist";
import {catesearchSaga} from "../saga";

export class MainStore extends Component{
    constructor(){
        super();
        this.state={
            input:null,
            currTag:null,
            data:null
        }
    }

    componentDidMount(){

    }

    getID(tag){
        switch (tag){
            case '单色':return 0
            case '文艺':return 1
            case '瞬间':return 2
            case '旅拍':return 3
            case '色感':return 4
            case '元气':return 5
            case '冷淡':return 6
            case '清新':return 7
            case '空气':return 8
            case '远方':return 9
        }
    }

    onSearch(){
        let tags=['danse','wenyi','shunjian','lvpai','segan','yuanqi','lengdan','qingxin','kongqi','yuanfang'];
        let cate=null
        const cb=()=>{
            console.log("sb product",JSON.parse(this.props.catesearch.data))
            this.setState({data:JSON.parse(this.props.catesearch.data)})
        }
        if(this.state.currTag==null){
            cate=tags[this.getID(this.props.navigation.state.params.id)];
        }else {
            cate=tags[this.state.currTag]
        }
        catesearchSaga.search(cate,this.state.input,cb)
    }

    render(){
        let id=this.props.navigation.state.params.id;
        console.log('aaaa',id)
        id=this.getID(id)
        return(
            <View style={{backgroundColor:'#fff',width:width,height:height}}>
                <View style={{alignItems:'center'}}>
                    <View style={{position:'absolute',left:0,top:(isIphoneX)?50:20}}>
                        <TouchableOpacity onPress={()=>{navBack()}} style={{marginTop:20,marginLeft:20}}>
                            <Image source={require('../../assert/img/backicon.png')} style={{width:10.5,height:20}}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{position:'absolute',right:0,top:(isIphoneX)?50:20}}>
                        <TouchableOpacity onPress={()=>{navToRoute('ShoppingCart')}} style={{marginTop:20,marginRight:20}}>
                            <Image source={require('../../assert/img/shopingcar.png')} style={{width:20,height:20}}></Image>
                        </TouchableOpacity>
                    </View>
                    <TextInput style={{paddingLeft:10,width:width-140,height:30,backgroundColor:"#f5f5f5",borderRadius:10,marginTop:(isIphoneX)?66:36}}
                               onChangeText={(input) => this.setState({input})}
                               returnKeyType="done"
                               ref={(ref) => this._inputtext = ref}
                               onSubmitEditing={()=>{this.onSearch()}}></TextInput>
                </View>
                <ScrollableTabView
                    initialPage={id}
                    tabBarActiveTextColor="#71D9D1"
                    tabBarTextStyle={{fontSize:19, fontWeight:"300"}}
                    tabBarUnderlineStyle={{backgroundColor:"#fff"}}
                    onChangeTab={(obj) => {
                        this._inputtext.clear()
                        this.setState({currTag:obj.i,data:null})
                    }}
                    renderTabBar={() => <ScrollableTabBar />}
                >
                    <View tabLabel='单色' style={{height:height,width:width}}><StoreList cate='danse' searchdata={this.state.data}/></View>
                    <View tabLabel='文艺' style={{height:height,width:width}}><StoreList cate='wenyi' searchdata={this.state.data}/></View>
                    <View tabLabel='瞬间' style={{height:height,width:width}}><StoreList cate='shunjian' searchdata={this.state.data}/></View>
                    <View tabLabel='旅拍' style={{height:height,width:width}}><StoreList cate='lvpai' searchdata={this.state.data}/></View>
                    <View tabLabel='色感' style={{height:height,width:width}}><StoreList cate='segan' searchdata={this.state.data}/></View>
                    <View tabLabel='元气' style={{height:height,width:width}}><StoreList cate='yuanqi' searchdata={this.state.data}/></View>
                    <View tabLabel='冷淡' style={{height:height,width:width}}><StoreList cate='lengdan' searchdata={this.state.data}/></View>
                    <View tabLabel='清新' style={{height:height,width:width}}><StoreList cate='qingxin' searchdata={this.state.data}/></View>
                    <View tabLabel='空气' style={{height:height,width:width}}><StoreList cate='kongqi' searchdata={this.state.data}/></View>
                    <View tabLabel='远方' style={{height:height,width:width}}><StoreList cate='yuanfang' searchdata={this.state.data}/></View>
                </ScrollableTabView>
            </View>
        )
    }

}