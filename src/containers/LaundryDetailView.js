import React from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom"
import Moment from 'react-moment';
import { Descriptions, Badge, Button, Icon, Modal, message, Divider, Select, Input, Form } from 'antd';
import Order from './Order';
import UpdateLaundryForm from '../components/UpdateLaundryForm.js'

const { Option } = Select;
const token = JSON.parse(localStorage.getItem('token'));

class LaundryDetail extends React.Component {

    state = {
        Laundry: [],
        Client: [],
        Shipper: [],
        editVisible: false,
        deleteVisible: false,
        deleteConfirmLoading: false,
        time: "",
        toHome: false,
        orderButton: true,
        orderLoading: false,
        reference: "",
        paymentMethod: ""
    }

    showDeleteModal = (id, time) => {

        console.log('this is the id: '+id, time);
        this.setState({ deleteVisible: true, time: time });
    }

    deleteLine = () => {
        this.setState({
          deleteConfirmLoading: true,
        });
        axios.delete('http://127.0.0.1:8000/api/laundry/'+this.state.Laundry.id,
                  {
                      headers: { "Authorization": "Bearer " + token }
                  })
                  .then(
                      res => {
                          this.setState({
                              deleteConfirmLoading: false,
                              deleteVisible: false,
                              toHome: true
                            });
                            message.success('Laundry sucssesfully deleted');
                      }  
                  );
      }
    
    showEditModal = () => {
        this.setState({ editVisible: true });
      }
      
      handleCancel = () => {
          this.setState({
              deleteVisible: false,
              editVisible: false,
              orderVisible: false
          });
      }

      getBadgeStatus = (status) => {
          switch (status) {
              case "Pending" :
                  return <Badge status="processing" text={status} />;
              case "Complete" :
                  return "success";
              case "Cancel" :
                  return "warning";
              case "Danger" :
                  return "error"
          }
      }

    handlePMChange = (value) => {this.setState({ paymentMethod: value['key'] });}
    showOrderModal = () => {
        let today = new Date();
        let date = today.getFullYear()+''+(today.getMonth()+1)+''+today.getDate();
        let time = today.getHours() + "" + today.getMinutes() + "" + today.getSeconds();
        let dateTime = date+''+time;
        let randomInt = Math.floor(Math.random() * 9999) + 1000;
        this.setState({reference: randomInt+'-'+dateTime, orderVisible: true})
    }

    order = () => {
        const laundryID = this.props.match.params.laundryID;
            this.setState({
                orderLoading: true
            });
        axios.post('http://127.0.0.1:8000/api/order/',
        {
            laundry: laundryID,
            reference: this.state.reference,
            amount: this.state.Laundry.price_estimated,
            payment_method: this.state.paymentMethod,
        },
            {
                headers: { "Authorization": "Bearer "+token }
            })
            .then(
                res => {
                    this.setState({
                        orderLoading: false
                    });
                    message.success("Order completed successfully");
                    console.log(res.data);
                }
            )
            .catch(error => {
                this.setState({
                    orderLoading: false
                });
                if (error.response) {
                  if (error.response.status === 401) {
                    localStorage.removeItem("token");
                    this.setState({ toLogin : true})
                  }
                  console.log(error.response.status, error.response.data);
                }
              });
         
    }

