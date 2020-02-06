import React from 'react';
import axios from 'axios';
import Laundry from './Laundry';
import { Redirect } from "react-router-dom"
import JsonQuery from 'json-query';


const listData = [];
for (let i = 0; i < 23; i++) {
    listData.push({
        href: 'http://ant.design',
        title: `ant design part ${i}`,
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        description:
            'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    });
}

const token = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTgwMTUxMzQwLCJqdGkiOiI5MDVlZmM5MDU3NWU0NGE2OGY0N2VkYmFhYjRkYjcwMCIsInVzZXJfaWQiOjJ9.3Zs5GZ9QR0S1czZOeYdn8XuV_cr24xpu20bWkpMRmBE";

class LaundryList extends React.Component {

    state = {
        Laundries: [],
        toLogin: false,
    }

    componentDidMount() {
        axios.get('http://127.0.0.1:8000/api/laundries/?status=pending',
                  {
                      headers: {"Authorization": 'Bearer '+this.props.token}
                  })
        .then(
            res => {
                this.setState({
                    Laundries: res.data
                });
                /*newdata = res.data.sort(function(a,b){
                    console.log(a.id - b.id);
                    return a.id - b.id;
                });*/
                console.log(res.data);
                
            }
        )
        
    }

    render(){
        if (this.state.toLogin === true) {
            return <Redirect to="/login" />
          }
        return (
            <Laundry data={this.state.Laundries} />
        ) 
    }
}

export default LaundryList;