const body = document.body;
const main = document.getElementById("main");
const mainScore = document.getElementById("main-score");
const startScreen = document.getElementById("start-screen");
const scoreDiv = document.getElementById("score");
const endRoundDiv = document.getElementById("end-round");
const roundDiv = document.getElementById("round");
const roundNrDiv = document.getElementById("round-nr");
const gameOverDiv = document.getElementById("game-over");
const dogDiv = document.getElementById("dog");

let mouseX, mouseY, maxX, maxY= 0;
let bullet, miniDuck = null;
const scoreValues = [500, 1000, 1500, 2000, 2500, 3000];
let duckIsDead = false;
let nrBullets = 3;
let duckShoted = 2;
let ducksKilled = 0;
let newDuck = null;
let round = 1;
let score = 000000;

const startGame = async () => {

    const dog = Dog();
    const uiRender = Interface();
    const duck = Duck(uiRender);
    const game = GameLogic(uiRender, duck);

    body.style.cursor = 'url("imgs/gun-pointer.png") 10 10, pointer';
    startScreen.style.display = 'none';

    await dog.animateDog();
    duck.create();
    game.verifyShot();
}

const Duck = (uiRender) => {

    let animation = null;
    let shotedAnim = null;
    
    return ({

        create : function() {
            newDuck = document.createElement("div");
            newDuck.id = "duck";
            newDuck.classList.add("duck");

            maxX = window.innerWidth - 70;
            maxY = window.innerHeight - 120;

            main.appendChild(newDuck);
            this.initialPosition();

            animateSprite("duck", 0, -230, 80, 160, 200);
            this.animation(this.path(maxX), this.path(maxY));
        },

        initialPosition : function () {
            const maxPositionX = window.innerWidth - newDuck.offsetWidth;
            
            newDuck.style.top = '80%';
            newDuck.style.left = randomNumber(0, maxPositionX) + "px";
        },

        path : (max) => randomNumber(0, max),

        animation : function(valueX, valueY) {

            const duckX = newDuck.offsetLeft;
            const duckY = newDuck.offsetTop;
            const distance = Math.floor(Math.sqrt((valueX - duckX) ** 2 + (valueY - duckY) ** 2));
            const duration = distance / 0.2;
            
            this.checkCoordinates(duck, duckX, valueX);
            
            animation = newDuck.animate(
                {left: valueX + 'px', top: valueY + 'px'},
                {duration: duration});

            animation.onfinish = () => {
                newDuck.style.left = valueX + 'px';
                newDuck.style.top = valueY + 'px';
                this.animation(this.path(window.innerWidth - duckX), this.path(window.innerHeight - duckY));
            };
        },

        checkCoordinates : function(duck, initialX, finalX) {
            initialX < finalX ? duck.style.transform = 'scaleX(1)': duck.style.transform = 'scaleX(-1)';     
        },

        stopAnimation : function() {
            animation.pause();
            clearInterval(tID);
        },
        
        fallingAnimation : function() {

            return new Promise((resolve) => {
                
                newDuck.style.backgroundPosition = '0px -460px';

                let endDuck = setInterval ( () => {
                    this.shotedAnimation();
                    newDuck.style.backgroundPosition = '-100px -460px';
                    newDuck.style.width = '35px';
            
                    newDuck.animate(
                        {top: maxY + 'px'},
                        { duration: 1000
                        }).onfinish = () => {
                            clearInterval(shotedAnim);
                            newDuck.remove();
                            uiRender.hideScore();
                            resolve();
                    };
                    clearInterval(endDuck);
                }, 1000 ); 
            });
        },

        shotedAnimation : function() {
            shotedAnim = setInterval ( () => {
                newDuck.style.transform === 'scaleX(1)' ? newDuck.style.transform = 'scaleX(-1)' : newDuck.style.transform = 'scaleX(1)';
            }, 200 );
        }
    })
}

