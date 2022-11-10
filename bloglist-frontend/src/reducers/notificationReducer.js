import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    showNotification(state, action) {
      console.log(action);
      return action.payload;
    },

    clearNotification() {
      return null;
    },
  },
});

export const setNotification = (type, message) => {
  return (dispatch) => {
    console.log("type", type, "message", message);
    dispatch(showNotification({ type, message }));
  };
};

export const { showNotification, clearNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
