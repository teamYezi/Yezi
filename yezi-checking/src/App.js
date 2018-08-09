
import 'antd/dist/antd.css'
import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const width=window.screen.width;
const height=window.screen.height;


class App extends Component {
    state = {
        collapsed: false,
        currentContent:0
    };

    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({ collapsed });
    }

    changeContent(id){
        this.setState({currentContent:id})
        console.log("this.state",this.state.currentContent)
    }

  render() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
            >
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1" onClick={()=>{this.changeContent(0)}}>
                        <Icon type="pie-chart" />
                        <span>已审核</span>
                    </Menu.Item>
                    <Menu.Item key="2" onClick={()=>{this.changeContent(1)}}>
                        <Icon type="desktop" />
                        <span>已驳回</span>
                    </Menu.Item>
                    <SubMenu
                        onClick={()=>{this.changeContent(2)}}
                        key="sub1"
                        title={<span><Icon type="user" /><span>待审核</span></span>}
                    >
                        <Menu.Item key="3">Tom</Menu.Item>
                        <Menu.Item key="4">Bill</Menu.Item>
                        <Menu.Item key="5">Alex</Menu.Item>
                    </SubMenu>
                    <SubMenu
                        onClick={()=>{this.changeContent(3)}}
                        key="sub2"
                        title={<span><Icon type="team" /><span>维权中</span></span>}
                    >
                        <Menu.Item key="6">No.1</Menu.Item>
                        <Menu.Item key="8">No.2</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="9" onClick={()=>{this.changeContent(4)}}>
                        <Icon type="file" />
                        <span>设置</span>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                {(this.state.currentContent==2)?<Content style={{ margin: '0 16px' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: height-100 }}>
                        {this.state.currentContent}
                    </div>
                </Content>:
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
