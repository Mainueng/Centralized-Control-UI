import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";

import login_logo from "../img/rakxa-logo.png";

import { login_api } from "../api/login";

const Login = () => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onchange_username = (username) => {
    setUsername(username);
    setError("");
  };

  const onchange_password = (password) => {
    setPassword(password);
    setError("");
  };

  const history = useHistory();

  const login = () => {
    const user = {
      username: userName,
      password: password,
    };

    login_api(user)
      .then((res) => {
        if (res) {
          setError("");
          localStorage.removeItem("login_error");
          localStorage.setItem("usertoken", res.token);

          history.push("/control");
        } else {
          setError(localStorage.login_error);
        }
      })
      .catch((err) => {
        setError("Login Fail: " + err);
      });

    if (localStorage.usertoken) {
      history.push("/control");
    }
  };

  if (localStorage.usertoken) {
    return <Redirect to="/control" />;
  }

  return (
    <div className="login d-flex justify-content-center align-items-center">
      <div className="login-container d-flex align-items-center">
        <div className="w-100 d-flex align-items-center">
          <img src={login_logo} className="ml-5" alt="logo" />
        </div>
        <div className="w-100 d-flex justify-content-center align-items-center login-border">
          <div className="login-input">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="form-control mb-4"
              onChange={(e) => onchange_username(e.target.value)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control mb-4"
              onChange={(e) => onchange_password(e.target.value)}
              required
            />
            {error === "" ? null : (
              <span className="error-login"> {error} </span>
            )}
            <button
              className="mt-4 w-100"
              type="button"
              onClick={() => login()}
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
