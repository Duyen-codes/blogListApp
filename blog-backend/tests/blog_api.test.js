const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test("HTTP GET request to /api/blogs url, blog list application returns blog posts in JSON format", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 10000);

test("returns a correct amount of blog posts", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test("4.9 blog post has id property", async () => {
  const response = await api.get("/api/blogs");
  const notes = response.body;
  for (let note of notes) {
    expect(note.id).toBeDefined();
  }
});

test("4.10 HTTP POST request to /api/blogs url creates a new blog", async () => {
  const newBlog = {
    title: "post a blog with async await",
    author: "fullstackopen",
    url: "fullstackopen.com",
    likes: 0,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  const titles = blogsAtEnd.map((b) => b.title);
  expect(titles).toContain("post a blog with async await");
});

test("4.11 verifies that if likes property from the request, it will default to 0", async () => {
  const blogWithNoLikes = {
    title: "this blog does not have likes property",
    author: "ex 4.11 step4",
    url: "fullstackopen.com",
  };

  await api
    .post("/api/blogs")
    .send(blogWithNoLikes)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const likesArray = blogsAtEnd.map((b) => b.likes);
  expect(likesArray[likesArray.length - 1]).toBe(0);
});

test("create a blog to /api/blogs, if title or url missing, respond status 400", async () => {
  const blogWithoutTitleAndUrl = {
    author: "fullstackopen",
    likes: 0,
  };

  await api
    .post("/api/blogs")
    .send(blogWithoutTitleAndUrl)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});
