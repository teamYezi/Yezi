import React,{Component} from 'react'
import {FlatList, Text, View, Dimensions, Image, TouchableOpacity, AsyncStorage, PixelRatio,Modal} from 'react-native'
import {navBack, navToRoute} from "../../nav";
import {isIphoneX} from "../../common/common";
import {getState} from "../index";
import {publishedSaga} from "../../mine/saga";
import {otherpaySaga, storecartSaga, storepaySaga} from "../saga";
import {showToast} from "../../common/util";

const {width, height} = Dimensions.get('window');

export class ShoppingCart extends Component{
    constructor(){
        super();
        this.state={
            data:null,
            phone:null,
            total:0,
            isAdd:{},
            sum:0,
            addAll:false,
            modalvisible:false,
            balance:false,
            orderid:null,
            selected_url:[]
        }
    }

    componentDidMount(){


        //获取phoenNum
        let keys=['phone','password'];
        AsyncStorage.multiGet(keys,(errs,result)=>{
            if(errs){
                return
            }else if(result[0][1]!=null&&result[1][1]!=null){
                const succ=()=>{
                    console.log("storecart",JSON.parse(this.props.storecart.data))
                    const success=()=>{
                        let data=this.state.data;
                        if(data!=null){
                            let total=0
                            for(let i=0;i<data.length;i++){
                                total=total+data[i].image_price;
                                }

                                this.setState({
                                    sum:total,
                                    phone:result[0][1]
                                })
                            }
                    };
                    this.setState({data:JSON.parse(this.props.storecart.data),phone:result[0][1]},success)
                }
                storecartSaga.getcart(result[0][1],succ)
            }

        })
    }

    onAdd(id,price){
        const {isAdd,total}=this.state;
        if(isAdd[id]){
            this.setState({
                isAdd:{...isAdd,[id]:false},
                total:total-price,
            })
        }else {
            this.setState({
                isAdd:{...isAdd,[id]:true},
                total:total+price,
            })
        }
    }

    onPay(){
        const succ=()=>{
            console.log("aaaaaa",this.props)
            this.setState({orderid:this.props.storepay.data})
        }
        let data=this.state.data;
        let imgID="";
        let url=[]
        for(let i=0;i<data.length;i++){
            if(this.state.isAdd[i]){
                if(imgID==''){
                    imgID=data[i].image_id
                    url.push(data[i].image_url)
                }else {
                    imgID+=","+data[i].image_id
                    url.push(data[i].image_url)
                }
            }
        }

        storepaySaga.storepay(this.state.phone,imgID,succ)
        this.setState({
            modalvisible:true,
            selected_url:url
        })
    }

