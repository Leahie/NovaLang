const bodyparser = require("body-parser")
const express = require("express");
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const fs = require("fs")
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const speakeasy = require("speakeasy")
const User = require('./models/user')
const {isLoggedIn} = require('./middleware');
const userRoutes = require('./routes/user');
const gameRoutes = require('./routes/game');
const positivity = require('positivity-api');
require('dotenv').config()

const uri = process.env.MONGODB_CONNECTION_STRING;

//const config = require('./config');

mongoose.connect(uri);

const db = mongoose.connection;
/* 
db.on("error", console.error.bind(console, "connection error:"));
*/
// db.collection.update({ "_id" : "660c6a3190bdd2f44452021c" }, {$inc: { "numEasy" : 1}} )

db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extendedx: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // How to STORE user
passport.deserializeUser(User.deserializeUser()); // How to UNSTORE user

const static_files_router = express.static('static')
app.use( static_files_router ) 
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/// REMEMBER when you get an incorrect password and something flashes up, basically this, is a MIDDLEWARE - LEAH
app.use((req,res, next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.use('/', userRoutes);
app.use('/', gameRoutes);


// COMMENT by LEAH important functions that we use 

// COMMENT by LEAH actual functions for the pages 
app.get('/', (req,res)=>{
    res.render("pages/landing")
})

app.post('/submitted', (req, res)=>{
    console.log(req.body)
    res.redirect(`/submitted/${parseInt(req.body.var1)}`);
})
app.get('/submitted/:score', async(req, res)=>{
    console.log(req.params.score)
    res.render("pages/submit", {score: req.params.score, statement: positivity.random()})
})

app.get('/tutorial', isLoggedIn, async (req,res)=>{
    res.send("Hidden Page!")
  })

app.get('/key', async(req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    key = {
        "token" : process.env.TOKEN,
        "ninja_key" : process.env.NINJA_KEY,
        "currUser" : res.locals.currentUser
    }
    console.log(res.locals.currentUser);
    res.send(JSON.stringify(key))
})
//////////////////////////////////////// LOG IN AND SIGN OUT
app.get('/profile', isLoggedIn, async (req,res)=>{
    res.render('pages/profile', {username: req.user.username });
})



//////////////////////////////////////// 404 CANNOT FIND PAGE 
app.get('/*', (req, res) => {
    res.render('pages/404')
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
});

