const express = require("express");
const router = express.Router();
const postController = require('../Controllers/Post.controller');

//getting limited posts
router.get("/", postController.getPosts);

// getting document count
router.get("/documentCount", postController.documentCount);

//getting single post
router.get("/:postId", postController.getPost);

// saving post
router.post("/", postController.addPost);

// deleing single post
router.delete("/:postId", postController.deletePost);

//update post
router.put("/:postId", postController.updatePost);

module.exports = router;
