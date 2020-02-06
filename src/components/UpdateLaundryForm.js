import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment';
import {
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    AutoComplete,
    DatePicker,
    Icon,
    Row,
    Col
} from 'antd'

const { TextArea } = Input;

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

class UpdateLaundryForm extends Component {
    state = {
        Clients: [],
        Shippers: [],
        clientID: this.props.clientID,
        shipperID: this.props.shipperID,
        status: this.props.status,
        description: this.props.description,
        price: this.props.price,
        time: this.props.time,
        toOrder: false,
        orderId: 0,
        buttonLoading: false,
        priceEdit: true,
    }

    handleClientChange = (value) => {
        console.log(`selected ${value}`);
        this.setState({ clientID: value });
      }

    handleShipperChange = (value) => {
        console.log(`selected ${value}`);
        this.setState({ shipperID: value });
    }

    handleStatusChange = (value) => {
        console.log(`selected ${value}`);
        this.setState({ status: value });
    }

    handlePriceEdit = () => {
        this.setState({ priceEdit: !(this.state.priceEdit) });
    }

    componentDidMount() {
        console.log(this.props.clientID, this.props.shipperID, this.props.status, this.props.description, this.props.price, this.props.time);
        axios.get('http://127.0.0.1:8000/api/clients/',
            {
                headers: { "Authorization": "Bearer "+this.props.token }
            })
            .then(
                res => {
                    this.setState({
                        Clients: res.data,
                    });
                    console.log(res.data);
                }
            );
            axios.get('http://127.0.0.1:8000/api/shipper/',
            {
                headers: { "Authorization": "Bearer "+this.props.token }
            })
            .then(
                res => {
                    this.setState({
                        Shippers: res.data,
                    });
                    console.log(res.data);
                }
            );

    }
    handleFormSubmit = (event) => {
        event.preventDefault();
        console.log("Helloooo");
        const client = this.state.clientID;
        const shipper = this.state.shipperID;
        const description = event.target.elements.description.value;
        const time = event.target.elements.time_expected.value;
        const status = this.state.status.label;
        const cost = event.target.elements.cost.value;
        const onDelivery = (shipper === 4) ? "0":"1";
        this.setState({buttonLoading: true});
        console.log(cost, client, shipper, description, time, onDelivery, status);
        axios.put('http://127.0.0.1:8000/api/laundry/'+this.props.laundryID+'/',
        {
                shipper: shipper,
                client: client,
                price_estimated: parseInt(cost.split(',').join('')),
                time_expected: time,
                status: status,
                onDelivery: onDelivery,
                description: description,
                //imgUrl: 'https://firebasestorage.googleapis.com/v0/b/pressing-18e11.appspot.com/o/laundryPics%2Fpressing2.png?alt=media&token=e97b80a7-a581-4395-9b23-dfff6e10404e',

            },
            {
                headers: { "Authorization": "Bearer "+this.props.token }
            }
            )
            .then(
                res => {
                    console.log(res.data);
                    this.setState(() => ({buttonLoading: false }));
                    this.props.reload();
                    this.props.close();

                }
            );
    }

    render() {
        /*
        if (this.state.toOrder === true) {
            return <Redirect to={"/"+this.state.orderId} />
          }*/
            let clients = this.state.Clients;
            let shippers = this.state.Shippers;
    
            let clientItems = clients.map((client) =>
                    <option value={client.id}>{client.name}</option>
                );
            let shipperItems = shippers.map((shipper) =>
                <option value={shipper.id}>{shipper.name}</option>
            );

        return (
            <div>
                 <Form onSubmit={(event) => this.handleFormSubmit(event, this.props.requestType, this.props.id)} style={{ padding: '10px 0px 10px 5px' }}>
                    <div>
                        <label for="name" style={label}>Client's Name:</label>
                        <Select onChange={this.handleClientChange}  defaultValue={this.state.clientID} placeholder="Select Client" name="clientId" showSearch 
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            } style={input}>
                                {clientItems}
                        </Select>
                    </div>
                    <div class="input">
                        <label for="name" style={label}>Shipper's Name:</label>
                        <Select id="name" style={input} onChange={this.handleShipperChange} defaultValue={this.state.shipperID} name="shipperId" placeholder="Select Shipper" showSearch 
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            prefix={<Icon type="user" />}>
                            {shipperItems}
                        </Select>
                    </div>
                    <div class="input">
                        <label for="status" style={label}>Status:</label>
                        <Select
                        style={input}
                            labelInValue
                            defaultValue={{ key: this.state.status }}
                            onChange={this.handleStatusChange}
                            name="status" >
                                    <Option value="Pending">Pending</Option>
                                    <Option value="Complete">Complete</Option>
                                    <Option value="Cancel">Cancel</Option>
                                    <Option value="Danger">Danger</Option>
                                </Select>
                    </div>
                    <div class="input">
                        <label for="address" style={label}>Description:</label>
                        <TextArea style={input} name="description" defaultValue={this.state.description}  placeholder="Enter laundry description" autoSize={{ minRows: 2, maxRows: 6 }}/>
                    </div>
                    <div className="gutter-box">
                    <label for="cost" style={label}>Total Cost: </label>
<br />                          
<InputNumber
                                    disabled={this.state.priceEdit}
                                    
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    name="cost"
                                    id="cost" style={input}
                                    defaultValue={this.state.price}
                                    placeholder="Laundry cost"
                                    prefix={<Icon type="dollar" />}
                                    suffix="FCFA" /><Button type="default" size="medium"  onClick={this.handlePriceEdit} icon="edit"  style={{marginLeft: '5px'}}></Button>
                            </div>
                        
                            <div className="gutter-box">
                    <label for="time" style={label}>Time Expected:</label>
<br />                          <DatePicker style={input} name="time_expected" defaultValue={moment(this.state.time, 'YYYY-MM-DDThh:mm:ssTZD')} showTime placeholder="Select Date and Time" />
                            </div>
                            
                            <div className="gutter-box" >
                            <Button type="primary" htmlType="submit" loading={this.state.buttonLoading} style={{  marginTop: '15px', float: 'center'}}>
                                Confirm
                            </Button>
                            </div>
                    
                </Form>

                
            </div>
        )
    }
}

export default UpdateLaundryForm