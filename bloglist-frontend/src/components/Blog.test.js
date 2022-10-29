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
  const element = container.querySelector(".blog");

  expect(element).toBeDefined();
  expect(element).toHaveTextContent(
    "Component testing is done with react-testing-library"
  );
  expect(element).toHaveTextContent("testing frontend");
  expect(element).not.toHaveTextContent("testing.fi");
  expect(element).not.toHaveTextContent("1");
});

// 5.14

test.only("show url and likes when view button is clicked", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "testing frontend",
    url: "testing.fi",
    likes: 1,
  };
  const mockHandler = jest.fn();

  const { container } = render(
    <Blog blog={blog} handleVisibility={mockHandler} />
  );

  const element = container.querySelector(".blog");
  const user = userEvent.setup();

  const button = screen.getByText("view");

  // fireEvent.click(button);
  await user.click(button);

  expect(screen.getByText("testing.fi")).toBeInTheDocument();
  expect(screen.getByText("testing.fi")).toBeDefined();
  expect(element).toHaveTextContent("likes");
});

test("toggled content can be closed", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "testing frontend",
    url: "testing.fi",
    likes: 1,
  };
  const mockHandler = jest.fn();
  const container = render(
    <Blog blog={blog} handleVisibility={mockHandler} />
  ).container;
  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);

  const closedButton = screen.getByText("hide");
  await user.click(closedButton);

  const div = container.querySelector("blog");

  const hiddenEle = screen.queryByText("url: testing.fi, likes: 1", {
    exact: false,
  });

  expect(hiddenEle).toBeNull();
});

// 5.15
test("like button is called twice", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "testing frontend",
    url: "testing.fi",
    likes: 1,
  };
  const updateLikes = jest.fn();

  render(<Blog blog={blog} updateLikes={updateLikes} />);

  const user = userEvent.setup();
  const button = screen.getByText("view");
  await user.click(button);
  // fireEvent.click(button);
  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(updateLikes.mock.calls).toHaveLength(2);
});
