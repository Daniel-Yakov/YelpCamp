const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// This adds on 'username' and 'password' fields to the schema
// and makes sure that the 'username' field is unique
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);