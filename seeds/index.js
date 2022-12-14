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
    
    for(let i = 0; i < 200; i++){
        const somePlace = sample(cities); // random location object from cities.js
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${somePlace.city}, ${somePlace.state}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/daxjey47z/image/upload/v1669387509/YelpCamp/e57rjm1phvr8fqx4hxms.jpg',
                  name: 'YelpCamp/e57rjm1phvr8fqx4hxms',
                },
                {
                  url: 'https://res.cloudinary.com/daxjey47z/image/upload/v1669387510/YelpCamp/jheo74xbpgyjulzxy1r4.jpg',
                  name: 'YelpCamp/jheo74xbpgyjulzxy1r4',
                }
              ],
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Natus ea quos minima omnis aut, temporibus dicta quo deleniti nobis assumenda vero officia ipsum suscipit aliquam, error nostrum illo! In, omnis?',
            price: price,
            author: '637a0e27d9859f0b6b91e4dc',
            geometry: {
                type: "Point",
                coordinates: [somePlace.longitude, somePlace.latitude]
            },
        });
        
        await camp.save();
    }
}

// close connection when data insertion done
seedDB().then(() => {
    mongoose.connection.close();
})