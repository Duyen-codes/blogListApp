const listHelper = require("../utils/list_helper");
const blogs = require("../utils/blogs");

test("dummy returns one", () => {
  const blogs = [];

  //   expect(listHelper.dummy(blogs)).toBe(1);
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
  ];

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);

    expect(result).toBe(5);
  });

  test("when list has more than one blog, returns total likes of all blogs", () => {
    const result = listHelper.totalLikes(blogs);

    expect(result).toBe(36);
  });
});

describe("favorite blog", () => {
  test("when list has only one blog, equal that blog", () => {
    const listWithOneBlog = [
      {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0,
      },
    ];

    const result = listHelper.favoriteBlog(listWithOneBlog);

    expect(result).toEqual({
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });

  test("when list has more than one blog, returns blog with most likes ", () => {
    const result = listHelper.favoriteBlog(blogs);

    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});

describe("mostBlogs", () => {
  test("author has the largest amount of blogs", () => {
    const result = listHelper.mostBlogs(blogs);

    expect(result).toEqual({ author: "Robert C. Martin", blogs: 3 });
  });
});

describe("blog with mostLikes", () => {
  test("blog post has the largest amount of likes", () => {
    const result = listHelper.mostLikes(blogs);

    expect(result).toEqual({ author: "Edsger W. Dijkstra", likes: 12 });
  });
});
