import React, { useState } from "react";

const BlogForm = ({ createBlog, setErrorMessage }) => {
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
    setErrorMessage({ type: "info", content: "New blog created" });
    setTimeout(() => {
      setErrorMessage({ type: "", content: "" });
    }, 5000);
  };

  return (
    <div className="formDiv">
      <h2>Create New Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            name="title"
            onChange={handleBlogChange}
            placeholder="write here blog title"
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
          <input name="url" onChange={handleBlogChange} type="text" id="url" />
        </div>
        <div>
          likes:
          <input name="likes" onChange={handleBlogChange} id="likes" />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default BlogForm;
