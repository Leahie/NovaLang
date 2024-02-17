const express = require("express");
const path = require('path');
const ejsMate = require('ejs-mate');
const fs = require("fs")

const app = express();
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const static_files_router = express.static('static')
app.use( static_files_router ) 

app.use(express.urlencoded({ extended: true }));


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

app.get('/tutorial', (req,res)=>{
    res.render('pages/tutorial')
})

app.get('/*', (req, res) => {
    res.render('pages/404')
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
});

