import React, { Component } from 'react'
import axios from 'axios'
import Moment from 'react-moment';
import { Button, Icon, Modal, message } from 'antd'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import ShipperForm from './ShipperForm'

class ShipperTable extends Component {
    state = {
        deleteVisible: false,
        deleteConfirmLoading: false,
        editVisible: false,
        postVisible: false,
        id: 0,
        name: "",
        phone: "",
        email: "",
        address: "",
        cni: "",
        code: "237",
        createdBy: ""
    }

    reload = () => {
        this.props.reload();
    }
    
    showPostModal = () => {
        this.setState({ postVisible: true});
    }
    showDeleteModal = (id, name) => {

        console.log('this is the id: '+id);
        this.setState({ deleteVisible: true, id: id, name: name });
    }
    
    deleteLine = () => {
        this.setState({
          deleteConfirmLoading: true,
        });
        axios.delete('http://127.0.0.1:8000/api/shipper/'+this.state.id,
                  {
                      headers: { "Authorization": "Bearer " + this.props.token }
                  })
                  .then(
                      res => {
                        message.success("Shipper removed successfully");
                          this.setState({
                              deleteConfirmLoading: false,
                              deleteVisible: false
                            });
                            this.props.reload();
                      }  
                  );
      }

    showEditModal = (id, name, phone, email, cni, address, createdOn, createdBy) => {
      console.log(id, name, phone, email, cni, address, createdOn, createdBy);
      this.setState({ editVisible: true, id: id, name: name, email: email, phone: phone, address: address, cni: cni, createdBy: createdBy });
    }
    
    handleCancel = () => {
        this.setState({
            deleteVisible: false,
            editVisible: false,
            postVisible: false
        });
    }

    render() {
        return (
            <div>
                <Button type="primary" size="medium" style={{marginBottom:"10px"}} onClick={() => this.showPostModal()}><Icon type="plus"/>Add Shipper</Button>
                <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table" style={{minWidth: 650}}>
        <TableHead style={{backgroundColor: "#e8eaf6"}}>
          <TableRow>
            <TableCell style={{fontSize: '0.9em', fontWeight: 'bold'}}>Name</TableCell>
            <TableCell style={{fontSize: '0.9em', fontWeight: 'bold'}}>Email</TableCell>
            <TableCell style={{fontSize: '0.9em', fontWeight: 'bold'}}>Phone</TableCell>
            <TableCell style={{fontSize: '0.9em', fontWeight: 'bold'}}>#CNI</TableCell>
            <TableCell style={{fontSize: '0.9em', fontWeight: 'bold'}}>Address</TableCell>
            <TableCell  style={{fontSize: '0.9em', fontWeight: 'bold', width: '10%'}}>Added by</TableCell>
            <TableCell style={{fontSize: '0.9em', fontWeight: 'bold', width: '10%'}}>Added</TableCell>
            <TableCell align="right"  style={{fontSize: '0.9em', fontWeight: 'bold'}}>Actions</TableCell>        
          </TableRow>
        </TableHead>
        <TableBody>
          {
          this.props.shipperTable.map((item, index) => {
            return <TableRow key={index}>
              <TableCell component="th" scope="row" style={{fontSize: '0.9em'}}>{item.name}</TableCell>
              <TableCell style={{fontSize: '0.9em'}}>{item.email}</TableCell>
              <TableCell style={{fontSize: '0.9em'}}>{item.phone}</TableCell>
              <TableCell style={{fontSize: '0.9em'}}>{item.cni_number}</TableCell>
              <TableCell style={{fontSize: '0.9em'}}>{item.address}</TableCell>
              <TableCell style={{fontSize: '0.9em'}}>{item.agent.name}</TableCell>
              <TableCell style={{fontSize: '0.9em', width: '10%'}}><Moment fromNow>{item.created_on}</Moment></TableCell>
              <TableCell align="right" component="th" scope="row" style={{ width: '10%' }}>
                  <Button type="default" size="small" style={{marginRight:"5px"}} onClick={() => this.showEditModal(item.id, item.name, item.phone, item.email, item.cni_number, item.address, item.created_on, item.agent.name)} disabled={(item.id===4) ? true : false}><Icon type="edit"/></Button>                  
                  <Button type="danger" size="small" value={item.id} onClick={() => this.showDeleteModal(item.id, item.name)} disabled={(item.id===4) ? true : false}><Icon type="delete"/></Button>
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
          <p>Mr/Ms <strong>{this.state.name}</strong> will be definitely deleted from the system </p>
        </Modal>

        <Modal
          title="Update Shipper's Info :"
          visible={this.state.editVisible}
          style={{ top: 20 }}
          onCancel={this.handleCancel}
          footer={null}
          destroyOnClose={true}
          maskClosable={true}
        >
          <ShipperForm
          token={this.props.token}
          requestType = "put"
          btnText = {"Update "+this.state.name}
          name = {this.state.name}
          email = {this.state.email}
          phone = {this.state.phone.substr(4)}
          address = {this.state.address}
          cni = {this.state.cni}
          code = {this.state.code}
          agency = {this.props.agency}
          id = {this.state.id}
          reload = {() => this.reload()}
          close = {this.handleCancel}
          />

        </Modal>

        <Modal
          title="Fill in Shipper's Informations :"
          visible={this.state.postVisible}
          style={{ top: 20 }}
          onCancel={this.handleCancel}
          footer={null}
          destroyOnClose={true}
          maskClosable={true}
        >
          <ShipperForm
          token={this.props.token}
          requestType = "post"
          btnText = {"Save Data"}
          name = {this.state.name}
          email = {this.state.email}
          phone = {this.state.phone}
          address = {this.state.address}
          cni = {this.state.cni}
          code = {this.state.code}
          id = {this.state.id}
          agency = {this.props.agency}
          reload = {() => this.reload()}
          close = {this.handleCancel}
          />

        </Modal>
            </div>
        )
    }
}

export default ShipperTable;