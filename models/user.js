const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const config = require('../config');

const UserSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email:{
        type: String, 
        required: true, 
        unique: true
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    }
});

UserSchema.methods.generateVerificationToken = function () {
    const user = this;
    const verificationToken = jwt.sign(
        { ID: user._id },
        config.USER_VERIFICATION_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
    return verificationToken;
};

UserSchema.plugin(passportLocalMongoose); //adds the username and password fields 

module.exports = mongoose.model('User', UserSchema);

