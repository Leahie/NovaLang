const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

//const config = require('../config');
//require('dotenv').config()
require('dotenv').config()

const UserSchema = new Schema({
    email:{
        type: String, 
        required: true, 
        unique: true
    },
    numEasy: {
        type: Number,
        default: 0
    },
    numHard: {
        type: Number,
        default: 0
    },
    easyAccuracy: {
        type: Number,
        default: 0
    },
    hardAccuracy: {
        type: Number,
        deafult: 0
    }
});

UserSchema.methods.generateVerificationToken = function () {
    const user = this;
    const verificationToken = jwt.sign(
        { ID: user._id },
        process.env.USER_VERIFICATION_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
    return verificationToken;
};

UserSchema.plugin(passportLocalMongoose); //adds the username and password fields 

module.exports = mongoose.model('User', UserSchema);

