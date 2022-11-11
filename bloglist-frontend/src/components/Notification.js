import React from "react";
import { Alert } from "@mui/material";

const Notification = ({ notification }) => {
  console.log("notification", notification);
  if (notification === null) {
    return null;
  }
  const style = {
    color: notification.type === "info" ? "green" : "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return (
    <div id="notification" style={style} className="notification">
      {notification.message && (
        <Alert severity={notification.type === "info" ? "success" : "error"}>
          {notification.message}
        </Alert>
      )}
    </div>
  );
};

export default Notification;
