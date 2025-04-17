require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '10d',
  });

  res.cookie('token', token, {
    maxAge: 864000000, // 10 days
    httpOnly: true, // Prevents access to the cookie via JavaScript, helping protect against XSS attacks.
    sameSite: 'strict', // Prevents the cookie from being sent with cross-site requests
    secure: process.env.NODE_ENV !== 'development', // Only allow cookies on HTTPS in production
  });
};

module.exports = generateTokenAndSetCookie;
