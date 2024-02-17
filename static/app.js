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

// const express = require("express");
// const app = express();

// app.use(express.static(__dirname + "/templates"), (_, res, next) => {
//   res.status(404)
//   res.sendFile(__dirname + "/404")
// });

// app.listen(8080);

document.addEventListener("DOMContentLoaded", function () {
    // Variable to track whether an animation is in progress
    let isAnimating = false;
  
    // Create and append the overlay
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
  
    // Function to handle the overlay animations
    function handleOverlayAnimation(overlay) {
      // Listen for the transitionend event
      overlay.addEventListener('transitionend', function () {
        // Hide the overlay after the transition ends
        overlay.style.display = 'none';
  
        // Set a timeout before allowing the next animation
        setTimeout(function () {
          isAnimating = false;
        }, 1000); // Set your desired delay in milliseconds
      });
  
      // Ensure the transition is triggered by changing the opacity in the next frame
      requestAnimationFrame(function () {
        overlay.style.opacity = 0;
      });
  
      // Disable pointer events during the transition
      overlay.style.pointerEvents = 'none';
    }
  
    // Create a function that adds the click event listener to each link
    function addLinkListener() {
      // Get all the links with the class 'ajax-link'
      const ajaxLinks = document.querySelectorAll('.ajax-link');
  
      // Remove existing click event listeners from all links
      ajaxLinks.forEach(function (link) {
        link.removeEventListener('click', ajaxLinkClick);
      });
  
      // Add click event listener to each link
      ajaxLinks.forEach(function (link) {
        link.addEventListener('click', ajaxLinkClick);
      });
    }
  
    // Separate the click event handling function for clarity
    function ajaxLinkClick(event) {
      event.preventDefault();
  
      // Check if an animation is already in progress
      if (isAnimating) {
        return;
      }
  
      isAnimating = true;
  
      // Show the overlay
      overlay.style.display = 'block';
      overlay.style.opacity = 1;
  
      // Fetch the content of the target URL using AJAX and return a promise
      fetch(this.href)
        .then(response => response.text())
        .then(html => {
          const content = document.getElementById('content');
          content.innerHTML = html;
  
          // Update the state object with the new content
          history.replaceState({url: this.href, html: html}, '', this.href);
  
          // Handle overlay animations
          handleOverlayAnimation(overlay);
  
          // Re-attach the event listeners to the links
          addLinkListener();
        })
        .catch(error => {
          console.error(error);
          alert('Something went wrong. Please try again.');
          // Handle overlay animations
          handleOverlayAnimation(overlay);
        });
    }
  
    // Call the function to add the initial event listeners
    addLinkListener();
  
    // Add popstate event listener to handle the back and forward buttons
    window.addEventListener('popstate', function (event) {
      // Check if the event has a state object
      if (event.state) {
        // Get the URL and the HTML from the state object
        const url = event.state.url;
        const html = event.state.html;
  
        // Update the content element with the HTML
        const content = document.getElementById('content');
        content.innerHTML = html;
  
        // Re-attach the event listeners to the links
        addLinkListener();
      }
    });
  });
  