import React,{Component} from 'react'
import {FlatList,Text,TextInput,View,Dimensions,Image,TouchableOpacity,AsyncStorage,ScrollView,Modal,ImageBackground} from 'react-native'
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ImageViewer from 'react-native-image-zoom-viewer'

import {addcommentSaga, commentsSaga, getmainpageSaga, imgdetailSage, starSage} from "../saga";
import {isIphoneX, showTime} from "../../common/common";
import {navBack, navToRoute} from "../../nav";
import {add2cartSaga, otherpaySaga, storepaySaga} from "../../store/saga";
import {showToast} from "../../common/util";

const {width, height} = Dimensions.get('window');

export class ImageDetail extends Component{
    constructor(){
        super();
        this.state={
            data:null,
            isLogin:null,
            phone:null,
            visible:false,
            isStar:false,
            seeAll:false,
            comments:[],
            cmt:"",
            modalvisible:false,
            balance:false,
            orderid:null
        }
    }

    componentDidMount(){
        console.log('this.props',this.props.navigation.state.params);
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(result[0][1]!=null){
                const succ=()=>{
                    this.setState({data:JSON.parse(this.props.mainpage.imgdetail.data),phone:result[0][1]})
                }
                imgdetailSage.getdetail(this.props.navigation.state.params.id,this.props.navigation.state.params.phone,succ)
            }else {
                const succ=()=>{
                    this.setState({data:JSON.parse(this.props.mainpage.imgdetail.data)})
                };
                imgdetailSage.getdetail(this.props.navigation.state.params.id,'NuLl',succ)
            }
        })
    }


    AddToCart(){
        const succ=()=>{
            console.log("======",this.props.add2cart)
            let result=this.props.add2cart.data;
            if(result==1){
                let data=this.state.data;
                data.status=4
                const success=()=>{
                    console.log("789987",this.state)
                    showToast("加入成功")
                }
                this.setState({data:data},success)
            }else if(result==2){
                showToast("已加入购物车")
            }else if(result==0) {
                showToast("该商品未上架")
            }else {
                showToast("已购买")
            }

        }
        add2cartSaga.add2cart(this.props.navigation.state.params.id,this.props.navigation.state.params.phone,succ)
    }

    onStar(id){
        let params=this.props.navigation.state.params
        let isstar=this.state.isStar;
        console.log("params",params)
        if(params.star==null){
            starSage.star(id,this.state.phone)
            this.setState({isStar:!isstar})
        }else {
            params.star(params.imgID,params.likesNum,params.star2,params.id)
            this.setState({isStar:!isstar});}


    }

    _ModalItem=(item)=>{
        item=item.item;
        let {image_id,image_name,image_price,image_url,i}=item
        return<View style={{width:width/2-30,flexDirection:'row',height:100}}>
            <View   style={{shadowColor: "#cacaca",width:50,height:50,
                marginRight:4,
                marginLeft:10,
                shadowOffset: { width: 2,height:2},
                shadowOpacity: 0.5,
                shadowRadius:5,
                marginBottom:4}}>
                <Image style={{width:50,height:50,borderRadius:5}} source={{url:image_url}}></Image>

            </View>
            <View style={{marginLeft:8,marginTop:5}}>
                <Text style={{fontSize:13,opacity:0.8}}>{image_name}</Text>
                <Text style={{fontSize:12,opacity:0.55,marginTop:0}}>作品ID:{image_id}</Text>
                <Text style={{fontSize:13,opacity:0.8,marginTop:5}}>￥{image_price}</Text>
            </View>
        </View>
    }

    onSeeAll(){
        const succ=()=>{
            console.log("product manager go die",this.props)
            this.setState({
                seeAll:true,
                comments:JSON.parse(this.props.comments.data)
            })
        }
        commentsSaga.comments(this.state.data.imgID,succ)
    }

    onCMT(){
        this._inputtext.clear();
        const succ=()=>{
            showToast("评论成功")
        }
        addcommentSaga.addcomment(this.state.data.imgID,this.state.phone,this.state.cmt,succ)
    }

    onPay(imgID){
        const succ=()=>{
            console.log("aaaaaa",this.props)
            this.setState({orderid:this.props.storepay.data})
        }
        storepaySaga.storepay(this.state.phone,imgID,succ)
        this.setState({modalvisible:true})
    }
    nowPay(){

        const success=()=>{
            let result=this.props.otherpay.data
            if(result==1){
                const succ=()=>{
                    navToRoute("SuccPay",{url:this.state.selected_url})
                }
                this.setState({modalvisible:false},succ)
            }else {
                const succ=()=>{
                    navToRoute("FailPay")
                }
                this.setState({modalvisible:false},succ)
            }

        }
        otherpaySaga.otherpay(this.state.orderid,success)
    }


    onYuEPay(){
        let balance=this.state.balance;
        this.setState({balance:!balance})
    }
    render(){

        console.log("this.state.data",this.state.data)
        let data={}
        let comments=0
        if(this.state.data!=null){data=this.state.data,comments=data.comments.length}
        const images = [{
            // Simplest usage.
            url: data.imgURL,
            // You can pass props to <Image />.

        }];
        let ModalData=[]
        ModalData.push({i:0,image_id:data.imgID,image_name:data.imgName,image_price:data.price,image_url:data.imgURL})
        return(
            <View style={{width:width,height:height,backgroundColor:"white"}}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalvisible}
                >
                    <View style={{justifyContent:'flex-end',alignItems:'center',width:width,height:height,backgroundColor:'rgba(0, 0, 0, 0.6)'}}>
                        <View style={{width:width,height:height*4/7,backgroundColor:"#fff",justifyContent:"flex-start"}}>
                            <View style={{width:width-20,marginLeft:20,alignItems:"flex-end"}}>
                                <TouchableOpacity onPress={()=>{this.setState({modalvisible:false})}} style={{width:60,alignItems:"flex-end",height:40,justifyContent:"center"}}>
                                    <Image style={{width:15,height:15,marginRight:20,zIndex:1000}} source={require('../../assert/img/cancel.png')}></Image>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Text style={{textAlign:'center',opacity:0.55,marginTop:-25}}>订单支付</Text>
                                <View style={{width:width-50,marginLeft:25,height:1,backgroundColor:"#dddddd",marginTop:10}}></View>
                                <Text style={{marginTop:15,marginLeft:20,opacity:0.8}}>订单号：{this.state.orderid}</Text>
                            </View>
                            <View style={{height:100}}><FlatList
                                style={{marginLeft:20,marginTop:20,height:80}}
                                data={ModalData}
                                renderItem={this._ModalItem}
                                horizontal={true}
                            >

                            </FlatList></View>

                            <View style={{flexDirection:'row',justifyContent:'center',marginTop:-height/130,alignItems:"flex-end"}}>
                                <Text style={{opacity:0.8,marginBottom:15,fontSize:15}}>￥</Text>
                                <Text style={{fontSize:height/20,fontWeight:'bold',opacity:0.8,marginTop:-height/20,marginLeft:5}}>{data.price}</Text>
                            </View>
                            <View style={{width:width-50,marginLeft:25,height:1,backgroundColor:"#dddddd",marginTop:height/40}}></View>
                            <View style={{alignItems:'center'}}>
                                <View style={{flexDirection:'row', marginTop:height/30,alignItems:"center"}}>
                                    <Image style={{width:height/30, height:height/30, marginRight:10}} source={require('../../assert/img/wechatpay.png')}></Image>
                                    <Text style={{fontSize:15}}>微信支付</Text>

                                    <View style={{width:14,height:14,borderWidth:1,borderColor:"#dddddd", borderRadius:7, marginLeft:100}}></View>

                                </View>
                                <View style={{flexDirection:'row', marginTop:height/50,alignItems:"center"}}>
                                    <Image style={{width:height/32, height:height/40, marginRight:10, marginLeft:1}} source={require('../../assert/img/yuepay.png')} resizeMode='stretch'></Image>
                                    <Text style={{fontSize:15, marginLeft:1}}>余额支付</Text>
                                    {(!this.state.balance)?
                                        <TouchableOpacity onPress={()=>{this.onYuEPay()}}>
                                            <View style={{width:14,height:14,borderWidth:1,borderColor:"#71d9d1", borderRadius:7, marginLeft:100}}></View>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={()=>{this.onYuEPay()}}>
                                            <View style={{width:14,height:14,borderWidth:1,borderColor:"#71d9d1", borderRadius:7, marginLeft:100,backgroundColor:"#71d9d1"}}></View>
                                        </TouchableOpacity>
                                    }

                                </View>

                            </View>
                            <View style={{height:(isIphoneX)?100:60,alignItems:'center',bottom:0,position:'absolute',justifyContent:'center',width:width}}>
                                {(!this.state.balance)?
                                    <TouchableOpacity style={{padding:10,paddingLeft:40,paddingRight:40,backgroundColor:'#dddddd',borderRadius:20,borderColor:"#dddddd",borderWidth:1}}
                                                      onPress={()=>{}}>
                                        <Text style={{color:'#fff',fontSize:17}}>立即支付</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={{padding:10,paddingLeft:40,paddingRight:40,backgroundColor:'#71d9d1',borderRadius:20}}
                                                      onPress={()=>{this.nowPay()}}>
                                        <Text style={{color:'white',fontSize:17}}>立即支付</Text>
                                    </TouchableOpacity>
                                }

                            </View>
                        </View>
                    </View>
                </Modal>
                <ParallaxScrollView
                    backgroundColor="white"
                    contentBackgroundColor="white"
                    stickyHeaderHeight={80}
                    parallaxHeaderHeight={width*0.8}
                    renderStickyHeader={() => (
                        <View style={{flexDirection:'row', height: 80, alignItems: 'center', justifyContent: 'center' ,width:width,backgroundColor:"#fff",marginTop:(isIphoneX)?20:0}}>
                            <Text style={{fontSize:18,fontWeight:'bold',marginTop:10}}>作品详情</Text>
                        </View>
                    )}
                    renderForeground={() => (
                        <TouchableOpacity style={{ height: width*0.8, width:width, alignItems: 'center', justifyContent: 'center' }} onPress={()=>{this.setState({visible:true})}}>

                        </TouchableOpacity>
                    )}
                    renderBackground={() => (
                        <TouchableOpacity style={{ height: width*0.8, width:width, alignItems: 'center', justifyContent: 'center' }} onPress={()=>{console.log("aaaaaaa")}}>
                            <Image style={{width:width,height:width*0.8,flexDirection:'row',justifyContent:'space-between'}} source={{url:data.imgURL}}></Image>
                            <Modal visible={this.state.visible} transparent={true}>
                                <ImageViewer enableSwipeDown={false} imageUrls={images} backgroundColor="#F5F5F5" onClick={()=>{this.setState({visible:false})}}/>
                            </Modal>
                        </TouchableOpacity>
                    )}
                >
                    <View style={{ width:width }}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',width:width-40,marginLeft:20,marginTop:10}}>
                            <View style={{justifyContent:'center'}}>
                                <Text style={{fontSize:18,fontWeight:'bold'}}>{data.imgName}</Text>
                                <Text style={{fontSize:12,opacity:0.8,marginTop:5}}>作品ID:{data.imgID}</Text>
                            </View>
                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <View>
                                    <Text style={{fontSize:12,textAlign:'right'}}>{data.authorName}</Text>
                                    <Text style={{fontSize:12,opacity:0.8,marginTop:5}}>{data.signature}</Text>
                                </View>
                                <Image style={{width:40,height:40,borderRadius:20,marginLeft:10}} source={(data.avatar==null)?require('../../assert/img/avatar.png'):{url:data.avatar}}></Image>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',marginTop:10,marginLeft:20}}>
                            <View style={{borderWidth:1,padding:3,borderRadius:12,paddingLeft:6,paddingRight:6,opacity:0.2}}>
                                <Text style={{fontSize:12}}>单色</Text>
                            </View>
                            <View style={{borderWidth:1,padding:3,borderRadius:12,paddingLeft:6,paddingRight:6,opacity:0.2,marginLeft:10}}>
                                <Text style={{fontSize:12}}>清新</Text>
                            </View>
                            <View style={{borderWidth:1,padding:3,borderRadius:12,paddingLeft:6,paddingRight:6,opacity:0.2,marginLeft:10}}>
                                <Text style={{fontSize:12}}>远方</Text>
                            </View>
                        </View>
                        <View style={{width:width-40,marginLeft:20,marginTop:20}}>
                            <Text style={{fontSize:14,opacity:0.8,lineHeight:20}}>
                                {data.imgDescription}
                            </Text>
                            <Text style={{fontSize:12,opacity:0.8,marginTop:10}}>
                                {showTime(data.pubdate)}
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',width:width-40,marginLeft:20,justifyContent:'space-between',marginTop:20}}>
                            <Text style={{fontSize:20,fontWeight:'bold',color:"#71d9d1"}}>￥{data.price}</Text>
                            <TouchableOpacity onPress={()=>{this.onStar(data.imgID)}} style={{flexDirection:'row',marginTop:8}}>
                                {(this.state.isStar)?
                                    <Image style={{width:18.5,height:16.5,marginRight:5}} source={(data.likedornot==0)?require('../../assert/img/isstar.png'):require('../../assert/img/unstar.png')}></Image>
                                    :
                                    <Image style={{width:18.5,height:16.5,marginRight:5}} source={(data.likedornot==0)?require('../../assert/img/unstar.png'):require('../../assert/img/isstar.png')}></Image>
                                }

                            </TouchableOpacity>
                        </View>
                        <View style={{width:width-40,height:1,backgroundColor:'#000',opacity:0.1,marginLeft:20,marginTop:10}}></View>
                        <View style={{marginTop:20,marginLeft:20}}>
                            <Text style={{fontSize:17,opacity:0.8}}>
                                版权详情
                            </Text>
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'space-between',width:width-40,marginLeft:20,marginTop:20}}>
                            <View>
                                <Text style={{fontSize:12,opacity:0.8}}>作品ID:{data.imgID}</Text>
                                <Text style={{fontSize:12,marginTop:10,opacity:0.8}}>作品格式:{data.image_type}</Text>
                            </View>
                            <View>
                                <Text style={{fontSize:12,opacity:0.8}}>作品大小:{data.image_size}</Text>
                                <Text style={{fontSize:12,marginTop:10,opacity:0.8}}>图片分辨率:{data.image_resolution}</Text>
                            </View>
                        </View>
                        <View style={{width:width-40,height:1,backgroundColor:'#000',opacity:0.1,marginLeft:20,marginTop:20}}></View>
                        <View style={{marginTop:20,marginLeft:20}}>
                            <Text style={{fontSize:17,fontWeight:'bold'}}>
                                评论
                            </Text>
                        </View>
                        {/*<View style={{flexDirection:'row',width:width-40,marginLeft:20,alignItems:'center',marginTop:20}}>*/}
                            {/*<Image style={{width:30,height:30,borderRadius:15}} source={{url:data.comments[0].avatar}}></Image>*/}
                            {/*<View style={{marginLeft:10}}>*/}
                                {/*<View style={{flexDirection:'row'}}>*/}
                                    {/*<Text style={{fontSize:12}}>{data.comments[0].name}</Text>*/}
                                    {/*<Text style={{fontSize:12,opacity:0.8,marginLeft:10}}>{showTime(data.comments[0].time)}</Text>*/}
                                {/*</View>*/}
                                {/*<Text style={{fontSize:12,marginTop:5,opacity:0.8}}>*/}
                                    {/*{data.comments[0].comment}*/}
                                {/*</Text>*/}
                            {/*</View>*/}
                        {/*</View>*/}
                        {/*<View style={{width:width-40,height:1,backgroundColor:'#000',opacity:0.1,marginLeft:20,marginTop:20}}></View>*/}
                        {(comments==0||this.state.seeAll==true)?(comments==0)?null:
                            this.state.comments.map((item)=>{
                                console.log("1111",item)
                                return<View style={{flexDirection:'row',width:width-40,marginLeft:20,alignItems:'center',marginTop:20}}>
                                    <Image style={{width:30,height:30,borderRadius:15}} source={(item.avatar==null)?require('../../assert/img/avatar.png'):{url:item.avatar}}></Image>
                                    <View style={{marginLeft:10}}>
                                        <View style={{flexDirection:'row'}}>
                                            <Text style={{fontSize:12}}>{item.user_name}</Text>
                                            <Text style={{fontSize:12,opacity:0.8,marginLeft:10}}>{showTime(item.time)}</Text>
                                        </View>
                                        <Text style={{fontSize:12,marginTop:5,opacity:0.8}}>
                                            {item.comment}
                                        </Text>
                                    </View>
                                </View>
                            })
                            :
                            data.comments.map((item)=>{
                                console.log("1111",item)
                            return<View style={{flexDirection:'row',width:width-40,marginLeft:20,alignItems:'center',marginTop:20}}>
                            <Image style={{width:30,height:30,borderRadius:15}} source={(item.avatar==null)?require('../../assert/img/avatar.png'):{url:item.avatar}}></Image>
                            <View style={{marginLeft:10}}>
                            <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize:12}}>{item.name}</Text>
                            <Text style={{fontSize:12,opacity:0.8,marginLeft:10}}>{showTime(item.time)}</Text>
                            </View>
                            <Text style={{fontSize:12,marginTop:5,opacity:0.8}}>
                                {item.comment}
                            </Text>
                            </View>
                            </View>
                        })

                           }
                        {(!this.state.seeAll)?(comments==0)?<TouchableOpacity style={{marginTop:20,marginLeft:20}} >
                            <Text style={{opacity:0.8}}>快来发表你的评论吧</Text>
                        </TouchableOpacity>:
                            <TouchableOpacity style={{marginTop:10,marginLeft:20}} onPress={()=>{this.onSeeAll()}}>
                                <Text style={{opacity:0.8}}>查看所有评论({data.number_of_comments})</Text>
                            </TouchableOpacity>:null}

                        <View style={{flexDirection:'row',width:width-40,marginLeft:20,marginTop:20,marginBottom:(isIphoneX)?400:300}}>
                            <Image style={{width:30,height:30,borderRadius:15}} source={(data.avatar==null)?require('../../assert/img/avatar.png'):{url:data.avatar}}></Image>
                            <TextInput
                                ref={(ref) => this._inputtext = ref}
                                returnKeyType="done"
                                onSubmitEditing={()=>{this.onCMT()}}
                                onChangeText={(cmt) => this.setState({cmt})}
                            style={{backgroundColor:'#f5f5f5',width:width-100,borderRadius:20,marginLeft:10,paddingLeft:30}}
                            placeholder="编写评论">

                            </TextInput>
                        </View>
                    </View>
                </ParallaxScrollView>
                <View style={{position:'absolute',left:20,top:(isIphoneX)?56:36,width:100,height:100}}>
                    <TouchableOpacity onPress={()=>{navBack()}} style={{width:100,height:100}}>
                        <Image source={require('../../assert/img/backicon.png')} style={{width:10,height:20}}></Image>
                    </TouchableOpacity>
                </View>
                <View style={{position:'absolute',right:20,top:(isIphoneX)?56:36,width:100,height:100,alignItems:"flex-end"}}>
                    <TouchableOpacity onPress={()=>{navBack()}} style={{width:100,height:100,alignItems:'flex-end'}}>
                        <Image source={require('../../assert/img/share.png')} style={{width:20,height:20}}></Image>
                    </TouchableOpacity>
                </View>
                {(data.status==2||data.status==5||data.status==3)?<View style={{bottom:0,width:width-40,marginLeft:20,backgroundColor:'#ffffff',height:(isIphoneX)?100:60,position:'absolute',flexDirection:'row',alignItems:(isIphoneX)?"flex-start":'center',justifyContent:'space-around'}}>
                        {(data.status==2)? <TouchableOpacity style={{borderWidth:1,borderColor:'#cacaca',backgroundColor:"#cacaca",padding:10,borderRadius:30,paddingLeft:25,paddingRight:25,marginTop:(isIphoneX)?10:0,}}>
                                <Text style={{color:"white",fontSize:16}}>未上架</Text>
                            </TouchableOpacity>
                            :
                            (data.status==5)? <TouchableOpacity style={{borderWidth:1,borderColor:'#cacaca',backgroundColor:"#cacaca",padding:10,borderRadius:30,paddingLeft:25,paddingRight:25,marginTop:(isIphoneX)?10:0,}}>
                                    <Text style={{color:"white",fontSize:16}}>已购买</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={{borderWidth:1,borderColor:'#cacaca',backgroundColor:"#cacaca",padding:10,borderRadius:30,paddingLeft:25,paddingRight:25,marginTop:(isIphoneX)?10:0,}}>
                                    <Text style={{color:"white",fontSize:16}}>无法购买自己作品</Text>
                                </TouchableOpacity>}


                    </View>
                :<View style={{bottom:0,width:width-40,marginLeft:20,backgroundColor:'#ffffff',height:(isIphoneX)?100:60,position:'absolute',flexDirection:'row',alignItems:(isIphoneX)?"flex-start":'center',justifyContent:'space-around'}}>
                        {(data.status==1)? <TouchableOpacity style={{borderWidth:1,borderColor:'#71d9d1',padding:10,borderRadius:30,paddingLeft:25,paddingRight:25,marginTop:(isIphoneX)?10:0,}}
                                                             onPress={()=>{this.AddToCart()}}>
                                <Text style={{color:"#5ec6be",fontSize:16}}>加入购物车</Text>
                            </TouchableOpacity>:
                            <TouchableOpacity style={{borderWidth:1,borderColor:'#cacaca',backgroundColor:"#cacaca",padding:10,borderRadius:30,paddingLeft:25,paddingRight:25,marginTop:(isIphoneX)?10:0,}}>
                                <Text style={{color:"white",fontSize:16}}>已加入购物车</Text>
                            </TouchableOpacity>}

                        <TouchableOpacity style={{backgroundColor:'#71d9d1',padding:10,borderRadius:30,paddingLeft:35,paddingRight:35,marginTop:(isIphoneX)?10:0,}}
                                          onPress={()=>{this.onPay(data.imgID)}}>
                            <Text style={{color:'white',fontSize:16}}>立即购买</Text>
                        </TouchableOpacity>
                    </View>
                    }

            </View>

    )
    }

}