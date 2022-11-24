const { number } = require('joi');
const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const Schema = mongoose.Schema;
const Review = require("./review");

const imageSchema = new Schema({
    url: String,
    name: String
});
// 'https://res.cloudinary.com/daxjey47z/image/upload/v1669217937/YelpCamp/o4rqldopdmao2ikndfwv.jpg'
imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('upload', 'upload/w_200,h_200');
})

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description:String,
    location: String,
    author: {
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId, 
            ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>`;
});

CampgroundSchema.post("findOneAndDelete", async(deletedCampground) => {
    if(deletedCampground){
        await Review.deleteMany({
            _id: {
                $in: deletedCampground.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);