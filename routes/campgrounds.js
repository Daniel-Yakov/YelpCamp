const express = require('express');
const Router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Campground = require("../models/campground");
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require('../schemas');
const { isLoggedIn } = require('../middleware');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

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
    await campground.save();
    req.flash('success', 'Successfuly made a new campground');
    res.redirect(`campgrounds/${campground._id}`);
}));

// Specific campground
Router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground){
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

// Serve the update campground form
Router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

// Update campground
Router.put("/:id", isLoggedIn, validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${id}`);
}));

// Delete campground
Router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
}));

module.exports = Router;