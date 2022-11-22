const express = require('express');
const Router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');

// Add a review to specific campground
Router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.createReview));

// Delete a review from inside a campground
Router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview));

module.exports = Router;