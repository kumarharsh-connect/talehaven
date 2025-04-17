// modules
const bcrypt = require('bcryptjs');

// models
const User = require('../models/user.model');

const generateTokenAndSetCookie = require('../services/auth.service');

const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    // Email validator
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // Check if the email is in correct format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if username already exists or not
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'This username is already taken' });
    }

    // Check if email already exists or not
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'This email is already taken' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be atleast 6 characters long' });
    }

    // hashing the password
    const salt = await bcrypt.genSalt(10); // more the number more secure it will be but slower
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating a new user
    const newUser = new User({
      fullName: fullName,
      username: username,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
    }

    res.status(201).json({
      _id: newUser.id,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      followers: newUser.followers,
      following: newUser.following,
      profileImg: newUser.profileImg,
      coverImg: newUser.coverImg,
    });
  } catch (error) {
    console.log('Error in login signup controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // find the user with the username
    const user = await User.findOne({ username });

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ''
    ); // comparing the entered password with the password in db or with empty string so it doesn't give error

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log('Error in login controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie('token', '', { maxAge: 0 });
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log('Error in logout controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.log('Error in getMe controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getMe, signup, login, logout };
