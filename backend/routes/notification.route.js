const express = require('express');
const protectRoute = require('../middleware/protectRoute');

const router = express.Router();

const {
  getNotifications,
  deleteNotifications,
  deleteNotification,
} = require('../controllers/notification.controller');

router.get('/', protectRoute, getNotifications);
router.delete('/', protectRoute, deleteNotifications);
router.delete('/:id', protectRoute, deleteNotification);

module.exports = router;
