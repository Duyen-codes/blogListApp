import { createSlice, current } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const byLikes = (blog1, blog2) => (blog2.likes > blog1.likes ? 1 : -1);

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs(state, { payload }) {
      return payload.sort(byLikes);
    },

    appendBlog(state, { payload }) {
      state.concat(payload).sort(byLikes);
    },

    likeBlog(state, action) {
      const likedBlog = action.payload;
      const id = action.payload.id;
      return state
        .map((blog) => (blog.id !== id ? blog : likedBlog))
        .sort(byLikes);
    },

    removeBlog(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id).sort(byLikes);
    },

    commentBlog(state, action) {
      const blogId = action.payload.blog;
      const blogToChange = state.find((blog) => blog.id === blogId);
      const changedBlog = {
        ...blogToChange,
        comments: [...blogToChange.comments, action.payload],
      };
      return state
        .map((blog) => (blog.id !== blogId ? blog : changedBlog))
        .sort(byLikes);
    },
  },
});

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog);
    dispatch(appendBlog(newBlog));
  };
};

export const addLike = (blog) => {
  return async (dispatch) => {
    const returnedBlog = await blogService.update(blog.id, blog);
    dispatch(likeBlog(returnedBlog));
  };
};

export const addComment = (id, comment) => {
  return async (dispatch) => {
    const returnedBlog = await blogService.comment(id, comment);
    dispatch(commentBlog(returnedBlog));
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id);
    dispatch(removeBlog(id));
  };
};
export const { setBlogs, appendBlog, likeBlog, removeBlog, commentBlog } =
  blogSlice.actions;
export default blogSlice.reducer;
