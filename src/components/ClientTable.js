import React, { Component } from 'react'
import axios from 'axios'
import { Button, Icon, Modal, Avatar,  message} from 'antd'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import ClientForm from './ClientForm'

class ClientTable extends Component {

  state = {
    index: 0,
    deleteVisible: false,
    editVisible: false,
    deleteConfirmLoading: false,
    editConfirmLoading: false,
    name: "client",
    email: "",
    phone: "",
    address: "",
    sex: "",
    town: "",
    country: "",
    code: "237",
    password: "",
  }

  showDeleteModal = (id, name, sex) => {

    console.log('this is the id: '+id);
    this.setState({ deleteVisible: true, index: id, name: name, sex: sex });
}

showEditModal = (id, name, phone, email, sex, address, town, country, password, code) => {
  console.log(id, name, phone, email, sex, address, town, country, password, code);
  this.setState({ editVisible: true, index: id, name: name, email: email, phone: phone, sex: sex, address: address, town: town, country: country, password: password, code: code });
}

handleCancel = () => {
  console.log('Clicked cancel button');
  this.setState({
    deleteVisible: false,
    editVisible: false
  });
  //this.props.reload();
}

deleteLine = () => {
  this.setState({
    deleteConfirmLoading: true,
  });
  axios.delete('http://127.0.0.1:8000/api/clients/'+this.state.index,
            {
                headers: { "Authorization": "Bearer " + this.props.token }
            })
            .then(
                res => {
                    this.setState({
                        deleteConfirmLoading: false,
                        deleteVisible: false
                      });
                      message.success('Client \''+this.state.name+'\' sucssesfully deleted');
                      this.props.reload();
                }  
            );
}

    render() {
        return (
            <div>
                <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table" style={{minWidth: 600, fontSize: '0.7em'}}>
        <TableHead style={{backgroundColor: "#e8eaf6"}}>
          <TableRow style={{fontSize: '1.2em', fontWeight: 'bold'}}>
          <TableCell> </TableCell>
            <TableCell style={{fontSize: '1.2em', fontWeight: 'bold'}}>Name</TableCell>
            <TableCell style={{fontSize: '1.2em', fontWeight: 'bold'}}>Email</TableCell>
            <TableCell style={{fontSize: '1.2em', fontWeight: 'bold'}}>Phone</TableCell>
            <TableCell style={{fontSize: '1.2em', fontWeight: 'bold'}}>Sex</TableCell>
            <TableCell style={{fontSize: '1.2em', fontWeight: 'bold'}}>Address</TableCell>
            <TableCell style={{fontSize: '1.2em', fontWeight: 'bold'}}>Town</TableCell>
            <TableCell  style={{fontSize: '1.2em', fontWeight: 'bold'}}>Country</TableCell>
            <TableCell align="left"  style={{fontSize: '1.2em', fontWeight: 'bold'}}>Actions</TableCell>        
          </TableRow>
        </TableHead>
        <TableBody>
          {
          this.props.data.map((item, index) => {
            return <TableRow key={index}>
              <TableCell align="right"><Avatar src={item.avatarUrl} /></TableCell>
              <TableCell  style={{fontSize: '1.2em'}} component="th" scope="row">{item.name}</TableCell>
              <TableCell style={{fontSize: '1.2em'}}>{item.email}</TableCell>
              <TableCell style={{fontSize: '1.2em'}}>{item.phone}</TableCell>
              <TableCell style={{fontSize: '1.2em'}}>{item.sex}</TableCell>
              <TableCell style={{fontSize: '1.2em'}}>{item.address}</TableCell>
              <TableCell style={{fontSize: '1.2em'}}>{item.town}</TableCell>
              <TableCell style={{fontSize: '1.2em'}}>{item.country}</TableCell>
              <TableCell align="right" component="th" scope="row">
          {/* <Button type="default" size="small" style={{marginRight:"5px"}} onClick={() => this.showEditModal(item.id, item.name, item.phone, item.email, item.sex, item.address, item.town, item.country, item.password, item.phone.substr(1,3))}><Icon type="edit"/></Button> */}                 
                  <Button type="danger" size="small" value={item.id} onClick={() => this.showDeleteModal(item.id, item.name, item.sex)}><Icon type="delete"/></Button>
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
          <p>{this.state.sex === "Male" ? "Mister" : "Miss"} <strong>{this.state.name}</strong> will be definitely deleted from the system </p>
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
          <ClientForm
          requestType = "put"
          btnText = {"Update "+this.state.name}
          name = {this.state.name}
          email = {this.state.email}
          phone = {this.state.phone}
          address = {this.state.address}
          country = {this.state.country}
          sex = {this.state.sex}
          town = {this.state.town}
          code = {this.state.code}
          password = {this.state.password}
          passwordOff = {true}
          id = {this.state.index}
          />
        </Modal>
            </div>
        )
    }
}

export default ClientTable;