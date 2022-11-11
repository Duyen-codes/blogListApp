import React, { useEffect } from "react";
import { initializeUsers } from "../reducers/userReducer";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

const Users = () => {
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeUsers());
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>users</TableCell>
              <TableCell>blogs created</TableCell>
            </TableRow>
            {users.map((user) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link to={`/users/${user.id}`}> {user.name}</Link>
                  </TableCell>
                  <TableCell>
                    <span>{user.blogs.length}</span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Users;
