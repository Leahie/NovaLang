
//Globals
let count = 0
let countTemp = 0
let modifiers = {}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//going through the text 

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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Dark Mode 

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Austen smooth animation  
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

  ///////////////////////////////////////////////////////////////////////////////////////////////

  const steps = ["home-nav", "choices", "text-corpus"];
  let index = 0;
   //text stuff
  var array = ["Click here to choose your level and author - easy, medium, or hard", "Here we display the text, if you want to see all of it in full screen press space", "Choose the word that most matches the author"]
  const text_div = document.createElement('div');
  const textbox = document.createElement("p");
  textbox.appendChild(document.createTextNode(array[0]));
  textbox.style = `font-family: 'Montserrat', sans-serif;
                  background: #fff;
                  display:block;
                  margin: auto;
                  padding: 1em;
                  
                  `;
  textbox.classList.add('card-text');
  text_div.appendChild(textbox);
  text_div.classList.add('card');
   
  // helper function
  const highlight = (id) => {
    // remove the existing highlighted elements
    document.getElementById("lb-highlight")?.remove();
    document.getElementById("lb-popover")?.remove();
    
    // get the element with the ID
    const element = document.getElementById(id);
  
    // get the element dimension 
    const elementDimension = element.getBoundingClientRect();
  
    // highlight the element
    highlightHelper(elementDimension);
  
    // add the popover with navigation button
    console.log(elementDimension)
    popover(elementDimension);
  }
  
  const highlightHelper = (elementDimension) => {
    // calculate the css poisition 
    // where the highlighter will be placed
    let top = elementDimension.top + window.scrollY;
    let left = elementDimension.left + window.scrollX;
    let width = elementDimension.width;
    let height = elementDimension.height;
    
    // create a new element with an id
    // and add a style to it
    const ele = document.createElement('div');
    ele.id = "lb-highlight";
    ele.style=`
      position: absolute;
      top: ${top - 4}px;
      left: ${left - 4}px;
      width: ${width}px;
      height: ${height}px;
      transition: border .2s ease;
    `;
    
    // append the element to the parent
    document.getElementById("wrapper").appendChild(ele);
    
    // add the border style late to take an effect
    setTimeout(() => {
      ele.style.border = "4px solid #000";
    }, 0);
  }
  
  const popover = (elementDimension) => {
    // calculate the css poisition 
    // where the highlighter will be placed
    let bottom = elementDimension.bottom + window.scrollY;
    let left = elementDimension.left + window.scrollX;
    let right = elementDimension.right;
    
    // create a new element with an id
    // and add a style to it
    const ele = document.createElement("div");
    ele.id = "lb-popover";
    ele.appendChild(text_div);
    ele.style = `
      position: absolute;
      top: ${bottom + 5}px;
      left: ${((left + right) / 2) - 50}px;
      width: 300px;
      margin: auto;
      
    `;
    
    // add the navigation button
    ele.appendChild(navigationButton());
    
    
    // apend to the parent of the element
    document.getElementById("wrapper").appendChild(ele);
  }
  
  const navigationButton = () => {
    // create the next button with click event listener
    const nextButton = document.createElement('button');
    nextButton.textContent = "next";
    nextButton.addEventListener('click', function(){
      // move the next step
      if(index < steps.length - 1){
        highlight(steps[++index]);
        textbox.textContent = array[index];
      }
    });


    // create the previous button with click event listener
    const prevButton = document.createElement('button');
    prevButton.textContent = "prev";
    prevButton.addEventListener('click', function(){
      // move the prev step
      if(index > 0){
        highlight(steps[--index]);
        textbox.textContent = array[index];
      }
    });

    const endButton = document.createElement('button');
    endButton.textContent = "end";
    endButton.addEventListener('click', function(){
      // end
      document.getElementById("lb-highlight")?.remove();
      document.getElementById("lb-popover")?.remove();
    });

    // create a fragment and these two buttons to it
    const fragment = document.createElement("div");
    prevButton.style='display:block'
    nextButton.style='display:block'
    endButton.style='display:block'
    fragment.appendChild(prevButton);
    fragment.appendChild(nextButton);
    fragment.appendChild(endButton);

    fragment.style=`
      background: #FFF;
      text-align:center;
    `;
    return fragment;
  }

 
  // helper function to scroll to element smoothly
  const scrollTo = (element) => {
    const eleTop = element.offsetTop;
    window.scrollTo({top: eleTop, behavior: "smooth"});
  }
  
  // initiate first step

  const button = document.querySelector('#btn-guide');
  button.addEventListener('click', e => {
        highlight(steps[index]);
    }
);
