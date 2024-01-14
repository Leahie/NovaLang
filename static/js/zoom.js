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
        }

        else if (zoom == false){
            zoom = true;
            text.style = 'font-size: 5vw'
        }
    }
});