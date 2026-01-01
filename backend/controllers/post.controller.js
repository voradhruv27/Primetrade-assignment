const Post = require("../models/Post");

// CREATE
exports.createPost = async (req, res) => {
  const { title, content } = req.body;

  const post = await Post.create({
    title,
    content,
    user: req.user,
  });

  res.status(201).json(post);
};

// READ
exports.getPosts = async (req, res) => {
  const posts = await Post.find({ user: req.user });
  res.json(posts);
};

// UPDATE
exports.updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ message: "Post not found" });

  if (post.user.toString() !== req.user)
    return res.status(403).json({ message: "Unauthorized" });

  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;

  await post.save();
  res.json(post);
};

// DELETE
exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ message: "Post not found" });

  if (post.user.toString() !== req.user)
    return res.status(403).json({ message: "Unauthorized" });

  await post.deleteOne();
  res.json({ message: "Post deleted" });
};
