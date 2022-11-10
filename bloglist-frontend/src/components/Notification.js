import React from "react";

const Notification = ({ notification }) => {
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
      {notification.message}
    </div>
  );
};

export default Notification;
