const User = require('../models/user.model');
const Post = require('../models/post.model');
const Notification = require('../models/notification.model');
const cloudinary = require('cloudinary').v2;

const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;

    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: 'User not found' });

    if (!text && !img) {
      return res
        .status(400)
        .json({ error: 'Post must have either text or image' });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log('Error in createPost controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(400).json({ error: 'Post not found' });

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: 'You are not authorized to delete this post' });
    }

    if (post.img) {
      const publicId = post.img.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.log('Error in deletePost controller ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addCommentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) return res.status(400).json({ error: 'Text field is required' });

    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ error: 'Post not found' });

    const comment = { user: userId, text };

    post.comments.push(comment);
    await post.save();

    const populatedPost = await Post.findById(postId).populate({
      path: 'comments.user',
      select: 'fullName username profileImg',
    });

    const updatedComments = populatedPost.comments;
    res.status(200).json(updatedComments);
  } catch (error) {
    console.log('Error in createComment controller ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleLikeOnPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) return res.status(400).json({ error: 'Post not found' });

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      // unlike the post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      return res.status(200).json(updatedLikes);
    }

    // like the post
    post.likes.push(userId);
    await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
    await post.save();

    if (userId.toString() !== post.user.toString()) {
      // don't send notification if user like their of post
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: 'like',
      });

      await notification.save();
    }

    const updatedLikes = post.likes;
    res.status(200).json(updatedLikes);
  } catch (error) {
    console.log('Error in toggleLikeOnPost controller ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'comments.user',
        select: '-password',
      });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    console.log('Error in getAllPosts controller ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getLikedPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: 'User not found' });

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'comments.user',
        select: '-password',
      });

    res.status(200).json(likedPosts);
  } catch (error) {
    console.log('Error in getLikedPosts controller ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: 'User not found' });

    const following = user.following;

    const followingPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({ path: 'user', select: '-password' })
      .populate({ path: 'comments.user', select: '-password' });

    res.status(200).json(followingPosts);
  } catch (error) {
    console.log('Error in getFollowingPosts controller ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ error: 'User not found' });

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'comments.user',
        select: '-password',
      });

    res.status(200).json(posts);
  } catch (error) {
    console.log('Error in getUserPosts controller ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createPost,
  deletePost,
  addCommentOnPost,
  toggleLikeOnPost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
  getUserPosts,
};
