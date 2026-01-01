const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, postController.createPost);
router.get("/", authMiddleware, postController.getPosts);
router.put("/:id", authMiddleware, postController.updatePost);
router.delete("/:id", authMiddleware, postController.deletePost);

module.exports = router;
