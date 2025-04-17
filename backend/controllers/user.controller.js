// modules
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;

// models
const User = require('../models/user.model');
const Notification = require('../models/notification.model');

const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log('Error in getUserProfile ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleFollowUser = async (req, res) => {
  try {
    const { id: targetUserId } = req.params;
    const loggedInUserId = req.user._id;

    if (loggedInUserId.equals(targetUserId)) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }

    // Fetch both users simultaneously
    const [loggedInUser, targetUser] = await Promise.all([
      User.findById(loggedInUserId),
      User.findById(targetUserId),
    ]);

    if (!loggedInUser || !targetUser)
      return res.status(404).json({ error: 'User not found' });

    const isFollowing = loggedInUser.following.includes(targetUserId);

    await User.bulkWrite([
      {
        updateOne: {
          filter: { _id: loggedInUserId }, // update loggedInUser
          update: isFollowing
            ? { $pull: { following: targetUserId } } // unfollow
            : { $push: { following: targetUserId } }, // follow
        },
      },
      {
        updateOne: {
          filter: { _id: targetUserId }, // update targetUser
          update: isFollowing
            ? { $pull: { followers: loggedInUserId } } // Remove follower
            : { $push: { followers: loggedInUserId } }, // add follower
        },
      },
    ]);

    if (!isFollowing) {
      const newNotification = new Notification({
        type: 'follow',
        from: loggedInUserId,
        to: targetUserId,
      });

      await newNotification.save();
    }

    res.status(200).json({
      message: isFollowing
        ? 'User unfollowed successfully'
        : 'User followed successfully',
    });
  } catch (error) {
    console.log('Error in toggleFollowUser controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSuggestedUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const loggedInUser = await User.findById(loggedInUserId).select(
      'following'
    );
    const followingList = loggedInUser?.following || [];

    const suggestedUsers = await User.aggregate([
      {
        $match: {
          _id: { $ne: loggedInUserId, $nin: followingList },
        },
      },

      { $sample: { size: 4 } },

      { $project: { password: 0 } },
    ]);

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log('Error in getSuggestedUsers controller ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const {
      username,
      email,
      fullName,
      currentPassword,
      newPassword,
      bio,
      link,
      profileImg,
      coverImg,
    } = req.body;

    const userId = req.user._id;

    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (
      (!currentPassword && newPassword) ||
      (currentPassword && !newPassword)
    ) {
      return res
        .status(400)
        .json({ error: 'Please provide both current and new password' });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: 'Password must be at least 6 characters long' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Handle Image Uploads
    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split('/').pop().split('.')[0]
        );
      }
      const uploadedProfile = await cloudinary.uploader.upload(profileImg);
      user.profileImg = uploadedProfile.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split('/').pop().split('.')[0]
        );
      }
      const uploadedCover = await cloudinary.uploader.upload(coverImg);
      user.coverImg = uploadedCover.secure_url;
    }

    // Update other fields
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;

    await user.save();

    user.password = null;

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in updateUserProfile controller:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserFollowing = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate(
      'following',
      'username fullName profileImg'
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user.following);
  } catch (error) {
    console.log('Error in getUserFollowing controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserFollowers = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).populate(
      'followers',
      'username fullName profileImg'
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user.followers);
  } catch (error) {
    console.log('Error in getUserFollowers controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { updateUserProfile };

module.exports = {
  getUserProfile,
  toggleFollowUser,
  getSuggestedUsers,
  updateUserProfile,
  getUserFollowing,
  getUserFollowers,
};
