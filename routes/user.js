const express = require("express");
const router = express.Router();
const passport = require('passport')
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { isLoggedIn } = require("../middleware");
const UserController = require('../controllers/user_controller.js');

router.get('/register', (req, res)=>{
    res.render('users/register')
})
router.post('/register', catchAsync(async (req, res, next)=>{
    try{
        const{email, username, password} = req.body;
        
        await UserController.signup(req,res);
         // This is just Passport

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
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async(req, res)=>{
    //await UserController.login(req,res); // STILL WORKING ON THIS
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