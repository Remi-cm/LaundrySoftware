import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon, Button, Avatar } from 'antd'
import AvatarMan from '../assets/images/avatar2.jpg'
import { useAuth } from "../context/auth"

const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout


const CustomLayout = (props) => {

  function logOut() {
    localStorage.removeItem("token");

  }
    return (
        <Layout>
          <Sider width={200} style={{ background: '#fff', overflow: 'auto', position: 'fixed', left: 0, height:'100vh'  }} >
          
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <center><Avatar src={AvatarMan} size={82} className="logo" style={{marginTop: "10px", marginBottom: "5px"}}/></center>
          <br/><div style={{color: "white", fontSize: "1em", fontWeight: "bold", marginTop: "5px", marginBottom: "10px"}}><center>Admin</center></div>
          <br/><br/>
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="skin" />
                Laundries
              </span>
            }
          >
            <Menu.Item key="1">All Laundries</Menu.Item>
            <Menu.Item key="2">Pending Laundries</Menu.Item>
            <Menu.Item key="3">Complete Laundries</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="laptop" />
                Operations
              </span>
            }
          >
            <Menu.Item key="5">Get orders</Menu.Item>
            <Menu.Item key="6">Register Admin</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub3"
            title={
              <span>
                <Icon type="setting" />
                Settings
              </span>
            }
          >
            <Menu.Item key="9">Admin Profile</Menu.Item>
            <Menu.Item key="12">Log Out</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    
    <Layout style={{ marginLeft: 200 }}>
    <Header className="header" style={{ padding: 0 }}>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        style={{ lineHeight: '64px', }}
      >   
        <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
        <Menu.Item key="2"><Link to="/clients">clients</Link></Menu.Item>
        <Menu.Item key="3"><Link to="/shippers">shippers</Link></Menu.Item>
        <Menu.Item key="4"><Link to="/clothes">clothes</Link></Menu.Item>
        <Link to="/login"><Button style={{ float: 'right', marginTop: '14px' }} onClick={logOut}>Logout</Button></Link>
        
      </Menu>
    </Header>
      <Layout style={{ padding: '0 0px 0px', background: '#fcfcfc' }}>
        <Content
          style={{
            background: '#fff',
            border: '1px solid #f7faff',
            borderRadius: '15px',
            paddingLeft: 40,
            paddingRight: 40,
            paddingBottom: 10,
            paddingTop: 20,
            margin: 0,
            minHeight: '100vh',
          }}
        >
          {props.children}
        </Content>
        <Footer style={{ textAlign: 'center' }}>Dongmo Pressing ©2020 Created by Remi D.</Footer>
      </Layout>
    </Layout>
  </Layout>
    )
}


export default CustomLayout;
  
