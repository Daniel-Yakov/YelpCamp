const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');

// Serve the registeration form
router.get('/register', (req, res) => {
    res.render('users/register');
});

// Register user
router.post('/register', wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        // login the user after registration
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        });
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

// Serve the login form 
router.get("/login", (req, res) => {
    res.render('users/login');
});

// Loginin user
router.post("/login", passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

// Logout user
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/campgrounds');
      });
});

module.exports = router;
