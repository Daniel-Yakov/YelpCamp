const Review = require('../models/review');
const Campground = require("../models/campground");

// Add a review to a campground
module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    campground.save();
    review.save();
    req.flash('success', 'Created your new review');
    res.redirect(`/campgrounds/${campground._id}`);
}

// Delete a review
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfuly deleted review');
    res.redirect(`/campgrounds/${id}`);
}