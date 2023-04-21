const main = document.getElementById("main");
const mainScore = document.getElementById("main-score");
const scoreDiv = document.getElementById("score");
const endRoundDiv = document.getElementById("end-round");
const roundDiv = document.getElementById("round");
const dogDiv = document.getElementById("dog");

const windowH = window.innerHeight;
const windowW = window.innerWidth;

let mouseX, mouseY = 0;
let bullet, miniDuck = null;
const scoreValues = [500, 1000, 1500, 2000, 2500, 3000];
let duckIsDead = false;
let nrBullets = 3;
let shotDuck = false;
let duckShoted = 2;
let ducksKilled = 0;
let newDuck = null;

let maxX, maxY = 0;

let round = 1;
let score = 000000;




const startGame1 = async () => {

    const dog = Dog();
    const duckD = Duck();
    const game = GameLogic();
    const uiRender = Interface();

    await animateDog();
    await duckD.create();
    gameLogic();

    game.verifyShot();
}

const startGame = async () => {

    const dog = Dog();
    const uiRender = Interface();
    const duck = Duck(uiRender);
    const game = GameLogic(uiRender, duck);

    await animateDog();
    await duck.create();
    game.verifyShot();
}

const Duck = (uiRender) => {

    let animation = null;
    
    return ({

        create : function() {
            newDuck = document.createElement("div");
            newDuck.id = "duck";
            newDuck.classList.add("duck");

            maxX = windowW - 70;
            maxY = windowH - 60;

            main.appendChild(newDuck);
            this.initialPosition();

            animateSprite("duck", 0, -230, 80, 160, 200);
            this.animation(this.path(maxX), this.path(maxY));
        
            return new Promise((resolve) => {
                console.log("second");
                resolve();
            });
        },

        initialPosition : function () {
            const maxPositionX = windowW - newDuck.offsetWidth;
            const positionY = windowH - newDuck.offsetHeight;
            
            newDuck.style.top = positionY + "px";
            newDuck.style.left = randomNumber(0, maxPositionX) + "px";
            
            console.log("initial position: " + newDuck.offsetTop + " " + newDuck.offsetLeft);
        },

        checkCoordinates : function(duck, initialX, finalX) {
            initialX < finalX ? duck.style.transform = 'scaleX(1)': duck.style.transform = 'scaleX(-1)';     
        },

        path : (max) => randomNumber(0, max),

        animation : function(valueX, valueY) {

            const duckX = newDuck.offsetLeft;
            const duckY = newDuck.offsetTop;
            const distance = Math.floor(Math.sqrt((valueX - duckX) ** 2 + (valueY - duckY) ** 2));
            const duration = distance / 0.2;
            
            console.log(valueX, valueY);
            this.checkCoordinates(duck, duckX, valueX);
            
            animation = newDuck.animate([
                {left: valueX + 'px', top: valueY + 'px'}],
                {duration: duration});
                
            animation.onfinish = () => {
                newDuck.style.left = valueX + 'px';
                newDuck.style.top = valueY + 'px';
                this.animation(this.path(window.innerWidth - duckX), this.path(window.innerHeight - duckY));
            };
        },

        stopAnimation : function() {
            animation.pause();
            clearInterval(tID);
            this.fallingAnimation();
        },
        
        fallingAnimation : function() {
        
            let endDuck = setInterval ( () => {
        
                newDuck.style.backgroundPosition = '-100px -460px';
                newDuck.style.width = '35px';
                this.shotedAnimation();

                console.log(maxY);
        
                newDuck.animate([
                    {top: maxY + 'px'}],
                    {
                        duration: 1000
                    }).onfinish = () => {
                        duckIsDead = true;
                        newDuck.remove();
                        uiRender.hideScore();
                        uiRender.showDog(655, 5);        
                };
                clearInterval(endDuck);
            }, 1000 );
            
            newDuck.style.backgroundPosition = '0px -460px';
        },

        shotedAnimation : function() {
        
            let anim = setInterval ( () => {
                if(duckIsDead){
                    clearInterval(anim);
                } else {
                    newDuck.style.transform === 'scaleX(1)' ? newDuck.style.transform = 'scaleX(-1)' : newDuck.style.transform = 'scaleX(1)';
                }
            }, 200 );
        }

    })
}

const Dog = () => {

    return ({
        create : function() {
            console.log('Using closure :)');
        },

    })
}

