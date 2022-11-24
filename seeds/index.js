// Add a sample data into the database

const mongoose = require('mongoose');
const Campground = require("../models/campground")
const cities = require('./cities');
const { places, descriptors } = require("./seedsHrlpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp")
    .then(() => {
        console.log('Database connected');
    })
    .catch(err => {
        console.log(err);
    });

// return a random element of an array
const sample = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    
    await Campground.deleteMany({}); // delete all previous data
    
    for(let i = 0; i < 50; i++){
        const somePlace = sample(cities); // random location object from cities.js
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${somePlace.city}, ${somePlace.state}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/daxjey47z/image/upload/v1669217937/YelpCamp/o4rqldopdmao2ikndfwv.jpg',
                  name: 'YelpCamp/o4rqldopdmao2ikndfwv',
                },
                {
                  url: 'https://res.cloudinary.com/daxjey47z/image/upload/v1669217939/YelpCamp/ffynyhwem8vms36nlx11.jpg',
                  name: 'YelpCamp/ffynyhwem8vms36nlx11',
                }
              ],
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Natus ea quos minima omnis aut, temporibus dicta quo deleniti nobis assumenda vero officia ipsum suscipit aliquam, error nostrum illo! In, omnis?',
            price: price,
            author: '637a0e27d9859f0b6b91e4dc',
            geometry: {
                type: "Point",
                coordinates: [-113.1331, 47.0202]
            },
        });
        
        await camp.save();
    }
}

// close connection when data insertion done
seedDB().then(() => {
    mongoose.connection.close();
})