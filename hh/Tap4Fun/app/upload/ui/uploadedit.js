import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage,FlatList,Modal,Switch,ScrollView} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'

import {navBack, navToRoute} from "../../nav";
import {isIphoneX, uploadImg} from "../../common/common";
import {showToast} from "../../common/util";
import {uploadSaga} from "../saga";
import {msgcommentSaga} from "../../mine/saga";
import {isEmpty} from "../../common/util"

const {width, height} = Dimensions.get('window');

export class UploadEdit extends Component{
    constructor(){
        super()
        this.state={
            id:null,
            phone:null,
            img:null,
            modalvisible:false,
            choose:[],
            totalTag:0,
            addstore:false,
            header:null,
            description:null,
            tags:"",
            idtag:null,
            price:null,
            resolution:null,
            size:null,
            postfix:null
        }
    }

    componentDidMount() {
        let keys = ['phone', 'password'];
        AsyncStorage.multiGet(keys, (errs, result) => {
            if (errs) {
                return
            } else if (result[0][1] != null && result[1][1] != null) {
                msgcommentSaga.comments(result[0][1])
                this.setState({phone: result[0][1]})
            }

        })

    }

    chooseImg(){
        let ops={
            cropping:false,
            includeBase64:true,
            compressImageQuality:0.2
        };
        let headCB=image=>{
            console.log("img=====>>",image)
            let size=image.size/1024/1024
            size=size.toFixed(2);
            const succ=()=>{
                console.log("uploading",this.state)
            }
            this.setState({img:image.path,resolution:image.width+"x"+image.height,size:size+"M",postfix:image.filename},succ)
        };
        ImagePicker.openPicker(ops).then(headCB)
    }

    onTag(index){
        let choose=this.state.choose
        let total=this.state.totalTag
        if(this.state.choose[index]==true){
            choose[index]=false;
            this.setState({choose:choose,totalTag:total-1})
        }else {
            if(total<3){
                choose[index]=true;
                this.setState({choose:choose,totalTag:total+1})
            }else {
                showToast("最多选择三个标签")
            }

        }
    }
    onAddStore(){
        let addstore=this.state.addstore;
        this.setState({addstore:!addstore})
    }

    onNextStep(){
        let data=["lvpai","danse","qingxin","lengdan","wenyi","segan","shunjian","kongqi","yuanqi","yuanfang"]
        let {tags,choose,img,addstore,header,description,idtag,price,size,postfix,resolution,phone}=this.state
        for(let i=0;i<10;i++){
            if(choose[i]==true){
                if(tags==""){
                    tags+=data[i]
                }else {
                    tags+=","+data[i]

                }
            }
        }
        // navToRoute("UploadRaw")
        if(isEmpty(size)){
            showToast("请选择上传作品")
        }else if(isEmpty(description)){
            showToast("作品描述不能为空")
        }else if(isEmpty(header)){
            showToast("标题不能为空")
        }else if(isEmpty(tags)){
            showToast("请选择标签")
        }else if(isEmpty(price)){
            showToast("请选择价格")
        } else {
            const succ=()=>{
                console.log("uploadsaga",this.props);
                let name=JSON.parse(this.props.upload.data);
                let id=name.img_id;
                name=name.img_url;
                uploadImg('yeziapp',name,img,'filename','size','width','height');
                navToRoute("UploadRaw",{id:id});
                showToast("上传成功")
            };
            let forsale=0;
            if(this.state.addstore){
                forsale=1
            }
            uploadSaga.upload(phone,price,header,postfix,size,resolution,description,tags,idtag,forsale,succ)

        }
    }

