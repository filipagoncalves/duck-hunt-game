const duck = document.getElementById("duck");
const windowH = window.innerHeight;
const windowW = window.innerWidth;
const maxX = windowW - duck.offsetWidth;
const maxY = windowH - duck.offsetHeight;
let mouseX, mouseY = 0;
let bullet, miniDuck = null;
const scoreValues = [500, 1000, 1500];
const duckIsDead = false;

const startGame = async () => {

    await animateDog();
    await createDuck();
    gameLogic();

    verifyShot();
}

const gameLogic = () => {

    /*while(true){
        //verificar se um pato foi morto
        verifyShot();
       
        //verificar se ainda tem tiros disponíveis
        verifyBullets();

        
    }

    createDuck();
    gameOver();*/
}



let nrBullets = 3;
let shotDuck = false;
let duckShoted = 1;

const verifyShot = () => {

    console.log("let's kill some ducks");    

    // listen for clicks on the document
    document.addEventListener('click', (event) => {
        
        const elementRect = duck.getBoundingClientRect();
        removeBullet();
   
        // check if the mouse coordinates are within the element's rectangle
        if (event.clientX >= elementRect.left && event.clientX <= elementRect.right
            && event.clientY >= elementRect.top && event.clientY <= elementRect.bottom) {
            // the mouse was clicked within the element's rectangle
            console.log('You killed a duck!');
            
            stopAnimation();
            shotDuck = true;
        } else {
            nrBullets--;
            shotDuck = false;
            console.log('You missed!');
        }
    });
    
}
//verifyShoot();

const verifyBullets = () => nrBullets === 0 ? false : true;

const removeBullet = () => {
    bullet = document.querySelector("#shots :nth-child(" + nrBullets + ")");
    bullet.style.visibility = "hidden";
}

const showBullet = () => {
    bullet = document.querySelector("#shots :nth-child(" + nrBullets + ")");
    bullet.style.visibility = "visible";
}

const blinkDuck = () => {
    miniDuck = document.querySelector("#ducks :nth-child(" + duckShoted + ")");
    miniDuck.classList.add('blink');
}

const removeBlinkDuck = () => {
    miniDuck = document.querySelector("#ducks :nth-child(" + duckShoted + ")");
    miniDuck.classList.remove('blink');
}

const miniDuckPosition = () => {
    miniDuck = document.querySelector("#ducks :nth-child(" + duckShoted + ")");
    miniDuck.style.backgroundPosition = "-27px 582px";
}


/*window.addEventListener('click', (event) => {
    mousePos = { x: event.clientX, y: event.clientY };
    console.log(mousePos);
});*/



const createDuck = () => {

    
    duckInitialPosition();
    animateScript("duck", 0, -230, 80, 160, 200);
    duckAnimation(duckPath(maxX), duckPath(maxY));

    return new Promise((resolve) => {
        console.log("second");
        resolve();
      });
}


const animateDog = () => {

    return new Promise((resolve) => {
        console.log("1st");
        resolve();
      });

    //console.log("Dog has been created!");
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
    fallingDuckAnimation();
}

const fallingDuckAnimation = () => {

    let endDuck = setInterval ( () => {

        duck.style.backgroundPosition = '-100px -460px';
        duck.style.width = '35px';
        shotedDuckAnimation();

        duck.animate([
            {top: window.innerHeight + 'px'}],
            {
                duration: 1000
            }).onfinish = () => {
                duckIsDead = true;
                duck.remove();
                //cão aparece com o pato

        };
        clearInterval(endDuck);
    }
    , 1000 );
    
    duck.style.backgroundPosition = '0px -460px';
}


let shotAnimation = null;
const shotedDuckAnimation = () => {

    let anim = setInterval ( () => {
        if(duckIsDead){
            clearInterval(anim);
        } else {
            duck.style.transform === 'scaleX(1)' ? duck.style.transform = 'scaleX(-1)' : duck.style.transform = 'scaleX(1)';
        }
    }
    , 200 );
}

const checkCoordinates = (initialX, finalX) => {
    initialX < finalX ? duck.style.transform = 'scaleX(1)': duck.style.transform = 'scaleX(-1)';     
}