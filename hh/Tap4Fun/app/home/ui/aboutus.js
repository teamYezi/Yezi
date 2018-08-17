import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage,ScrollView} from 'react-native'
import ScrollableTabView,{DefaultTabBar} from 'react-native-scrollable-tab-view'

import {isIphoneX} from "../../common/common";
import {navBack} from "../../nav";


const {width, height} = Dimensions.get('window');

export class AboutUs extends Component{
    constructor(){
        super();
        this.state={
            phone:null,
            id:0
        }
    }


    render(){
        return(
            <View style={{width:width,height:height,backgroundColor:"white"}}>
                <View style={{flexDirection:'row',width:width-40,marginLeft:20,alignItems:'center',justifyContent:'center',height:80,marginTop:(isIphoneX)?20:0}}>
                    <View style={{position:'absolute',left:0,top:35}}>
                        <TouchableOpacity onPress={()=>{navBack()}}>
                            <Image source={require('../../assert/img/backicon.png')} style={{width:10.5,height:19}}></Image>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:18,fontWeight:"bold",marginTop:10}}>关于我们</Text>
                </View>

            </View>
        )
    }
}