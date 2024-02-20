const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const ejsMate = require('ejs-mate');
const fs = require("fs")
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')

const userRoutes = require('./routes/user');

mongoose.connect('mongodb://127.0.0.1:27017/nova');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
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

app.use('/', userRoutes);

// COMMENT by LEAH important functions that we use 

function process(txt){
    return new Promise((resolve, reject)=>{
        fs.readFile(txt, (err, inputD) => {
            if (err)  reject(err);
            let val = inputD.toString();
            let lines = [];
            let sentence = "";
            for (let i = 0;i<val.length; i++){
                if(val[i]=="\n")sentence+= " ";
                else if(val[i]=='.' || val[i]==';' || val[i]=='!'){
                    sentence+=val[i]
                    if (sentence.length>=50 && !sentence.includes('_'))
                        lines.push(sentence); 
                    sentence = "";
                }
                else{
                    sentence+=val[i]
                } 
            }
            resolve(lines)
        })
    })
    
    
}

function randomInts(num, max){
    let nums = new Set();
    while(nums.size<num){
        var candidateInt = Math.floor(Math.random() * (max)) + 1
        nums.add(candidateInt)
    }
    return [...nums]
}

let text = './ml/Pride_and_Prejudice_by_Jane_Austen.txt'

// COMMENT by LEAH actual functions for the pages 
app.get('/', (req,res)=>{
    res.render("pages/landing")
})

app.get('/nova', async (req, res)=>{
    let lines = await process(text);//generates the whole 
    let index = Math.floor(Math.random() * lines.length);
    let sentence = lines[index].split(" ");//makes the sentence a list 
    console.log( lines[index], sentence)
    let nums = randomInts(Math.floor(sentence.length/10)+1, sentence.length);
    console.log(Math.floor(sentence.length/10)+1)
    nums = nums.sort(function(a, b){return a-b})
    console.log(nums)
    
    res.render("pages/home",  {text: JSON.stringify(sentence), modifylist: JSON.stringify(nums), modifiers: ['magically', 'organically', 'going']})
})

app.get('/tutorial', async (req,res)=>{
    let lines = await process(text);//generates the whole 
    let index = Math.floor(Math.random() * lines.length);
    let sentence = lines[index].split(" ");//makes the sentence a list 
    console.log( lines[index], sentence)
    let nums = randomInts(Math.floor(sentence.length/10)+1, sentence.length);
    console.log(Math.floor(sentence.length/10)+1)
    nums = nums.sort(function(a, b){return a-b})
    console.log(nums)
    
    res.render('pages/tutorial',  {text: JSON.stringify(sentence), modifylist: JSON.stringify(nums), modifiers: ['magically', 'organically', 'going']})
})
//////////////////////////////////////// LOG IN AND SIGN OUT




//////////////////////////////////////// 404 CANNOT FIND PAGE 
app.get('/*', (req, res) => {
    res.render('pages/404')
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
});

