const canvas = document.getElementById("canvas");

let fireworkStickImage =  new Image();
fireworkStickImage.src = `images/FireworkStickBgRemovedPart.png`;   //1:5 ratio

//var fireworkExplodingSound = new Audio(`sound/fwWithDelaySound.mp3`);

let screen_width = screen.width;//-10
let screen_height = screen.height;//-100
const ctx = canvas.getContext("2d");

const scroll_minus_x = 30;
const scroll_minus_y = 0;

canvas.width = screen_width - scroll_minus_x;
canvas.height = screen_height - scroll_minus_y;

let noOfStars = 20;

let stars = []
let fireworkSticks = []
let fireworks = []
let particles = []


let gameObjects = [stars, fireworkSticks, fireworks, particles];


const fireworkStickSpeed = 10; 
const fireworkStickRandSpeedDivergence = fireworkStickSpeed / 4.2; 

const fireworkStickExplodeHeight = canvas.height - (canvas.height / 1.4);
const fireworkStickExplodeHeightDivergence = fireworkStickExplodeHeight / 4;

let FPS = true;
let Sound = true;

///////////////////////////PURPLE////////////////////////RED///////////////////////BLUE///////////////////////GREEN///////////////////YELLOW//////////////
const fireworkColours =  ["rgba(227, 49, 141, 0.8)", "rgba(250, 2, 39, 0.74)", "rgba(14, 21, 211, 0.86)", "rgba(25, 217, 12, 0.9)", "rgba(241, 241, 12, 0.9)"];
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;


//////////BDAY/////////
const bday="Dad";

class gameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    doTickActions(){

    }
}

class Star extends gameObject{
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }
    
    draw() {
        
        const radius = Math.min(this.width, this.height) / 2;
        ctx.fillStyle = "white";
        ctx.shadowBlur = 8;
        ctx.shadowColor =  "yellow";
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.shadowColor =  "";
    }

    doTickActions(){
        this.draw();
    }
}

class Particle extends gameObject{
    constructor(timeAliveInTicks, colour, speed, shadowBLUR, vx, vy, x, y, width, height) {
        super(x, y, width, height);
        this.timeAliveInTicks = timeAliveInTicks;
        this.currentTimeAliveInTicks = 0;
        this.colour = colour;
        this.speed = speed;
        this.shadowBLUR = shadowBLUR;
        this.vx = vx;
        this.vy = vy;
    }
    
    addTime(){
        this.currentTimeAliveInTicks += 1;
    }

    checkAlive() {
        if(this.currentTimeAliveInTicks >= this.timeAliveInTicks){
            let indexInArray = particles.indexOf(this);
            if(indexInArray >= 0)
            {
                particles.splice(indexInArray, 1);
            }
        }
    }

    move(){
        this.x += this.vx * this.speed;
        this.y += this.vy * this.speed;
    }

    draw() {
        
        const radius = Math.min(this.width, this.height) / 2;
        ctx.fillStyle = this.colour;
        ctx.shadowBlur = this.shadowBLUR;
        ctx.shadowColor = this.colour;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.shadowColor = "";
    }

    doTickActions(){
        this.addTime();
        this.checkAlive();
        this.move();
        this.draw();
    }
}

class fireWorkStick extends gameObject{
    constructor(image, speed, explodeHeight, fireworkParticles, x, y, width, height) {
        super(x, y, width, height);
        this.image = image;
        this.speed = speed;
        this.explodeHeight = explodeHeight;
        this.fireworkParticles = fireworkParticles;
        //this.explodeSoundDelayInTicks = explodeSoundDelayInTicks;
        //this.waitingOnExplode = false;
        //this.explodeSoundDelayInTicksCurrent = 0;
    }
    
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    moveUp() {
        this.y -= this.speed;
    }

    summonExplodingParticles(){
        //this.waitingOnExplode = true;
        
        if(Sound) {
            const fireworkExplodingSound = new Audio(`sound/fwTrimmedFinal.mp3`);
            //fireworkExplodingSound.onended = () => { };
            fireworkExplodingSound.play();
        }

        let colour = fireworkColours[random(0, fireworkColours.length)];
        
        for(let i = 1; i <= this.fireworkParticles; i++){
            let x = this.x + Math.random();
            let y = this.y + Math.random();

            //let colour = `rgb(${random(0, 225)}, ${random(0, 225)} , ${random(0, 225)})`; 
            //let colour = `rgba(${random(0, 225)}, ${random(0, 225)} , ${random(0, 225)}, ${0.85})`; 

            let angle = (i / this.fireworkParticles) * (Math.PI) * 2;
            let speed = 2 ;//+ Math.random();

            let vx = Math.cos(angle) + (Math.random()/ 1.5);
            let vy = Math.sin(angle) + (Math.random() / 1.5);

            let width = random(4, 5);
            let height  = random(4, 5);
            particles.push(new Particle(random(90, 100), colour, speed, 12, vx, vy, x, y, width, height));
        }
    }

