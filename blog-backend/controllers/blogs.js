const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
  // Blog.find({}).then((blogs) => {
  //   response.json(blogs);
  // });
});

blogsRouter.get("/:id", async (request, response, next) => {
  const blog = await Blog.findById(request.params.id);
  response.status(200).json(blog);

  // Blog.findById(request.params.id)
  //   .then((result) => {
  //     response.status(200).json(result);
  //   })
  //   .catch((error) => {
  //     next(error);
  //   });
});

// const getTokenFrom = (request) => {
//   const authorization = request.get("authorization");
//   if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
//     return authorization.substring(7);
//   }
//   return null;
// };

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  // get user from request object
  const user = request.user;
  console.log("user from request.user", user);
  // const token = getTokenFrom(request);
  // const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (body.title === undefined || body.url === undefined) {
    return response.status(400).json({ error: "title or url missing" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response, next) => {
    const blog = await Blog.findById(request.params.id);
    console.log("blog to delete", blog);
    // get user from request object
    const user = request.user;
    console.log("user from request.user", request.user);
    console.log("blog.user.toString() from delete route", blog.user.toString());

    // const decodedToken = jwt.verify(request.token, process.env.SECRET);
    // if (!request.token || !decodedToken.id) {
    //   return response.status(401).json({
    //     error: "token missing or invalid",
    //   });
    // }
    const userid = user._id;
    console.log("userid", userid);

    if (blog.user.toString() === userid.toString()) {
      await Blog.findByIdAndRemove(request.params.id);
      response.status(204).end();
    }

    // Blog.findByIdAndRemove(request.params.id).then((deletedBlog) => {
    //   response.status(204).end();
    // });
  }
);

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