const GameLogic = (uiRender, duck) => {

    /*while(ducksKilled < 11) {

    }*/

    return ({
        verifyShot : function() {
                
            uiRender.removeBullet();
            uiRender.blinkDuck();
            
            document.addEventListener('click', (event) => {
                const elementRect = newDuck.getBoundingClientRect();
                
                // check if the mouse coordinates are within the element's rectangle
                if (event.clientX >= elementRect.left && event.clientX <= elementRect.right
                    && event.clientY >= elementRect.top && event.clientY <= elementRect.bottom) {
                    console.log('You killed a duck!');
                    
                    duck.stopAnimation();
                    uiRender.miniDuckPosition();
                    uiRender.showBullet();
                    uiRender.showScore(elementRect.top, elementRect.left);
                    shotDuck = true;
                    ducksKilled++;

                } else {
                    nrBullets--;
                    shotDuck = false;
                    console.log('You missed!');
                }

                uiRender.removeBlinkDuck();
                duckShoted++;
                round++;

                if (this.verifyBullets()) {
                    this.gameOver();
                };

                if (this.checkLevelResult()) {
                    uiRender.showRoundBox();
                };
            });
        },

        verifyBullets : function() {
            nrBullets === 0 ? false : true;
        },

        checkLevelResult : function() {
            return ducksKilled === 10;
        },

        gameOver : function() {
            gameOverBox.style.visibility = 'visible';
        }

        
    })
}

const Interface = () => {

    return ({
        removeBullet : function() {
            bullet = document.querySelector("#shots :nth-child(" + nrBullets + ")");
            bullet.style.visibility = "hidden";
        },
        
        showBullet : function() {
            bullet = document.querySelector("#shots :nth-child(" + nrBullets + ")");
            bullet.style.visibility = "visible";
        },
        
        blinkDuck : function() {
            miniDuck = document.querySelector("#ducks :nth-child(" + duckShoted + ")");
            miniDuck.classList.add('blink');
        },
        
        removeBlinkDuck : function() {
            miniDuck = document.querySelector("#ducks :nth-child(" + duckShoted + ")");
            miniDuck.classList.remove('blink');
        },
        
        miniDuckPosition : function() {
            miniDuck = document.querySelector("#ducks :nth-child(" + duckShoted + ")");
            miniDuck.style.backgroundPosition = "-27px 582px";
        },

        showScore : function(x, y) {
            mainScore.style.visibility = 'visible';
            mainScore.style.top = x + 'px';
            mainScore.style.left = (y - 40) + 'px';

            mainScore.innerHTML = scoreValues[round];
            scoreDiv.innerHTML = score + scoreValues[round];
        },

        hideScore : function() {
            mainScore.style.visibility = 'hidden';
        },

        showRoundBox : function () {
            roundDiv.innerHTML = round;

            let show = setInterval ( () => {
                endRoundDiv.style.visibility = 'visible';
                clearInterval(show);
            }, 2000 );

            let hide = setInterval ( () => {
                endRoundDiv.style.visibility = 'hidden';
                clearInterval(hide);
            }, 4000 );
        },

        showDog : function(spriteX, spriteY) {
            dogDiv.style.backgroundPosition = `-${spriteX}px ${spriteY}px`;
            dogDiv.style.left = newDuck.offsetLeft + 'px';
            dogDiv.style.bottom = '10%';
            dogDiv.style.width = '90px';

            dogDiv.animate([
                {bottom: '30%'}],
                {duration: 1000
                }).onfinish = () => {
                    dogDiv.style.bottom = '30%';
                    dogDiv.animate([
                        {bottom: '10%'}],
                        {duration: 500, delay: 2000
                        }).onfinish = () => {
                            dogDiv.style.visibility = 'hidden';
                        }
                };
        }
    })
}



/*const gameLogic = (uiRender) => {

    while(true){
        //verificar se um pato foi morto
        verifyShot();
       
        //verificar se ainda tem tiros disponíveis
        verifyBullets();

        
    }

    createDuck();
    gameOver();
}*/


const animateDog = () => {

    return new Promise((resolve) => {
        console.log("1st");
        let hide = setInterval ( () => {
            endRoundDiv.style.visibility = 'hidden';
            clearInterval(hide);resolve();
        }, 4000 );
        
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
const animateSprite = (animal, positionX, positionY, spriteWidth, endPosition, speed) => {
    
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

const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}