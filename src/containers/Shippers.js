import React, { Component } from 'react'
import axios from 'axios'
import { Redirect } from "react-router-dom"
import ShipperTable from '../components/ShipperTable'
import ShipperForm from '../components/ShipperForm'

const token = JSON.parse(localStorage.getItem('token'));

class Shippers extends Component {

    state = {
        agency: [],
        shipperTable: [],
        toLogin: false
    }

    loader = () => {
        axios.get('http://127.0.0.1:8000/api/shipper-nested/',
        {
            headers: { "Authorization": "Bearer " + token }
        })
        .then(
            res => {
                this.setState({
                    shipperTable: res.data.reverse(),
                });
                console.log(res.data);
            }
        );
        axios.get('http://127.0.0.1:8000/api/auth/users/me',
        {
            headers: { "Authorization": "Bearer " + token }
        })
        .then(
            res => {
                this.setState({
                    agency: res.data,
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
    componentDidMount(){
        this.loader();
    }

    render() {
        if (this.state.toLogin === true) {
            return <Redirect to="/login" />
          }
        return (
            <div>
                {/*<ShipperTable token={token} />*/}
                <ShipperTable token={token} agency={this.state.agency} shipperTable={this.state.shipperTable} reload={() => this.loader()}/>
            </div>
        )
    }
}

export default Shippers;