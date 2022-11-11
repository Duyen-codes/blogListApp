import React, { useState } from "react";
import { Link } from "react-router-dom";

const Blog = ({ blog, likeBlog, removeBlog }) => {
  console.log("blog", blog);
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
      <Link className="title" to={`/blogs/${blog.id}`}>
        {" "}
        {blog.title}{" "}
      </Link>
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