    render(){
        let data=["旅拍","单色","清新","冷淡","文艺"]
        let data2=["色感","瞬间","空气","元气","远方"]
        return(
            <View style={{width:width,height:height,backgroundColor:"#fff"}}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalvisible}
                >
                    <View style={{justifyContent:'center',alignItems:'center',width:width,height:height,backgroundColor:'rgba(0, 0, 0, 0.6)'}}>
                        <View style={{width:width*0.7,height:height*2/3,backgroundColor:"#fff",shadowColor: "#cacaca",borderRadius:5,
                            marginRight: 4,
                            shadowOffset: {width: 2, height: 2},
                            shadowOpacity: 0.5,
                            shadowRadius: 5,
                            marginBottom: 4}}>
                            <TouchableOpacity style={{width:width-120,alignItems:'flex-end',marginTop:20}} onPress={()=>{this.setState({modalvisible:false})}}>
                                <Image style={{width:20,height:20,marginRight:20}} source={require("../../assert/img/close.png")}></Image>
                            </TouchableOpacity>
                            <View style={{height:height*2.2/4,justifyContent:"center"}}>
                                <Text style={{textAlign:'center',fontSize:width/25,fontWeight:'bold',marginTop:10}}>版权上链须知</Text>
                                <Text style={{textAlign:'center',fontSize:width/30,marginTop:20}}>致力于保护镜头下的每个创意</Text>
                                <Text style={{textAlign:'center',fontSize:width/30,marginTop:10}}>请每位创意师也为自己证明</Text>
                                <View style={{width:width-160,marginLeft:20}}>
                                    <Text style={{fontSize:width/28,fontWeight:'bold',opacity:0.8,marginTop:height/45}}>步骤：</Text>
                                    <Text style={{fontSize:13,opacity:0.8,lineHeight:20,marginTop:10}}>1. 作品编辑：上传展示作品，编辑标题，标
                                        签，文案。可选择一键上架，设置价格。</Text>
                                    <Text style={{fontSize:13,opacity:0.8,marginTop:height/65,lineHeight:20}}>2. 作品验证：上传作品的RAW格式源文件，保证你才是作品的创意师。
                                    </Text>
                                    <Text style={{fontSize:13,opacity:0.8,lineHeight:20}}>（小tip: 源文件不会发布在平台哦）</Text>
                                    <Text style={{fontSize:13,opacity:0.8,marginTop:height/65,lineHeight:20}}>3. 版权上链：发布后我们会尽快审核，审核
                                        成功后，作品信息生成独有数字版权ID，写
                                        入区块链，永不可篡改。并且作品会展示在
                                        首页，选择一键上架的作品会上架到发现。</Text>
                                </View>
                            </View>

                        </View>
                    </View>
                </Modal>
                <View style={{flexDirection:'row',width:width,alignItems:'center',justifyContent:'space-between',height:80,marginTop:(isIphoneX)?20:0}}>
                    <TouchableOpacity onPress={()=>{navBack()}} style={{marginLeft:20,height:80,justifyContent:'center'}}>
                        <Image source={require('../../assert/img/backicon.png')} style={{width:10.5,height:19}}></Image>
                    </TouchableOpacity>
                    <Text style={{fontSize:18,fontWeight:"bold",marginTop:10,marginLeft:20}}>作品编辑</Text>
                    <TouchableOpacity onPress={()=>{this.setState({modalvisible:true})}} style={{marginRight:20,height:80,justifyContent:'center'}}>
                        <Image style={{width:30,height:30,marginTop:10}} source={require('../../assert/img/question.png')}></Image>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{marginBottom:(isIphoneX)?100:60}}>
                    <View style={{width:width-40,marginLeft:20,marginTop:0}}>
                        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                            <Text style={{opacity:0.8,fontSize:16}}>作品</Text>
                            <View style={{marginLeft:10}}>
                                {(this.state.img==null)?
                                    <TouchableOpacity style={{width:width-90,height:width*2/3-60,borderColor:'#f5f5f5',borderWidth:1,borderRadius:5,justifyContent:'center',alignItems:'center'}}
                                                      onPress={()=>{this.chooseImg()}}>
                                        <Text style={{fontSize:100,color:'#f5f5f5',fontWeight:'100'}}>+</Text>
                                    </TouchableOpacity>:
                                    <TouchableOpacity onPress={()=>{this.chooseImg()}}>
                                        <Image style={{width:width-100,height:width*2/3-60,borderRadius:5}} source={{url:this.state.img}}></Image>
                                    </TouchableOpacity>
                                }
                                <TextInput style={{width:width-90,borderRadius:5,borderWidth:1,borderColor:'#f5f5f5',height:40,marginTop:10,paddingLeft:10}} maxLength={16} placeholder="请输入标题"
                                           onChangeText={(header) => this.setState({header})}></TextInput>
                                <TextInput style={{width:width-90,borderRadius:5,borderWidth:1,borderColor:'#f5f5f5',height:height/6,marginTop:10,paddingLeft:10}} maxLength={1000} placeholder="请输入作品文案" multiline={true}
                                           onChangeText={(description) => this.setState({description})}></TextInput>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
                            <Text style={{opacity:0.8,fontSize:16,marginTop:10}}>标签</Text>
                            <View style={{marginLeft:10}}>
                                <TextInput style={{width:width-90,borderRadius:5,borderWidth:1,borderColor:'#f5f5f5',height:40,marginTop:10,paddingLeft:10}} maxLength={4} placeholder="请输入您的标签"
                                           onChangeText={(idtag) => this.setState({idtag})}></TextInput>
                                <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:10}}>
                                    {data.map((name,index)=>{
                                        return             (this.state.choose[index]==true)?
                                            <TouchableOpacity style={{padding:4,paddingLeft:12,paddingRight:12,borderRadius:10,borderWidth:1,borderColor:'#71d9d1',backgroundColor:"#71d9d1"}}
                                                              onPress={()=>{this.onTag(index)}}>
                                                <Text style={{fontSize:12,color:"white"}}>{name}</Text>
                                            </TouchableOpacity>:
                                            <TouchableOpacity style={{padding:4,paddingLeft:12,paddingRight:12,borderRadius:10,borderWidth:1,borderColor:'#f5f5f5'}} onPress={()=>{this.onTag(index)}}>
                                                <Text style={{opacity:0.55,fontSize:12}}>{name}</Text>
                                            </TouchableOpacity>
                                    })}
                                </View>
                                <View style={{flexDirection:'row',justifyContent:'space-around',marginTop:10}}>
                                    {data2.map((name,index)=>{
                                        return             (this.state.choose[index+5]==true)?
                                            <TouchableOpacity style={{padding:4,paddingLeft:12,paddingRight:12,borderRadius:10,borderWidth:1,borderColor:'#71d9d1',backgroundColor:"#71d9d1"}} onPress={()=>{this.onTag(index+5)}}>
                                                <Text style={{fontSize:12,color:"white"}}>{name}</Text>
                                            </TouchableOpacity>:
                                            <TouchableOpacity style={{padding:4,paddingLeft:12,paddingRight:12,borderRadius:10,borderWidth:1,borderColor:'#f5f5f5'}} onPress={()=>{this.onTag(index+5)}}>
                                                <Text style={{opacity:0.55,fontSize:12}}>{name}</Text>
                                            </TouchableOpacity>
                                    })}
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:20}}>
                            <Text style={{opacity:0.8,fontSize:16,marginTop:10}}>一键上架</Text>
                            <Switch  onTintColor="#71d9d1" value={this.state.addstore} onValueChange={()=>{this.onAddStore()}}></Switch>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'flex-start',marginTop:20}}>
                            <Text style={{opacity:0.8,fontSize:16,marginTop:10}}>设置价格</Text>
                            <Text style={{marginTop:13, marginLeft:15}}>￥</Text>
                            <View style={{flexDirection:"row",width:width/6,borderRadius:5,borderWidth:1,borderColor:'#f5f5f5',height:40,alignItems:'center',marginBottom:250}}>
                                <TextInput style={{paddingLeft:0,width:width/6}} maxLength={4} placeholder="0"
                                           onChangeText={(price) => this.setState({price})}></TextInput>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={{bottom:0,width:width,backgroundColor:'#fff',height:(isIphoneX)?100:60,position:'absolute',flexDirection:'row',alignItems:(isIphoneX)?"flex-start":'center',justifyContent:'space-around'}}>
                    <TouchableOpacity style={{borderWidth:0,backgroundColor:'#71d9d1',padding:10,borderRadius:30,paddingLeft:50,paddingRight:50,marginTop:(isIphoneX)?10:0,}}
                    onPress={()=>{this.onNextStep()}}>
                        <Text style={{fontSize:16,color:"white"}}>下一步</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

}