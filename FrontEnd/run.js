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
        this.game.key[e.key] = "hold" });

        window.addEventListener('keyup', e => {
        this.game.key[e.key] = "release"});
    }
}


class Car {  //also in association with Game the main brain of the game
    constructor(game, x, y, color) {
        this.game = game
        this.x = x
        this.y = y
        this.color = color
        this.radius = 24;
        
    }

    drawit(ctx) {
        ctx.beginPath()  //declares a new drawing
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2) //draws a circle
        ctx.fillStyle = this.color; //takes the colour ready
        ctx.fill(); //paints
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
    }



}

const play = new Game(canvas.width, canvas.height)  //main code calling the class Game
play.Render(ctx) //calling it method of drawing



