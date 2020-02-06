import React, { Component } from 'react'
import LaundryList from '../components/LaundryListView';
import HomeCommands from '../components/HomeCommands';

const token = JSON.parse(window.localStorage.getItem('token'));

class Home extends Component {
    state = {
        token: ""
    }

    componentDidMount() {
        let token = JSON.parse(window.localStorage.getItem('token'));
        this.setState({ token: token });
    }
    render() {
        return (
            <div>
                
                < HomeCommands token={JSON.parse(localStorage.getItem('token'))}/>
                < LaundryList token={JSON.parse(localStorage.getItem('token'))}/>
            </div>
        )
    }
}

export default Home;