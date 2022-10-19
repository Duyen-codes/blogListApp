const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({
      error: "username must be unique",
    });
  }

  if (username.length < 3) {
    return response.status(400).json({
      error: "username must be at least 3 characters long",
    });
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: "password must be at least 3 characters long",
    });
  }
  const saltRounds = 10;

  const passwordHash = await bcrypt.hash(password, saltRounds);
  console.log("passwordHash", passwordHash);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });
  response.json(users);
});

module.exports = usersRouter;
