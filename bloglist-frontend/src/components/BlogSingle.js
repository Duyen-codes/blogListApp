import React from "react";

const BlogSingle = ({ blog, likeBlog, removeBlog }) => {
  if (!blog) {
    return null;
  }
  return (
    <div>
      <h2>{blog.title}</h2>
      <div>
        <p className="url">{blog.url}</p>
        <span>{blog.likes} likes</span>
        <button onClick={() => likeBlog(blog)} id="like-button">
          like
        </button>
        <p>added by {blog.user.name}</p>
      </div>
    </div>
  );
};

export default BlogSingle;