    addAll(){
        let data=this.state.data;
        if(data!=null){
            let total=this.state.total
            let isAdd=this.state.isAdd
            if(this.state.sum!=this.state.total){
                for(let i=0;i<data.length;i++){
                    if(!this.state.isAdd[i]){
                        isAdd={...isAdd,[i]:true};
                        total=total+this.state.data[i].image_price;
                    }
                }
                this.setState({
                    isAdd:isAdd,
                    total:total
                })
            }else {
                for(let i=0;i<data.length;i++){
                    if(this.state.isAdd[i]){
                        isAdd={...isAdd,[i]:false};
                        total=total-this.state.data[i].image_price;
                    }
                }
                this.setState({
                    isAdd:isAdd,
                    total:total
                })

            }

        }
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
    _Item=(item)=>{
        item=item.item;
        let {image_id,image_name,image_price,image_url,i}=item
        return<View style={{flexDirection:'row',width:width-40,marginLeft:20,justifyContent:'space-between',marginTop:16}}>
            <View style={{flexDirection:'row'}}>
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    {(this.state.isAdd[i])?
                        <TouchableOpacity onPress={()=>{this.onAdd(i,image_price)}} style={{height:60,justifyContent:'center'}}>
                            <View style={{width:14,height:14,borderWidth:1,borderColor:"#71d9d1",backgroundColor:"#71d9d1",borderRadius:7}}></View>
                        </TouchableOpacity>
                    :
                        <TouchableOpacity onPress={()=>{this.onAdd(i,image_price)}} style={{height:60,justifyContent:'center'}}>
                            <View style={{width:14,height:14,borderWidth:1,borderColor:"#71d9d1",backgroundColor:"white",borderRadius:7}}></View>
                        </TouchableOpacity>
                    }
                </View>
                <TouchableOpacity onPress={()=>{navToRoute('ImageDetail',{id:image_id,phone:this.state.phone})}}
                                  style={{shadowColor: "#cacaca",
                                      marginRight:4,
                                      marginLeft:10,
                                      shadowOffset: { width: 2,height:2},
                                      shadowOpacity: 0.5,
                                      shadowRadius:5,
                                      marginBottom:4}}>
                    <Image style={{width:100,height:100,borderRadius:5}} source={{url:image_url}}></Image>
                </TouchableOpacity>
                <View style={{marginLeft:8,marginTop:5}}>
                    <Text style={{fontSize:17,opacity:0.8}}>{image_name}</Text>
                    <Text style={{fontSize:12,opacity:0.55,marginTop:5}}>作品ID:{image_id}</Text>
                </View>
            </View>
            <Text style={{fontSize:17,fontWeight:'bold',opacity:0.8}}>￥{image_price}</Text>
        </View>
    }
    render(){
        let ModalData=[]
        let Data=[];
        if(this.state.data!=null){
        let data=this.state.data;
            for(let i=0;i<data.length;i++){
                Data.push({i:i,image_id:data[i].image_id,image_name:data[i].image_name,image_price:data[i].image_price,image_url:data[i].image_url})
            }
        }
        if(this.state.data!=null){
            let data=this.state.data;
            for(let i=0;i<data.length;i++){
                if(this.state.isAdd[i]){
                    ModalData.push({i:i,image_id:data[i].image_id,image_name:data[i].image_name,image_price:data[i].image_price,image_url:data[i].image_url})
                }
            }
        }


        return(
            <View style={{backgroundColor:"#fff",width:width,height:height}}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalvisible}
                >
                    <View style={{justifyContent:'flex-end',alignItems:'center',width:width,height:height,backgroundColor:'rgba(0, 0, 0, 0.6)'}}>
                        <View style={{width:width,height:height*4/7,backgroundColor:"#fff",justifyContent:"flex-start"}}>
                            <View style={{width:width-40,marginLeft:20,alignItems:"flex-end"}}>
                                <TouchableOpacity onPress={()=>{this.setState({modalvisible:false})}} style={{width:60,alignItems:"flex-end",height:40,justifyContent:"center"}}>
                                    <Image style={{width:15,height:15}} source={require('../../assert/img/cancel.png')}></Image>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Text style={{textAlign:'center',opacity:0.55,marginTop:-25}}>订单支付</Text>
                                <View style={{width:width-50,marginLeft:25,height:1,backgroundColor:"#dddddd",marginTop:10}}></View>
                                <Text style={{marginTop:15,marginLeft:20,opacity:0.8}}>订单号：{this.state.orderid}</Text>
                            </View>
                            <View style={{height:80}}><FlatList
                                style={{marginLeft:20,marginTop:20,height:80}}
                                data={ModalData}
                                renderItem={this._ModalItem}
                                horizontal={true}
                            >

                            </FlatList></View>

                            <View style={{flexDirection:'row',justifyContent:'center',marginTop:20,alignItems:"flex-end"}}>
                                <Text style={{opacity:0.8,marginBottom:15,fontSize:15}}>￥</Text>
                                <Text style={{fontSize:height/20,fontWeight:'bold',opacity:0.8,marginTop:-height/20,marginLeft:5}}>{this.state.total}</Text>
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
                <View style={{flexDirection:'row',width:width-40,marginLeft:20,alignItems:'center',justifyContent:'center',height:80,marginTop:(isIphoneX)?20:0}}>
                    <View style={{position:'absolute',left:-20,top:0}}>
                        <TouchableOpacity onPress={()=>{navBack()}} style={{marginTop:35,marginLeft:20}}>
                            <Image source={require('../../assert/img/backicon.png')} style={{width:10.5,height:19}}></Image>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:18,fontWeight:"bold",marginTop:10}}>我的购物车</Text>
                </View>
                <FlatList
                    style={{marginTop:-10}}
                data={Data}
                renderItem={this._Item}
                >

                </FlatList>
                <View style={{bottom:0,width:width-40,marginLeft:20,backgroundColor:'#ffffff',height:(isIphoneX)?100:60,position:'absolute',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                    {(this.state.sum==this.state.total)?
                        <TouchableOpacity style={{flexDirection:'row',alignItems:"center"}} onPress={()=>{this.addAll()}}>
                            <View style={{width:14,height:14,borderWidth:1,borderColor:"#71d9d1",backgroundColor:"#71d9d1",borderRadius:7}}></View>
                            <Text style={{marginLeft:10,fontSize:15,opacity:0.55}}>全选</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={{flexDirection:'row',alignItems:"center"}} onPress={()=>{this.addAll()}}>
                            <View style={{width:14,height:14,borderWidth:1,borderColor:"#71d9d1",backgroundColor:"white",borderRadius:7}}></View>
                            <Text style={{marginLeft:10,fontSize:15,opacity:0.55}}>全选</Text>
                        </TouchableOpacity>
                    }

                    <View style={{flexDirection:'row',alignItems:"center"}}>
                        <Text style={{marginRight:10,fontSize:17,opacity:0.55}}>合计:</Text>
                        <Text style={{marginRight:10,fontSize:17,opacity:0.8,fontWeight:'bold'}}>￥{this.state.total}</Text>
                        {(this.state.total==0)?
                            <TouchableOpacity style={{padding:10,paddingLeft:20,paddingRight:20,backgroundColor:'#a5a5a5',borderRadius:20}}>
                                <Text style={{color:'white',fontSize:17}}>结算</Text>
                            </TouchableOpacity>
                        :
                            <TouchableOpacity style={{padding:10,paddingLeft:20,paddingRight:20,backgroundColor:'#71d9d1',borderRadius:20}}
                            onPress={()=>{this.onPay()}}>
                                <Text style={{color:'white',fontSize:17}}>结算</Text>
                            </TouchableOpacity>
                        }

                    </View>
                </View>
            </View>
        )
    }

}