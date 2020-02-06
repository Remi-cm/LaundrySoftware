import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SimpleCard from './HomeCards';
import {Icon, Row, Col, Modal, Button} from 'antd';
import Divider from '@material-ui/core/Divider';
import LaundryForm from './LaundryForm'

//#bcaaa4
class HomeCommands extends Component {
    state = {
        laundryColor: "#ffab00",
        clientColor: "#0091ea",
        shipperColor: "#7e57c2",
        clotheColor: "#00c853",
        laundryCount: 0,
        clientCount: 0,
        shipperCount: 0,
        clotheCount: 0,
        laundryLogo: "plus-circle",
        clientLogo: "user",
        shipperLogo: "car",
        clotheLogo: "skin",
        laundryText: "Total laundries awaiting:",
        basicText: "Total number registered:",
        laundryLabel: "New Laundry",
        clientLabel: "Manage Clients",
        shipperLabel: "Manage Shippers",
        clotheLabel: "Manage Clothes",

        Visible: false,
    }
    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
          Visible: false,
        });
      }
    showModal = () => {
        this.setState({ Visible: true});
  }

  loader = () => {
    axios.get('http://127.0.0.1:8000/api/laundry/?status=Pending',
    {
        headers: { "Authorization": "Bearer " + this.props.token }
    })
    .then(
        res => {
            this.setState({
                laundryCount: res.data.length
            });
            console.log(res.data);
        }
    );
    
    axios.get('http://127.0.0.1:8000/api/clients/',
    {
        headers: { "Authorization": "Bearer " + this.props.token }
    })
    .then(
        res => {
            const count= res.data.length;
            this.setState({
                clientCount: count
            });
            console.log('Hello '+res.data.length);
        }
    );
    axios.get('http://127.0.0.1:8000/api/clothe/',
    {
        headers: { "Authorization": "Bearer " + this.props.token }
    })
    .then(
        res => {
            this.setState({
                clotheCount: res.data.length,
            });
            console.log(res.data.length);
        }
    );
    axios.get('http://127.0.0.1:8000/api/shipper/',
    {
        headers: { "Authorization": "Bearer " + this.props.token }
    })
    .then(
        res => {
            this.setState({
                shipperCount: res.data.length,
            });
            console.log(res.data);
        }
    );
  }

  componentDidMount(){
      this.loader();
  }

    render() {
        return (
            <div>
                <Row gutter={16}>
                    <Col span={6}><Link onClick={() => this.showModal()}><SimpleCard label={this.state.laundryLabel} logo={this.state.laundryLogo} count={this.state.laundryCount} text={this.state.laundryText} color={this.state.laundryColor}/></Link></Col>
                    <Col span={6}><Link to="/clients"><SimpleCard label={this.state.clientLabel} logo={this.state.clientLogo} count={this.state.clientCount} text={this.state.basicText} color={this.state.clientColor}/></Link></Col>
                    <Col span={6}><Link to="/shippers"><SimpleCard label={this.state.shipperLabel} logo={this.state.shipperLogo} count={this.state.shipperCount} text={this.state.basicText} color={this.state.shipperColor}/></Link></Col>
                    <Col span={6}><Link to="/clothes"><SimpleCard label={this.state.clotheLabel} logo={this.state.clotheLogo} count={this.state.clotheCount} text={this.state.basicText} color={this.state.clotheColor}/></Link></Col>
                </Row>
                <br/>
                <Divider variant="middle" style={{backgroundColor: "#f5f5f5"}}/>
                <Modal
          title="Create Laundry :"
          visible={this.state.Visible}
          style={{ top: 20 }}
          onCancel={this.handleCancel}
          footer={null}
          destroyOnClose={true}
          maskClosable={true}
          width={750}
        >
          <LaundryForm token={this.props.token} reload={()=>this.loader()} />
        </Modal>
            </div>
        )
    }
}

export default HomeCommands;