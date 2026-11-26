'use strict';

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

const arrows = {'left': 'ArrowLeft', 'right': 'ArrowRight', 'gas': 'ArrowUp', 'reverse': 'ArrowDown'}
const wasd = {'left': 'a', 'right': 'd', 'gas': 'w', 'reverse': 's'}

class Controller {  //class that saves the keys pressed and is in association with the main play class
    constructor(game) {
        this.game = game //takes the address of Game class
        this.game.key = {}; //stores all the key held down and up
        window.addEventListener('keydown', e => { 
        this.game.key[e.key] = true });
        console.log(this.game.key)

        window.addEventListener('keyup', e => {
        this.game.key[e.key] = false });
    }
}


class Car {  //also in association with Game the main brain of the game
    constructor(game, x, y, color, angle, keys) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = angle;
        this.keys = keys
        this.vx = 0;
        this.vy = 0;
        this.radius = 18;

       
        
    }
    

    drawit(ctx) {
       

        ctx.beginPath()  //declares a new drawing
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2) //draws a circle
        ctx.fillStyle = this.color; //takes the colour ready
        ctx.fill(); //paints

    }

    driveit() {  //method responsible to drive each vehicule
        //console.log("drive")
        const key = this.game.key
        if (key[this.keys.right]) {      //if arrowleft is held = true
            this.angle += 0.07     //modifies the angle of the left car 
        }
        if (key[this.keys.left]) {
            this.angle -= 0.07
        }

        const cosinus = Math.cos(this.angle)  //depending on the angle, the value will effect x axis
        const sinus = Math.sin(this.angle) //depending on the angle, the value will effect y axis

        if (key[this.keys.gas]) {   //moves forward
            this.vx += cosinus * 0.09;     // the value [-1 to 1] is multiplied by a const
            this.vy += sinus * 0.09;  // same but sharply add to y if angle is 90 or 270
        }
        if (key[this.keys.reverse]) {
            this.vx -= cosinus * 0.07;
            this.vy -= sinus * 0.07;
        }
       
        const offgas = this.vx * cosinus + this.vy * sinus  //combines both vx and vy into 1 speed
        this.vx += (cosinus * offgas - this.vx) * 0.1;    // so turning will happen even if arrowup is not pressed
        this.vy += (sinus * offgas - this.vy) * 0.1;  // without it only angle moves but not the vehicule while sliding

        
        
        this.x += this.vx;   //conbines both the speed while driving + while sliding
        this.y += this.vy;

        this.vx *= 0.98  //keeps shrinking vx each frame by 98.5% till almost full stop
        this.vy *= 0.98;  //so it mimics a sliding effect, without it car will keep driving based on last speed recorded
        
        
        if (Math.hypot(this.vx, this.vy) < 0.03) {  //stops the car since the friction multiplication never goes to 0;
            this.vx = 0; //so if speed goes too small, it will do a full stop eventually
            this.vy = 0;
        } return true
        
        
    }
}


class Puck {
    constructor(x, y, color){
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = 12;
        this.speedX = 0;
        this.speedY = 0;

    }

    draw_puck(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    checkCollision(player){
        let dist_x = player.x - this.x;
        let dist_y = player.y - this.y;
        let distance = Math.hypot(dist_x, dist_y);

        if (distance <= this.radius + player.radius)
        {
            //collision with car will be detected
            let direction_x = -dist_x/distance; //minus side attached to let the puck move in opp. x-direction
            let direction_y = -dist_y/distance; //minus side attached to let the puck move in opp. y-direction

            this.speedX = direction_x*5;//puck will move with 5 pixel per frame in x-direction
            this.speedY = direction_y*5;//puck will move with 5 pixel per frame in y-direction

            console.log('Collision Detected'); //for testing purpose
            console.log('Speed X:', this.speedX); //for testing purpose
            console.log('Speed Y:', this.speedY); //for testing purpose
        }
    }
    movePuck(){
        this.x += this.speedX;
        this.y += this.speedY;
        console.log('New Speed X:', this.x); //for testing purpose
        console.log('New Speed Y:', this.y); //for testing purpose
    }

}

const puck = new Puck(512, 335, 'green')
puck.draw_puck(ctx);
puck.movePuck();

class Rink {

}

class Score {

}

class Booster {

}

class Game { // the main brain of the game takes the canvas dimension as parametre
    constructor(width, height, ctx) {
        this.width = width;
        this.height = height;
        this.ctx = ctx
        this.controller = new Controller(this) //calls these classes (nested)
        this.leftcar = new Car(this, 180, 335, 'red', 0, wasd)
        this.rightcar = new Car(this, 844, 335, 'lime', Math.PI, arrows)
    }
    Render() {  //method to draw from game instead of the other subclasses
        this.leftcar.drawit(this.ctx)
        this.rightcar.drawit(this.ctx)
        this.leftcar.driveit()  //keeep rendering in new positions
        this.rightcar.driveit()
    }


        


}

const play = new Game(canvas.width, canvas.height, ctx)  //main code calling the class Game
function animate() {  
    ctx.clearRect(0, 0, canvas.width, canvas.height)  //this clears last drawing of vehicule, without it the car pattern will be shown.
    play.Render() //calling it method of drawing
    console.log("p")
    
    requestAnimationFrame(animate)   //this windows object or method refreshes the screen to show movement
}
animate()
