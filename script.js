const duck = document.getElementById("duck");
const windowH = window.innerHeight;
const windowW = window.innerWidth;

let tID;
const animateScript = (animal, positionX, positionY, spriteWidth, endPosition, speed) => {
    
    tID = setInterval ( () => {
        document.getElementById(animal).style.backgroundPosition = `-${positionX}px ${positionY}px`; 
        if (positionX < endPosition) {
            positionX += spriteWidth;
        } else {
            positionX = 0;
        }
    }
    , speed );
}

//animateScript("dog", 0, 0, 120, 480, 120);
//animateScript("duck", 0, -230, 80, 160, 200); //1a linha
//animateScript("duck", 0, -300, 80, 160, 200); //2º linha
//animateScript("duck", 0, -380, 80, 160, 200); //3º linha
//animateScript("duck", 0, -460, 65, 65, 500); //dying duck



let duckMooves = [];

const duckInitialPosition = () => {
    const maxPositionX = windowW - duck.offsetWidth;
    const positionY = windowW - duck.offsetWidth;

    duck.style.top = positionY;
    duck.style.left = randomNumber(0, maxPositionX);
}

const duckPaths = () => {

    
    
}

const randomNumber = (min, max) => {
    Math.random() * (max - min) + min;
}


const move = () => {

    let id = null;
    const duckX = duck.offsetTop;
    let pos = duck.offsetTop;
    clearInterval(id);
    id = setInterval(frame, 10);

    function frame() {
        if (pos === windowH - duck.offsetHeight) {
            clearInterval(id);
            move();
        } else {
            pos++;
            duck.style.top = pos + 'px';
            duck.style.left = pos + 'px';
        }
    }
}

const scale = (cardToPlay) => {
    cardToPlay.animate([
        {transform: 'scale(1.1)'}
    ],
        {
            duration: 500, easing: 'ease-in-out'
        }).onfinish = () => {
            Array.from(playerCards).forEach(element => fadeOut(element));
        };
}




//const duck = document.getElementById("duck").y = 600;




/*const SPRITE_WIDTH = 120;
const SPRITE_HEIGHT = 86;
const BORDER_WIDTH = 1;
const SPACING_WIDTH = 1;

function spritePositionToImagePosition(row, col) {
    return {
        x: (
            BORDER_WIDTH +
            col * (SPACING_WIDTH + SPRITE_WIDTH)
        ),
        y: (
            BORDER_WIDTH +
            row * (SPACING_WIDTH + SPRITE_HEIGHT)
        )
    }
}

var canvas = document.getElementById('dog');
var context = canvas.getContext('2d');

var spriteSheetURL = 'imgs/main-sprite.png';
var image = new Image();
image.src = spriteSheetURL;
image.crossOrigin = true;

// extract all of our frames
var karelright0 = spritePositionToImagePosition(0, 0);
var karelright1 = spritePositionToImagePosition(0, 1);
var karelright2 = spritePositionToImagePosition(0, 2);
var karelleftt0 = spritePositionToImagePosition(0, 3);
var karelleft1 = spritePositionToImagePosition(0, 4);
var karelleft2 = spritePositionToImagePosition(0, 5);
var karelleft2 = spritePositionToImagePosition(0, 5);
var karelleft2 = spritePositionToImagePosition(0, 5);
var karelleft2 = spritePositionToImagePosition(0, 5);
var karelleft2 = spritePositionToImagePosition(0, 5);
var karelleft2 = spritePositionToImagePosition(0, 5);

var walkCycle = [
    karelright0,
    karelright1,
    karelright2,
    karelright1
];

var frameIndex = 0;
var frame;
function animate() {
    // once we hit the end of the cycle,
    // start again
    if (frameIndex === walkCycle.length) {
        frameIndex = 0;
    }
    frame = walkCycle[frameIndex];
    context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
    context.drawImage(
        image,
        frame.x,
        frame.y,
        SPRITE_WIDTH,
        SPRITE_HEIGHT,
        0,
        0,
        SPRITE_WIDTH,
        SPRITE_HEIGHT
    );
    frameIndex += 1;
}

image.onload = function() {
    setInterval(animate, 250);
};*/