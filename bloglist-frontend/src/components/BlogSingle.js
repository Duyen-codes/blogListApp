import React, { useState }  from "react";
import { useParams } from "react-router-dom";
import { useSelector , useDispatch} from "react-redux";
import {addComment} from '../reducers/blogReducer'

const BlogSingle = ({ likeBlog }) => {
  const dispatch = useDispatch()
  const { id } = useParams();
  const [content, setContent] = useState('')

  const blog = useSelector((state) =>
    state.blogs.find((blog) => {
      return blog.id === id;
    })
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const comment = { content }
    dispatch(addComment(id, comment))
   
  }

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
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={({target}) => setContent(target.value)}/>
        <button type="submit">add comment</button>
      </form>
      {blog.comments.map((comment) => {
        return <li key={comment.id}>{comment.content}</li>;
      })}
    </div>
  );
};

export default BlogSingle;
