import React from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {
    Form,
    Input,
   // InputNumber,
    Select,
    Button,
    DatePicker,
    Icon
  } from 'antd';
  
  
  const { TextArea } = Input;
  //const { Option } = Select;
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTc5ODc3NTMxLCJqdGkiOiJiMDNlYTgxMTE5MzY0NzlhOTVlMTk2MDAyODhiZDM2MSIsInVzZXJfaWQiOjJ9.H9DfCghoInYmtslKio3IuT8zWvVwbsklvzbkLurz-UA";

  class LaundryForm extends React.Component {

    state = {
        Clients: [],
        Shippers: [],
        Me: [],
        clientSelected: "",
        shipperSelected: "",
        toOrder: false,
        orderId: 0,
        toLogin: false
    };
    
    change = (value) => {
        console.log(`selected ${value}`);
        this.setState({ clientSelected: value });
      }

      change2 = (value) => {
        console.log(`selected ${value}`);
        this.setState({ shipperSelected: value });
      }

    componentDidMount() {
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
            axios.get('http://127.0.0.1:8000/api/auth/users/me',
            {
                headers: { "Authorization": "Bearer "+this.props.token }
            })
            .then(
                res => {
                    this.setState({
                        Me: res.data,
                    });
                    console.log(res.data);
                }
            );
    }
    handleFormSubmit = (event) => {
        event.preventDefault();
        console.log("Helloooo");
        const client = this.state.clientSelected;
        const shipper = this.state.shipperSelected;
        const agency = this.state.Me.id;
        //const cost = event.target.elements.cost.value;
        const description = event.target.elements.description.value;
        const time = event.target.elements.time_expected.value;
        const status = "Pending";
        const onDelivery = (shipper === 4) ? "0":"1";
        
        console.log("Xa veut dire quoi xa "+client+" ett"+shipper+"et +cost+ "+description+" "+time+" the agency id is"+agency+" c a liverer "+onDelivery+" et enfin "+status);
        axios.post('http://127.0.0.1:8000/api/laundry/',
        {
                shipper: shipper,
                client: client,
                agency: agency,
                time_expected: time,
                status: status,
                onDelivery: onDelivery,
                description: description,
                imgUrl: 'https://firebasestorage.googleapis.com/v0/b/pressing-18e11.appspot.com/o/laundryPics%2Fpressing2.png?alt=media&token=e97b80a7-a581-4395-9b23-dfff6e10404e',

            },
            {
                headers: { "Authorization": "Bearer "+this.props.token }
            }
            )
            .then(
                res => {
                    console.log(res.data);
                    this.setState(() => ({ toOrder: true, orderId: res.data.id }));
                    this.props.reload();

                }
            )
            .catch(error => {
              if (error.response) {
                if (error.response.status === 401) {
                  localStorage.removeItem("token");
                  this.setState({ toLogin : true})
                }
                console.log(error.response.status, error.response.data);
              }
            });
    }

    render() {
      if (this.state.toLogin === true) {
        return <Redirect to="/login" />
      }
      if (this.state.toOrder === true) {
        return <Redirect to={"/detail/"+this.state.orderId} />
      }
        let clients = this.state.Clients;
        let shippers = this.state.Shippers;

        let clientItems = clients.map((client) =>
                <option value={client.id}>{client.name}</option>
            );
        let shipperItems = shippers.map((shipper) =>
            <option value={shipper.id}>{shipper.name}</option>
        );
      return (
        <Form onSubmit={this.handleFormSubmit}>
        <Form.Item label="Client">
            <Select onChange={this.change} placeholder="Select Client" name="clientId" showSearch 
               filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              } >
                  {clientItems}
            </Select>
        </Form.Item>
        <Form.Item label="Shipper">
            <Select onChange={this.change2} name="shipperId" placeholder="Select Shipper" showSearch 
               filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              prefix={<Icon type="user" />}>
              {shipperItems}
            </Select>
        </Form.Item>
          
          <Form.Item label="Description">
          <TextArea name="description" placeholder="Enter laundry description"
          autoSize={{ minRows: 2, maxRows: 6 }}/>
            
          </Form.Item>
          <Form.Item label="Time expected">
            <DatePicker name="time_expected" showTime placeholder="Select Date and Time" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              New Laundry
            </Button>
          </Form.Item>

        </Form>
      );
    }
  }
  
  export default LaundryForm;