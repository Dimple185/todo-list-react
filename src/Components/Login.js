import React, { Component } from 'react'
import './Login.css'
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             username : '',
             password : '',
        }
    }

    handleUsernameChange = (event) => {
        this.setState({
            username : event.target.value
        })
    }

    handlePasswordChange = (event) => {
        this.setState({
            password : event.target.value
        })
    }

    handleLogin = () => {
        alert(`Username is ${this.state.username} and the passwoed is ${this.state.password}`)
    }

    handleSignup = () => {
        axios 
          .post(
              'http://localhost:5001/signup',this.state
          )
          .then((res) => {
              window.alert(res.data.msg) 
          })
    }

    render() {
        return ( 
            <form>
                <div>
                    <label><b>Username</b></label>
                        <input className="container1" type = "text" 
                         placeholder = "Enter Username"
                         value = {this.state.username}
                         onChange = {this.handleUsernameChange} 
                         required />
                </div>
                <div>
                    <label><b>Password</b></label>
                         <input className = "container2" type = "password" 
                         placeholder = "Enter Password"
                         value =  {this.state.password}
                         onChange = {this.handlePasswordChange}
                         required />
                </div>
                <div>
                    <button className = 'button1' 
                    onClick = {this.handleLogin} 
                    type="submit">Login</button>
                    <button className = 'button2'
                    onClick= {this.handleSignup} 
                    type="submit">SignUp</button>
                </div>
            </form>
            
        )
    }
}

export default Login