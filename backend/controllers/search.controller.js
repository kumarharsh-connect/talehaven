const User = require('../models/user.model');

const searchUsers = async (req, res) => {
  try {
    const search_query = req.query.search_query;

    if (!search_query) {
      return res.status(200).json([]);
    }

    const users = await User.find({
      $or: [
        { username: { $regex: search_query, $options: 'i' } },
        { fullName: { $regex: search_query, $options: 'i' } },
      ],
    }).select('_id username fullName profileImg');

    res.status(200).json(users);
  } catch (error) {
    console.error('Error in searchUsers controller:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { searchUsers };
