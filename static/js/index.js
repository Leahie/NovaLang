//document.querySelector("h1").innerText="Nova Lang" don't use, just an example of querySelector
// zoom.js
// description: zooming in/out functionality


//Globals
let count = 0
let countTemp = 0
let modifiers = {}


FirstTime = true
let textBody =  document.querySelector('#textBody').innerHTML // This is how we get the index
textBody = textBody.replace(/'/g, '"') //replacing all ' with "
textBody = JSON.parse(textBody)

let modifyList = document.querySelector('#modifyList').innerHTML 
modifyList = modifyList.replace(/'/g, '"') //replacing all ' with "
modifyList = JSON.parse(modifyList)

console.log( textBody, modifyList)

let selected = textBody[modifyList[count]]


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


$(document).keydown(function(e) {
switch (e.which) {
    case 37: // left
        next(null, false, -1, countTemp);
        break;  

    case 39: // right
        next(null, false, 1, countTemp)
        break;

    case 49:
        next(0)

    case 50:
        next(1)

    case 51:
        next(2)
}
e.preventDefault(); 
});

// Pressing one of the lis 
function next(option, countTrue=true, add=1, curr=count){
if(countTrue){
    if(count+1 < modifyList.length){
        let currOpt = document.querySelectorAll(".modifiers")
        console.log(option)
        console.log(currOpt[option])
        modifiers[count] = currOpt[option].innerHTML
        let choices = document.querySelector("#choices")
        choices.innerText = JSON.stringify(modifiers)
        console.log(modifiers)

        count+=1
        countTemp = count
        selected = textBody[modifyList[count]]
        console.log(modifiers)
        generateText(count)
    }
}
else{
    if(curr+add <= count && curr+add >=0){
    countTemp+=add
    selected = textBody[modifyList[countTemp]]
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


function darkmode_init()
      {
          let darkmodeSwitch = document.querySelector('header .darkmode');

          let darkmodeCookie = {
              set:function(key,value,time,path,secure=false)
              {
                  let expires = new Date();
                  expires.setTime(expires.getTime() + time);
                  var path   = (typeof path !== 'undefined') ? pathValue = 'path=' + path + ';' : '';
                  var secure = (secure) ? ';secure' : '';

                  document.cookie = key + '=' + value + ';' + path + 'expires=' + expires.toUTCString() + secure;
              },
              get:function()
              {
                  let keyValue = document.cookie.match('(^|;) ?darkmode=([^;]*)(;|$)');
                  return keyValue ? keyValue[2] : null;
              },
              remove:function()
              {
                  document.cookie = 'darkmode=; Max-Age=0; path=/';
              }
          };


          if(darkmodeCookie.get() == 'true')
          {
              darkmodeSwitch.classList.add('active');
              document.body.classList.add('darkmode');
              document.getElementById('text').classList.add('darkmode');
              document.getElementById('heading').classList.add('darkmode');
              // div_top_hypers.style = "background-color: #212121;"
          }


          darkmodeSwitch.addEventListener('click', (event) => {
              event.preventDefault();
              event.target.classList.toggle('active');
              document.body.classList.toggle('darkmode');
              document.getElementById('text').classList.toggle('darkmode');
              document.getElementById('heading').classList.toggle('darkmode');

              if(document.body.classList.contains('darkmode'))
              {
                  darkmodeCookie.set('darkmode','true',2628000000,'/',false);
              }
              else
              {
                  darkmodeCookie.remove();
              }
          });
      }

      document.addEventListener('DOMContentLoaded',function()
      {
          darkmode_init();
      });
