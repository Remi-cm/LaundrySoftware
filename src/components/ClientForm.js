import React, { Component } from 'react'
import axios from 'axios'
import {
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    AutoComplete,
    Icon,
    Row,
    Col,
    message
} from 'antd';

const { Option } = Select;
const towns = ['Yaoundé', 'Douala', 'Buea', 'Bamenda', 'Bertoua', 'Mfou', 'Baffoussam', 'Ebolowa', 'Maroua', 'Limbé', 'Garoua'];

export default class ClientForm extends Component {
    state = {
        sex: this.props.sex,
        country: this.props.country,
        code: this.props.code,
        addLoading: false,
        avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/pressing-18e11.appspot.com/o/avatarPics%2Favatar_man.jpg?alt=media&token=3ee09a5b-7228-4c28-b3b9-ea214c499552',
        //clientCreated: [],
        name: this.props.name,
        email: this.props.email,
        phone: this.props.phone.substr(4),
        address: this.props.address,
        town: this.props.town,
        password: this.props.password,
        passwordOff: this.props.passwordOff
    }
    
    handleInputChange = e => {
        console.log(e.target.value, e.target.name);
        this.setState({ [e.target.name] : e.target.value})
    }
    handleCodeChange = (value) => {this.setState({ code: value['key'] });}
    handleCountryChange = (value) => {this.setState({ country: value['key'] });}
    handleSexChange = (value) => {this.setState({ sex: value['key'] });}

    handleFormSubmit = (event, requestType, clientID) => {
        event.preventDefault();
        const name = event.target.elements.name.value;
        const phone = '+' + this.state.code + event.target.elements.phone.value;
        const email = event.target.elements.email.value;
        const address = event.target.elements.address.value;
        const sex = this.state.sex;
        const town = event.target.elements.town.value;
        const country = this.state.country;
        const password = event.target.elements.password.value;
        var avatar = 'https://firebasestorage.googleapis.com/v0/b/pressing-18e11.appspot.com/o/avatarPics%2Favatar_man.jpg?alt=media&token=3ee09a5b-7228-4c28-b3b9-ea214c499552';
        this.setState({addLoading: true});
        if (sex === 'Female'){
            avatar = "https://firebasestorage.googleapis.com/v0/b/pressing-18e11.appspot.com/o/avatarPics%2FwomanAvatar2.jpg?alt=media&token=31f94ce1-2b4c-4f5c-9213-f264e36a0dfb";
            this.setState({avatarUrl: "https://firebasestorage.googleapis.com/v0/b/pressing-18e11.appspot.com/o/avatarPics%2FwomanAvatar2.jpg?alt=media&token=31f94ce1-2b4c-4f5c-9213-f264e36a0dfb"});}

        else if (sex === 'Other'){
            this.setState({avatarUrl: "https://firebasestorage.googleapis.com/v0/b/pressing-18e11.appspot.com/o/avatarPics%2Favatar.jpg?alt=media&token=2b4ec709-474d-4b9b-83b6-9d17b6fa0f70"});}
        console.log(name, phone, email, address, town, country, sex, password, this.state.avatarUrl);
        switch (requestType) {
            case "post":
                return axios.post('http://127.0.0.1:8000/api/clients/',
                {
                    name: name,
                    email: email,
                    password: password,
                    phone: phone,
                    address: address,
                    sex: sex,
                    avatarUrl: avatar,
                    town: town,
                    country: country,
                    gpsLat: 3.844119,
                    gpsLng: 11.501346,
                    is_client: 1,
                },
                {
                    headers: { "Authorization": "Bearer " + this.props.token }
                })
                .then(res => {
                    console.log(res.data);
                    this.setState({ addLoading: false });
                    message.success("Client "+name+" was successfully registered to the system");
                    //this.setState({ clientCreated: res.data });
                    this.props.reload();

                })
                .catch(err => {console.error(err.response.data); this.setState({addLoading: false}); message.error("Something went wrong");});
            
                case "put":
                    return axios.put('http://127.0.0.1:8000/api/clients/'+this.props.id+'/',
                {
                    name: name,
                    email: email,
                    password: password,
                    phone: phone,
                    address: address,
                    sex: sex,
                    //avatarUrl: this.state.avatarUrl,
                    town: town,
                    country: country,
                    //gpsLat: 3.844119,
                    //gpsLng: 11.501346,
                    //is_client: 1,
                },
                {
                    headers: { "Authorization": "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTgwMzMwODUyLCJqdGkiOiI2ZDRhMGZiZjJjMWM0ZjRiOTE1MDFhYWFiMmU3NmM1MSIsInVzZXJfaWQiOjEzfQ.zhlIX5N-sJE9cENY3nQ_vmSrRkLCdJUvNGsFm5K5-vQ" }
                })
                .then(res => {
                    console.log(res.data);
                    this.setState({ addLoading: false });
                    
                    //this.setState({ clientCreated: res.data });
                    this.props.reload();

                })
                .catch(err => {
                    
                    this.setState({ addLoading: false });
                    console.error(err.response ? err.response.data : '');
                });
        }
     }
    
