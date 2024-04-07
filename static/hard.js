
//Globals
let count = 1
let countTemp = 1
let modifiers = {}
let modifiers_gen = {}
let keybinds; 
let timer,
    timeoutVal = 1000;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//going through the text 

FirstTime = true
let textBody =  document.querySelector('#textBody').innerHTML // This is how we get the index

textBody1 = textBody.replace(/\\n/g, "").replace(/\\/g, "")//replacing all ' with "

textBody = JSON.parse(textBody1)

let modifyList = document.querySelector('#modifyList').innerHTML 
modifyList = modifyList.replace(/'/g, '"') //replacing all ' with "
modifyList = JSON.parse(modifyList)

async function everything(){
  console.log( textBody, modifyList)

let selected = textBody[modifyList[count]]


  if(FirstTime == true){
      let textCorpus = document.querySelector("#text-corpus")
      let temp = "";
      for( let i = 0; i < textBody.length; i++  ){
        if(i==count){
            temp = temp + " " + `<span id='${count}' style='color:red;'>${textBody[i]}</span>`
        }
        else{
            temp = temp + " " + textBody[i]
        }
      }

      textCorpus.innerHTML = temp
      let currOpt = document.querySelectorAll(".modifiers")
      for(let i=0; i < currOpt.length; i++ ){
        currOpt[i].innerHTML = modifiers_gen[count][i]
      }

      FirstTime = false
  }
}





everything()
if(keybinds){
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
    });
}


// Pressing one of the lis 
function next(option, countTrue=true, add=1, curr=count){
  console.log(`${count} ${modifyList.length}`);
  if(count+1 == modifyList.length){
    console.log("GOT HERE")
    const newButton = document.createElement('button');
    newButton.className = "btn btn-primary btn-lg"
    newButton.textContent = 'Check Your Accuracy';
    let myDiv = document.querySelector("#submission")
    newButton.onclick = function () {
      location.href = "submitted";
  };
    myDiv.appendChild(newButton);
    count++;
  }
  if(countTrue){
      if(countTemp < modifyList.length){
        console.log("counttemp count", countTemp, count)
        if(countTemp==count){
          let currOpt = modifiers_gen[count]
          //let currOpt = document.querySelectorAll(".modifiers")

          modifiers[count] = option

          let choices = document.querySelector("#choices")
          choices.innerText = JSON.stringify(modifiers)
          console.log(modifiers)

          count+=1
          countTemp = count
          selected = textBody[modifyList[count]]
          console.log(modifiers)
          generateText(count)
        }
        else{
          let currOpt = modifiers_gen[countTemp]
          //let currOpt = document.querySelectorAll(".modifiers")

          modifiers[countTemp] = option
          let choices = document.querySelector("#choices")
          choices.innerText = JSON.stringify(modifiers)
          console.log(modifiers)

          countTemp += 1
          selected = textBody[modifyList[countTemp]]
          console.log(modifiers)
          generateText(countTemp)
        }

      }
  }

  else{
      if(curr+add <= count && curr+add >=0){
      countTemp+=add
      selected = textBody[modifyList[countTemp]];
      generateText(countTemp);      
      }
  }
  
}

function generateText(curr){
  let textCorpus = document.querySelector("#text-corpus")
  let temp = "";
  console.log("ARRIVED AT GENERATE TEXT", textBody, modifyList)
  for( let i = 0; i < textBody.length; i++  ){
      if(i==curr){
        console.log("If 1", textBody[i])
        temp = temp + " " + `<span id='${curr}' style='color:red;'>${textBody[i]}</span>`
      }
      
      else if(i<count && modifyList.includes(i)){
        console.log('modifiers', modifiers[i])
        temp = temp + " " + `<span  style='color:blue;'>${modifiers[i]}</span>` ;
        }
    
      
      else{
        temp = temp + " " + textBody[i];
      }
  }
  
  textCorpus.innerHTML = temp

  let NextOpt = document.querySelectorAll(".modifiers")
  for(let i=0; i < NextOpt.length; i++ ){
    NextOpt[i].innerHTML = modifiers_gen[curr][i]
  }
  document.getElementById(curr).scrollIntoView()({
    behavior: 'smooth'
});
}

function Generate_random(arr) {
  return arr[(Math.floor(Math.random() * arr.length))];
}

let zoom = true;
let container = document.getElementById("text");
let text = document.getElementById("text-corpus");

window.addEventListener('keydown', e => {
  if (keybinds){
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
  } 
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
  const highlight = (index) => {
    prev = steps[index-1]
    id = steps[index]
    // remove the existing highlighted elements
    

    document.getElementById("lb-highlight")?.remove();
    document.getElementById("lb-popover")?.remove();
    
    // get the element with the ID
    const element = document.getElementById(id);
    document.getElementById(prev).style.outline = "none";
    
  
    // get the element dimension 
    const elementDimension = element.getBoundingClientRect();
  
    // highlight the element
    highlightHelper(element, elementDimension);
  
    // add the popover with navigation button
    console.log(elementDimension)
    popover(elementDimension);
  }
  
  const highlightHelper = (element, elementDimension) => {
    element.style.outline = "thick solid #0000FF";  
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
        highlight(index);
    }
);

const response = document.querySelector("#response");

$(response).focus( function(){
  console.log("False")
  keybinds=false;
})

$(response ).blur( function() {
  console.log("true")
  keybinds=true;
});

const ton = document.querySelector("#ton");
ton.addEventListener("click", function(e){
  e.preventDefault();
  const result = response.value;
  response.value = "";
  console.log(result)

  next(result);
});