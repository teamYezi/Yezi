import React,{Component} from "react"
import {View,Image,Text,TextInput,TouchableOpacity,AsyncStorage} from 'react-native'


import {showToast} from "../../common/util";
import {loginSaga} from "../../login/saga";
import {isEmpty} from "../../common/util"
import {navBack, navToRoute} from "../../nav";


export class Login extends Component{
    constructor(){
        super();
        this.state={
            PhoneNum:null,
            PassWord:null
        }
    }

    componentDidMount(){

    }

    onNavToSignup(){
        console.log("nav to signup begin")
        navToRoute('SignupScreen')
    }

    //登录成功后自动保存密码
    savePassword(){
        let keyValues=[['phone',this.state.PhoneNum],["password",this.state.PassWord]]
        AsyncStorage.multiSet(keyValues,function (err) {
            if(err){
                return
            }
        })
    }

    //登录按钮逻辑实现
    sagaLogin() {
        let phoneNum=this.state.PhoneNum
        let passwrod=this.state.PassWord
        //判断手机号码格式是否正确
        let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
        if(isEmpty(phoneNum)){
            showToast("手机号码不能为空")
        }else if(isEmpty(passwrod)){
            showToast("密码不能为空")
        }else if(!myreg.test(phoneNum)){
            showToast("手机号码格式不正确")
        }else {
            const succ = (payload, data) => {
                const {[loginSaga.name]:login}=this.props
                let loginResult=login.data;
                if(loginResult==1){
                    showToast('登录成功！');
                    navBack();
                    this.savePassword();
                }else if(loginResult==2){
                    showToast('密码不正确');
                }else if(loginResult ==3){
                    showToast('请注册');
                }


            };
            loginSaga.login(phoneNum, passwrod, succ);
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
                           placeholder="手机号"
                           autoFocus={true}
                           keyboardType="numeric"
                           maxLength={11}
                           returnKeyType="next"
                           onChangeText={(PhoneNum) => this.setState({PhoneNum})}></TextInput>
                <View style={{width:250,height:1,backgroundColor:"#000",opacity:0.2}}/>
                <TextInput style={{height:35,width:250,marginTop:20,paddingLeft:10}}
                           placeholder="密码"
                           returnKeyType="done"
                           secureTextEntry={true}
                           maxLength={12}
                           onChangeText={(PassWord) => this.setState({PassWord})}></TextInput>
                <View style={{width:250,height:1,backgroundColor:"#000",opacity:0.2}}/>
                <TouchableOpacity style={{height:40,width:200,backgroundColor:"#c6c6c6",opacity:0.7,borderRadius:20,marginTop:60,padding:5,alignItems:'center',justifyContent:'center'}}
                onPress={()=>{this.sagaLogin()}}>
                    <Text>
                        登录
                    </Text>
                </TouchableOpacity>
<TouchableOpacity style={{height:40,width:200,opacity:0.7,borderRadius:20,borderWidth:1,borderColor:"#c6c6c6",marginTop:20,padding:5,alignItems:'center',justifyContent:'center'}}
                  onPress={()=>{this.onNavToSignup()}}>
                    <Text>
                        注册
                    </Text>
                </TouchableOpacity>
                <Text style={{marginTop:100,fontSize:10,color:"#cdcbd0"}}>
                    创建账号即代表同意用户协议
                </Text>
            </View>
        </View>
        )
    }

}
