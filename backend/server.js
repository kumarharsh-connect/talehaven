const express = require('express');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const path = require('path');

const connectDatabase = require('./config/db.config');

const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const postRoutes = require('./routes/post.route');
const notificationRoutes = require('./routes/notification.route');
const searchRoutes = require('./routes/search.route');

require('dotenv').config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 5000;

connectDatabase();

const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('/*any', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html')
    );
  });
}

app.listen(PORT, () => {
  console.log(`Server running on the port: ${PORT}`);
});
