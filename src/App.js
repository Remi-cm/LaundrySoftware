import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'antd/dist/antd.css';
import CustomLayout from './containers/Layout';
import BaseRouter from './routes';
import { AuthContext } from "./context/auth";
import PrivateRoute from './PrivateRoute';
import Login from './containers/Login'

function App() {
  const [authTokens, setAuthTokens] = useState();
  
  const setTokens = (data) => {
    localStorage.setItem("token", JSON.stringify(data));
    setAuthTokens(data);
  }
  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
    <div className="App">
        <Router>
        <Switch>
        <Route path="/login" component={Login} />
        <CustomLayout>
            <BaseRouter />
          </CustomLayout>
          </Switch>
        </Router>
    </div>
    </AuthContext.Provider>
  );
}

export default App;
