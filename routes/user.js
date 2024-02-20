const express = require("express");
const router = express.Router();
const passport = require('passport')
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

router.get('/register', (req, res)=>{
    res.render('users/register')
})
router.post('/register', catchAsync(async (req, res)=>{
    try{
        const{email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        res.redirect('/nova');
    }
    catch (e){
        console.log(e.message)
        res.redirect('register')
    }
}))

router.get('/login', (req,res)=>{
    res.render('users/login');
})

/// A LOT OF HAND WAVY PASSPORT METHODS 
router.post('/login', passport.authenticate('local', {failureMessage: true, failureRedirect:'/404'}), (req, res)=>{
    res.redirect('/nova')
})

module.exports = router;