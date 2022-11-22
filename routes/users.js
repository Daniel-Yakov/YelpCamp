const express = require('express');
const passport = require('passport');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const users = require('../controllers/users');

router.route('/register')
    // Serve the registeration form
    .get(users.renderRegisterForm)
    // Register user
    .post(wrapAsync(users.createUser));

router.route('/login')
    // Serve the login form 
    .get(users.renderLoginForm)
    // Login user
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), users.loginUser);

// Logout user
router.get('/logout', users.logoutUser);

module.exports = router;
