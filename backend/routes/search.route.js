const express = require('express');
const protectRoute = require('../middleware/protectRoute');

const { searchUsers } = require('../controllers/search.controller');

const router = express.Router();

router.get('/', protectRoute, searchUsers);

module.exports = router;
