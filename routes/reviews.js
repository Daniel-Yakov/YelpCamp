const express = require('express');
const Router = express.Router({mergeParams: true});
const { reviewSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const Campground = require("../models/campground");
const wrapAsync = require('../utils/wrapAsync');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// Add a review to specific campground
Router.post("/", validateReview, wrapAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    campground.save();
    review.save();
    req.flash('success', 'Created your new review');
    res.redirect(`/campgrounds/${campground._id}`);
}))

// Delete a review from inside a campground
Router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfuly deleted review');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = Router;