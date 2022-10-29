import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

// 5.16
test("<BlogForm /> new blog form created with the right details", async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  const { container } = render(
    <BlogForm
      createBlog={createBlog}
      setErrorMessage={() => console.log("notification")}
    />
  );

  const titleInput = screen.getByPlaceholderText("write here blog title");
  const authorInput = container.querySelector("#author");
  const urlInput = container.querySelector("#url");

  const saveButton = screen.getByText("save");

  await user.type(titleInput, "testing a form...");
  await user.type(authorInput, "test blog author");
  await user.type(urlInput, "test blog url");

  await user.click(saveButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("testing a form...");
  expect(createBlog.mock.calls[0][0].author).toBe("test blog author");
  expect(createBlog.mock.calls[0][0].url).toBe("test blog url");
});
