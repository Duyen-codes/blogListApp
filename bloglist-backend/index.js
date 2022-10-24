require("dotenv").config();
const app = require("./app");
const http = require("http");
const express = require("express");

const config = require("./utils/config");

const server = http.createServer(app);
server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
