import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  clearNotification,
  setNotification,
} from "../reducers/notificationReducer";

const BlogForm = ({ createBlog, setNotification }) => {
  const dispatch = useDispatch();
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: "",
    likes: "",
  });

  const handleBlogChange = (e) => {
    setNewBlog({ ...newBlog, [e.target.name]: e.target.value });
  };

  const addBlog = (event) => {
    event.preventDefault();
    createBlog(newBlog);
    setNewBlog({
      title: "",
      author: "",
      url: "",
      likes: "",
    });
    dispatch(setNotification("info", "New blog created"));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };

  return (
    <div className="formDiv">
      <h2>Create New Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id="title"
            name="title"
            onChange={handleBlogChange}
            placeholder="write here blog title"
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
          />
        </div>
        <div>
          likes:
          <input
            type="number"
            name="likes"
            onChange={handleBlogChange}
            id="likes"
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default BlogForm;
