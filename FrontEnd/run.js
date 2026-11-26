'use strict';

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

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
    constructor(game, x, y, color) {
        this.game = game
        this.x = x
        this.y = y
        this.vx = 0;
        this.vy = 0;
        this.angle = 0;
        this.color = color
        this.radius = 18;
        
    }
    

    drawit(ctx) {
        ctx.beginPath()  //declares a new drawing
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2) //draws a circle
        ctx.fillStyle = this.color; //takes the colour ready
        ctx.fill(); //paints
    }

    driveit() {  //method responsible to drive each vehicule
        if (this.game.key['ArrowLeft']) {      //if arrowleft is held = true
            this.game.leftcar.angle -= 0.03     //modifies the angle of the left car 
        }
        if (this.game.key['ArrowRight']) {
            this.game.leftcar.angle += 0.03
        }

        const left_cos = Math.cos(this.game.leftcar.angle)  //depending on the angle, the value will effect x axis
        const left_sin = Math.sin(this.game.leftcar.angle) //depending on the angle, the value will effect y axis

        if (this.game.key['ArrowUp']) {   //moves forward
            this.game.leftcar.vx += left_cos * 0.018;     // the value [-1 to 1] is multiplied by a const
            this.game.leftcar.vy += left_sin * 0.018;  // same but sharply add to y if angle is 90 or 270
        }
        if (this.game.key['ArrowDown']) {
            this.game.leftcar.vx -= left_cos * 0.01;
            this.game.leftcar.vy -= left_sin * 0.01;
        }
       
        const left_offgas = this.game.leftcar.vx * left_cos + this.game.leftcar.vy * left_sin  //combines both vx and vy into 1 speed
        this.game.leftcar.vx += (left_cos * left_offgas - this.game.leftcar.vx) * 0.2;    // so turning will happen even if arrowup is not pressed
        this.game.leftcar.vy += (left_sin * left_offgas - this.game.leftcar.vy) * 0.2;  // without it only angle moves but not the vehicule while sliding

        
        
        this.game.leftcar.x += this.game.leftcar.vx;   //conbines both the speed while driving + while sliding
        this.game.leftcar.y += this.game.leftcar.vy;

        if (this.game.key['a']) {
            this.game.rightcar.angle -= 0.03
        }
        if (this.game.key['d']) {
            this.game.rightcar.angle += 0.03
        }

        const right_cos = Math.cos(this.game.rightcar.angle)
        const right_sin = Math.sin(this.game.rightcar.angle)

        if (this.game.key['s']) {
            this.game.rightcar.vx += right_cos * 0.01;
            this.game.rightcar.vy += right_sin * 0.01;
        }
        if (this.game.key['w']) {   //equivalent to left vehicule's ArrowDown but moves forward for right vehicle
            this.game.rightcar.vx -= right_cos * 0.018;
            this.game.rightcar.vy -= right_sin * 0.018;
        }
       
        const right_offgas = this.game.rightcar.vx * right_cos + this.game.rightcar.vy * right_sin
        this.game.rightcar.vx += (right_cos * right_offgas - this.game.rightcar.vx) * 0.2;    
        this.game.rightcar.vy += (right_sin * right_offgas - this.game.rightcar.vy) * 0.2;

        this.vx *= 0.985  //keeps shrinking vx each frame by 98.5% till almost full stop
        this.vy *= 0.985  //so it mimics a sliding effect, without it car will keep driving based on last speed recorded
        
        this.game.rightcar.x += this.game.rightcar.vx;
        this.game.rightcar.y += this.game.rightcar.vy;


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
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.controller = new Controller(this) //calls these classes (nested)
        this.leftcar = new Car(this, 180, 335, 'red')
        this.rightcar = new Car(this, 1024-180, 335, 'lime')
    }
    Render(ctx) {  //method to draw from game instead of the other subclasses
        this.leftcar.drawit(ctx)
        this.rightcar.drawit(ctx)
        this.leftcar.driveit()  //keeep rendering in new positions
        this.rightcar.driveit()
    }
        



}

const play = new Game(canvas.width, canvas.height)  //main code calling the class Game
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)  //this clears last drawing of vehicule, without it the car pattern will be shown.
    play.Render(ctx) //calling it method of drawing
    requestAnimationFrame(animate)   //this windows object or method refreshes the screen to show movement
}
animate()