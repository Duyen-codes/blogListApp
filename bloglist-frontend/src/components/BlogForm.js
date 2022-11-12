import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";

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

  // add blog
  const handleSubmit = (event) => {
    event.preventDefault();
    // hide the form by calling blogFormRef.current.toggleVisibility() after a new note has been created
    blogFormRef.current.toggleVisibility();
    // blogService.create(blogObject).then((returnedBlog) => {
    //   setBlogs(blogs.concat(returnedBlog));
    // });

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
  };

  return (
    <div className="formDiv">
      <h2>Create New Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input
            id="title"
            name="title"
            onChange={handleBlogChange}
            placeholder="title of the blog"
            required
          />
        </div>
        <div>
          author:
          <input
            type="text"
            name="author"
            onChange={handleBlogChange}
            id="author"
            placeholder="author of the blog"
          />
        </div>
        <div>
          url:
          <input
            name="url"
            onChange={handleBlogChange}
            type="text"
            id="url"
            required
            placeholder="url of the blog"
          />
        </div>

        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
