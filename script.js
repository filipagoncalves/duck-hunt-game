const body = document.body;
const main = document.getElementById("main");
const mainScore = document.getElementById("main-score");
const startScreen = document.getElementById("start-screen");
const scoreDiv = document.getElementById("score");
const totalScoreDiv = document.getElementById("total-score");
const endRoundDiv = document.getElementById("end-round");
const roundDiv = document.getElementById("round");
const ducksDiv = document.getElementsByClassName("thumbDuck");
const roundNrDiv = document.getElementById("round-nr");
const gameOverDiv = document.getElementById("game-over");
const dogDiv = document.getElementById("dog");
const audios = ['dog-barking.mp3', 'duck-falling.mp3', 'duck-hunt-intro.mp3', 'game-over.mp3', 'gun-shot.mp3', 'next-round.mp3', 'duck-quack.mp3'];
let audio = new Audio(`audios/${audios[2]}`);

let mouseX, mouseY, maxX, maxY, ducksKilled, score = 0;
let bullet, miniDuck = null;
const scoreValues = ['', 500, 1000, 1500, 2000, 2500, 3000];
let nrBullets = 3;
let duckShoted, round = 1;
let newDuck = null;
let duckSpeed = 0.2;

totalScoreDiv.innerHTML = localStorage.getItem("totalScore");

audio.play();

const startGame = async () => {

    body.style.cursor = 'url("imgs/gun-pointer.png") 10 10, pointer';
    startScreen.style.display = 'none';
    audio.pause();
    
    const uiRender = Interface();
    const dog = Dog(uiRender);
    const duck = Duck(uiRender);
    const game = GameLogic(uiRender, duck, dog);

    await dog.animateDog();
    duck.create();
    game.verifyShot();
}

