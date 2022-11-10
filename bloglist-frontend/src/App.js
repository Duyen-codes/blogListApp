import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

import blogService from "./services/blogs";
import loginService from "./services/login";

import { useSelector, useDispatch } from "react-redux";
import {
  clearNotification,
  setNotification,
} from "./reducers/notificationReducer";
import {
  initializeBlogs,
  setBlogs,
  createBlog,
  addLike,
  removeBlog,
  deleteBlog,
} from "./reducers/blogReducer";

const App = () => {
  // const [blogs, setBlogs] = useState([]);
  // const [notification, setNotification] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const byLikes = (blog1, blog2) => (blog2.likes > blog1.likes ? 1 : -1);

  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);
  const blogs = useSelector((state) => state.blogs);

  // get blogs
  useEffect(() => {
    // blogService.getAll().then((blogs) => {
    //   // ex 5.9 list blogs by number of likes
    //   const sortedBlogs = blogs.sort(byLikes);
    //   setBlogs(sortedBlogs);
    // });
    dispatch(initializeBlogs());
  }, []);

  // get user
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  // handle login
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      // user is an object (token, username, name)
      blogService.setToken(user.token);
      setUser(user);

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      setUsername("");
      setPassword("");
      // setNotification({ type: "info", message: "Login success" });
      dispatch(setNotification("info", "Login success"));

      setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
    } catch (exception) {
      dispatch(
        setNotification({
          type: "error",
          message: "Wrong username or password",
        })
      );
      setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
    }
  };

  // handle logout
  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    blogService.setToken(null);
    setUser(null);
  };

  // add blog
  const addBlog = (blogObject) => {
    // hide the form by calling blogFormRef.current.toggleVisibility() after a new note has been created
    blogFormRef.current.toggleVisibility();
    // blogService.create(blogObject).then((returnedBlog) => {
    //   setBlogs(blogs.concat(returnedBlog));
    // });
    dispatch(createBlog(blogObject));

    dispatch(setNotification("info", "New blog created"));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };

  // like blog
  const likeBlog = (blogObject) => {
    const liked = { ...blogObject, likes: blogObject.likes + 1 };
    // blogService.update(liked.id, liked).then((returnedBlog) => {
    //   const updatedBlogs = blogs
    //     .map((blog) => (blog.id !== blogObject.id ? blog : returnedBlog))
    //     .sort(byLikes);
    //   setBlogs(updatedBlogs);
    // });
    dispatch(addLike(liked));
  };

  //  remove blog
  const removeBlog = async (blogObject) => {
    const ok = window.confirm(
      `remove '${blogObject.title}' by ${blogObject.author}?`
    );
    if (!ok) {
      return;
    }
    // await blogService.remove(blogObject.id);
    // const updatedBlogs = blogs
    //   .filter((blog) => blog.id !== blogObject.id)
    //   .sort(byLikes);
    // dispatch(setBlogs(updatedBlogs));
    dispatch(deleteBlog(blogObject.id));
  };

  const blogFormRef = useRef();
  return (
    <div>
      <h1>Blogs Application MERN stack</h1>
      {<Notification notification={notification} />}
      {user === null ? (
        <Togglable buttonLabel="login">
          <LoginForm
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        </Togglable>
      ) : (
        <div>
          <p>
            {user.name} logged-in
            <button onClick={handleLogout}>log out</button>
          </p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm
              createBlog={addBlog}
              notification={notification}
              setNotification={setNotification}
            />
          </Togglable>
        </div>
      )}

      <h2>Blogs</h2>
      <div className="blogs">
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            blogs={blogs}
            // setBlogs={setBlogs}
            likeBlog={likeBlog}
            removeBlog={removeBlog}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
