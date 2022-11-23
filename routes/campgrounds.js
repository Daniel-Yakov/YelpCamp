const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route("/")
    // All Campgrounds
    .get(wrapAsync(campgrounds.index))
    // Add new Campground
    .post(isLoggedIn, upload.array('image'), validateCampground, wrapAsync(campgrounds.createCampground));
    

// Serve the new Campground form
router.get("/new", isLoggedIn,  campgrounds.renderNewForm);

router.route("/:id")
    // Specific campground
    .get(wrapAsync(campgrounds.renderCampgroundDetails))
    // Update campground
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, wrapAsync(campgrounds.editCampground))
    // Delete campground
    .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground));

// Serve the update campground form
router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(campgrounds.renderEditForm));

module.exports = router;
