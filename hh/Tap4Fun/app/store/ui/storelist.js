import React,{Component} from 'react'
import {FlatList, Text, View, Dimensions, Image, TouchableOpacity, AsyncStorage, PixelRatio,RefreshControl} from 'react-native'
import {isIphoneX} from "../../common/common";
import {navBack, navToRoute} from "../../nav";
import {getState} from "../../store";
import {add2cartSaga, storecateSaga} from "../saga";
import {publishedSaga} from "../../mine/saga";
import {showToast} from "../../common/util";
import {getmainpageSaga} from "../../main/saga";

const {width, height} = Dimensions.get('window');

export class StoreList extends Component{
    constructor(){
        super();
        this.state={
            data:null,
            phone:null,
            refreshing:false,
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
                    publishedSaga.published(result[0][1])
                }
                this.setState({phone:result[0][1]},succ)
            }

        })
        console.log('list====',this.props)
        const succ=()=>{
            let data=getState()
            console.log('statedata====',JSON.parse(data.store.storecate.data))
            this.setState({data:JSON.parse(data.store.storecate.data)})
        }
       storecateSaga.getcate(this.props.cate,succ);
    }


    _onRefresh = () => {
        this.setState({refreshing: true});
        const succ=()=>{
            let data=getState()
            console.log('statedata====',JSON.parse(data.store.storecate.data))
            this.setState({data:JSON.parse(data.store.storecate.data),refreshing:false})
        }
        storecateSaga.getcate(this.props.cate,succ);
    };

    AddToCart(id){
        const succ=()=>{
            let data=getState()
            let result=JSON.parse(data.store.add2cart.data)
            if(result==1){
                showToast("加入成功")
            }else if(result==2){
                showToast("已加入购物车")
            }else if(result==5){
                showToast("不能购买自己作品")
            }else {
                showToast("已购买")
            }

        }
        add2cartSaga.add2cart(id,this.state.phone,succ)
    }


    _Item=((item)=>{
        item=item.item;
        let i=item.i;
        let price=item.price;
        let imgURL=item.imgURL;
        let imgName=item.imgName;
        let imgID=item.imgID;
        let author_name=item.author_name
        return <View>
            <View style={{padding:5,borderRadius:5,borderWidth:1,borderColor:'#E0E0E0',marginLeft:10,marginTop:20,backgroundColor:"#FAFAFA"}}>
                <TouchableOpacity onPress={()=>{navToRoute('ImageDetail',{id:imgID,phone:this.state.phone})}}>
                    <Image source={{url:imgURL}} style={{width:width/2-35,height:width/2-35}}/>
                </TouchableOpacity>
                <Text style={{fontSize:16,marginTop:10}}>{imgName}</Text>
                <Text style={{fontSize:12,opacity:0.8,marginTop:10}}>{author_name}</Text>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10,marginBottom:5}}>
                    <Text style={{fontSize:16,color:'#71d9d1'}}>￥{price}</Text>
                    <TouchableOpacity onPress={()=>{this.AddToCart(imgID)}}>
                        <Image style={{width:20,height:20}} source={require('../../assert/img/addshop.png')}></Image>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    })

    render(){

        let Data=[];
        // let data=JSON.parse(this.props.follow.data)
        // console.log("follow",data)
        let data=this.state.data;
        if(data!=null){
            if(this.props.searchdata!=null){
                data=this.props.searchdata;
                for(let i=0;i<data.length;i++){
                    Data.push({i:i,imgID:data[i].imgID,author_name:data[i].author_name,imgName:data[i].imgName,imgURL:data[i].imgURL,price:data[i].price})
                }
            }else {
                for(let i=0;i<data.length;i++){
                    Data.push({i:i,imgID:data[i].imgID,author_name:data[i].author_name,imgName:data[i].imgName,imgURL:data[i].imgURL,price:data[i].price})
                }
            }

        }
        return(
            <View style={{backgroundColor:'#fff',width:width,height:height,marginLeft:10}}>
                <FlatList
                    renderItem={this._Item}
                    style={{marginBottom:(isIphoneX)?160:120}}
                    numColumns={2}
                    data={Data}
                    refreshControl={
                        <RefreshControl
                            tintColor="#71d9d1"
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                >
                </FlatList>
            </View>
        )
    }
}