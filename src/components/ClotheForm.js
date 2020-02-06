import React, { Component } from 'react'
import axios from 'axios'
import {
    Form, message,
    Input,
    InputNumber,
    Select,
    Button,
    AutoComplete,
    Icon,
    Row,
    Col
} from 'antd';

const label = {
    marginTop: '50px',
    marginBottom: '10px',
    color: '#212121',
    fontSize: '0.9em'
  };

const input = {
    marginBottom: '15px', marginTop: '3px'
}


class ClotheForm extends Component {

    state = {
        name: this.props.name,
        price: this.props.price,
        buttonLoading: false,
    }

    handleFormSubmit = (event, requestType, clotheID) => {
        event.preventDefault();
        const name = event.target.elements.name.value;
        const price = event.target.elements.price.value;
        this.setState({buttonLoading: true});
        
        console.log(name, price);
        switch (requestType) {
            case "post":
                return axios.post('http://127.0.0.1:8000/api/clothe/',
                {
                    name: name,
                    price: price
                },
                {
                    headers: { "Authorization": "Bearer " + this.props.token }
                })
                .then(res => {
                    message.success(name+' sucssesfully added');
                    console.log(res.data);
                    this.setState({ buttonLoading: false });
                    //this.setState({ clientCreated: res.data });
                    this.props.reload();
                    this.props.close();

                })
                .catch(error => {
                    this.setState({buttonLoading: false});
                    if (error.response) {
                      if (error.response.status === 401) {
                        localStorage.removeItem("token");
                        this.setState({ toLogin : true})
                      }
                      else if (error.response.status === 400) {
                        message.error('Invalid data entry');
                      }
                      else if (error.response.status === 500) {
                        message.warning('Clothe already exists');
                      }
                      console.log(error.response.status, error.response.data);
                    }
                  });
                case "put":
                    return axios.put('http://127.0.0.1:8000/api/clothe/'+clotheID+'/',
                {
                    name: name,
                    price: price
                },
                {
                    headers: { "Authorization": "Bearer " + this.props.token }
                })
                .then(res => {
                    message.success(name+' succesfully modified');
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
                    <div>
                        <Input name="name" placeholder="Shipper's Name" addonBefore={<Icon type="skin" twoToneColor="#9e9e9e" theme="twoTone"/>} style={input} id="name" type="text" defaultValue={this.state.name} allowClear/>
                    </div>
                    <div class="input">
                        <Input name="price" placeholder="Clothe Pricing (FCFA XAF)" addonBefore={<Icon type="dollar" twoToneColor="#9e9e9e" theme="twoTone"/>} style={input} id="email" type="text" defaultValue={this.state.price} allowClear/>
                    </div>
                            
                            <div className="gutter-box" >
                            <Button type="primary" htmlType="submit" loading={this.state.buttonLoading} style={{  marginTop: '15px', width: '100%'}}>
                                {this.props.btnText}
                            </Button>
                            </div>
                    
                </Form>
            </div>
        )
    }
}

export default ClotheForm