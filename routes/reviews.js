const express = require('express');
const Router = express.Router({mergeParams: true});
const Review = require('../models/review');
const Campground = require("../models/campground");
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');

// Add a review to specific campground
Router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    campground.save();
    review.save();
    req.flash('success', 'Created your new review');
    res.redirect(`/campgrounds/${campground._id}`);
}))

// Delete a review from inside a campground
Router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfuly deleted review');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = Router;