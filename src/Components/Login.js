import React, { Component } from "react";
import "./Login.css";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
    };
  }

  handleUsernameChange = (event) => {
    this.setState({
      username: event.target.value,
    });
  };

  handlePasswordChange = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  handleLogin = (e) => {
    e.preventDefault();

    const data = {
      username: this.state.username,
      password: this.state.password,
    };

    axios
      .post("http://localhost:5001/users/login", data)
      .then((res) => {
        console.log(res.data);
        window.alert(JSON.stringify(res.data.msg));
        localStorage.setItem("userData", JSON.stringify(res.data));
        console.log(JSON.parse(localStorage.getItem("userData")));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleSignup = () => {
    axios.post("http://localhost:5001/signup", this.state).then((res) => {
      console.log(res.data.msg);
    });
  };

  // setTokens = (data) => {
  //     localStorage.setItem("tokens", JSON.stringify(data));
  //     setAuthTokens(data);
  //   }

  render() {
    return (
      <form>
        <div>
          <label>
            <b>Username</b>
          </label>
          <input
            className="container1"
            type="text"
            placeholder="Enter Username"
            value={this.state.username}
            onChange={this.handleUsernameChange}
            required
          />
        </div>
        <div>
          <label>
            <b>Password</b>
          </label>
          <input
            className="container2"
            type="password"
            placeholder="Enter Password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
            required
          />
        </div>
        <div className="buttons">
          <button type="submit" onClick={this.handleLogin}>
            Login
          </button>
          <button onClick={this.handleSignup} type="submit">
            SignUp
          </button>
        </div>
      </form>
    );
  }
}

export default Login;
