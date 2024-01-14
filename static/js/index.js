//document.querySelector("h1").innerText="Nova Lang" don't use, just an example of querySelector
// zoom.js
// description: zooming in/out functionality

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
            container.style = 'display: block; height: 45vh'
        }
    }
});