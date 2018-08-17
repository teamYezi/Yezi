import React,{Component} from "react"
import {View,Image,Text,TextInput,TouchableOpacity,Dimensions,AsyncStorage,ScrollView} from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import ImagePicker from 'react-native-image-crop-picker'
import Picker from 'react-native-picker'
import DatePicker from 'react-native-datepicker'
import moment from 'moment'


import {showToast} from "../../common/util";
import {getinfoSaga, loginSaga, upinfoSage} from "../saga";
import {isIphoneX, uploadImg} from "../../common/common";
import {navBack} from "../../nav";
import {mineSaga} from "../../mine/saga";

let {height, width} = Dimensions.get('window');

export class PersonInfo extends Component{
    constructor(){
        super();
        this.state={
            UserName:null,
            signatureL:null,
            sex:"男",
            Date:new moment().format('YYYY-MM-DD'),
            birthday:null,
            url:null,
            filetype:null,
            path:null,
            phone:null,
            changeURL:0

        }
    }

    componentDidMount(){
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(errs){
                return
            }else if(result[0][1]!=null&&result[1][1]!=null){
                const succ=()=>{
                    let {[getinfoSaga.name]:getinfo}=this.props
                    console.log("getinfo====>>>",JSON.parse(getinfo.data))
                    getinfo=JSON.parse(getinfo.data);
                    let sex="男"
                    if(getinfo.gender=="female"){
                        sex="女"
                    }
                    this.setState({sex:sex,UserName:getinfo.name,signatureL:getinfo.signature,url:getinfo.avatar,birthday:getinfo.birthday,phone:result[0][1]})
                }
                getinfoSaga.getinfo(result[0][1],succ)
            }

        })

    }

    // SexPicker(){
    //     let sexdata=['男','女'];
    //     Picker.init({
    //         pickerData:sexdata,
    //         pickerConfirmBtnText:"确认",
    //         pickerCancelBtnText:"取消",
    //         pickerTitleText:'请选择性别',
    //         selectedValue:[this.state.sex],
    //         onPickerConfirm:data=>{
    //             this.setState({sex:data[0]})
    //         }
    //     })
    //     Picker.show()
    // }

    ShowDatePicker(){
        let data=this.state.Date;
        this.picker.showDatePicker(data,(d)=>{
            this.setState({Date:d})
        })
    }

    chooseHeadImg(){
        this.ActionSheet.show()
    }

    chooseSex(){
        this.SexActionSheet.show()
    }


    upInfo(){
        let postfix=this.state.filetype;
        let name=this.state.UserName;
        let gender=this.state.sex;
        if(gender=="女"){gender='female'}
        else {gender='male'}
        let birthday=this.state.birthday;
        let signature=this.state.signatureL;
        let id=this.state.phone;
        let path=this.state.url
        const succ=()=>{
            if(this.state.changeURL==1){
                let {[upinfoSage.name]:upinfo}=this.props
                upinfo=JSON.parse(upinfo.data);
                console.log("aaaaaa",upinfo.avatar,path)
                uploadImg('avatar',upinfo.avatar,path,'filename','size','width','height');
            }

            //更新store用户资料
            mineSaga.getmign(id)
            showToast("更改成功")
        }

        upinfoSage.upinfo(postfix,name,gender,birthday,signature,id,this.state.changeURL,succ)
    }
    render(){
        console.log("123",this.state)
        let username=this.state.UserName;
        // let signature=this.state.signatureL
        let signature=this.state.signatureL;

        return(
            <View style={{flex:1,backgroundColor:"#fff"}}>
                <View style={{flexDirection:'row',alignItems:'center',marginTop:(isIphoneX)?20:0,height:(isIphoneX)?100:100}}>
                    <TouchableOpacity onPress={()=>{navBack()}}>
                        <Image source={require('../../assert/img/backicon.png')} style={{width:10.86,height:20.23,marginLeft:20}}>
                        </Image>
                    </TouchableOpacity>
                    <Text style={{fontSize:18,marginLeft:width*0.34,marginBottom:height*0.0027}}>编辑资料</Text>
                </View>
                <ScrollView style={{}}>
                    <View style={{flex:1.92,flexDirection:'row',alignItems:'center',justifyContent:"space-between",width:width-40,marginLeft:20}}>
                        <View>
                            <View  style={{}}>
                                <Image style={{borderRadius:50,width:100,height:100}} source={(this.state.url==null)?require('../../assert/img/avatar.png'):{url:this.state.url}}></Image>
                            </View>
                            <ActionSheet
                                ref={o=>this.ActionSheet=o}
                                title={'修改头像'}
                                options={['拍照','相册','取消']}
                                cancelButtonIndex={2}
                                onPress={(index)=>{
                                    let ops={
                                        width:400,
                                        height:400,
                                        cropping:true,
                                        includeBase64:true,
                                        compressImageQuality:0.8
                                    };
                                    let headCB=image=>{
                                        console.log("img=====>>",image)
                                        let filename=image.filename;
                                        if(filename==null){filename="camare.jpeg"}
                                        this.setState({url:image.path,filetype:filename,changeURL:1})
                                    };
                                    if(index==0){
                                        ImagePicker.openCamera(ops).then(headCB)
                                    }else if(index==1){
                                        ImagePicker.openPicker(ops).then(headCB)
                                    }
                                }}
                            />
                        </View>
                        <View style={{flexDirection:'row',alignItems:'center',}}>
                            <TouchableOpacity onPress={()=>{this.chooseHeadImg()}} style={{flexDirection:'row',height:50,alignItems:"center", width:150,justifyContent:'flex-end'}}>
                                <Text style={{textAlign:"right"}}>修改头像</Text>
                                <Image source={require("../../assert/img/editicon.png")} style={{marginLeft:10,width:5.75,height:10.72,marginTop:3}}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex:1.07,width:319.15,flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',marginLeft:35.71,marginBottom:5,marginTop:40}}>
                        <View style={{justifyContent:'center',height:34, marginBottom: -height/45}}>
                            <Text>用户名</Text>
                        </View>
                        <TextInput
                            style={{textAlign:'right',width:200,height:34, marginBottom:-height/45}}
                            defaultValue={username}
                            returnKeyType="next"
                            maxLength={12}
                            onChangeText={(UserName) => this.setState({UserName})}
                        ></TextInput>
                    </View>
                    <View style={{flex:0.853}}>
                        <View style={{height:1,width:376,opacity:0.125,marginTop:height/40,marginLeft:23.19,backgroundColor:"#000"}}></View>
                        <View style={{flexDirection:'row',justifyContent:'space-between',width:319.15,marginLeft:35.71,marginTop:21.2}}>
                            <View style={{justifyContent:'center',height:34, marginTop:-height/100}}>
                                <Text>标签</Text>
                            </View>
                            <TextInput
                                style={{textAlign:'right',width:200,height:34, marginTop:-height/100}}
                                defaultValue={signature}
                                returnKeyType="next"
                                maxLength={12}
                                onChangeText={(signatureL) => this.setState({signatureL})}
                            ></TextInput>
                        </View>
                    </View>
                    <View style={{flex:0.8452}}>
                        <View style={{height:1,width:376,opacity:0.125,marginTop:height/40,marginLeft:23.19,backgroundColor:"#000"}}></View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{marginTop:21.2,flexDirection:'row',justifyContent:'space-between',width:319.15,marginLeft:35.71}}>
                                <Text>性别</Text>
                                <ActionSheet
                                    ref={o=>this.SexActionSheet=o}
                                    title={'修改性别'}
                                    options={['男','女','取消']}
                                    cancelButtonIndex={2}
                                    onPress={(index)=>{
                                        if(index==0){
                                            this.setState({sex:'男'})
                                        }else if(index==1){
                                            this.setState({sex:'女'})
                                        }
                                    }}
                                />
                                <TouchableOpacity onPress={()=>{this.chooseSex()}}><Text style={{opacity:0.5, height:30, width:200, textAlign:'right'}}>{this.state.sex}</Text></TouchableOpacity>
                            </View>
                            <Image source={require("../../assert/img/editicon.png")} style={{width:5.75,height:10.72,marginLeft:18.6,marginTop:23.2}}></Image>
                        </View>
                    </View>
                    <View style={{flex:0.9452}}>
                        <View style={{height:1,width:376,opacity:0.125,marginTop:height/80,marginLeft:23.19,backgroundColor:"#000"}}></View>
                        <View style={{flexDirection:'row'}}>
                            <View style={{marginTop:21.2,flexDirection:'row',justifyContent:'space-between',width:319.15,marginLeft:35.71}}>
                                <Text style={{marginTop:2}}>生日</Text>
                                <DatePicker
                                    ref={o=>this.DatePicker=o}
                                    style={{width:200,borderColor:"#000"}}
                                    data={this.state.Date}
                                    mode="date"
                                    placeholder={this.state.birthday}
                                    format="YYYY-MM-DD"
                                    minDate="1918-07-20"
                                    maxDate={this.state.Date}
                                    hideText={false}
                                    confirmBtnText="确认"
                                    cancelBtnText="取消"
                                    showIcon={false}
                                    customStyles={{dateInput:{
                                            bordwidth:0
                                        }}}
                                    onDateChange={(date)=>{this.setState({birthday:date})}}>
                                </DatePicker>
                            </View>
                            <Image source={require("../../assert/img/editicon.png")} style={{width:5.75,height:10.72,marginLeft:18.6,marginTop:24.2}}></Image>
                        </View>
                        <View style={{height:1,width:376,opacity:0.125,marginTop:height/200,marginLeft:23.19,backgroundColor:"#000"}}></View>
                    </View>
                    <View style={{flex:3.75,justifyContent:"flex-end",alignItems:'center',marginTop:height/10}}>
                        <TouchableOpacity style={{padding:10,backgroundColor:"#71D9D1",alignItems:'center',width:149,borderRadius:22,marginBottom:48}}
                                          onPress={()=>{this.upInfo()}}>
                            <Text style={{fontSize:18,color:"#fff"}}>确认修改</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>


            </View>
        )
    }
}