const Duck = (uiRender) => {

    let animation, shotedAnim, duckSprite = null;

    return ({
        create : function() {
            newDuck = document.createElement("div");
            newDuck.id = "duck";
            newDuck.classList.add("duck");

            maxX = window.innerWidth - 70;
            maxY = window.innerHeight - 120;

            main.appendChild(newDuck);
            this.initialPosition();

            this.animateSprite(newDuck, 0, -230, 80, 160, 200);
            this.animation(this.path(maxX), this.path(maxY));
        },

        initialPosition : function () {
            const maxPositionX = window.innerWidth - newDuck.offsetWidth;
            
            newDuck.style.top = '75%';
            newDuck.style.left = randomNumber(0, maxPositionX) + "px";
        },

        animateSprite : function (animal, positionX, positionY, spriteWidth, endPosition, speed) {
            
            duckSprite = setInterval ( () => {
                animal.style.backgroundPosition = `-${positionX}px ${positionY}px`; 
                if (positionX < endPosition) {
                    positionX += spriteWidth;
                } else {
                    positionX = 0;
                }
            }
            , speed );
        },

        path : (max) => randomNumber(0, max),

        animation : function(valueX, valueY) {

            const duckX = newDuck.offsetLeft;
            const duckY = newDuck.offsetTop;
            const distance = Math.floor(Math.sqrt((valueX - duckX) ** 2 + (valueY - duckY) ** 2));
            const duration = distance / duckSpeed;
            
            this.checkCoordinates(duck, duckX, valueX);
            
            animation = newDuck.animate(
                {left: valueX + 'px', top: valueY + 'px'},
                {duration: duration});

            animation.onfinish = () => {
                uiRender.playSound(audios[6]);
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
            clearInterval(duckSprite);
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
            uiRender.playSound(audios[1]);
            shotedAnim = setInterval ( () => {
                newDuck.style.transform === 'scaleX(1)' ? newDuck.style.transform = 'scaleX(-1)' : newDuck.style.transform = 'scaleX(1)';
            }, 200 );
        }
    })
}

const Dog = (uiRender) => {

    let dogAnim;

    return ({
        animateDog : function() {
            return new Promise((resolve) => {
                dogDiv.style.visibility = 'visible';
                dogDiv.style.zIndex = '2';
                dogDiv.style.left = '10%';
                dogDiv.style.bottom = '15%';
                dogDiv.style.width = '120px';

                this.dogIntroAnim(dogDiv, 0, 0, 120, 360, 100);

                dogDiv.animate(
                    {left: '200px'},
                    {duration: 1000}
                ).onfinish = () => {
                    dogDiv.style.left = '200px';
                    clearInterval(dogAnim);
                    this.dogIntroAnim(dogDiv, 360, 0, 120, 480, 150);
                                        
                    dog.animate(
                        {left: '201px'},
                        {duration: 500, delay: 1000}
                    ).onfinish = () => {
                        clearInterval(dogAnim);
                        this.dogIntroAnim(dogDiv, 0, -100, 120, 240, 250);
                        uiRender.playSound(audios[0]);

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
              });
        },
        
        dogIntroAnim : function(animal, positionX, positionY, spriteWidth, endPosition, speed) {
            const startPosition = positionX;
            dogAnim = setInterval ( () => {
                animal.style.backgroundPosition = `-${positionX}px ${positionY}px`; 
                if (positionX < endPosition) {
                    positionX += spriteWidth;
                } else {
                    positionX = startPosition;
                }
            }, speed );
        }
    })
}

const GameLogic = (uiRender, duck, dog) => {

    return ({
        verifyShot : function() {
            uiRender.blinkDuck();

            body.addEventListener('click', (event) => {
                const duckCoord = newDuck.getBoundingClientRect();
                mouseX = event.clientX;
                mouseY = event.clientY;
                uiRender.removeBullet();
                uiRender.playSound(audios[4]);

                if (mouseX >= duckCoord.left && mouseX <= duckCoord.right
                    && mouseY >= duckCoord.top && mouseY <= duckCoord.bottom) {
                    ducksKilled++;
                    this.setInterfaceChanges();
                    this.allAnimations();
                    duckShoted++;
                } else {
                    nrBullets--;
                    console.log('You missed!');
                }

                this.verifyBullets();
            });     
        },

        allAnimations: async function (){
            duck.stopAnimation();
            await duck.fallingAnimation();
            await uiRender.showDog(655, 5);
            if(ducksKilled === 10){
                round++;
                await uiRender.showRoundBox();
                uiRender.updateRound();
                this.resetValues();
                await dog.animateDog();
            }
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

        resetValues : function() {
            ducksKilled = 0;
            duckShoted = 1;
            duckSpeed += 0.1;

            Array.from(ducksDiv).forEach(el => {el.style.backgroundPosition = '-54px 582px';});
        },

        gameOver : function() {
            gameOverDiv.style.visibility = 'visible';
            body.style.pointerEvents = "none";
            uiRender.playSound(audios[3]);
            this.storageScore();
        },

        storageScore : function(){
            if (score > localStorage.getItem("totalScore")) {
                localStorage.setItem("totalScore", score);
            }
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
            score += scoreValues[round];
            scoreDiv.innerHTML = score;
        },

        hideScore : function() {
            mainScore.style.visibility = 'hidden';
        },

        showRoundBox : function () {
            this.playSound(audios[5]);
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
                dogDiv.style.bottom = '10%';
                dogDiv.style.width = '90px';
                dogDiv.style.left = (mouseX - dogDiv.offsetWidth/2) + 'px';
                dogDiv.style.zIndex = '0';
                dogDiv.style.visibility = 'visible';

                dogDiv.animate([
                    {bottom: '25%'}],
                    {duration: 1000
                    }).onfinish = () => {
                        dogDiv.style.bottom = '25%';
                        dogDiv.animate([
                            {bottom: '10%'}],
                            {duration: 500, delay: 1500
                            }).onfinish = () => {
                                dogDiv.style.visibility = 'hidden';
                                resolve();
                            }
                    };
            });
        },

        playSound : function(sound){
            audio = new Audio(`audios/${sound}`);
            audio.play();
        }
    })
}

const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}