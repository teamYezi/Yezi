import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage,FlatList,Modal,Switch,ScrollView} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'
var forge = require('node-forge');
var md5 = forge.md.md5.create();

import {isIphoneX, uploadImg} from "../../common/common";
import {navBack, navToRoute} from "../../nav";
import {showToast} from "../../common/util";
import {msgcommentSaga} from "../../mine/saga";
import {uploadrawSaga} from "../saga";
import {isEmpty} from "../../common/util"
import {Checking} from "../../store/ui/checking";

const {width, height} = Dimensions.get('window');

export class UploadRaw extends Component{
    constructor(){
        super()
        this.state={
            img:null,
            width:null,
            height:null,
            phone:null,
            id:null,
            postfix:null,
            MD5:null
        }
    }

    componentDidMount() {
        console.log("this.props",this.props)
        let keys = ['phone', 'password'];
        AsyncStorage.multiGet(keys, (errs, result) => {
            if (errs) {
                return
            } else if (result[0][1] != null && result[1][1] != null) {
                msgcommentSaga.comments(result[0][1])
                this.setState({phone: result[0][1],id:this.props.navigation.state.params.id})
            }

        })

    }

    checkRAW(type){
        type=type.toUpperCase()
        if(type=="BMP"){
            return false
        }else if(type=="JPG"){
            return false
        }else if(type=="JPEG"){
            return false
        }else if(type=="JPEG2000"){
            return false
        }else if(type=="TIFF"){
            return false
        }else if(type=="TIF"){
            return false
        }else if(type=="PNG"){
            return false
        }else if(type=="SVG"){
            return false
        }else if(type=="TGA"){
            return false
        }else if(type=="EPS"){
            return false
        }else if(type=="FLI"){
            return false
        }else if(type=="FLC"){
            return false
        }else if(type=="EMF"){
            return false
        }else if(type=="WMF"){
            return false
        }else if(type=="DXF"){
            return false
        }else if(type=="PCX"){
            return false
        }else {
            return true
        }
    }

    chooseImg(){
        let ops={
            cropping:false,
            includeBase64:true,
            compressImageQuality:1
        };
        let headCB=image=>{
            console.log("img=====>>",image)
            // let size=image.size/1024/1024
            // size=size.toFixed(2);
            md5.update(image.data);
            let md=md5.digest().toHex();
            console.log("md5",md)
            let type=image.filename;
            type=type.split(".");
            if(this.checkRAW(type[1])){
                const succ=()=>{
                    console.log("uploading",this.state,"type",type[1])
                }
                this.setState({img:image.path,width:image.width,height:image.height,postfix:image.filename,MD5:md},succ)
            }else {
                showToast("请选择正确源文件")
            }

        };
        ImagePicker.openPicker(ops).then(headCB)
    }

    upLoad(){
        if(isEmpty(this.state.postfix)){
            showToast("请上传源文件")
        }else {
            const succ=()=>{
                console.log("raw",this.props)
                let name=JSON.parse(this.props.uploadraw.data);
                name=name.img_url;
                uploadImg('raw-img',name,this.state.img,'filename','size','width','height');
                navToRoute("Checking")
            };
            uploadrawSaga.uploadraw(this.state.phone,this.state.postfix,this.state.id,this.state.MD5,succ)
        }
    }

    render(){
        let Width=this.state.width;
        let Height=this.state.height;
        if(Width>Height){
            Height=Height*(width-40)/Width;
            Width=width-40
        }else {
            Width=Width*(width-40)/Height;
            Height=width-40
        }
        console.log("this.props",this.props)
        return(
            <View style={{width:width,height:height,backgroundColor:"#fff"}}>
                <View style={{flexDirection:'row',width:width-40,marginLeft:20,alignItems:'center',justifyContent:'space-between',height:80,marginTop:(isIphoneX)?20:0}}>
                    <TouchableOpacity onPress={()=>{navBack()}} style={{width:50,alignItems:"flex-start"}}>
                        <Image source={require('../../assert/img/backicon.png')} style={{width:10.5,height:19}}></Image>
                    </TouchableOpacity>
                    <Text style={{fontSize:18,fontWeight:"bold",marginTop:10,}}>作品验证</Text>
                    <TouchableOpacity onPress={()=>{this.props.navigation.popToTop()}} style={{width:50,alignItems:'flex-end'}}>
                        <Image style={{width:15,height:15,marginTop:8}} source={require('../../assert/img/cancel.png')}></Image>
                    </TouchableOpacity>
                </View>
                <View style={{width:width-40,height:width-40,marginLeft:20,borderWidth:1,borderRadius:5,borderColor:"#dddddd",justifyContent:'center',alignItems:"center"}}>
                    {(this.state.img==null)?
                        <TouchableOpacity onPress={()=>{this.chooseImg()}}>
                            <Text style={{fontSize:100,color:'#f5f5f5',fontWeight:'100'}}>+</Text>
                        </TouchableOpacity>:
                        <TouchableOpacity onPress={()=>{this.chooseImg()}}>
                            <Image style={{width:Width,height:Height}} source={{url:this.state.img}}></Image>
                        </TouchableOpacity>
                    }
                </View>

                <View style={{width:width-50,marginLeft:25,marginTop:15,justifyContent:"center"}}>
                    <Text style={{fontSize:12,opacity:0.55,lineHeight:20}}>叶子承诺：尊重并保护所有用户的作品隐私，版权归原作者所有，如有侵权，请立即与我们联系，我们将及时处理</Text>
                </View>
                <View style={{bottom:0,width:width,backgroundColor:'#ffffff',height:(isIphoneX)?100:60,position:'absolute',flexDirection:'row',alignItems:(isIphoneX)?"flex-start":'center',justifyContent:'space-around'}}>
                    <TouchableOpacity style={{borderWidth:0,backgroundColor:'#71d9d1',padding:10,borderRadius:30,paddingLeft:50,paddingRight:50,marginTop:(isIphoneX)?10:0,}}
                                      onPress={()=>{this.upLoad()}}>
                        <Text style={{fontSize:16,color:"white"}}>上传</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}