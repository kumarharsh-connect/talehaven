const express = require('express');
const protectRoute = require('../middleware/protectRoute');
const {
  createPost,
  deletePost,
  addCommentOnPost,
  toggleLikeOnPost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
} = require('../controllers/post.controller');

const router = express.Router();

router.get('/all', protectRoute, getAllPosts);
router.get('/likes/:id', protectRoute, getLikedPosts);
router.get('/following', protectRoute, getFollowingPosts);
router.get('/user/:username', protectRoute, getUserPosts);
router.post('/create', protectRoute, createPost);
router.post('/like/:id', protectRoute, toggleLikeOnPost);
router.post('/comment/:id', protectRoute, addCommentOnPost);
router.delete('/:id', protectRoute, deletePost);

module.exports = router;
