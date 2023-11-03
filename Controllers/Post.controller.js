const PostSchema = require("../Schema/Post.schema");
const Post = require("../Models/Post.model");
const createError = require('http-errors')

const getPosts = async (req, res, next) => {
  try {
    if (req.query.page === "all") {
      const posts = await Post.find();
      res.json(posts);
    } else {
      const posts = await Post.find(
        req.query.category && {
          category: req.query.category,
        }
      )
        .limit(4)
        .skip(req.query.page * 4);
      res.json(posts);
    }
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const deletePost = await Post.findByIdAndDelete(req.params.postId);
    if (deletePost) return res.json("Post has been deleted");
    throw createError.NotFound()
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const result = await PostSchema.validateAsync(req.body);

    const updatePost = await Post.findByIdAndUpdate(
      postId,
      result
    );
    if (updatePost) return res.json("Post has been updated");
    throw createError.NotFound()

  } catch (error) {
    if (error.isJoi == true) error.status = 422;

    next(error);
  }
};

const documentCount = async (req, res, next) => {
  try {
    const category = req.query.category;
    const posts = await Post.find(
      category && {
        category: category,
      }
    ).countDocuments();

    res.json(posts);
  } catch (error) {
    next(error)
  }
};

const addPost = async (req, res, next) => {
  try {
    const result = await PostSchema.validateAsync(req.body);

    const post = new Post(result);
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    if (error.isJoi == true) error.status = 422;

    next(error);
  }
};

module.exports = {
    getPosts,
    getPost,
    documentCount,
    addPost,
    updatePost,
    deletePost,
}