    summonTrailParticles(){
        let bottomY = this.y +  (this.height);
        let middleX = this.x + (this.width / 2);

        //let divergenceY = (bottomY / 3.4);
        let divergenceX = 4;
        for(let i = 1; i <= 3; i++){
            let x = (random((middleX - divergenceX), (middleX + divergenceX))); 
            let y = bottomY;
            
            let BLUR = 6;

            let colour = "rgba(255,255,255, 0.75)";
            if(random(1, 3) == 3){
                colour = `rgba(205, ${random(30, 125)} , 25, 0.75)`; 
                BLUR = 20;
            }
            particles.push( new Particle(5, colour, 0, BLUR, 0, 0, x, y, 3, 3) );
        }
       
    }
    checkHeightToExplode()
    {
        if(this.y <= this.explodeHeight)
        {
            this.summonExplodingParticles();
            let indexInArray = fireworkSticks.indexOf(this);
            if(indexInArray >= 0)
            {
                fireworkSticks.splice(indexInArray, 1);
            }
        }

    }

    /*checkPlaySound(){
        if(this.waitingOnExplode){
            console.log('debug 1');
            if(this.explodeSoundDelayInTicksCurrent >= this.explodeSoundDelayInTicks){
                console.log('debug 2');
                fireworkExplodingSound.play();
                this.waitingOnExplode = false;
                this.explodeSoundDelayInTicksCurrent = 0;
            }
            else{
                console.log('debug 3');
                this.explodeSoundDelayInTicksCurrent++;
            }
            
        }
    }*/

    doTickActions(){

        this.summonTrailParticles();
        this.draw();
        this.checkHeightToExplode();
        this.moveUp();
        //this.checkPlaySound();
    }
}




function generateStarts(starNumber) {
    for(let i = 1; i <= starNumber; i++) {
        stars.push(new Star(random(0, (canvas.width - 10)), random(0, (canvas.height - 10)), random(5, 8), random(5, 8)));
    }
}

generateStarts(noOfStars);





canvas.addEventListener(
    "click",
    (click) => {
        //FPS clicked
        if(click.x >= 0 && click.y >= 0 && click.x <= 63 && click.y <= 22){
            FPS = !FPS;
        }
        //Sound clicked
        else if(click.x >= canvas.width - 55 && click.y >= 0 && click.x <= canvas.width && click.y <= 16){
            Sound = !Sound;
        }
        //anywhere else do a firework
        else{
            const width = 10 - 2.5, height = 50 - 12.5;
            const speed = random( (fireworkStickSpeed - fireworkStickRandSpeedDivergence), (fireworkStickSpeed + fireworkStickRandSpeedDivergence));
            const explodeHeight = random( (fireworkStickExplodeHeight - fireworkStickExplodeHeightDivergence), (fireworkStickExplodeHeight + fireworkStickExplodeHeightDivergence))
            
            const numOfParticles = random(30, 50);
            fireworkSticks.push(new fireWorkStick(fireworkStickImage, speed, explodeHeight, numOfParticles, click.x, canvas.height - (height * 1), width, height));
        }
        
    },
    false,
  );




var lastFPSLoop = new Date();
function showFPS(){
    if(!FPS){
        return false;
    }
    var thisLoop = Date.now();
    var fps = 1000 / (thisLoop - lastFPSLoop);
    lastFPSLoop = thisLoop;

    ctx.font = "18px serif";
    if(fps < 13){
        ctx.fillStyle = "red";
    }
    else if(fps < 30){
        ctx.fillStyle = "yellow";
    }
    else{
        ctx.fillStyle = "green";
    }

    ctx.fillText(`FPS: ${Math.floor(fps)}`, 6, 15);
}

function showSound(){
    if(Sound){
        ctx.font = "18px serif";
        ctx.fillStyle = "purple";
        ctx.fillText(`Sound`, canvas.width - 52, 15);
    }

}

function showBdayText(name, x, y){
    if(name==""){
        return;
    }

    const happyBdayString = "Happy Birthday" + name;
    ctx.fillStyle = "green";
    ctx.font = "48px serif";
    ctx.fillText(happyBdayString, x - (happyBdayString.length * 1.5), y);
    
}

function gameloop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    

    for(gameObject of gameObjects)
    {
        for(object of gameObject)
        {
            object.doTickActions();
        }
    }
    
    showFPS();
    showSound();
    showBdayText(bday, screen_width/2, screen_height/2)
}






var gameInterval = setInterval(gameloop, 20);
   




