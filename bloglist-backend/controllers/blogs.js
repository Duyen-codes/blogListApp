const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");
const logger = require("../utils/logger");

const Comment = require("../models/comment");

blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({})
		.populate("user", {
			username: 1,
			name: 1,
			id: 1,
		})
		.populate("comments", { content: 1 });
	response.json(blogs);
});

blogsRouter.get("/:id", async (request, response, next) => {
	const blog = await Blog.findById(request.params.id);
	response.status(200).json(blog);

	// Blog.findById(request.params.id)
	//   .then((result) => {
	//     response.status(200).json(result);
	//   })
	//   .catch((error) => {
	//     next(error);
	//   });
});

// const getTokenFrom = (request) => {
//   const authorization = request.get("authorization");
//   if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
//     return authorization.substring(7);
//   }
//   return null;
// };

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
	const body = request.body;

	// get user from request object
	const user = await request.user;
	// const token = getTokenFrom(request);
	// const decodedToken = jwt.verify(request.token, process.env.SECRET);
	if (body.title === undefined || body.url === undefined) {
		return response.status(400).json({ error: "title or url missing" });
	}

	const blog = new Blog({
		...body,
		user: user._id,
	});

	const savedBlog = await blog.save();
	user.blogs = user.blogs.concat(savedBlog._id);
	await user.save();

	const blogToReturn = await Blog.findById(savedBlog._id).populate("user", {
		username: 1,
		name: 1,
	});
	response.status(201).json(blogToReturn);
});

blogsRouter.delete(
	"/:id",
	middleware.userExtractor,
	async (request, response, next) => {
		const blog = await Blog.findById(request.params.id);

		// get user from request object
		const user = request.user;

		// const decodedToken = jwt.verify(request.token, process.env.SECRET);
		// if (!request.token || !decodedToken.id) {
		//   return response.status(401).json({
		//     error: "token missing or invalid",
		//   });
		// }

		const userid = user._id;
		if (!blog) {
			return response.status(204).end();
		}
		if (blog.user && blog.user.toString() !== request.user.id) {
			return response.status(401).json({
				error: "only the creator can delete a blog",
			});
		}
		if (blog.user.toString() === userid.toString()) {
			await Blog.findByIdAndRemove(request.params.id);
			response.status(204).end();
		}

		// Blog.findByIdAndRemove(request.params.id).then((deletedBlog) => {
		//   response.status(204).end();
		// });
	},
);

blogsRouter.put("/:id", async (request, response) => {
	const body = request.body;
	const blog = await Blog.findById(request.params.id);
	const user = request.user;

	const newBlog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
	};

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {
		new: true,
		runValidators: true,
	}).populate("user", { username: 1, name: 1 });
	response.status(200).json(updatedBlog);
});

// comments
blogsRouter.post("/:id/comments", async (request, response) => {
	const body = request.body;

	const blog = await Blog.findById(request.params.id);

	const comment = new Comment({
		content: body.content,
		blog: blog._id,
	});

	const savedComment = await comment.save();
	blog.comments = blog.comments.concat(savedComment);
	await blog.save();
	response.status(201).json(savedComment);
});

module.exports = blogsRouter;
