import React, { useEffect, useRef } from "react";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

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
	const blogFormRef = useRef();

	const dispatch = useDispatch();
	const notification = useSelector((state) => state.notification);
	const user = useSelector((state) => state.user);

	const navigate = useNavigate();
	// get blogs
	useEffect(() => {
		dispatch(initializeBlogs());
		dispatch(initializeLoggedInUser());
	}, []);

	// handle logout
	const handleLogout = () => {
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
					<p>{user.name} logged-in!</p>
					<Togglable buttonLabel='create new blog' ref={blogFormRef}>
						<BlogForm blogFormRef={blogFormRef} />
					</Togglable>
				</div>
			)}

			<Routes>
				<Route path='/' element={<Blogs />} />
				<Route path='/users' element={<Users />} />
				<Route path='/users/:id' element={<User />}></Route>
				<Route path='/blogs/:id' element={<BlogSingle />}></Route>
				<Route path='/login' element={<LoginForm />}></Route>
			</Routes>
		</Container>
	);
};

export default App;
