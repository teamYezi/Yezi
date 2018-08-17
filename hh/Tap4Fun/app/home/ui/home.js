import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage,Modal} from 'react-native'
import SideMenu from 'react-native-side-menu'
import {Footer,FooterTab,Button,Icon, Container} from 'native-base';
import Drawer from 'react-native-drawer'


import {SideBar} from "./leftmenu";
import {Main} from "../../main/ui/main";
import {Message} from "../../message/ui/message";
import {Mine} from "../../mine/ui/mine";
import {SideBar_} from "../index"
import {Main_} from "../../main/index"
import {Mine_} from "../../mine/index"
import {loginSaga} from "../../login/saga";
import {navToRoute} from "../../nav";
import {isIphoneX} from "../../common/common";
import {showToast} from "../../common/util";
import {mineSaga} from "../../mine/saga";

const {width, height} = Dimensions.get('window');

export class Home extends Component{
    constructor(){
        super();
        this.state={
            isSideMenuOpen:false,
            isLogin:false,
            currPage:0,
            modalvisible:false
        }
    }

    componentDidMount(){
        /*
        * 控制身份
        * Asyncstorage 存储登录状态 1----已经登录 undefined----未登录
        *
        *
        * 打开app，查看是否保存账号密码，如果有---登录-》登录状态改为1   如果没有----不做任何操作
        *
        * 所有需要判断用户身份的时候 ，取登录状态
        *
        * */


        //检查是否已经储存账号密码，如果有自动登录
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(errs){
                return
            }else if(result[0][1]!=null&&result[1][1]!=null){
                const succ=()=>{
                    this.saveIslogin()
                    mineSaga.getmign(result[0][1])
                }
                loginSaga.login(result[0][1],result[1][1],succ)
            }

        })

    }
    //检查登录状态
    checkLogin(){
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            console.log("phone",result[0][1])
           return result[0][1]
        })

    }

//保存登录状态
    saveIslogin(){
        AsyncStorage.setItem('isLogin',"1")
        this.setState({isLogin:true})
    }

    //控制侧滑抽屉的关闭开启
    closeDrawer = () => {
            this._drawer.close()
    };
    openDrawer = () => {
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(result[0][1]!=null){
                    this._drawer.open()
            }else {
                navToRoute('LoginScreen')

            }
        })
    };

    navToBanquan(){
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(result[0][1]!=null){
                navToRoute("UploadEdit")
            }else {
                navToRoute('LoginScreen')

            }
        })
    }
    navToMine(){
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(result[0][1]!=null){
                this.setState({currPage:4})
            }else {
                navToRoute('LoginScreen')

            }
        })
    }

    render(){

        return(
          <Drawer
              type='overlay'
              styles={{
                  main: {paddingLeft: 0},
              }}
              tweenHandler={(ratio) => ({main: { opacity:(3-ratio)/3 }})}
              ref={(ref) => this._drawer = ref}
              open={this.state.isSideMenuOpen}
              openDrawerOffset={width*0.5}
              closedDrawerOffset={0}
              tapToClose={true}
              content={<SideBar_ navigator={this.navigator} close={this.closeDrawer.bind(this)}/>}
          >
              <View style={{height:height+20,width:width,backgroundColor:'#ffffff'}}>
                  {(this.state.currPage==0)?
                      <View>
                          <Main_/>
                      </View>
                      :
                      null
                  }
                  {(this.state.currPage==2)?
                      <View>
                          <Text style={{marginTop:100,marginLeft:80}}>版权</Text>
                      </View>
                      :
                      null
                  }
                  {(this.state.currPage==4)?
                      <View>
                         <Mine_/>
                      </View>
                      :
                      null
                  }

              </View>
              <View style={{position:'absolute',left:0,top:(isIphoneX)?50:20}}>
                  <TouchableOpacity onPress={()=>{this.openDrawer()}} style={{marginLeft:20,marginRight:20,marginTop:20,marginBottom:20}}>
                      <Image source={require('../../assert/img/sidemenu.png')} style={{width:20,height:18}}></Image>
                  </TouchableOpacity>
              </View>
              <View style={{bottom:0,width:width,backgroundColor:'#ffffff',height:(isIphoneX)?100:60,position:'absolute',flexDirection:'row',alignItems:'flex-start',justifyContent:'space-around'}}>
                  {/*首页FooterBar控制*/}
                  <View style={{alignItems:'center',marginTop:8}}>
                      {(this.state.currPage==0)?
                          <TouchableOpacity onPress={()=>{this.setState({currPage:0})}} style={{width:width/3,alignItems:"center"}}>
                              <Image source={require('../../assert/img/home_selected.png')} style={{width:30,height:30}} resizeMode='stretch'></Image>
                              <Text style={{color:"#71D9D1",fontSize:10,textAlign:'center',marginTop:5}}>首页</Text>
                          </TouchableOpacity>
                          :
                          <TouchableOpacity onPress={()=>{this.setState({currPage:0})}} style={{width:width/3,alignItems:"center"}}>
                              <Image source={require('../../assert/img/home_us.png')} style={{width:30,height:30}} resizeMode='stretch'></Image>
                              <Text style={{color:"#797979",fontSize:10,textAlign:'center',marginTop:5}}>首页</Text>
                          </TouchableOpacity>
                      }
                  </View>
                  {/*版权FooterBar控制*/}
                  <View style={{alignItems:'center',marginTop:8}}>
                          <TouchableOpacity onPress={()=>{this.navToBanquan()}} style={{width:width/3,alignItems:"center"}}>
                              <Image source={require('../../assert/img/copyright_us.png')} style={{width:30,height:30}} resizeMode='stretch'></Image>
                              <Text style={{color:"#797979",fontSize:10,textAlign:'center',marginTop:5}}>上传</Text>
                          </TouchableOpacity>
                  </View>
                  {/*我的FooterBar控制*/}
                  <View style={{alignItems:'center',marginTop:8}}>
                      {(this.state.currPage==4)?
                          <TouchableOpacity onPress={()=>{this.navToMine()}} style={{width:width/3,alignItems:"center"}}>
                              <Image source={require('../../assert/img/me_s.png')} style={{width:30,height:32}} resizeMode='stretch'></Image>
                              <Text style={{color:"#71D9D1",fontSize:10,textAlign:'center',marginTop:5}}>我的</Text>
                          </TouchableOpacity>
                          :
                          <TouchableOpacity onPress={()=>{this.navToMine()}} style={{width:width/3,alignItems:"center"}}>
                              <Image source={require('../../assert/img/me_us.png')} style={{width:30,height:32}} resizeMode='stretch'></Image>
                              <Text style={{color:"#797979",fontSize:10,textAlign:'center',marginTop:5}}>我的</Text>
                          </TouchableOpacity>
                      }
                  </View>
              </View>
          </Drawer>
        )

    }

}

