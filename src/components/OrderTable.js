import React, { Component } from 'react'
import axios from 'axios';
import OrderLineForm from './OrderLineForm';
import { Button, Icon, Modal } from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';



const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTc5ODc3NTMxLCJqdGkiOiJiMDNlYTgxMTE5MzY0NzlhOTVlMTk2MDAyODhiZDM2MSIsInVzZXJfaWQiOjJ9.H9DfCghoInYmtslKio3IuT8zWvVwbsklvzbkLurz-UA";

class OrderTable extends React.Component {

    state = {
        laundrySelected: this.props.laundryID,
        orderTable: [],
        deleteVisible: false,
        editVisible: false,
        deleteText: " Are you sure? ",
        deleteConfirmLoading:  false,
        open: false,
        index: 0,
        color: "none",
        description: "none",
        price: 0,
        quantity: 1,
        clotheID: 1,
        refresh: false
    }


showDeleteModal = (id) => {

      console.log('this is the id: '+id);
      this.setState({ deleteVisible: true, index: id });
}

showEditModal = (id, color, description, price, quantity, clotheID) => {
       console.log('this is the id: '+id+'description :'+description, clotheID);
       this.setState({ editVisible: true, index: id, color: color, description: description, price: price, quantity: quantity, clotheID: clotheID });
 }

deleteLine = () => {
    
    console.log("on ok clicked");
    this.setState({
      deleteConfirmLoading: true,
    });
    axios.delete('http://127.0.0.1:8000/api/order-line/'+this.state.index,
            {
                headers: { "Authorization": "Bearer " + this.props.token }
            })
            .then(
                res => {
                    this.setState({
                        deleteConfirmLoading: false,
                        deleteVisible: false
                      });
                      this.props.relaunch();
                }  
            );
  }

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      deleteVisible: false,
      editVisible: false
    });
  }


  loader = () => {
    const laundryID = this.props.laundryID;
    console.log('This is '+laundryID+' and new refrzshh iss '+this.state.refresh);
    this.setState({ laundrySelected: laundryID });
    axios.get('http://127.0.0.1:8000/api/order-line-nested/?laundry='+laundryID,
        {
            headers: { "Authorization": "Bearer " + this.props.token }
        })
        .then(
            res => {
                this.setState({
                    orderTable: res.data.reverse(),
                });
                console.log(res.data);
            }
        );
  }

    render() {
        return (
            <div>
                <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table" style={{minWidth: 650}}>
        <TableHead style={{backgroundColor: "#e8eaf6"}}>
          <TableRow>
            <TableCell>Clothe</TableCell>
            <TableCell>Colour</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Unity</TableCell>
            <TableCell>Total</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
          this.props.orderTable.map((item, index) => {
            return <TableRow key={index}>
              <TableCell component="th" scope="row">
                {item.clothe.name}
              </TableCell>
              <TableCell>{item.color}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{item.quantity*item.price}</TableCell>
              <TableCell align="right">
                  <Button type="default" size="small" style={{marginRight:"5px"}} onClick={() => this.showEditModal(item.id, item.color, item.description, item.price, item.quantity, item.clothe.id)}><Icon type="edit"/></Button>                  
                  <Button type="danger" size="small" value={item.id} onClick={() => this.showDeleteModal(item.id)}><Icon type="delete"/></Button>
              </TableCell>
            </TableRow>
          })
          }
        </TableBody>
      </Table>
    </TableContainer>
    <Modal
          title="Are you sure ?"
          visible={this.state.deleteVisible}
          onOk={this.deleteLine}
          onCancel={this.handleCancel}
          confirmLoading={this.state.deleteConfirmLoading}
          okButtonProps={{ type: "danger" }}
          okText="Delete"
        >
          <p>The data will be deleted from the database and lost for ever ...</p>
        </Modal>

        <Modal
              title="Edit Line :"
              visible={this.state.editVisible}
              style={{ top: 20 }}
              onCancel={this.handleCancel}
              footer={null}
              destroyOnClose={true}
              maskClosable={true}
              width={750}
        >
          <OrderLineForm 
              orderLineID={this.state.index} 
              laundryID={this.state.laundrySelected} 
              closeModal={() => this.handleCancel()} 
              relaunch = {this.props.relaunch}
              requestType="put" 
              btnText="Update"
              color={this.state.color}
              description={this.state.description}
              price={this.state.price}
              quantity={this.state.quantity}
              id={this.state.clotheID}
              token = {this.props.token}
          />
        </Modal>

            </div>
        )
    }
}
//JsonQuery('[*][id='+item.id+'].clothe.name', {data: this.state.orderTable}).value
export default OrderTable;