import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addComment, deleteBlog, addLike } from "../reducers/blogReducer";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";

const BlogSingle = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id } = useParams();
	const [content, setContent] = useState("");

	const blog = useSelector((state) =>
		state.blogs.find((blog) => {
			return blog.id === id;
		}),
	);

	const user = useSelector((state) => state.user);

	const handleSubmit = (event) => {
		event.preventDefault();
		const comment = { content };
		dispatch(addComment(id, comment));
		setContent("");
	};

	// like blog
	const likeBlog = (blogObject) => {
		const liked = { ...blogObject, likes: blogObject.likes + 1 };
		dispatch(addLike(liked));
	};

	//  remove blog
	const removeBlog = async (blogObject) => {
		const ok = window.confirm(
			`remove '${blogObject.title}' by ${blogObject.author}?`,
		);
		if (!ok) {
			return;
		}

		dispatch(deleteBlog(blogObject.id));
		navigate("/");
	};

	if (!blog) {
		return null;
	}

	const addedBy = blog.user && blog.user ? blog.user.name : "anonymous";
	const own = user && blog.user && user.username === blog.user.username;

	return (
		<div>
			<h2>
				{blog.title} {blog.author}
			</h2>
			<p>added by {addedBy}</p>
			<div>
				Visit blog here: <a href={blog.url}>{blog.url}</a>
				<p>{blog.likes} likes</p>
				<button onClick={() => likeBlog(blog)} id='like-button'>
					like
				</button>
				{own && <button onClick={() => removeBlog(blog)}>remove</button>}
			</div>
			<h3>Comments</h3>
			<form onSubmit={handleSubmit}>
				<TextField
					type='text'
					value={content}
					onChange={({ target }) => setContent(target.value)}
					margin='normal'
					required
					fullWidth
					id='content'
					name='content'
					placeholder='write a comment...'
					autoFocus
				/>
				<Button type='submit' variant='contained'>
					add comment
				</Button>
			</form>
			<ul>
				{blog?.comments.map((comment, index) => {
					return <li key={index}>{comment.content}</li>;
				})}
			</ul>
		</div>
	);
};

export default BlogSingle;
