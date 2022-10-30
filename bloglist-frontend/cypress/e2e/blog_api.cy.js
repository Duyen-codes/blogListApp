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
    cy.login({ username: "mluukkai", password: "salainen" });
  });

  it("A new blog can be created", function () {
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

  describe("and a blog exists", function () {
    beforeEach(function () {
      cy.createBlog({
        title: "another blog cypress",
        author: "cypress",
        url: "cypress.com",
        likes: 1,
      });
    });

    // // 5.20
    it("Users can like a blog", function () {
      cy.contains("view").click();
      cy.contains("like");
      cy.get("#like-button").click();
    });
  });

  describe("and several blog posts exist", function () {
    beforeEach(function () {
      cy.createBlog({
        title: "first blog",
        author: "first blog author",
        url: "firstblog.come",
        likes: 1,
      });
      cy.createBlog({
        title: "second blog",
        author: "second blog author",
        url: "secondblog.come",
        likes: 2,
      });
      cy.createBlog({
        title: "third blog",
        author: "third blog author",
        url: "thirdblog.come",
        likes: 4,
      });
    });

    it("one of those blogs can be liked", function () {
      cy.contains("second blog").parent().find("button").click();
      cy.contains("second blog")
        .parent()
        .find("button")
        .then((buttons) => {
          console.log("number of buttons", buttons.length);
          cy.wrap(buttons[1]).click();
        });

      cy.contains("second blog").parent().contains("likes:3");
    });

    // // 5.21
    it("user who created a blog can delete it", function () {
      cy.contains("a blog created by cypress")
        .parent()
        .contains("view")
        .click();
      cy.contains("a blog created by cypress")
        .parent()
        .contains("remove")
        .click();
      cy.get(".blogs").should("not.contain", "a blog created by cypress");
    });

    // bonus exercise: other users cannot delete the blog.
    // it("other users cannot delete the blog", function () {
    //   cy.contains("log out").click();
    //   cy.contains("first blog").parent().contains("view").click();
    //   cy.contains("first blog").parent().contains("remove").click();
    //   cy.get(".blogs").should("contain", "first blog");
    // });

    // // 5.22
    it("blogs are sorted by most likes", function () {
      cy.get(".blogs").each(function (blog) {
        cy.get(".blog").contains("view").click();
      });
      cy.get(".blog").eq(0).should("contain", "third blog");
    });
  });
});
