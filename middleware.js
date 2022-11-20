// the passport middleware added the 'isAuthenticated' method to the req object
// it's uses the session middleware
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be loged in');
        return res.redirect('/login');
    }
    next();
}