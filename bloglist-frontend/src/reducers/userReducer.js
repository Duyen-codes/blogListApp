import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/users";

const userSlice = createSlice({
  name: "user",
  initialState: [],
  reducers: {},
});

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll();
    console.log("users", users);
  };
};

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
