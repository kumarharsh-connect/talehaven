const express = require('express');
const protectRoute = require('../middleware/protectRoute');

const {
  getUserProfile,
  toggleFollowUser,
  getSuggestedUsers,
  updateUserProfile,
  getUserFollowers,
  getUserFollowing,
} = require('../controllers/user.controller');

const router = express.Router();

router.get('/profile/:username', protectRoute, getUserProfile);
router.get('/suggested', protectRoute, getSuggestedUsers);
router.get('/following/:username', protectRoute, getUserFollowing);
router.get('/followers/:username', protectRoute, getUserFollowers);
router.post('/follow/:id', protectRoute, toggleFollowUser);
router.post('/update', protectRoute, updateUserProfile);

module.exports = router;
