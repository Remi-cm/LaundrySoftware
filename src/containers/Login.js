import React, { Component } from 'react'
import { Link, Redirect } from "react-router-dom"
import axios from 'axios'
import { Form, Input, Button, Icon, message, Alert, Card, Typography } from 'antd';
import Logo from '../assets/images/logoLaundry2.png'
import Banner from '../assets/images/pressing2.png'


const { Title } = Typography;

const label = {
  marginTop: '50px',
  marginBottom: '10px',
  color: '#212121',
  fontSize: '0.9em'
};

const input = {
  marginBottom: '15px', marginTop: '3px'
}

/*
function Login() {

        function postLogin(event) {
            event.preventDefault();
            axios.post("http://localhost:8000/api/auth/jwt/create", {
              email: userName,
              password: password
            }).then(result => {
              if (result.status === 200) {
                localStorage.setItem("tokens", JSON.stringify(data));
              } else {
              }
            }).catch(e => {
            });
          }
        
          if (isLoggedIn) {
            return <Redirect to="/" />;
          }
          
        return (
            <div>
                <form>
                <input
          type="username"
          value={userName}
          onChange={e => {
            setUserName(e.target.value);
          }}
          placeholder="email"
        />
        <input
          type="password"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
          }}
          placeholder="password"
        />
                    <input type="submit" onClick={postLogin} value="Login"/>
                </form>
            </div>
        )
    }

*/


class Login extends Component {
  state = {
    buttonLoading: false,
    Verified: false,
    alert401: false,
    token: "",
  }

  handleFormSubmit = (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    this.setState({buttonLoading: true});
    
    console.log(email, password);
    axios.post('http://localhost:8000/api/auth/jwt/create',
            {
                email: email,
                password: password
            })
            .then(res => {
              if (res.status === 200){
                console.log(res.data);
                this.setState({ buttonLoading: false, token: res.data.access});
                axios.defaults.headers.common['Authorization'] = res.data.access;
                  window.localStorage.removeItem("token");
                window.localStorage.setItem("token", JSON.stringify(res.data.access));
                 console.log(this.state.Verified);
                message.success('Authentication successful', 4);
                setInterval(()=>{}, 1000)
                this.setState({ Verified: true });
              }


            })
            .catch(err => {console.error(err.response ? err.response.data : ''); this.setState({buttonLoading: false, alert401: true});});
 }

 componentDidMount(){
    if (localStorage.getItem('token')){
      this.setState({ Verified: true });
    }
 }

 render() {
  if (this.state.Verified === true) {
    return <Redirect to={{
      pathname: "/",
    state: {token: this.state.token} }} />
  }
  return (
      <div
      style={{
        background: 'linear-gradient(to right, #f5f5f5, #fafafa, white)',
        width: '100%',
        minHeight: '100vh'
      }}
      >
        <div style={{width: '100%', height: '10%'}}>.</div>
        
        <Card style={{ maxWidth: '30%',float: 'center',backgroundImage: 'linear-gradient(-20deg, #fafafa 0%, white 100%)', marginRight: 'auto',marginLeft: 'auto', marginTop: '10px'}}>
          <center><img src={Logo} width='60'/></center>
          <center><span style={{color: '#757575', fontFamily: 'verdana', textAlign: 'center', fontSize: '1.5em', fontWeight: 'bold', /*fontStyle: 'italic'*/}}>Eva Pressing SARL</span></center>
          <center><span style={{color: '#8c9eff', fontFamily: 'verdana', fontSize: '1.2em', fontWeight: 'bold'}}>Admin login</span></center>
        </Card>

        <Card style={{ maxWidth: '30%', maxHeight: '40%', float: 'center', marginRight: 'auto',marginLeft: 'auto', marginTop: '20px'}} 
        cover={<img alt="example" height="100" src={Banner} />}>
          <Form onSubmit={(event) => this.handleFormSubmit(event)}>
            {
              this.state.alert401 ? 
              <Alert
                message="Wrong credentials. Try again !"
                type="error"
                showIcon
                closable
                style={{marginBottom: '15px'}}
                afterClose={() => this.setState({alert401: false})}
              />
              : <span></span>
            }
              <div>
                  <Input name="email" placeholder="Email address" addonBefore={<Icon type="mail" twoToneColor="#9e9e9e" theme="twoTone"/>} style={input} id="email" type="text" allowClear/>
              </div>
              <div class="input">
                  <Input.Password name="password" placeholder="Password" disabled={false} type="password" visibilityToggle={true} addonBefore={<Icon type="lock" twoToneColor="#9e9e9e" theme="twoTone"/>} style={input} id="password" type="text" allowClear/>
              </div>
                      
                      <div className="gutter-box" >
                      <Button type="primary" htmlType="submit" loading={this.state.buttonLoading} style={{  marginTop: '15px', width: '100%'}}>
                          Sign In
                      </Button>
                      </div>
              
          </Form>
          </Card>
      </div>
  )
}
}



export default Login;