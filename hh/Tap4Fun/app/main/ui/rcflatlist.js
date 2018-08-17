import React,{Component} from 'react'
import {FlatList,Text,View,Dimensions,Image} from 'react-native'

const {width, height} = Dimensions.get('window');

export class RcFlatlist extends Component{


    _RcItem=((item)=>{
        // console.log("item===>",item)
        item=item.item
        let {ProductName}=item
        let {Author}=item
        let {id}=item
        let {time}=item
        let {star}=item
        let {src}=item
        // let isStar=this.isRCisStar(id)
        return  <View>
            <View style={{marginLeft:40,width:width-80,flexDirection:'row',justifyContent:"space-between",marginTop:10}}>
                <View style={{flexDirection:'row'}}>
                    <Image style={{width:40,height:40,borderRadius:20}} source={require('../../assert/img/head.jpg')}></Image>
                    <View style={{justifyContent:'space-around'}}>
                        <Text style={{marginLeft:10,fontWeight:'bold'}}>{ProductName}</Text>
                        <Text style={{marginLeft:10,fontSize:12,opacity:0.6}}>{Author}</Text>
                    </View>
                </View>
                <Text style={{marginTop:10,fontSize:12,opacity:0.4}}>{time}</Text>
            </View>
            <View>
                {/*<Image style={{width:20,height:20,position:'relative',top:40}} source={require('../../assert/img/isstar.png')}></Image>*/}
                <Image style={{width:width,height:width*3/4,marginTop:15,marginBottom:20}} source={require('../../assert/img/showimg.jpg')}></Image>
            </View>
        </View>
    })
    _separator=(()=>{
        return <View style={{width:width,height:1,backgroundColor:'#000',opacity:0.1}}></View>
    })

    render(){
        let RcData=[];
        for(let i=0;i<10;i++){
            RcData.push({id:i,ProductName:"旅行的意义·叙旧美宿",Author:"张尼",time:"19小时前",src:'aaa',star:true})
        }
        return(
            <FlatList
                ref={(newList)=>this._newList=newList}
                initialNumToRender={2}
                initialScrollIndex={0}
                renderItem={this._RcItem}
                ItemSeparatorComponent={this._separator}
                data={RcData}
                style={{}}
            >

            </FlatList>
        )
    }

}
