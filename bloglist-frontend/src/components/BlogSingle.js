import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addComment, deleteBlog, addLike } from "../reducers/blogReducer";

const BlogSingle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [content, setContent] = useState("");

  const blog = useSelector((state) =>
    state.blogs.find((blog) => {
      return blog.id === id;
    })
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
    // blogService.update(liked.id, liked).then((returnedBlog) => {
    //   const updatedBlogs = blogs
    //     .map((blog) => (blog.id !== blogObject.id ? blog : returnedBlog))
    //     .sort(byLikes);
    //   setBlogs(updatedBlogs);
    // });
    dispatch(addLike(liked));
  };

  //  remove blog
  const removeBlog = async (blogObject) => {
    const ok = window.confirm(
      `remove '${blogObject.title}' by ${blogObject.author}?`
    );
    if (!ok) {
      return;
    }
    // await blogService.remove(blogObject.id);
    // const updatedBlogs = blogs
    //   .filter((blog) => blog.id !== blogObject.id)
    //   .sort(byLikes);
    // dispatch(setBlogs(updatedBlogs));
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
      <div>
        <p className="url">{blog.url}</p>
        <span>{blog.likes} likes</span>
        <button onClick={() => likeBlog(blog)} id="like-button">
          like
        </button>
        <p>added by {addedBy}</p>
        {own && <button onClick={() => removeBlog(blog)}>remove</button>}
      </div>
      <h3>Comments</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={({ target }) => setContent(target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment, index) => {
          return <li key={index}>{comment.content}</li>;
        })}
      </ul>
    </div>
  );
};

export default BlogSingle;