    loader = () => {
        const laundryID = this.props.match.params.laundryID;
        axios.get('http://127.0.0.1:8000/api/laundries/' + laundryID,
            {
                headers: { "Authorization": "Bearer "+token }
            })
            .then(
                res => {
                    this.setState({
                        Laundry: res.data,
                        Client: res.data.client,
                        Shipper: res.data.shipper,
                        toLogin: false
                    });
                    if(res.data.status === "Complete"){
                        this.setState({ orderButton: true });
                    }
                    console.log(res.data);
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

    
    componentDidMount() {
        this.loader();
    }

    render() {
        if (this.state.toLogin === true) {
            return <Redirect to="/login" />
          }
        if (this.state.toHome === true) {
            return <Redirect to="/" />
          }
        return (
            <div>
                <Descriptions
                    title={"Order number " + this.state.Laundry.id}
                    bordered
                    column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                >
                    <Descriptions.Item label="Name">{this.state.Client.name}</Descriptions.Item>
                    <Descriptions.Item label="Phone number">{this.state.Client.phone}</Descriptions.Item>
                    <Descriptions.Item label="address">{this.state.Client.address}</Descriptions.Item>
                    <Descriptions.Item label="Amount">{this.state.Laundry.price_estimated}</Descriptions.Item>
                    <Descriptions.Item label="Time Submitted"><Moment fromNow>{this.state.Laundry.time_submitted}</Moment></Descriptions.Item>
                    <Descriptions.Item label="Time expected"><Moment fromNow>{this.state.Laundry.time_expected}</Moment></Descriptions.Item>
                    <Descriptions.Item label="Town">{this.state.Client.town}</Descriptions.Item>
                    <Descriptions.Item label="Delivery Service">
                        {this.state.Laundry.onDelivery==1?"YES (By "+this.state.Shipper.name+")":"NO"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        {()=>this.getBadgeStatus(this.state.Laundry.status)}
                        <Badge status={
                            this.state.Laundry.status == "Pending" ? "processing" :
                            this.state.Laundry.status == "Complete" ? "success" :
                            this.state.Laundry.status == "Cancel" ? "warning" : "error"

                            } text={this.state.Laundry.status} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Description" span={2}>{this.state.Laundry.description}</Descriptions.Item>
                    <Descriptions.Item label="Actions" span={1} style={{textAlign: 'center'}}>
                    <Button type="default" style={{marginRight:"5px"}} onClick={() => this.showEditModal()}><Icon type="edit"/>Edit</Button>
                    <Button type="danger" style={{marginRight:"5px"}} onClick={() => {this.showDeleteModal(this.state.Laundry.id, this.state.Laundry.time_expected)}}><Icon type="delete"/>Delete</Button>
                    </Descriptions.Item>
                </Descriptions>
                

                <br/>
                <Button type="primary" onClick={this.showOrderModal} disabled={this.state.Laundry.status !== "Complete"} confirmLoading={this.state.orderLoading}><Icon type="edit"/>Complete Order</Button>
                <br/>
                <Divider/>
                <br/>
                <Order laundryID={this.props.match.params.laundryID} token={token} reload={()=>this.loader()}/>

                <Modal
                    title="Update Laundry :"
                    visible={this.state.editVisible}
                    style={{ top: 20 }}
                    onCancel={this.handleCancel}
                    footer={null}
                    destroyOnClose={true}
                    maskClosable={true}
                >
                        <UpdateLaundryForm
                            token={token}
                            clientID = {this.state.Client.id}
                            shipperID = {this.state.Shipper.id}
                            time = {this.state.Laundry.time_expected}
                            price = {this.state.Laundry.price_estimated}
                            status = {this.state.Laundry.status}
                            onDelivery = {this.state.Laundry.onDelivery}
                            description = {this.state.Laundry.description}
                            laundryID = {this.props.match.params.laundryID}
                            reload = {() => this.loader()}
                            close = {this.handleCancel}
                        />

                </Modal>
                <Modal
                    title="Are you sure ?"
                    visible={this.state.deleteVisible}
                    onOk={this.deleteLine}
                    onCancel={this.handleCancel}
                    confirmLoading={this.state.deleteConfirmLoading}
                    okButtonProps={{ type: "danger" }}
                    okText="Delete"
                    reload = {() => this.loader()}
                    >
                    <p>This laundry expected <strong><Moment fromNow>{this.state.time}</Moment></strong> will be irredeemably removed from the system !</p>
                </Modal>

                <Modal
                    title="Confirming Order ... ?"
                    visible={this.state.orderVisible}
                    onOk={()=> this.order()}
                    onCancel={this.handleCancel}
                    confirmLoading={this.state.orderConfirmLoading}
                    okButtonProps={{ type: "primary" }}
                    okText="Confirm"
                    reload = {() => this.loader()}
                    style={{ width: '30%'}}
                    >
                    <Form>
                               <Input type="text" prefix={<Icon type="number" />} placeholder="Reference" disabled={true} defaultValue={this.state.reference} />
                               <br/><br/>
                               <Select
                                    labelInValue
                                    defaultValue={{ key: "cash" }}
                                    onChange={this.handlePMChange}
                                    name="country"
                                >
                                    <Option value="momo">MTN Mobile Money</Option>
                                    <Option value="om">Orange Money</Option>
                                    <Option value="cash">Cash</Option>
                                    <Option value="card">Bank Card</Option>
                                    <Option value="bank">Bank Transfer</Option>
                                </Select>
                    </Form>
                </Modal>

            </div>
        )
    }
}

export default LaundryDetail;