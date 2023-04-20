const duck = document.getElementById("duck");
const windowH = window.innerHeight;
const windowW = window.innerWidth;
const maxX = windowW - duck.offsetWidth;
const maxY = windowH - duck.offsetHeight;
let duckMooves = [];

const startGame = () => {

    animateDog();
    createDuck();

    
    //move(duckPath(maxY));
}

const gameLogic = () => {
    
}

const createDuck = () => {
    duckInitialPosition();
    animateScript("duck", 0, -230, 80, 160, 200);
    duckAnimation(duckPath(maxX), duckPath(maxY));
}

let dogAnim;
let countMoove = 0;
const dogIntroAnim = (animal, positionX, positionY, spriteWidth, endPosition, speed) => {
    
    dogAnim = setInterval ( () => {
        document.getElementById(animal).style.backgroundPosition = `-${positionX}px ${positionY}px`; 
        if (positionX < endPosition) {
            positionX += spriteWidth;
            countMoove++;
        } else {
            positionX = 0;
        }
    }
    , speed );
}

//dogIntroAnim("dog", 0, 0, 120, 480, 120);

const dogAnimation = (valueX, valueY) => {

    const duckX = duck.offsetLeft;
    const duckY = duck.offsetTop;
    const distance = Math.floor(Math.sqrt((valueX - duckX) ** 2 + (valueY - duckY) ** 2));
    const duration = distance / 0.2;
    
    console.log(valueX, valueY);
    checkCoordinates(duckX, valueX);
    
    animation = duck.animate([
        {left: valueX + 'px', top: valueY + 'px'}],
        {duration: duration});
        
    animation.onfinish = () => {
        duck.style.left = valueX + 'px';
        duck.style.top = valueY + 'px';
        duckAnimation(duckPath(window.innerWidth - duckX), duckPath(window.innerHeight - duckY));
    };
}


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



const duckInitialPosition = () => {
    const maxPositionX = windowW - duck.offsetWidth;
    const positionY = windowH - duck.offsetHeight;
    
    duck.style.top = positionY + "px";
    duck.style.left = randomNumber(0, maxPositionX) + "px";
    
    console.log("initial position: " + duck.offsetTop + " " + duck.offsetLeft);
}

const duckPath = (max) => {
    return randomNumber(0, max);
}

const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}


/*const move = (duckMoove) => {

    let count;

    console.log("Position Y to go: " + duckMoove);

    if (duck.offsetTop >= duckMoove) {

        count = +1;

    } else {count = -1;}

    if (duck.offsetLeft >= duckMoove) {

        count = -1;

    } else {count = +1;}

    let id = null;
    let pos = duck.offsetTop;
    clearInterval(id);
    id = setInterval(frame, 10);

    function frame() {
        //if (pos === windowH - duck.offsetHeight) {
        if (pos === duckMoove) {
            clearInterval(id);
            move(duckPath(maxY));
        } else {
            //pos++;
            pos += count;
            duck.style.top = pos + 'px';
            duck.style.left = pos + 'px';
        }
    }
}*/

let animation = null;

const duckAnimation = (valueX, valueY) => {

    const duckX = duck.offsetLeft;
    const duckY = duck.offsetTop;
    const distance = Math.floor(Math.sqrt((valueX - duckX) ** 2 + (valueY - duckY) ** 2));
    const duration = distance / 0.2;
    
    console.log(valueX, valueY);
    checkCoordinates(duckX, valueX);
    
    animation = duck.animate([
        {left: valueX + 'px', top: valueY + 'px'}],
        {duration: duration});
        
    animation.onfinish = () => {
        duck.style.left = valueX + 'px';
        duck.style.top = valueY + 'px';
        duckAnimation(duckPath(window.innerWidth - duckX), duckPath(window.innerHeight - duckY));
    };
}

const stopAnimation = () => {
    animation.pause();
    clearInterval(tID);

    duck.style.backgroundPosition = '0px -460px'; 

    //animateScript("duck", 0, -460, 65, 65, 500);
    duckAnimation(duck.offsetLeft, window.innerHeight);
}

const checkCoordinates = (initialX, finalX) => {
    initialX < finalX ? duck.style.transform = 'scaleX(1)': duck.style.transform = 'scaleX(-1)';     
}