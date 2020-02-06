import React, { Component } from 'react'
import axios from 'axios'
import { Button, Icon, Modal, message} from 'antd'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@material-ui/core'
import ClotheForm from './ClotheForm'

class ClotheTable extends Component {

    state = {
        deleteVisible: false,
        editVisible: false,
        deleteConfirmLoading: false,
        id: 0,
        name: "",
        price: "",
    }

    showDeleteModal = (id, name) => {

        console.log('this is the id: '+id);
        this.setState({ deleteVisible: true, id: id, name: name });
    }
    
    deleteLine = () => {
        this.setState({
          deleteConfirmLoading: true,
        });
        axios.delete('http://127.0.0.1:8000/api/clothe/'+this.state.id,
                  {
                      headers: { "Authorization": "Bearer " + this.props.token }
                  })
                  .then(
                      res => {
                          this.setState({
                              deleteConfirmLoading: false,
                              deleteVisible: false
                            });
                            message.success('Clothe sucssesfully deleted');
                            this.props.reload();
                      }  
                  );
      }

    showEditModal = (id, name, price) => {
      console.log(id, name, price);
      this.setState({ editVisible: true, id: id, name: name, price: price });
    }
    
    handleCancel = () => {
        this.setState({
            deleteVisible: false,
            editVisible: false,
        });
    }

    render() {
        return (
            <div>
                    <TableContainer component={Paper} >
      <Table size="small" aria-label="a dense table" >
        <TableHead style={{backgroundColor: "#e8eaf6"}}>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Actions</TableCell>        
          </TableRow>
        </TableHead>
        <TableBody>
          {
          this.props.data.map((item, index) => {
            return <TableRow key={index} hover>
              <TableCell component="th" scope="row">{item.name}</TableCell>
              <TableCell align="right">{item.price}</TableCell>

              <TableCell component="th" scope="row" align="right">
                  <Button type="default" size="small" style={{marginRight:"5px"}} onClick={() => this.showEditModal(item.id, item.name, item.price )}><Icon type="edit"/></Button>                  
                  <Button type="danger" size="small" value={item.id} onClick={() => this.showDeleteModal(item.id, item.name)} ><Icon type="delete"/></Button>
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
          reload = {this.props.reload}
        >
          <p>{this.state.name} will be definitely removed from the system </p>
        </Modal>

        <Modal
          title="Update Shipper's Info :"
          visible={this.state.editVisible}
          style={{ top: 50 }}
          onCancel={this.handleCancel}
          footer={null}
          destroyOnClose={true}
          maskClosable={true}
        >
          <ClotheForm
          token={this.props.token}
          requestType = "put"
          btnText = {"Update "+this.state.name}
          name = {this.state.name}
          price = {this.state.price}
          id = {this.state.id}
          reload = {() => this.props.reload()}
          close = {this.handleCancel}
          />

        </Modal> 
            </div>
        )
    }
}

export default ClotheTable
