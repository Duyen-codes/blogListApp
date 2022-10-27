import React, { useState } from "react";

const Blog = ({ blog, updateLikes, handleDeleteBlog }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleAddLikes = (blog) => {
    const addedLikesObject = {
      ...blog,
      likes: blog.likes + 1,
    };
    const id = blog.id;
    updateLikes(addedLikesObject, id);
  };

  const removeClick = (blog) => {
    const toBeRemovedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      id: blog.id,
    };
    const id = blog.id;
    if (window.confirm(`Remove ${blog.title} by ${blog.author}`)) {
      handleDeleteBlog(toBeRemovedBlog, id);
    } else {
      return;
    }
  };

  return (
    <li style={blogStyle} className="blog">
      <span className="title"> {blog.title} </span>
      <button onClick={() => setVisible(!visible)}>
        {visible ? "hide" : "view"}
      </button>
      <p className="author">{blog.author}</p>
      {visible && (
        <div>
          <p className="url">{blog.url}</p>
          <span>
            likes
            {blog.likes}
          </span>
          <button onClick={() => handleAddLikes(blog)}>like</button>

          <button onClick={() => removeClick(blog)}>remove</button>
        </div>
      )}
    </li>
  );
};

export default Blog;
