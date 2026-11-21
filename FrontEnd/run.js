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

}

class Rink {

}

class Score {

}

class Booster {

}

class Play {

}