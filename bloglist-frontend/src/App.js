import React, { useEffect, useRef } from "react";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

// import blogService from "./services/blogs";
// import loginService from "./services/login";

import { useSelector, useDispatch } from "react-redux";
import {
  clearNotification,
  setNotification,
} from "./reducers/notificationReducer";
import { initializeBlogs, createBlog } from "./reducers/blogReducer";

import { initializeLoggedInUser, logout } from "./reducers/loginReducer";

import { Routes, Route, Link, useMatch, useNavigate } from "react-router-dom";
import Users from "./components/Users";
import User from "./components/User";

import BlogSingle from "./components/BlogSingle";
import Blogs from "./components/Blogs";

import { Container } from "@mui/material";
import Navigation from "./components/Navigation";

const App = () => {
  // const [blogs, setBlogs] = useState([]);
  // const [notification, setNotification] = useState(null);
  // const [user, setUser] = useState(null);
  const blogFormRef = useRef();

  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);
  const user = useSelector((state) => state.user);

  const navigate = useNavigate();
  // get blogs
  useEffect(() => {
    // blogService.getAll().then((blogs) => {
    //   // ex 5.9 list blogs by number of likes
    //   const sortedBlogs = blogs.sort(byLikes);
    //   setBlogs(sortedBlogs);
    // });
    dispatch(initializeBlogs());
    dispatch(initializeLoggedInUser());
  }, []);

  // handle logout
  const handleLogout = () => {
    // window.localStorage.removeItem("loggedBlogAppUser");
    // blogService.setToken(null);
    // setUser(null);
    dispatch(logout());
    navigate("/");
  };

  // const match = useMatch('/blogs/:id')

  // const blog = match ? useSelector(state => state.blogs.find(blog => {
  //   return blog.id === (match.params.id)
  // })) : null
  // console.log('blog', blog);

  return (
    <Container>
      <Navigation user={user} />
      <h1>Blogs Application MERN stack</h1>
      {<Notification notification={notification} />}
      {/* {user === null && (
        <Togglable buttonLabel="login">
          <LoginForm
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        </Togglable>
      )} */}
      {user !== null && (
        <div>
          <p>
            {user.name} logged-in
            <button onClick={handleLogout}>log out</button>
          </p>
          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm blogFormRef={blogFormRef} />
          </Togglable>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User />}></Route>
        <Route path="/blogs/:id" element={<BlogSingle />}></Route>
        <Route path="/login" element={<LoginForm />}></Route>
      </Routes>
    </Container>
  );
};

export default App;
