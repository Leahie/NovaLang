const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const fs = require("fs")
require('dotenv').config()
const allAuthors = ["Shakespeare", "De Cervantes", "Oda"];

function processing(txt){
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

async function query(data){
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/gemma-7b",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TOKEN}`
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    console.log(response);
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


router.post('/nova_redirect', (req, res) => {
    let diff_query = req.body.diff;
    let auth_query = req.body.auth;
    let prmt_query = req.body.prmt;
    if (prmt_query!=""){
        req.app.locals.generateResults = {
            "diff" : diff_query,
            "auth" : auth_query,
            "prmt" : prmt_query
        };
        res.redirect('/easy');
    }
    else{
        req.app.locals.generateResults = {
            "diff" : diff_query,
            "auth" : auth_query,
            "prmt" : undefined
        };
        res.redirect('/easy');
    }
    
})

router.get('/easy', async (req, res)=>{
    let lines = await processing(text);//generates the whole 
    let index = Math.floor(Math.random() * lines.length);
    let line = lines[index]
    console.log(line)
    let sentence = line.split(" ");//makes the sentence a list 
    console.log( line, sentence)
    let nums = randomInts(Math.floor(sentence.length/10)+1, sentence.length);
    console.log(Math.floor(sentence.length/10)+1)
    nums = nums.sort(function(a, b){return a-b})

    if (req.app.locals.generateResults != undefined && req.app.locals.generateResults["prmt"] != undefined) {
        const prompt = `Hey Gemini, you are a helpful chatbot that responds carefully to every prompt and suggestion; when someone asks you to write an email or create a presentation, generate the content in the requested format, ensuring it's detailed and well-formatted.
        You are an exemplare text generator you are not providing guidelines or you are giving FULL TEXT no BLANK SPACES, you are the orignal text and others follow your example. You are writing professionally and with care. Thank you! Don't forget to try to finish the example
        within one paragraph, this example is not a list of instructions, you are not talking to the user you are just providing an example. Now I am asking you to please provide an example of: ${req.app.locals.generateResults["prmt"] }`;
        
        let response = await query({ inputs: prompt });
        console.log(response);


        line = response[0]['generated_text'].slice(prompt.length);

        let sentence = line.split(" ");//makes the sentence a list 
        console.log( line, sentence)
        let nums = randomInts(Math.floor(sentence.length/10)+1, sentence.length);
        console.log(Math.floor(sentence.length/10)+1)
        nums = nums.sort(function(a, b){return a-b})
        console.log(sentence)
        
        res.render("pages/home",  {text: JSON.stringify(sentence), 
            modifylist: JSON.stringify(nums), 
            modifiers: ['magically', 'organically', 'going'], 
            generateResults_diff: "easy",
            generateResults_auth: req.app.locals.generateResults["auth"],
            generateResults_prmt: req.app.locals.generateResults["prmt"],
            cadaAuthor : allAuthors
            })
        }
    else if(req.app.locals.generateResults != undefined){
        res.render("pages/home",  {text: JSON.stringify(sentence), 
            modifylist: JSON.stringify(nums), 
            modifiers: ['magically', 'organically', 'going'], 
            generateResults_diff: "easy",
            generateResults_auth: "",
            generateResults_prmt: "",
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
});

const arrayRange = (start, stop, step=1) =>
    Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
    );

router.get('/hard', async (req, res) =>{
    let lines = await processing(text);//generates the whole 
    let index = Math.floor(Math.random() * lines.length);
    let line = lines[index]
    console.log(line)
    let sentence = line.split(" ");//makes the sentence a list 
    console.log( line, sentence)
    let nums = arrayRange(1, sentence.length)
    console.log(Math.floor(sentence.length/10)+1)

    if (req.app.locals.generateResults != undefined && req.app.locals.generateResults["prmt"] != undefined) {
        const prompt = `GIVE ME A GOOD EXAMPLE OF ${req.app.locals.generateResults["prmt"]}. Please just give me the example. Please do not inlcude this phrase in your response. Don't give me a step by step guide, just give me a GOOD example of ${req.app.locals.generateResults["prmt"]}, and try to be as humanly as possible.`;
    
        let response = await query({ inputs: prompt });
        console.log(response);

        let exampleStart = response[0]['generated_text'].indexOf("answer:");
        if (exampleStart === -1) {
        exampleStart = response[0]['generated_text'].indexOf(":") + 1;
        }
        line = response[0]['generated_text'].slice(exampleStart);

        let sentence = line.split(" ");//makes the sentence a list 
        console.log( line, sentence)
        let nums = randomInts(Math.floor(sentence.length/10)+1, sentence.length);
        console.log(Math.floor(sentence.length/10)+1)
        nums = nums.sort(function(a, b){return a-b})
        console.log(sentence)
        
        res.render("pages/hard",  {text: JSON.stringify(sentence), 
            modifylist: JSON.stringify(nums), 
            modifiers: ['magically', 'organically', 'going'], 
            generateResults_diff: req.app.locals.generateResults["diff"],
            generateResults_auth: req.app.locals.generateResults["auth"],
            generateResults_prmt: req.app.locals.generateResults["prmt"],
            cadaAuthor : allAuthors
            })
        }
    else if(req.app.locals.generateResults != undefined){
        res.render("pages/hard",  {text: JSON.stringify(sentence), 
            modifylist: JSON.stringify(nums), 
            modifiers: ['magically', 'organically', 'going'], 
            generateResults_diff: req.app.locals.generateResults["diff"],
            generateResults_auth: "",
            generateResults_prmt: "",
            cadaAuthor : allAuthors
            })
        }
        
    else{
        res.render("pages/hard",  {text: JSON.stringify(sentence), 
            modifylist: JSON.stringify(nums), 
            modifiers: ['magically', 'organically', 'going'], 
            generateResults_diff: "hard",
            generateResults_auth: "",
            generateResults_prmt: "",
            cadaAuthor : allAuthors
            })
        }
});

module.exports = router;