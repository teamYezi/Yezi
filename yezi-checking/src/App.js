import fetchJsonp from "fetch-jsonp"

import 'antd/dist/antd.css'
import React, { Component } from 'react';
import { Layout, Menu, Icon ,Button} from 'antd';
import nebulas from 'nebulas';
import nebpayCls from 'nebpay'

const axios = require('axios');
const {  Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const width=window.screen.width;
const height=window.screen.height;
const host="http://172.20.120.194:7001"
const dappAddress="n1jBPSa4Eocwhr8JraquQLYit3FQUjZ6i1j";
const Account =nebulas.Account;
const neb =new nebulas.Neb();
let from=Account.NewAccount().getAddressString();
neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"))
// const host="http://127.0.0.1:7001"
const ax = axios.create({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'Content-type': 'application/x-www-form-urlencoded'
    },
    timeout: 1000 * 20,
    rejectUnauthorized: false,
    responseType: 'json',
    mode: "cors",//可以在这设置跨域

    // httpsAgent: agent,
});


class App extends Component {
    state = {
        waitlist:[],
        collapsed: false,
        currentContent:2,
        item:null
    };

    componentDidMount(){
        ax.get(host+'/manualCheck?type=0')
            .then((response) =>{
                // handle success
                this.setState({waitlist:response.data,item:response.data[0]})
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }

    getList(){
        ax.get(host+'/manualCheck?type=0')
            .then((response) =>{
                // handle success
                this.setState({waitlist:response.data})
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }

    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({ collapsed });
    }

    changeContent(id){
        this.setState({currentContent:id})
        console.log("this.state",this.state.currentContent)
    }

    onPress(item){
        this.setState({item:item})
    }

    onPass(){
        ax.get(host+`/doManualCheck?img_id=${this.state.item.img_id}&type=1`)
            .then((response) =>{
                // handle success
                // window.location.reload(true)
                let nebPay=new nebpayCls();
                let value="0";
                let serialNumber;
                let callFunction="addCopyRight";
                let callArgs=`["${this.state.item.img_url}","${this.state.item.raw_time}","${this.state.item.phone}","${this.state.item.img_id}","${this.state.item.id}","${this.state.item.MD5}"]`
                serialNumber=nebPay.call(dappAddress,value,callFunction,callArgs,{
                    listener:(resp)=>{
                        console.log("交易返回"+JSON.stringify(resp))
                    }
                })
                let intervalQuery=setInterval(()=>{
                    nebPay.queryPayInfo(serialNumber).then((res)=>{
                        console.log("交易结果"+res)
                        let result=JSON.parse(res)
                        if(result==0){
                            alert("版权认证成功")
                            clearInterval(intervalQuery)
                        }
                    }).catch((err)=>{
                        alert(err)
                        clearInterval(intervalQuery)
                    })
                },5000)
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }

    onReject(){
        ax.get(host+`/doManualCheck?img_id=${this.state.item.img_id}&type=-1`)
            .then((response) =>{
                // handle success
                window.location.reload(true)

                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }

  render() {
        console.log("this.state",this.state)
      let data={};
        if(this.state.item!=null){
            data=this.state.item
        }
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
            >
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['6']} mode="inline">
                    <Menu.Item key="1" onClick={()=>{this.changeContent(0)}}>
                        <Icon type="pie-chart" />
                        <span>已审核</span>
                    </Menu.Item>
                    <Menu.Item key="2" onClick={()=>{this.changeContent(1)}}>
                        <Icon type="desktop" />
                        <span>已驳回</span>
                    </Menu.Item>

                    <SubMenu
                        onClick={()=>{this.changeContent(3)}}
                        key="sub2"
                        title={<span><Icon type="team" /><span>维权中</span></span>}
                    >
                        <Menu.Item key="3">No.1</Menu.Item>
                        <Menu.Item key="4">No.2</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="5" onClick={()=>{this.changeContent(4)}}>
                        <Icon type="file" />
                        <span>发布公告</span>
                    </Menu.Item>
                    <SubMenu
                        onClick={()=>{this.changeContent(2)}}
                        key="sub1"
                        title={<span><Icon type="user" /><span>待审核</span></span>}
                    >
                        {this.state.waitlist.map((item,index)=>{
                            return <Menu.Item key={index+6} onClick={()=>{this.onPress(item)}}>{item.img_name}</Menu.Item>
                        })}

                    </SubMenu>
                </Menu>
            </Sider>
            <Layout>
                {(this.state.currentContent==2)?<Content style={{ margin: '0 16px' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: height-100 ,display:'flex',flexDirection:"row",justifyContent:'space-around',alignItems:"center"}}>
                        <div style={{display:'flex',justifyContent:"center",alignItems:'center',flexDirection:"column"}}>
                            <div style={{marginBottom:50}}>作品：</div>
                            <img style={{width:600,height:400}} src={data.img_url}></img>
                            <Button type="primary" style={{marginTop:50,width:100,marginBottom:50}} onClick={()=>{this.onPass()}}>通过</Button>
                        </div>
                        <div style={{display:'flex',justifyContent:"center",alignItems:'center',flexDirection:"column"}}>
                            <div style={{marginBottom:50}}>源文件：</div>
                            <img style={{width:600,height:400}} src={data.raw_url}></img>
                            <Button type="primary" style={{marginTop:50,width:100,marginBottom:50}} onClick={()=>{this.onReject()}}>不通过</Button>
                        </div>
                    </div>
                </Content>:(this.state.currentContent==4)?
                    <Content style={{ margin: '0 16px' }}>



                        <div style={{ padding: 24, background: '#8d6690', minHeight: height-100 }}>

                        </div>



                    </Content>
                    :
                    <Content style={{ margin: '0 16px' }}>
                        <div style={{ padding: 24, background: '#fff', minHeight: height-100 }}>
                            暂未开放
                        </div>
                    </Content>}

                <Footer style={{ textAlign: 'center' }}>
                    YeZi ©2018 Created By Hehuan
                </Footer>
            </Layout>
        </Layout>
    );
  }
}

export default App;
