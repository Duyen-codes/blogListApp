import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import blogService from "../services/blogs";

const loginSlice = createSlice({
  name: "loggedInUser",
  initialState: null,
  reducers: {
    setUser(state, action) {
      console.log("action.payload", action.payload);
      return action.payload;
    },
  },
});

export const login = (username, password) => {
  console.log("username", username, password);
  return async (dispatch) => {
    const user = await loginService.login({ username, password });
    window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
    blogService.setToken(user.token);
    dispatch(setUser(user));
  };
};

export const logout = () => {
  return async (dispatch) => {
    window.localStorage.clear();
    blogService.setToken(null);
    dispatch(setUser(null));
  };
};

export const initializeLoggedInUser = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  };
};
export const { setUser, loginUser } = loginSlice.actions;

export default loginSlice.reducer;
