import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const loginSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
  },
});

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
