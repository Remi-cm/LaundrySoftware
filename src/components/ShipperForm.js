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
    Col, message
} from 'antd';
import Style from './styles/formStyle.module.css'
import { StylesProvider } from '@material-ui/core';

const { Option } = Select;
const label = {
    marginTop: '50px',
    marginBottom: '10px',
    color: '#212121',
    fontSize: '0.9em'
  };

  const input = {
      marginBottom: '10px', marginTop: '3px'
  }
class ShipperForm extends Component {
    state = {
        name: this.props.name,
        email: this.props.email,
        phone: this.props.phone,
        code: this.props.code,
        cni: this.props.cni,
        address: this.props.address,
        buttonLoading: false,
    }

    handleFormSubmit = (event, requestType, shipperID) => {
        event.preventDefault();
        const agencyID = this.props.agency.id;
        const name = event.target.elements.name.value;
        const phone = '+' + this.state.code + event.target.elements.phone.value;
        const email = event.target.elements.email.value;
        const address = event.target.elements.address.value;
        const cni = event.target.elements.cni.value;
        this.setState({buttonLoading: true});
        
        console.log(name, phone, email, address, cni, agencyID);
        switch (requestType) {
            case "post":
                return axios.post('http://127.0.0.1:8000/api/shipper/',
                {
                    agent: agencyID,
                    name: name,
                    email: email,
                    phone: phone,
                    address: address,
                    cni_number: cni,
                },
                {
                    headers: { "Authorization": "Bearer " + this.props.token }
                })
                .then(res => {
                    message.success("\'"+name+"\' was successfully added as a shipper");
                    console.log(res.data);
                    this.setState({ buttonLoading: false });
                    //this.setState({ clientCreated: res.data });
                    this.props.reload();
                    this.props.close();

                })
                .catch(err => {console.error(err.response ? err.response.data : ''); this.setState({addLoading: false});});
            
                case "put":
                    return axios.put('http://127.0.0.1:8000/api/shipper/'+shipperID+'/',
                {
                    name: name,
                    email: email,
                    phone: phone,
                    address: address,
                    cni_number: cni
                },
                {
                    headers: { "Authorization": "Bearer " + this.props.token }
                })
                .then(res => {
                    message.success("M. "+name+"\'s informations have been successfully updated");
                    console.log(res.data);
                    this.setState({ buttonLoading: false });
                    this.props.close();
                    this.props.reload();

                })
                .catch(err => {
                    this.setState({ buttonLoading: false });
                    console.error(err.response ? err.response.data : '');
                });
        }
     }
    render() {
        
        return (
            <div>
                <Form onSubmit={(event) => this.handleFormSubmit(event, this.props.requestType, this.props.id)} style={{ padding: '10px 0px 10px 5px' }}>
                    <div className={Style.label}>
                        <label for="name" style={label}>Name:</label>
                        <Input name="name" placeholder="Shipper's Name" addonBefore={<Icon type="meh" twoToneColor="#9e9e9e" theme="twoTone"/>} style={input} id="name" type="text" defaultValue={this.state.name} allowClear/>
                    </div>
                    <div class="input">
                        <label for="email" style={label}>Email:</label>
                        <Input name="email" placeholder="Email address" addonBefore={<Icon type="mail" twoToneColor="#9e9e9e" theme="twoTone"/>} style={input} id="email" type="text" defaultValue={this.state.email} allowClear/>
                    </div>
                    <div class="input">
                        <label for="cni" style={label}>NIC Number:</label>
                        <Input name="cni" placeholder="National Identity Card Number" addonBefore={<Icon type="idcard" twoToneColor="#9e9e9e" theme="twoTone"/>} style={input} id="cni" type="text" defaultValue={this.state.cni} allowClear/>
                    </div>
                    <div class="input">
                        <label for="address" style={label}>Address:</label>
                        <Input name="address" placeholder="Address of residence" addonBefore={<Icon type="home" twoToneColor="#9e9e9e" theme="twoTone" />} style={input} id="address" type="text" defaultValue={this.state.address} allowClear/>
                    </div>
                    <div className="gutter-box">
                    <label for="phone" style={label}>Phone:</label>
<br />                          
                                <Input allowClear style={input}
                                    addonBefore={
                                        <Select
                                    labelInValue
                                    defaultValue={{ key: this.state.code }}
                                    onChange={this.handleCodeChange}
                                    name="code"
                                    >
                                    <Option value="237">+237</Option>
                                    <Option value="234">+234</Option>
                                    <Option value="225">+225</Option>
                                </Select>
                                    }
                                    id="phone"
                                    name="phone"
                                    placeholder="Phone number (Whatsapp if possible)"
                                    defaultValue={this.state.phone} onChange = {this.handleInputChange} />
                            </div>
                            
                            <div className="gutter-box" >
                            <Button type="primary" htmlType="submit" loading={this.state.buttonLoading} style={{  marginTop: '15px', float: 'center'}}>
                                {this.props.btnText}
                            </Button>
                            </div>
                    
                </Form>
            </div>
        )
    }
}

export default ShipperForm;
