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
const config = require('./config');

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

const allAuthors = ["Shakespeare", "De Cervantes", "Oda"];

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

async function query(data) {
    console.log(data)
	const response = await fetch(
		"https://api-inference.huggingface.co/models/google/gemma-7b",
		{
			headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${config.token}`
             },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
    console.log(response)
	const result = await response.json();
	return result;
}


function process_response(txt){
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

let text = './ml/Pride_and_Prejudice_by_Jane_Austen.txt'

// COMMENT by LEAH actual functions for the pages 
app.get('/', (req,res)=>{
    res.render("pages/landing")
})


app.post('/nova_redirect', (req, res) => {
    let diff_query = req.body.diff;
    let auth_query = req.body.auth;
    let prmt_query = req.body.prmt;
    if (prmt_query!=""){
        app.locals.generateResults = {
            "diff" : diff_query,
            "auth" : auth_query,
            "prmt" : prmt_query
        };
        res.redirect('/nova');
    }
    else{
        req.flash('success', 'You Need A Prompt!')
        res.redirect('/nova');
    }
    
})

app.get('/nova', async (req, res)=>{
    let lines = await process(text);//generates the whole 
    let index = Math.floor(Math.random() * lines.length);
    
    let line = lines[index]
    console.log(line)
    /* let response = await query({"inputs": `translate: ${line}`})
    line = (response[0]['generated_text']); 
    console.log(response)
    */
    let sentence = line.split(" ");//makes the sentence a list 
    console.log( line, sentence)
    let nums = randomInts(Math.floor(sentence.length/10)+1, sentence.length);
    console.log(Math.floor(sentence.length/10)+1)
    nums = nums.sort(function(a, b){return a-b})
    console.log(nums)
    
    if( app.locals.generateResults != undefined){
        let temp = "immediately after,'now start writing' you will write your answer. You are an example in a textbook providing readers with a example to the prompt, answer with complete sentences only. WITHOUT steps and WITHOUT the quotation symbols: please"

        let response  = await query({"inputs": `${temp}${app.locals.generateResults["prmt"]}, now start writing:`})
        console.log(response)
        line = (response[0]['generated_text']).slice(temp.length + app.locals.generateResults["prmt"].length)

        let sentence = line.split(" ");//makes the sentence a list 
        console.log( line, sentence)
        let nums = randomInts(Math.floor(sentence.length/10)+1, sentence.length);
        console.log(Math.floor(sentence.length/10)+1)
        nums = nums.sort(function(a, b){return a-b})
        console.log(sentence)
        
        res.render("pages/home",  {text: JSON.stringify(sentence), 
            modifylist: JSON.stringify(nums), 
            modifiers: ['magically', 'organically', 'going'], 
            generateResults_diff: app.locals.generateResults["diff"],
            generateResults_auth: app.locals.generateResults["auth"],
            generateResults_prmt: app.locals.generateResults["prmt"],
            cadaAuthor : allAuthors
            })
        }
    else{
        res.render("pages/home",  {text: JSON.stringify(sentence), 
            modifylist: JSON.stringify(nums), 
            modifiers: ['magically', 'organically', 'going'], 
            generateResults_diff: "",
            generateResults_auth: "",
            generateResults_prmt: "",
            cadaAuthor : allAuthors
            })
        }
    

    
})

app.get('/submitted', async(req, res)=>{
    res.render("pages/submit")
})

app.get('/tutorial', isLoggedIn, async (req,res)=>{
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
app.get('/profile', isLoggedIn, async (req,res)=>{
    res.render('pages/profile', {username: req.user.username});
})



//////////////////////////////////////// 404 CANNOT FIND PAGE 
app.get('/*', (req, res) => {
    res.render('pages/404')
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
});

