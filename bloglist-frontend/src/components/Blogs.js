import React from "react";
import Blog from "./Blog";

const Blogs = ({ blogs, likeBlog, removeBlog }) => {
  if (!blogs) {
    return null;
  }
  return (
    <div>
      <h2>Blogs</h2>
      <div className="blogs">
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            blogs={blogs}
            likeBlog={likeBlog}
            removeBlog={removeBlog}
          />
        ))}
      </div>
    </div>
  );
};

export default Blogs;
