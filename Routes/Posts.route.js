const express = require("express");
const router = express.Router();
const postController = require('../Controllers/Post.controller');
const { verifyAccessToken } = require("../helpers/jwt_helper");

//getting limited posts
router.get("/", verifyAccessToken, postController.getPosts);

// getting document count
router.get("/document-count", postController.documentCount);

//getting single post
router.get("/:postId", postController.getPost);

// saving post
router.post("/", verifyAccessToken, postController.addPost);

// deleing single post
router.delete("/:postId", postController.deletePost);

//update post
router.put("/:postId", postController.updatePost);

module.exports = router;
