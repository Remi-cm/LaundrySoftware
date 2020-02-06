import React, { Component } from 'react'
import OrderLineForm from '../components/OrderLineForm';
import OrderTable from '../components/OrderTable';
import axios from 'axios';

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTc5ODc3NTMxLCJqdGkiOiJiMDNlYTgxMTE5MzY0NzlhOTVlMTk2MDAyODhiZDM2MSIsInVzZXJfaWQiOjJ9.H9DfCghoInYmtslKio3IuT8zWvVwbsklvzbkLurz-UA";
class Order extends Component {
    state = {
        laundryID: this.props.laundryID,
        refresh: false,
        orderTable: [],
        totalPrice: 0
    }

    refreshTable = () => {
        this.setState({refresh: true})
    }

    relaunch = () => {
        this.loader();
    }

      loader = () => {
    
        if ((this.props.laundryID != null)||(this.props.laundryID != undefined))
            {this.setState({laundryID: this.props.laundryID});}
        else if ((this.props.params != null)||(this.props.params != undefined))
            {this.setState({laundryID: this.props.params.laundryID});
        }

    axios.get('http://127.0.0.1:8000/api/order-line-nested/?laundry='+this.state.laundryID,
        {
            headers: { "Authorization": "Bearer " + this.props.token }
        })
        .then(
            res => {
                this.setState({
                    orderTable: res.data.reverse(),
                    totalPrice: res.data.reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.price, 10)*currentValue.quantity, 0)
                });
                this.props.reload();
                console.log(res.data);
                console.log(this.state.totalPrice);
                axios.put('http://localhost:8000/api/laundry/'+this.state.laundryID+'/',{ price_estimated: this.state.totalPrice },{headers: { "Authorization": "Bearer " + this.props.token }})
                        .then(res => {console.log(res.data); this.props.reload();})
            }
        );
        this.props.reload();
  }

  componentDidMount() {
    this.loader();
}

    render() {
        return (
            <div>
                <OrderLineForm laundryID={this.state.laundryID} requestType="post" orderLineID={null} relaunch={() => this.loader()} btnText="Add" refresh={()=>this.refreshTable()} token={this.props.token}  />
                < OrderTable laundryID={this.state.laundryID} refresh={this.state.refresh} relaunch={() => this.loader()} orderTable={this.state.orderTable} token={this.props.token} />
            </div>
        )
    }
}

export default Order;