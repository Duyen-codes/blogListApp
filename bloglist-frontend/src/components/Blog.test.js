import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

// 5.13
test("renders title and author, not render url or number of likes by default", () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "testing frontend",
    url: "testing.fi",
    likes: 1,
  };

  const { container } = render(<Blog blog={blog} />);

  expect(container).toHaveTextContent(
    "Component testing is done with react-testing-library"
  );
  expect(container).toHaveTextContent("testing frontend");
  expect(container).not.toHaveTextContent("testing.fi");
  expect(container).not.toHaveTextContent("1");
});

// 5.14
test("show url and likes when view button is clicked", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "testing frontend",
    url: "testing.fi",
    likes: 1,
  };
  const { container } = render(<Blog blog={blog} />);
  const user = userEvent.setup();
  const button = screen.getByText("view");
  fireEvent.click(button);
  expect(screen.getByText("testing.fi")).toBeInTheDocument();
  expect(container).toHaveTextContent("likes");
});

// 5.15
test("like button is called twice", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "testing frontend",
    url: "testing.fi",
    likes: 1,
  };
  const mockHandler = jest.fn();

  render(<Blog blog={blog} updateLikes={mockHandler} />);

  const user = userEvent.setup();
  const button = screen.getByText("view");
  fireEvent.click(button);
  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler.mock.calls).toHaveLength(2);
});
// 5.16
test("new blog form created with the right details", async () => {
  const mockHandler = jest.fn();
  const blog = {
    title: "new blog",
    author: "new blog author",
    url: "newBlog.fi",
    likes: 0,
  };
  render(<BlogForm blog={blog} createBlog={mockHandler} />);

  const user = userEvent.setup();
  const newBlogButton = screen.getByText("new blog");
  fireEvent.click(newBlogButton);
  const saveButton = screen.getByText("save");
  await user.click(saveButton);

  expect(mockHandler.mock.calls).toHaveLength(1);
});
