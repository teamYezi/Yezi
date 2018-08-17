import React,{Component} from "react"
import {View,Image,Text,TextInput,TouchableOpacity,AsyncStorage} from 'react-native'


import {showToast} from "../../common/util";
import {isEmpty} from "../../common/util"
import {loginSaga, signupSaga, smsSaga} from "../saga";
import {navBack} from "../../nav";


export class Signup extends Component{
    constructor(){
        super();
        this.state={
            PhoneNum:null,
            Code:null,
            PassWord:null,
            getSms:false,
            CountDown:60
        }
    }

    componentDidMount(){
    }
    //获取短信验证码Saga
    sagaSms(){
        let phoneNum=this.state.PhoneNum;
        const succ=()=>{
            console.log("sms start")
            const {[smsSaga.name]:sms}=this.props
            let smsResult=sms.data;
            if(smsResult==0){
                showToast("验证码发送成功")
            }
            else {
                showToast("您已注册")

            }
        }
        smsSaga.getsms(phoneNum,succ)
    }

    //倒计时60s
    settime(val){

        let countdown=val
        if(countdown==0){
            this.setState({getSms:false,CountDown:60})
        }else {
            countdown--;
            this.setState({CountDown:countdown})
            setTimeout(()=> {
                this.settime(countdown)
            },1000)
        }
    }

    //获取验证码按钮实现
    getSms(){
        //判断手机号码格式是否正确
        let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;

            if(isEmpty(this.state.PhoneNum)){
                showToast("请输入手机号")
            }else if(!myreg.test(this.state.PhoneNum)){
                showToast("手机号码格式不正确")
            }else {
                this.setState({getSms:true})
                this.settime(60)
                this.sagaSms();
            }
    }

    //注册
    Signup(){
        const succ=()=>{
            const {[signupSaga.name]:signup}=this.props
            let signupResult=signup.data;
            if(signupResult==1){
                showToast("注册成功！")
                navBack();
            }else if(signupResult==0){
                showToast("验证码错误")
            }else if(signupResult==-1){
                showToast("验证码过期")
            }
        }
        let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
        if(isEmpty(this.state.PhoneNum)){
            showToast("请输入手机号")
        }else if(!myreg.test(this.state.PhoneNum)){
            showToast("手机号码格式不正确")
        }else if(isEmpty(this.state.Code)){
            showToast("请输入验证码")
        }else if(isEmpty(this.state.PassWord)){
            showToast("请输入密码")
        }else {
            signupSaga.signup(this.state.PhoneNum,this.state.Code,this.state.PassWord,succ)
        }
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor:"#ffffff"}}>
                <View style={{flex:4,justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../../assert/img/logo.png')} style={{width:160,height:160,borderRadius:40}}/>
                </View>
                <View style={{flex:6,alignItems:'center'}}>
                    {/*第一版本*/}
                    {/*<TextInput style={{height:35,width:250,backgroundColor:"#c6c6c6",opacity:0.7,borderRadius:20,paddingLeft:15}}*/}
                    {/*placeholder="手机号"*/}
                    {/*autoFocus={true}*/}
                    {/*keyboardType="numeric"*/}
                    {/*maxLength={11}*/}
                    {/*returnKeyType="next"*/}
                    {/*onChangeText={(PhoneNum) => this.setState({PhoneNum})}></TextInput>*/}

                    {/*<TextInput style={{height:35,width:250,backgroundColor:"#c6c6c6",opacity:0.7,borderRadius:20,marginTop:20,paddingLeft:15}}*/}
                    {/*placeholder="密码"*/}
                    {/*returnKeyType="done"*/}
                    {/*onChangeText={(PassWord) => this.setState({PassWord})}></TextInput>*/}
                    {/*<TouchableOpacity style={{height:30,width:80,backgroundColor:"#c6c6c6",opacity:0.7,borderRadius:20,marginTop:60,padding:5,alignItems:'center'}}>*/}
                    {/*<Text>*/}
                    {/*登录*/}
                    {/*</Text>*/}
                    {/*</TouchableOpacity>*/}
                    <TextInput style={{height:35,width:250,paddingLeft:10}}
                               placeholder="请输入手机号"
                               autoFocus={true}
                               keyboardType="numeric"
                               maxLength={11}
                               returnKeyType="next"
                               onChangeText={(PhoneNum) => this.setState({PhoneNum})}></TextInput>
                    <View style={{width:250,height:1,backgroundColor:"#000",opacity:0.2}}/>
                    <View style={{flexDirection:'row'}}>
                        <TextInput style={{height:35,width:150,marginTop:20,paddingLeft:10}}
                                   placeholder="请输入验证码"
                                   returnKeyType="next"
                                   secureTextEntry={true}
                                   keyboardType="numeric"
                                   maxLength={4}
                                   onChangeText={(Code) => this.setState({Code})}></TextInput>
                        {
                            (this.state.getSms==false)?
                                <TouchableOpacity style={{width:100,marginTop:28,alignItems:'flex-end'}}
                                                  onPress={()=>{this.getSms()}}>
                                    <Text style={{fontSize:10,opacity:0.7,borderWidth:1,borderRadius:10,padding:5}}>获取验证码</Text>
                                </TouchableOpacity>
                            :
                                <View style={{width:100,marginTop:30,alignItems:'flex-end'}}>
                                    <Text style={{fontSize:12,opacity:0.7}}>{this.state.CountDown+'s'}</Text>
                                </View>
                        }


                    </View>
                    <View style={{width:250,height:1,backgroundColor:"#000",opacity:0.2}}/>
                    <TextInput style={{height:35,width:250,marginTop:20,paddingLeft:10}}
                               placeholder="请输入密码"
                               returnKeyType="done"
                               secureTextEntry={true}
                               maxLength={12}
                               onChangeText={(PassWord) => this.setState({PassWord})}></TextInput>
                    <View style={{width:250,height:1,backgroundColor:"#000",opacity:0.2}}/>
                    <View>
                        <Text style={{fontSize:12,paddingTop:5,opacity:0.5}}>（长度在6-12位，请牢记你的密码）</Text>
                    </View>
                    <TouchableOpacity style={{height:40,width:200,backgroundColor:"#c6c6c6",opacity:0.7,borderRadius:20,marginTop:60,padding:5,alignItems:'center',justifyContent:'center'}}
                                      onPress={()=>{this.Signup()}}>
                        <Text>
                            注册
                        </Text>
                    </TouchableOpacity>
                    <Text style={{marginTop:100,fontSize:12,color:"#cdcbd0"}}>
                        创建账号即代表同意用户协议
                    </Text>
                </View>
            </View>
        )
    }

}