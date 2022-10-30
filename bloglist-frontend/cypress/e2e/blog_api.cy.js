describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "Matti Luukkainen",
      username: "mluukkai",
      password: "salainen",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user);
    cy.visit("http://localhost:3000");
  });

  it("front page can be opened", function () {
    cy.visit("http://localhost:3000");
    cy.contains("Blogs Application");
    cy.contains("Blogs");
  });

  it("login form is shown", function () {
    cy.contains("login").click();
  });

  it("user can log in", function () {
    cy.contains("login").click();
    cy.get("#username").type("mluukkai");
    cy.get("#password").type("salainen");
    cy.get("#login-button").click();
    cy.contains("Login success");
  });

  //   // 5.18 tests for logging in
  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.contains("login").click();
      cy.get("#username").type("mluukkai");
      cy.get("#password").type("salainen");
      cy.get("#login-button").click();
      cy.contains("Login success");
    });

    it("fails with wrong credentials", function () {
      cy.contains("login").click();
      cy.get("#username").type("mluukkai");
      cy.get("#password").type("wrong");
      cy.get("#login-button").click();
      cy.get(".notification")
        .should("contain", "Wrong username or password")
        .and("have.css", "color", "rgb(255, 0, 0)")
        .and("have.css", "border-style", "solid");
    });
  });
});

// 5.19 logged-in user can create a new blog
describe("When logged in", function () {
  beforeEach(function () {
    // log in user here
    // cy.login({ username: "mluukkai", password: "salainen" });
    cy.request("POST", "http://localhost:3003/api/login", {
      username: "mluukkai",
      password: "salainen",
    }).then((response) => {
      localStorage.setItem("loggedBlogAppUser", JSON.stringify(response.body));
      cy.visit("http://localhost:3000");
    });
  });

  // cy.createBlog({
  //   title: "first blog",
  //   author: "first blog author",
  //   url: "www.firstblog.com",
  //   likes: 0,
  // });
  // cy.createBlog({
  //   title: "blog2",
  //   author: "author 2",
  //   url: "url 2",
  //   likes: 1,
  // });
  // cy.createBlog({
  //   title: "blog3",
  //   author: "author 3",
  //   url: "url 3",
  //   likes: 2,
  // });

  it("A blog can be created", function () {
    cy.contains("new blog").click();
    cy.get("input[name*='title']").type("a blog created by cypress");
    cy.get("input[name='url']").type("blog url created by cypress");
    cy.contains("save").click();

    cy.get(".notification")
      .should("contain", "New blog created")
      .and("have.css", "border-style", "solid");

    cy.contains("a blog created by cypress");
    cy.get("html").should("contain", "Matti Luukkainen logged-in");
  });
  // // 5.20
  it.only("Users can like a blog", function () {
    cy.contains("view").click();
    // cy.contains("like").click();
    cy.get("#like-button").click();
  });

  // // 5.21
  // it("user who created a blog can delete it", function () {
  //   cy.contains("first blog").contains("view").click();
  //   cy.contains("first blog").contains("remove").click();
  //   cy.get(".blogs").should("not.contain", "first blog");
  // });

  // // bonus exercise: other users cannot delete the blog.
  // it("other users cannot delete the blog", function () {
  //   cy.contains("logout").click();
  //   cy.contains("HTML is easy").contains("view").click();
  //   cy.contains("HTML is easy").contains("remove").click();
  //   cy.get(".blogs").should("contain", "HTML is easy");
  // });

  // // 5.22
  // it("blogs are sorted by most likes", function () {
  //   cy.get(".blogs").each(function (blog) {
  //     cy.get(".blog").contains("view").click();
  //   });
  //   cy.get(".blog").eq(0).should("contain", "blog3");
  // });
});
