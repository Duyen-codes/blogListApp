const blogs = require("./blogs");
const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let totalLikes = 0;
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes) {
      totalLikes += blogs[i].likes;
    }
  }

  return totalLikes;
};

// which blog has most likes
const favoriteBlog = (blogs) => {
  const max = blogs.reduce(function (prev, current) {
    return prev.likes > current.likes ? prev : current;
  });
  return { title: max.title, author: max.author, likes: max.likes };
};

// Ex4.6
const mostBlogs = (blogs) => {
  let counter = {};
  for (let i = 0; i < blogs.length; i++) {
    if (counter[blogs[i].author]) {
      counter[blogs[i].author] += 1;
    } else {
      counter[blogs[i].author] = 1;
    }
  }

  const result = Object.entries(counter).reduce(function (prev, curr) {
    return prev[1] > curr[1]
      ? { author: prev[0], blogs: prev[1] }
      : { author: curr[0], blogs: curr[1] };
  });
  return result;
};

// Ex 4.7

const mostLikes = (blogs) => {
  const reducedArr = blogs.reduce((prev, blog) => {
    return prev.likes > blog.likes
      ? {
          ...prev,
          author: prev.author,
          likes: prev.likes,
        }
      : {
          ...prev,
          author: blog.author,
          likes: blog.likes,
        };
  }, {});

  return reducedArr;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
