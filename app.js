if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');


mongoose.connect("mongodb://localhost:27017/yelp-camp")
    .then(() => {
        console.log('Database connected');
    })
    .catch(err => {
        console.log(err);
    });

const app = express();

app.engine('ejs', engine);

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'thisisnotverysecure',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}));
app.use(flash());

// passport configuration
app.use(passport.initialize()); 
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to add locals to the rendered templates
app.use((req, res, next) => {
    res.locals.logedInUser = req.user; // 'user' added to the req object by passport, contains the session information (uses the serializeUser and deserializeUser) of the user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Add the different routes
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);


// URL that doesn't exist
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

// ErrorHandler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!';
    res.status(statusCode).render('error', { err });
})



app.listen(3000, () => {
    console.log('Serving on port 3000');
})