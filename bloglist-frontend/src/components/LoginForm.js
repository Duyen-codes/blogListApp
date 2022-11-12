import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { TextField, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { setUser } from "../reducers/loginReducer";
import {
  setNotification,
  clearNotification,
} from "../reducers/notificationReducer";
import loginService from "../services/login";
import blogService from "../services/blogs";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handle login
  const handleSubmit = async (event) => {
    event.preventDefault();
    loginService
      .login({
        username,
        password,
      })
      .then((user) => {
        blogService.setToken(user.token);
        dispatch(setUser(user));
        window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
        dispatch(setNotification("info", "Login success"));
        navigate("/");
        setTimeout(() => {
          dispatch(clearNotification());
        }, 3000);
      })
      .catch(() => {
        dispatch(setNotification("error", "Wrong username or password"));
        setTimeout(() => {
          dispatch(clearNotification());
        }, 3000);
      });
  };
  return (
    <div>
      <h2>Log in</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="username"
            id="username"
            type="text"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            label="password"
            type="password"
            id="password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <div>
          <Button
            type="submit"
            id="login-button"
            variant="contained"
            color="primary"
          >
            login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
