const Campground = require("../models/campground");
const { cloudinary } = require('../cloudinary');

// Find all campgrounds
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

// Render the new campground form
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

// Create a new campground
module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, name: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfuly made a new campground');
    res.redirect(`campgrounds/${campground._id}`);
}

// Show detailed campground's page
module.exports.renderCampgroundDetails = async (req, res) => {
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
}

// Render the deit campground form
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

// Edit a campground
module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    // Adding images
    const imgs = req.files.map(f => ({url: f.path, name: f.filename}));
    campground.images.push(...imgs); // using the spread oparator, add the new photos to the existing ones
    await campground.save();
    // Deleting images
    if (req.body.deleteImages) {
        // Deleting from cloudinary
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        // Deleting from mongoDB, from the campground model
        await campground.updateOne({$pull: {images: {name: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${id}`);
}

// Delete campground
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
}