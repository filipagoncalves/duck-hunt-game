




let tID;
const animateScript = (animal, positionX, positionY, spriteWidth, endPosition, speed) => {
    
    tID = setInterval ( () => {
        document.getElementById(animal).style.backgroundPosition = `-${positionX}px ${positionY}px`; 
        if (positionX < endPosition) {
            positionX += spriteWidth;
        } else {
            positionX = spriteWidth;
        }
    }
    , speed );
}

//animateScript("dog", 0, 0, 120, 480, 120);
//animateScript("duck", -10, -230, 80, 170, 300);

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