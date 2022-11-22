const express = require('express');
const Router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');


// All Campgrounds
Router.get("/", wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

// Serve the new Campground form
Router.get("/new", isLoggedIn,  (req, res) => {
    res.render('campgrounds/new');
});

// Add new Campground
Router.post("/", isLoggedIn, validateCampground, wrapAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfuly made a new campground');
    res.redirect(`campgrounds/${campground._id}`);
}));

// Specific campground
Router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: 'reviews', 
            populate: {
                path: 'author'
        }}).populate('author');
    if(!campground){
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

// Serve the update campground form
Router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

// Update campground
Router.put("/:id", isLoggedIn, isAuthor, validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${id}`);
}));

// Delete campground
Router.delete("/:id", isLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
}));

module.exports = Router;