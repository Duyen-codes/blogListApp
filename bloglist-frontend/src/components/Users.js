import React, { useEffect } from "react";
import { initializeUsers } from "../reducers/userReducer";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Users = () => {
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeUsers());
  }, []);

  return (
    <div>
      <h2>Users</h2>
      blogs created
      {users.map((user) => {
        return (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}> {user.name}</Link>
            <span>{user.blogs.length} </span>
          </li>
        );
      })}
    </div>
  );
};

export default Users;
