const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require("./models/campground");
const methodOverride = require('method-override');
const engine = require('ejs-mate');

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

// All Campgrounds
app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

// Add new Campground
app.post("/campgrounds", async (req, res) => {
    const campground = new Campground(req.body.campground);
    console.log(await campground.save());
    res.redirect(`campgrounds/${campground._id}`);
});

// Serve the new Campground form
app.get("/campgrounds/new", (req, res) => {
    res.render('campgrounds/new');
});

// Specific campground
app.get("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground });
});

// Serve the update campground form
app.get("/campgrounds/:id/edit", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
});

// Update campground
app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${id}`);
});

// Delete campground
app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});



app.listen(3000, () => {
    console.log('Serving on port 3000');
})