const Dog = () => {

    let dogAnim;
    let countMoove = 0;

    return ({
        animateDog : function() {
            return new Promise((resolve) => {
                
                this.dogIntroAnim("dog", 0, 0, 120, 360, 100);

                dogDiv.animate(
                    {left: '200px'},
                    {duration: 1000}
                ).onfinish = () => {
                    dogDiv.style.left = '200px';
                    clearInterval(dogAnim);

                    this.dogIntroAnim("dog", 360, 0, 120, 480, 150);
                                        
                    dog.animate(
                        {left: '201px'},
                        {duration: 500, delay: 1000}
                    ).onfinish = () => {
                        dogDiv.style.left = '201px';
                        clearInterval(dogAnim);

                        this.dogIntroAnim("dog", 0, -100, 120, 240, 250);

                        dog.animate(
                            {left: '230px', bottom: '30%'},
                            {duration: 900}
                        ).onfinish = () => {
                            dogDiv.style.visibility = 'hidden';
                            clearInterval(dogAnim);
                            resolve();
                        };

                    };
                };
                console.log("1st");
              });
        },
        
        dogIntroAnim : function(animal, positionX, positionY, spriteWidth, endPosition, speed) {
            const startPosition = positionX;
            dogAnim = setInterval ( () => {
                document.getElementById(animal).style.backgroundPosition = `-${positionX}px ${positionY}px`; 
                if (positionX < endPosition) {
                    positionX += spriteWidth;
                } else {
                    positionX = startPosition;
                }
            }, speed );
        }
    })
}

const GameLogic = (uiRender, duck) => {

    uiRender.blinkDuck();

    return ({
        verifyShot : function() {

            body.addEventListener('click', (event) => {
                const duckCoord = newDuck.getBoundingClientRect();
                mouseX = event.clientX;
                mouseY = event.clientY;
                uiRender.removeBullet();

                // check if the mouse coordinates are within the element's rectangle
                if (mouseX >= duckCoord.left && mouseX <= duckCoord.right
                    && mouseY >= duckCoord.top && mouseY <= duckCoord.bottom) {
                    console.log('You killed a duck!');
                    
                    this.setInterfaceChanges();
                    this.allAnimations();
                    ducksKilled++;
                    duckShoted++;
                    round++;

                } else {
                    nrBullets--;
                    console.log('You missed!');
                }
                //Verifica se ainda tem balas
                this.verifyBullets();
                //Verifica se já foram feitas 10 jogadas
                this.checkLevelResult();
            });     
        },

        allAnimations: async function (){
            duck.stopAnimation();
            await duck.fallingAnimation();
            await uiRender.showDog(655, 5);
            await uiRender.showRoundBox();
            uiRender.updateRound();
            uiRender.showBullet();
            this.replay();
        },

        setInterfaceChanges : function(left, top) {
            uiRender.removeBlinkDuck();
            uiRender.miniDuckPosition();
            uiRender.showScore();
            body.style.pointerEvents = "none";
        },

        verifyBullets : function() {
            if (nrBullets === 0) this.gameOver();
        },

        checkLevelResult : function() {
            if (ducksKilled === 10) uiRender.showRoundBox();
        },

        gameOver : function() {
            gameOverDiv.style.visibility = 'visible';
            body.style.pointerEvents = "none";
        },

        replay : function () {
            duck.create();
            uiRender.blinkDuck();
            body.style.pointerEvents = "initial";
        }  
    })
}

const Interface = () => {

    return ({
        removeBullet : function() {
            console.log(nrBullets);
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

        showScore : function() {
            mainScore.style.visibility = 'visible';
            mainScore.style.top = mouseY + 'px';
            mainScore.style.left = (mouseX - 40) + 'px';

            mainScore.innerHTML = scoreValues[round];
            scoreDiv.innerHTML = score + scoreValues[round];
        },

        hideScore : function() {
            mainScore.style.visibility = 'hidden';
        },

        showRoundBox : function () {
            return new Promise((resolve) => {
                roundDiv.innerHTML = round;
                endRoundDiv.style.visibility = 'visible';

                let hide = setInterval ( () => {
                    endRoundDiv.style.visibility = 'hidden';
                    clearInterval(hide);
                    resolve();
                }, 2000 );
            });
        },

        updateRound : function() {
            roundNrDiv.innerHTML = roundDiv.innerHTML;
        },

        showDog : function(spriteX, spriteY) {
            
            return new Promise((resolve) => {
                dogDiv.style.backgroundPosition = `-${spriteX}px ${spriteY}px`;
                dogDiv.style.left = mouseX + 'px';
                dogDiv.style.bottom = '10%';
                dogDiv.style.width = '90px';
                dogDiv.style.zIndex = '0';
                dogDiv.style.visibility = 'visible';

                dogDiv.animate([
                    {bottom: '30%'}],
                    {duration: 1000
                    }).onfinish = () => {
                        dogDiv.style.bottom = '30%';
                        dogDiv.animate([
                            {bottom: '10%'}],
                            {duration: 500, delay: 1500
                            }).onfinish = () => {
                                dogDiv.style.visibility = 'hidden';
                                resolve();
                            }
                    };
            });
        }
    })
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

const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}