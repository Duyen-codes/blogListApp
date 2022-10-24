const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const bcrypt = require("bcrypt");
const User = require("../models/user");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
  // for (let blog of helper.initialBlogs) {
  //   let blogObject = new Blog(blog);
  //   await blogObject.save();
  // }
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

// tests for adding a new blog
describe("addition of a new blog", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("test", 10);
    const user = new User({ username: "test", name: "test", passwordHash });
    await user.save();
  });

  test("4.10 HTTP POST request to /api/blogs url creates a new blog, succeeds with valid token and data", async () => {
    const newBlog = {
      title: "blog post created to test posting with token",
      author: "test, username: test, password: test",
      url: "test.com",
      likes: 0,
    };

    const response = await api
      .post("/api/login")
      .send({ username: "test", name: "test", password: "test" });

    const token = response.body.token;

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: `bearer ${token}` })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).toContain("blog post created to test posting with token");
  }, 10000);

  test("fails with status code 401 if token is not provided", async () => {
    const newBlog = {
      title: "blog post created to test posting without token",
      author: "test, username: test, password: test",
      url: "test.com",
      likes: 0,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  }, 10000);

  test("4.11 verifies that if likes property missing from the request, it will default to 0", async () => {
    const blogWithNoLikes = {
      title: "this blog does not have likes property",
      author: "ex 4.11 step4",
      url: "fullstackopen.com",
    };

    // user login first
    const response = await api
      .post("/api/login")
      .send({ username: "test", name: "test", password: "test" });

    console.log("response.body from login user", response.body);

    // get token from response body.token field
    const token = response.body.token;

    // post blog with logged in user token
    await api
      .post("/api/blogs")
      .send(blogWithNoLikes)
      .set({ Authorization: `bearer ${token}` })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const likesArray = blogsAtEnd.map((b) => b.likes);
    expect(likesArray[likesArray.length - 1]).toBe(0);
  }, 10000);

  test("create a blog to /api/blogs, if title or url missing, respond status 400", async () => {
    const blogWithoutTitleAndUrl = {
      author: "fullstackopen",
      likes: 0,
    };
    // login user
    const response = await api
      .post("/api/login")
      .send({ username: "test", name: "test", password: "test" });

    // get token from response.body
    const token = response.body.token;

    // post blog with token
    await api
      .post("/api/blogs")
      .send(blogWithoutTitleAndUrl)
      .set({ Authorization: `bearer ${token}` })
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

// Tests for deleting a blog
describe("deletion of a blog", () => {
  // before each test, empty user db, create a test user
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("test", 10);
    const user = new User({ username: "test", name: "test", passwordHash });
    await user.save();
  });

  test("succeeds with status code 204 if token is valid", async () => {
    // user login
    const response = await api
      .post("/api/login")
      .send({ username: "test", password: "test" });

    // get token after user login
    const token = response.body.token;

    // newBlog object to post
    const newBlog = {
      title: "blog to be deleted with token",
      author: "test, username: test, password: test",
      url: "test.com",
      likes: 0,
    };

    // post blog
    const savedBlog = await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: `bearer ${token}` })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    // blog id to delete
    const blogToDeleteId = savedBlog.body.id;

    // delete blog with token
    await api
      .delete(`/api/blogs/${blogToDeleteId}`)
      .set("authorization", `bearer ${token}`)
      .expect(204);

    const blogsAtEndAfterDeleteOneBlog = await helper.blogsInDb();
    const titles = blogsAtEndAfterDeleteOneBlog.map((blog) => blog.title);
    // expect
    expect(await Blog.findById(blogToDeleteId)).toBeNull();
    expect(blogsAtEndAfterDeleteOneBlog).toHaveLength(
      helper.initialBlogs.length
    );
    expect(titles).not.toContain(savedBlog.body.title);
  }, 10000);
});

// Tests for users

describe("when there is initially one user at db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("username must be unique");
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
