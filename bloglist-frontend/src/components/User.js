import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const User = () => {
	const { id } = useParams();
	const user = useSelector((state) => {
		return state.users.find((user) => {
			return user.id === id;
		});
	});

	if (!user) {
		return null;
	}
	return (
		<div>
			<h2>Name: {user.name}</h2>
			<p>added blogs</p>
			<ul>
				{user.blogs.map((blog) => (
					<li key={blog.id}>{blog.title}</li>
				))}
			</ul>
		</div>
	);
};

export default User;
