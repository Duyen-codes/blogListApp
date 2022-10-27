import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState({
    type: "",
    content: "",
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // get blogs
  useEffect(() => {
    blogService.getAll().then((blogs) => {
      // ex 5.9 list blogs by number of likes
      const sortedBlogs = blogs.sort((a, b) => {
        return b.likes - a.likes;
      });
      setBlogs(sortedBlogs);
    });
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
      console.log(username, password);
      // user is an object (token, username, name)
      blogService.setToken(user.token);
      setUser(user);

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      setUsername("");
      setPassword("");
      setErrorMessage({ type: "info", content: "Login success" });
      setTimeout(() => {
        setErrorMessage({ type: "", content: "" });
      }, 3000);
    } catch (exception) {
      setErrorMessage({ type: "error", content: "Wrong username or password" });
      setTimeout(() => {
        setErrorMessage({ type: "", content: "" });
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
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
    });
  };

  // update likes
  const updateLikes = (blogObject, id) => {
    blogService.update(id, blogObject).then((returnedBlog) => {
      // const index = blogs.findIndex((blog) => blog.id === returnedBlog.id);
      // const copiedBlogs = [...blogs];
      // copiedBlogs[index] = returnedBlog;
      // setBlogs(copiedBlogs);
      setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)));
    });
  };

  // handle delete blog
  const handleDeleteBlog = async (blogObject) => {
    await blogService.remove(blogObject.id);
    const index = blogs.findIndex((blog) => blog.id === blogObject.id);
    const copiedBlogs = [...blogs];
    copiedBlogs.splice(index, 1);
    setBlogs(copiedBlogs);
  };

  const blogFormRef = useRef();
  return (
    <div>
      <h1>Blogs Application</h1>
      {errorMessage.content !== "" && (
        <Notification errorMessage={errorMessage} />
      )}
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
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
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
            setBlogs={setBlogs}
            updateLikes={updateLikes}
            handleDeleteBlog={handleDeleteBlog}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
