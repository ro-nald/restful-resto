const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/user');

// For now, want sign-up and sign-in
// since this API is stateless, don't need log-out for now

router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.delete('/:userId', checkAuth, UserController.delete_user);

module.exports = router;