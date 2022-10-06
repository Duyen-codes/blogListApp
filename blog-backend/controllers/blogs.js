const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogsRouter.get("/:id", (request, response, next) => {
  Blog.findById(request.params.id)
    .then((result) => {
      response.status(200).json(result);
    })
    .catch((error) => {
      next(error);
    });
});

blogsRouter.post("/", (request, response) => {
  const body = request.body;

  if (body.title === undefined || body.url === undefined) {
    return response.status(400).json({ error: "title or url missing" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
  });

  blog.save().then((savedBlog) => {
    response.status(201).json(savedBlog);
  });
});

blogsRouter.delete("/:id", (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id).then((deletedBlog) => {
    response.status(204).end();
  });
});

blogsRouter.put("/:id", (request, response, next) => {
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then((updatedBlog) => {
      response.status(200).json(updatedBlog);
    })
    .catch((error) => next(error));
});

module.exports = blogsRouter;
