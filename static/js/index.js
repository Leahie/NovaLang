//document.querySelector("h1").innerText="Nova Lang" don't use, just an example of querySelector
// zoom.js
// description: zooming in/out functionality



let count = 0
let countTemp = 0
FirstTime = true
let textBody =  document.querySelector('#textBody').innerHTML // This is how we get the index
textBody = textBody.replace(/'/g, '"') //replacing all ' with "
textBody = JSON.parse(textBody)

let modifyList = document.querySelector('#modifyList').innerHTML 
modifyList = modifyList.replace(/'/g, '"') //replacing all ' with "
modifyList = JSON.parse(modifyList)

console.log( textBody, modifyList)

let selected = textBody[modifyList[count]]
console.log(selected)

if(FirstTime == true){
    let textCorpus = document.querySelector("#text-corpus")
    let temp = "";
    for( let i = 0; i < textBody.length; i++  ){
    if(i==modifyList[count]){
        temp = temp + " " + `<span id='${count}' style='color:red;'>${textBody[i]}</span>`
    }
    else{
        temp = temp + " " + textBody[i]
    }
    }
    console.log(temp)
    textCorpus.innerHTML = temp

    
    FirstTime = false
}

//pressing button keys
/*var option1 = document.getElementsByClassName('option1 ul_top_hypers');
var option2 = document.getElementsByClassName('option2 ul_top_hypers');
var option3 = document.getElementsByClassName('option3 ul_top_hypers');

option1.addEventListener("keypress", function(event)
{
    if(event.key === "1"){
        event.preventDefault();
        document.getElementsByClassName('option1 ul_top_hypers').click();
    }
});*/

$(document).keydown(function(e){
    switch (e.which){
        
    }
})

$(document).keydown(function(e) {
switch (e.which) {
    case 37: // left
    next(false, -1, countTemp);
    break;  

    case 39: // right
    next(false, 1, countTemp)
    break;
}
e.preventDefault(); 
});

// Pressing one of the lis 
function next(countTrue=true, add=1, curr=count){
if(countTrue){
    if(count+1 < modifyList.length){
    count+=1
    countTemp = count
    selected = textBody[modifyList[count]]
    console.log(selected)
    generateText(count)
    
    }
}
else{
    if(curr+add <= count && curr+add >=0){
    countTemp+=add
    selected = textBody[modifyList[countTemp]]
    console.log(selected)
    generateText(countTemp)
    
    }
}
}
function generateText(curr){
let textCorpus = document.querySelector("#text-corpus")
let temp = "";
for( let i = 0; i < textBody.length; i++  ){
    if(i==modifyList[curr]){
    temp = temp + " " + `<span id='${curr}' style='color:red;'>${textBody[i]}</span>`
    }
    else{
    temp = temp + " " + textBody[i]
    }
}
console.log(temp)
textCorpus.innerHTML = temp

document.getElementById(curr).scrollIntoView()({
    behavior: 'smooth'
});

}

let zoom = true;
let container = document.getElementById("text");
let text = document.getElementById("text-corpus");

window.addEventListener('keydown', e => {
    switch (e.key) { 
        case ' ':
        if (zoom == true){
            zoom = false;
            text.style = 'font-size: 1.5vw'
            container.style = 'display: inline-block; height: unset'
        }
    

        else if (zoom == false){
            zoom = true;
            text.style = 'font-size: 5vw'
            container.style = 'display: inline-block; height: 45vh'
            document.getElementById(countTemp).scrollIntoView()({
                behavior: 'smooth'
            });
        }

    }
});