    render() {
        return (
            <div>
                <Form onSubmit={(event) => this.handleFormSubmit(event, this.props.requestType, this.props.clientID)}>
                    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
                        <Col className="gutter-row" span={8}>
                            <div className="gutter-box">
                                Name:
                             <Input name="name" placeholder="Client's name" prefix={<Icon type="user"/>} allowClear value={this.state.name} onChange = {this.handleInputChange}/>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={8}>
                        <div className="gutter-box">
                            Email:
                             <Input name="email" placeholder="Email address" prefix={<Icon type="mail" theme="twoTone" twoToneColor="#9e9e9e"/>} value={this.state.email} onChange = {this.handleInputChange} allowClear />
                            </div>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <div className="gutter-box">
                            Password:
                             <Input.Password name="password" disabled={false} type="password" visibilityToggle={true} placeholder="Password" prefix={<Icon twoToneColor="#9e9e9e" type="lock" theme="twoTone"/>} />
                            </div>
                        </Col>


                    </Row>
                    <br/>
                    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
                        <Col span={8}>
                            <div>
                            Country:
<br />
                                <Select
                                    prefix={<Icon type="global" />}
                                    labelInValue
                                    defaultValue={{ key: this.props.country }}
                                    onChange={this.handleCountryChange}
                                    name="country"
                                >
                                    <Option value="Cameroon">Cameroon</Option>
                                    <Option value="Ivory Coast">Ivory Coast</Option>
                                    <Option value="Nigeria">Nigeria</Option>
                                </Select>
                               
                            </div>
                        </Col>
                        <Col span={8}>
                            <div>
                            Town:
                            <AutoComplete
                                dataSource={towns} defaultValue={this.state.town}
                                filterOption={ (inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                            >
                                <Input name="town" placeholder="Town"  onChange = {this.handleInputChange} prefix={<Icon type="shop" theme="twoTone" twoToneColor="#9e9e9e"/>} allowClear />
                            </AutoComplete>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div>
                            Address:
                    <Input name="address" placeholder="Address" value={this.state.address} onChange = {this.handleInputChange} prefix={<Icon twoToneColor="#9e9e9e" type="home" theme="twoTone" twoToneColor="#9e9e9e"/>} allowClear />
                                
                            </div>
                        </Col>
                        
                        


                    </Row>
                    <br/>
                    <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
                    <Col className="gutter-row" span={8}>
                            <div className="gutter-box">
                            Sex:<br/>
                            <Select
                                    labelInValue
                                    prefix={<Icon type="female" />}
                                    defaultValue={{ key: this.state.sex }}
                                    onChange={this.handleSexChange}
                                    name = "sex">
                                    <Option value="Male"><Icon type="man" />  Male</Option>
                                    <Option value="Female"><Icon type="woman" />  Female</Option>
                                    <Option value="Other"><Icon type="bug" />  Other</Option>
                                </Select>
                            </div>
                        </Col>
                        <Col span={8}>
                        <div className="gutter-box">
                            Phone:
                                <Input allowClear
                                addonBefore={
                                    <Select
                                    labelInValue
                                    defaultValue={{ key: this.props.code }}
                                    style={{ width: 70, }}
                                    onChange={this.handleCodeChange}
                                    name="code"
                                >
                                    <Option value="237">+237</Option>
                                    <Option value="234">+234</Option>
                                    <Option value="225">+225</Option>
                                </Select>
                                }
                                    name="phone"
                                    placeholder="Phone number"
                                    value={this.state.phone} onChange = {this.handleInputChange}
                                    prefix={<Icon type="phone" />} />
                            </div></Col>
                            <Col span={8}>
                            <div className="gutter-box" style={{ float: 'right', marginTop: '10px', marginBottom: '25px' }}>
                            <Button type="primary" htmlType="submit" loading={this.state.addLoading}>
                                {this.props.btnText}
                            </Button>
                            </div>
                            </Col>
                    </Row>
                    
                    <br/>


                </Form><br/>
            </div>
        )
    }
}
