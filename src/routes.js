import React from 'react'
import { Route, Switch }  from 'react-router-dom'
import Home from './containers/Home'
import LaundryDetail from './containers/LaundryDetailView'
import CreateLaundry from './containers/CreateLaundry'
import Order from './containers/Order'
import Clients from './containers/Clients'
import Shippers from './containers/Shippers'
import Clothes from './containers/Clothes'
import PrivateRoute from './PrivateRoute'

const BaseRouter = () => (
    <div>
        
        <PrivateRoute exact path='/' component={Home} />
        <PrivateRoute exact path='/clients' component={Clients} />
        <PrivateRoute exact path='/shippers' component={Shippers} />
        <PrivateRoute exact path='/clothes' component={Clothes} />
        <PrivateRoute exact path='/detail/:laundryID' component={LaundryDetail} />
        <PrivateRoute exact path='/order/:laundryID' component={Order} />
        
        
    </div>
);

export default BaseRouter;