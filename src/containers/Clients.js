import React, { Component } from 'react'
import axios from 'axios'
import { Redirect } from "react-router-dom"
import ClientTable from '../components/ClientTable'
import ClientForm from '../components/ClientForm'

const token = JSON.parse(localStorage.getItem('token'));

class Clients extends Component {

    state = {
        clientTable: [],
        toLogin: false
    }

    getClient = (client) => {}

          loader = () => {
    axios.get('http://127.0.0.1:8000/api/clients/',
        {
            headers: { "Authorization": "Bearer " + token }
        })
        .then(
            res => {
                this.setState({
                    clientTable: res.data.reverse(),
                });
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
        return (
            <div>
                <ClientForm token={token} btnText="Register new client" requestType="post" reload={()=>this.loader()} passwordOff = {false} name=""  email=""  phone="" address="" town="" code="237" password="" sex="Male" country="Cameroon"/>
                <ClientTable data={this.state.clientTable} token={token}  reload={()=>this.loader()}/>
            </div>
        )
    }
}

export default Clients;