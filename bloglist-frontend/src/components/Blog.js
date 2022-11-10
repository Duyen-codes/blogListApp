import React, { useState } from "react";

const Blog = ({ blog, likeBlog, removeBlog }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleVisibility = () => {
    setVisible(!visible);
  };
  return (
    <li style={blogStyle} className="blog">
      <span className="title"> {blog.title} </span>
      <button onClick={handleVisibility}>{visible ? "hide" : "view"}</button>
      <p className="author">{blog.author}</p>
      {visible && (
        <div>
          <p className="url">{blog.url}</p>
          <span>
            likes:
            {blog.likes}
          </span>
          <button onClick={() => likeBlog(blog)} id="like-button">
            like
          </button>

          <button onClick={() => removeBlog(blog)}>remove</button>
        </div>
      )}
    </li>
  );
};

export default Blog;
