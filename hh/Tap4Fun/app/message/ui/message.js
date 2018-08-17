import React,{Component} from "react"
import {View,Image,Text,TextInput,TouchableOpacity,Dimensions,FlatList} from 'react-native'
import {Tabs,Tab,TabHeading} from 'native-base';

import ScrollableTabView,{DefaultTabBar} from 'react-native-scrollable-tab-view'
import {NewFlatlist} from "../../main/ui/newflatlist";

const {width, height} = Dimensions.get('window');

export class Message extends Component{
    constructor() {
        super()
        this.state = {
            currPage:0
        }
    }


    render(){
        return(
            <View style={{width:width,height:height}}>
                <View style={{width:width,alignItems:'center',marginTop:40}}>
                    <Text style={{fontSize:18,fontWeight:'bold'}}>消息</Text>
                </View>
                {/*<Tabs style={{marginTop:20,width:width-80,marginLeft:40}}*/}
                      {/*tabBarBackgroundColor="#FFFFFF"*/}
                      {/*>*/}
                    {/*<Tab heading={<TabHeading><Text>赞</Text></TabHeading>}>*/}
                        {/*<View>*/}
                            {/*<Text>赞</Text>*/}
                        {/*</View>*/}
                    {/*</Tab>*/}
                    {/*<Tab heading={<TabHeading><Text>评论</Text></TabHeading>}>*/}
                        {/*<View>*/}
                            {/*<Text>评论</Text>*/}
                        {/*</View>*/}
                    {/*</Tab>*/}
                    {/*<Tab heading={<TabHeading><Text>通知</Text></TabHeading>}>*/}
                        {/*<View>*/}
                            {/*<Text>通知</Text>*/}
                        {/*</View>*/}
                    {/*</Tab>*/}
                {/*</Tabs>*/}
                <ScrollableTabView
                    style={{marginTop:20}}
                    locked={false}
                    tabBarActiveTextColor="#71D9D1"
                    tabBarUnderlineStyle={{backgroundColor:"#fff",width:40}}
                    initialPage={0}
                    renderTabBar={()=><DefaultTabBar/>}
                >
                    <View tabLabel='赞' style={{backgroundColor:'#fff',height:height,width:width}}>
                        <Text style={{marginTop:200}}>赞</Text>
                    </View>
                    <View tabLabel='消息' style={{flex:1,backgroundColor:'fff'}}>
                        <Text>消息</Text>
                    </View>
                    <View tabLabel='评论' style={{backgroundColor:'fff'}}>
                        <NewFlatlist style={{marginTop:200}}/>
                    </View>



                </ScrollableTabView>
            </View>
        )
    }

}