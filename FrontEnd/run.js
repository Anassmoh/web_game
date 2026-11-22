'use strict';

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d');

class Controller {
    constructor() {
        this.key = {};
        window.addEventListener('keydown', e => { 
        this.key[e.key] = "hold" 
        console.log(this.key)});

        window.addEventListener('keyup', e => {
        this.key[e.key] = "release"
        console.log(this.key)});
    }
}

const controller = new Controller();

class Car {
    constructor(x,y,color) {
        this.x = x
        this.y = y
        this.color = color
        this.radius = 24;
        
    }

    drawit(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

const player1 = new Car(180, 335, 'red')
player1.drawit(ctx);

const player2 = new Car(1024-180, 335, 'lime')
player2.drawit(ctx);


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
puck.checkCollision(player1);
puck.movePuck();

class Rink {

}

class Score {

}

class Booster {

}

class Play {

}