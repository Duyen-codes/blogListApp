import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const BlogSingle = ({ likeBlog, removeBlog }) => {
  const { id } = useParams();

  const blog = useSelector((state) =>
    state.blogs.find((blog) => {
      return blog.id === id;
    })
  );
  console.log(blog);
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
      <h3>Comments</h3>
      {blog.comments.map((comment) => {
        return <li key={comment.id}>{comment.content}</li>;
      })}
    </div>
  );
};

export default BlogSingle;
