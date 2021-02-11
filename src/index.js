import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Login from "./Components/Login";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import PrivateRoute from './PrivateRoute'

const getSession = () => {
  return  JSON.parse(localStorage.getItem("userData"));
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route path="/login" exact component={Login} />
      {<Route path="/app" component={App} />}
      <PrivateRoute
        path="/"
        component={App}
      />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
