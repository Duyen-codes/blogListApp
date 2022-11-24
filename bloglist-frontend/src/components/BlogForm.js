import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer";
import {
	setNotification,
	clearNotification,
} from "../reducers/notificationReducer";

// Material UI
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

const BlogForm = ({ blogFormRef }) => {
	const [newBlog, setNewBlog] = useState({
		title: "",
		author: "",
		url: "",
		likes: 0,
	});

	const handleBlogChange = (e) => {
		setNewBlog({ ...newBlog, [e.target.name]: e.target.value });
	};

	const dispatch = useDispatch();
	const navigate = useNavigate();

	// add blog
	const handleSubmit = (event) => {
		event.preventDefault();
		// hide the form by calling blogFormRef.current.toggleVisibility() after a new note has been created
		blogFormRef.current.toggleVisibility();

		dispatch(createBlog(newBlog));
		setNewBlog({
			title: "",
			author: "",
			url: "",
		});
		dispatch(setNotification("info", "New blog created"));
		setTimeout(() => {
			dispatch(clearNotification());
		}, 5000);
		navigate("/");
	};

	// return (
	// 	<div className='formDiv'>
	// 		<h2>Create New Blog</h2>
	// 		<form onSubmit={handleSubmit}>
	// 			<div>
	// 				title:
	// 				<input
	// 					value={newBlog.title}
	// 					id='title'
	// 					name='title'
	// 					onChange={handleBlogChange}
	// 					placeholder='title of the blog'
	// 					required
	// 				/>
	// 			</div>
	// 			<div>
	// 				author:
	// 				<input
	// 					value={newBlog.author}
	// 					type='text'
	// 					id='author'
	// 					name='author'
	// 					onChange={handleBlogChange}
	// 					placeholder='author of the blog'
	// 				/>
	// 			</div>
	// 			<div>
	// 				url:
	// 				<input
	// 					value={newBlog.url}
	// 					name='url'
	// 					onChange={handleBlogChange}
	// 					type='text'
	// 					id='url'
	// 					required
	// 					placeholder='url of the blog'
	// 				/>
	// 			</div>

	// 			<button type='submit'>create</button>
	// 		</form>
	// 	</div>
	// );

	return (
		<ThemeProvider theme={theme}>
			<Container component='main' maxWidth='xs'>
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component='h1' variant='h5'>
						New Blog
					</Typography>
					<Box
						component='form'
						onSubmit={handleSubmit}
						noValidate
						sx={{ mt: 1 }}
					>
						<TextField
							margin='normal'
							fullWidth
							label='Blog Title'
							name='title'
							autoComplete='title'
							autoFocus
							value={newBlog.title}
							id='title'
							onChange={handleBlogChange}
							placeholder='title of the blog'
							required
						/>
						<TextField
							margin='normal'
							required
							fullWidth
							label='Blog Author'
							autoComplete='current-password'
							value={newBlog.author}
							type='text'
							id='author'
							name='author'
							onChange={handleBlogChange}
							placeholder='author of the blog'
						/>
						<TextField
							margin='normal'
							fullWidth
							label='Blog Url'
							autoComplete='url'
							required
							value={newBlog.url}
							name='url'
							onChange={handleBlogChange}
							type='text'
							id='url'
							placeholder='url of the blog'
						/>

						<Grid container>
							<Grid item xs>
								<Button
									type='submit'
									fullWidth
									variant='contained'
									sx={{ mt: 3, mb: 2 }}
								>
									create
								</Button>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
};

export default BlogForm;
