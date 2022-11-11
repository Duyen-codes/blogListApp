import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Users from "./Users";
import { logout } from "../reducers/loginReducer";
import { AppBar, Toolbar, IconButton, Button } from "@mui/material";

const Navigation = ({ user }) => {
  const dispatch = useDispatch();
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu"></IconButton>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        <Button color="inherit">
          {user ? (
            <>
              <em>{user.name} logged in</em>{" "}
              <em onClick={() => dispatch(logout())}>logout</em>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              login
            </Button>
          )}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
