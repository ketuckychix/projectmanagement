//React
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//Axios
import axios from 'axios';
import './App.css';
//Importing Views
import ProjectManagementApp from './projectmanagement/projectmanagement';
import LoginPage from './auth/login';
import NavBar from './views/navbar';
import RegisterUser from './auth/register';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isAuthenticated: false,
      error: {}
    };
    this.loginUser = this.loginUser.bind(this);
    this.logout = this.logout.bind(this);
    this.registerUser = this.registerUser.bind(this);
  };
  
  async loginUser(credentials) {
    this.setState({
      error: {}
    })
    try {
      //Sends a request to login with credentials from auth/login.js
      await axios.post(process.env.REACT_APP_USER_LOGIN + "/api/users/login", credentials)
      .then(res => {
        //If on success, store token into local storage with key "token" and set state to true.
        if (res.data.success) {
          const token = res.data.token;
          localStorage.setItem("token", token)
          this.setState({isAuthenticated: true,})
        }
      }).catch(err=> {
        //Catch any errors and throws it to catch wrapper to set state.
        throw err.response
      })
    } catch (err) {
      //Set error to err.data.
      this.setState({
        error: err.data
      })
    }

  };


  componentDidMount() {
    //Check if user has logged in, if so persist login state
    const token = localStorage.getItem("token");
    if (token) {
      this.setState({
        isAuthenticated: true
      })
    }
  };

  //Log out,and remove token from localstorage.
  logout(e) {
    e.preventDefault();
    this.setState({
      isAuthenticated: false
    })
    localStorage.removeItem("token")
  }

  //Register user and redirect to home page.
  async registerUser(credentials) {
      //Clear the errors:
      this.setState({
        error: {}
      })
      try {
        //Post Request
        await axios.post(process.env.REACT_APP_USER_LOGIN + '/api/users/register', credentials)
          .then(() => {
            //Redirect
            window.location.replace('/')
          })
          .catch(err => {
            throw err.response
          })
      } catch (err) {
          this.setState({
            error: err.data
          })
      }
  }

  render() {
    const {isAuthenticated, error} = this.state
    return (
      <div className="App">

        {isAuthenticated ? 
          //True
          <div><NavBar logout={this.logout}/><ProjectManagementApp/></div> 
          : 
          //False
          <Router>
            <Switch>
              <Route exact path="/">
                <LoginPage loginUser={this.loginUser} errors={error}/>
              </Route>
              <Route exact path="/register">
                <RegisterUser registerUser={this.registerUser} errors={error}/>
              </Route>
            </Switch>
          </Router>
         }

      </div>
    );
  }
  
}

export default App;
