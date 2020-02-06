import React, { Component } from 'react'
import axios from 'axios'
import { Redirect } from "react-router-dom"
import { Row, Col, Alert, Card} from 'antd'
import ClotheTable from '../components/ClotheTable'
import ClotheForm from '../components/ClotheForm'

const token = JSON.parse(localStorage.getItem('token'));

class Clothes extends Component {

    state = {
        clotheTable: [],
        toLogin: false
    }

    loader = () => {
        axios.get('http://127.0.0.1:8000/api/clothe/',
        {
            headers: { "Authorization": "Bearer " + JSON.parse(localStorage.getItem('token')) }
        })
        .then(
            res => {
                this.setState({
                    clotheTable: res.data.reverse(),
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
                <Alert
                    message="Clothe Module"
                    description="You can add, edit and delete clothes here, if you are a staff member"
                    type="info"
                    style={{maxWidth: '100%', margin: 'auto'}}
                /><br/>
                <Row  gutter={[{ xs: 12, sm: 24, md: 32, lg: 48 }, 20]}>
                    <Col span={9} >
                        <Card><ClotheForm token={token} btnText="Add Clothe" requestType="post" name="" price="" reload={() => this.loader()}/></Card>
                    </Col>
                    <Col span={15}>
                        <ClotheTable data={this.state.clotheTable} token={token} btnText="Update Clothe" reload={() => this.loader()}/>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Clothes;