import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Users from "./Users";
import { logout } from "../reducers/loginReducer";
import { AppBar, Toolbar, IconButton, Button } from "@mui/material";

const Navigation = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
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

        {user ? (
          <>
            <Button color="inherit">{user.name} logged in</Button>
            <Button color="inherit" onClick={() => dispatch(logout())}>
              logout
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
