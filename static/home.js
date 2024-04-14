
//Globals
let count = 0
let countTemp = 0
let modifiers = {}
let modifiers_gen = {}
let answers = {}
let token; 


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function getJSON(){
  return fetch('http://localhost:3000/key')
    .then(response => response.json())
    .then(data => {
      return data;
  });
}

function query(word){
  return new Promise(function(resolve, reject) {
      $.ajax({
        method: 'GET',
        url: 'https://api.api-ninjas.com/v1/thesaurus?word=' + word,
        headers: { 'X-Api-Key': token.ninja_key},
        contentType: 'application/json',
        success: function(result) {
            console.log(result.synonyms);
            resolve(result.synonyms);
        },
        error: function ajaxError(jqXHR) {
          reject(jqXHR.responseText);
        }
    });
  });
}

/* async function query(word){
  let val;
    $.ajax({
      method: 'GET',
      url: 'https://api.api-ninjas.com/v1/thesaurus?word=' + word,
      headers: { 'X-Api-Key': token.ninja_key},
      contentType: 'application/json',
      success: function(result) {
          console.log(result.synonyms);
          val = result.synonyms;
      },
      error: function ajaxError(jqXHR) {
          console.error('Error: ', jqXHR.responseText);
      }
  });
  return val 
} */

/* async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/mrm8488/longformer-base-4096-finetuned-squadv2",
		{
			headers: { Authorization: `Bearer ${token.token}` },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	return result;
} */

  
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//going through the text 

FirstTime = true
let textBody =  document.querySelector('#textBody').innerHTML // This is how we get the index

textBody1 = textBody.replace(/\\n/g, "").replace(/\\/g, "")//replacing all ' with "

console.log(textBody1)

textBody = JSON.parse(textBody1)

let modifyList = document.querySelector('#modifyList').innerHTML 
modifyList = modifyList.replace(/'/g, '"') //replacing all ' with "
modifyList = JSON.parse(modifyList)

async function everything(){
  token = await getJSON()
  console.log(token)
  for (let i = 0; i < modifyList.length; i++) {
    temp = textBody[modifyList[i]]
    answers[i] = temp
    textBody[modifyList[i]] = "_".repeat(textBody[modifyList[i]].length)
    console.log(textBody[i])
    let x  = await generateSim(temp)
    shuffle(x)
    modifiers_gen[i] = x
    
  }
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
    let currOpt = document.querySelectorAll(".modifiers")
    for(let i=0; i < currOpt.length; i++ ){
      currOpt[i].innerHTML = modifiers_gen[count][i]
    }

    FirstTime = false
}
}





everything()

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
async function next(option, countTrue=true, add=1, curr=count){
  console.log(`${count} ${modifyList.length}`);

  if(countTrue){
      if(countTemp < modifyList.length){
        if(countTemp==count){
          let currOpt = modifiers_gen[count]
          //let currOpt = document.querySelectorAll(".modifiers")
          console.log(option)
          console.log(currOpt[option])
          modifiers[count] = currOpt[option]
          let choices = document.querySelector("#choices")
          choices.innerText = JSON.stringify(modifiers)
          console.log(modifiers)

          count+=1
          countTemp = count
          selected = textBody[modifyList[count]]
          console.log(modifiers)
          generateText(count)
        }
        else if (countTemp<count){
          let currOpt = modifiers_gen[countTemp]
          //let currOpt = document.querySelectorAll(".modifiers")
          console.log(option)
          console.log(currOpt[option])
          modifiers[countTemp] = currOpt[option]

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
  if(count >= modifyList.length){
    if (count == modifyList.length){
      console.log("GOT HERE")
      let score = await checkScore(modifiers, answers)
      console.log(score)
      const newButton = document.createElement('button');
      newButton.className = "btn btn-primary btn-lg"
      newButton.textContent = 'Check Your Accuracy';
      let myDiv = document.querySelector("#submission")
      $("#var1").val(score);
      newButton.onclick = function () {
        $("#form").submit();;
    };
      myDiv.appendChild(newButton);
      count++;
    }
    else{
      return null; 
    }
    
  }
}

async function checkScore(choices, answer){
  let score = 0;
  let total = 0;
  console.log("things", choices, answer)
  for(let i = 0; i<modifyList.length; i++){
    if(choices[i] === answer[i]) score ++
    total++
  }
  return (score/total)
}

function generateText(curr){
  let textCorpus = document.querySelector("#text-corpus")
  let temp = "";
  for( let i = 0; i < textBody.length; i++  ){
      if(i==modifyList[curr]){
        console.log(textBody[i])
        temp = temp + " " + `<span id='${curr}' style='color:red;'>${textBody[i]}</span>`
      }
      else if(modifyList.includes(i)){
        index = modifyList.indexOf(i);
        if (index<count){ 
          temp = temp + " " + `<span  style='color:blue;'>${modifiers[index]}</span>` ;
        }
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

async function generateSim(word){
  const response = undefined;
  //const response = await query(word)

  console.log("response", response)
  
  if(response !== undefined && response.length>=2){
      let tot = response.length
      let count = 2

      let fin = [word]
      while(tot-- && count--){
        fin.push(Generate_random(response))
      }

      console.log("final array", fin)
      return fin
      
    }
    
  
  return [word, word, word]
}

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
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
