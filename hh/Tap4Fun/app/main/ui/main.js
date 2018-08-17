import React,{Component} from "react"
import {View,Image,Text,TextInput,TouchableOpacity,Dimensions,FlatList,AsyncStorage} from 'react-native'
import ScrollableTabView,{DefaultTabBar} from 'react-native-scrollable-tab-view'

import {RcFlatlist} from "./rcflatlist";
import {NewFlatlist} from "./newflatlist";
// import {NewFlatlist_} from "../index";
import {getmainpageSaga} from "../saga";
import {showToast} from "../../common/util";
import {Store} from "../../store/ui/store";
import {isIphoneX} from "../../common/common";
import {navToRoute} from "../../nav";

const {width, height} = Dimensions.get('window');
export class Main extends Component{

    constructor(){
        super();
        this.state={
            isLogin:null
        }
    }

    componentDidMount(){
        AsyncStorage.getItem('isLogin').then(value => {
            console.log("isLogin=>>>",value)
            if(value!=null){
                this.setState({isLogin:1})
            }
        })
    }


    navToCart(){
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(result[0][1]!=null){
                navToRoute('ShoppingCart')
            }else {
                navToRoute('LoginScreen')

            }
        })
    }

    render(){
        return(
            <View>
                <View style={{flexDirection:'row',marginLeft:70}}>
                    <TouchableOpacity onPress={()=>{navToRoute("Search")}} style={{paddingLeft:10,width:width-140,height:35,backgroundColor:"#f5f5f5",borderRadius:30,marginTop:(isIphoneX)?63:33, justifyContent:"center"}}>
                        <Text style={{opacity:0.4, marginLeft:5}}>搜索用户名、作品ID</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.navToCart()}} style={{marginTop:20,marginLeft:20}}>
                        <Image source={require('../../assert/img/shopingcar.png')} style={{width:20,height:20,marginLeft:10,marginTop:(isIphoneX)?50:20}}></Image>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',justifyContent:"center"}}>
                    <ScrollableTabView
                        style={{marginTop:20}}
                        prerenderingSiblingsNumber={0}
                        containerWidth={100}
                        tabBarTextStyle={{fontSize:20, fontWeight:"300"}}
                        locked={false}
                        tabBarActiveTextColor="#71D9D1"
                        tabBarUnderlineStyle={{backgroundColor:"#fff",width:40}}
                        initialPage={0}
                        renderTabBar={()=><DefaultTabBar/>}
                    >
                        <View tabLabel='推荐' style={{backgroundColor:'#fff',marginBottom:(isIphoneX)?525:400.7}}>
                            <NewFlatlist/>
                        </View>
                        <View tabLabel='发现' style={{backgroundColor:'#ff0f43'}}>
                            <Store/>
                        </View>
                    </ScrollableTabView>
                </View>
            </View>
        )
    }
}