import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage} from 'react-native'
import ScrollableTabView,{DefaultTabBar} from 'react-native-scrollable-tab-view'
import {DiliveredLsit} from "./deliveredlist";
import {PengdingLsit} from "./pendinglist";
import {publishedSaga} from "../saga";
import {isIphoneX} from "../../common/common";
import {navBack} from "../../nav";

const {width, height} = Dimensions.get('window');

export class Product extends Component{
    constructor(){
        super();
        this.state={
            phone:null,
            id:0
        }
    }

    componentDidMount(){
        let id=this.props.navigation.state.params.id;
        console.log("id====>>",id)
        if(id!=null){
            this.setState({id:id})
        }
    }


render(){
        let id=this.props.navigation.state.params.id
    if(id==null){
            id=0
    }else {
            id=1
    }

    return(
            <View style={{backgroundColor:"#fff"}}>
                <View style={{flexDirection:'row',width:width-40,marginLeft:20,alignItems:'center',justifyContent:'center',height:80,marginTop:(isIphoneX)?20:0}}>
                    <View style={{position:'absolute',left:-20,top:0}}>
                        <TouchableOpacity onPress={()=>{navBack()}} style={{marginTop:35,marginLeft:20,marginRight:20,marginBottom:20}}>
                            <Image source={require('../../assert/img/backicon.png')} style={{width:10.5,height:19}}></Image>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:18,fontWeight:"bold",marginTop:10}}>我的作品</Text>
                </View>
                <View style={{width:width,height:height}}>
                    <ScrollableTabView
                        style={{marginTop:0}}
                        locked={false}
                        tabBarActiveTextColor="#71D9D1"
                        tabBarUnderlineStyle={{backgroundColor:"#fff",width:40}}
                        initialPage={id}
                        renderTabBar={()=><DefaultTabBar/>}
                        >
                         <View tabLabel='已发布' style={{backgroundColor:'#fff',height:height,width:width}}>
                             <DiliveredLsit/>
                         </View>
                         <View tabLabel='待审核' style={{flex:1,backgroundColor:'#fff'}}>
                            <PengdingLsit/>
                         </View>
                    </ScrollableTabView>
                </View>
            </View>
        )
}

}
