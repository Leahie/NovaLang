const express = require("express");
const router = express.Router();
const passport = require('passport')
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { isLoggedIn } = require("../middleware");

router.get('/register', (req, res)=>{
    res.render('users/register')
})
router.post('/register', catchAsync(async (req, res, next)=>{
    try{
        const{email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err =>{
            if(err) return next(err)
            req.flash('Welcome '+req.user.username)
            res.redirect('/nova');
        })
        
    }
    catch (e){
        console.log(e.message)
        res.redirect('register')
    }
}))

router.get('/login',  (req,res)=>{
    res.render('users/login');
})

/// A LOT OF HAND WAVY PASSPORT METHODS 
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}), (req, res)=>{
    req.flash('success', 'Welcome Back '+ req.user.username)
    res.redirect('/nova')
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out!');
        res.redirect('/nova');
    });
}); 

module.exports = router;