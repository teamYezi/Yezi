import React,{Component} from "react"
import {View, Image, Text, TextInput, TouchableOpacity, Dimensions, AsyncStorage,FlatList,RefreshControl} from 'react-native'
import {pendingSaga, publishedSaga} from "../saga";
import {getState} from "../../store";

const {width, height} = Dimensions.get('window');

export class PengdingLsit extends Component{
    constructor(){
        super();
        this.state={
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
                    pendingSaga.pending(this.state.phone)
                }
                this.setState({phone:result[0][1]},succ)
            }

        })

    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        const succ=()=>{
            this.setState({refreshing:false})
        }
        pendingSaga.pending(this.state.phone,succ)
    };

    _Item=((item)=>{
        let i=item
        return  <View>
            <Image source={{url:i.item.imgURL}} style={{width:width/3-20,height:width/3-20,borderRadius:5,marginLeft:10,marginTop:20}}/>
        </View>
    })

    render(){
        const state=getState();
        // let {[getmainpageSaga.name]:getinfo}=this.props;
        console.log("getinfo===>",JSON.parse(state.mine.pending.data));
        let data=JSON.parse(state.mine.pending.data);
        let Data=[];
        if(data!=null){
            for(let i=0;i<data.length;i++){
                Data.push({i:i,id:data[i].id,imgURL:data[i].imgURL})
            }
        }
        return(
            <View style={{width:width,height:height}}>
                <FlatList
                    style={{width:width-30,marginLeft:10}}
                    renderItem={this._Item}
                    numColumns={3}
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