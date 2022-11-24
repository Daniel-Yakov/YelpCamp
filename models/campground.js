const { number } = require('joi');
const mongoose = require('mongoose');
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