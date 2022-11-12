import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

const Blogs = () => {
  const blogs = useSelector((state) => state.blogs);
  return (
    <div>
      <h2>Blogs</h2>
      <TableContainer component={Paper} className="blogs" id="blogs">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>blogs</TableCell>
              <TableCell>users</TableCell>
            </TableRow>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>
                    {blog.title} by {blog.author}
                  </Link>
                </TableCell>
                <TableCell>{blog.user.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Blogs;

{
  /* <Blog
            key={blog.id}
            blog={blog}
            blogs={blogs}
            likeBlog={likeBlog}
            removeBlog={removeBlog}
          /> */
}
