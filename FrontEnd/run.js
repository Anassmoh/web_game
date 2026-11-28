'use strict';

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

const frames = 8;      //sprite images
const framesw = 430;    
const framesh = 320;
const COURT_SRC = 'pitch.svg';
const OVERLAY_SRC = 'overlay.svg'

function loadImage(src) {
    const img = new Image();
    img.ready = false;
    img.onload = () => { img.ready = true; };
    img.onerror = () => console.error('Could not load image:', src);
    img.src = src;
    return img;
}

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
    constructor(game, x, y, image, angle, keys) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.keys = keys
        this.vx = 0;
        this.vy = 0;
        this.width = 50;
        this.height = 37.2;
        this.image = new Image();
        this.image.src = image;
        this.radius = 18;
        this.bounce = 0.2;

       
        
    }
    

    drawit(ctx) {
        const a = ((this.angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);           // angle kept between 0 and 2π
        const frame = Math.round(a / ((Math.PI * 2) / frames)) % frames;      // nearest of the 8 frames

        ctx.drawImage(this.image, frame * framesw, 0, framesw, framesh, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

    
    }

    driveit() {  //method responsible to drive each vehicule
        //console.log("drive")
        const key = this.game.key
        if (key[this.keys.right]) {      //if arrowleft or a is held = true
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

// The rink is the court in which the players will play the  game
class Rink {
    constructor(game) {
        this.game = game;

        // pitch and overlay measurements
        this.width = 950;
        this.height = 450;
        this.overlayHeight = 480;
        this.frontWall = 30;

        // goal measurements
        this.goalLineX = 60;    // distance from the edge of the pitch to the goal line
        this.goalWidth = 120;   // distance between the goal posts
        this.goalDepth = 40;    // the distance from the goal line to the back of the net

        this.offsetX = (game.width - this.width) / 2;
        this.offsetY = game.height - 20 - this.height;
        this.overlayY = game.height - 20 - this.overlayHeight;

        this.courtImg = loadImage(COURT_SRC);
        this.overlayImg = loadImage(OVERLAY_SRC);

        this.goalTop = this.offsetY + (this.height - this.goalWidth) / 2;
        this.goalBottom = this.goalTop + this.goalWidth;

        // the playable area
        this.floorLeft = this.offsetX + this.goalLineX;
        this.floorRight = this.offsetX + this.width - this.goalLineX;
        this.floorTop = this.offsetY;
        this.floorBottom = this.offsetY + this.height - this.frontWall;

        const w = this.width, gx = this.goalLineX, d = this.goalDepth;
        const t = this.goalTop, b = this.goalBottom, fb = this.floorBottom;
        const gl = this.floorLeft, gr = this.floorRight;

        // defining the walls for the puck
        this.walls = [
            // goal lines solid minus the area between the goal posts
            {x1: gl,     y1: this.floorTop, x2: gl,     y2: t},
            {x1: gl,     y1: b,             x2: gl,     y2: fb},
            {x1: gr,     y1: this.floorTop, x2: gr,     y2: t},
            {x1: gr,     y1: b,             x2: gr,     y2: fb},
            // nets
            {x1: gl,     y1: t,   x2: gl-d,     y2: t},
            {x1: gl,     y1: b,   x2: gl-d,     y2: b},
            {x1: gl-d,   y1: t,   x2: gl-d,     y2: b},
            {x1: gr,     y1: t,   x2: gr+d,     y2: t},
            {x1: gr,     y1: b,   x2: gr+d,     y2: b},
            {x1: gr+d,   y1: t,   x2: gr+d,     y2: b},
        ];
    }

    // Drawing the court
    drawCourt(ctx) {
        if (this.courtImg.ready) {
            ctx.drawImage(this.courtImg, this.offsetX, this.offsetY, this.width, this.height);
        }
    }

    // adding the overlay for a pseudo-3D effect
    drawOverlay(ctx) {
        if (this.overlayImg.ready) {
            ctx.drawImage(this.overlayImg, this.offsetX, this.overlayY, this.width, this.overlayHeight);
        }
    }

    // bounce
    bounceOff(obj, nx, ny) {
        const dot = obj.vx * nx + obj.vy * ny;
        if (dot < 0) {
            obj.vx -= (1 + obj.bounce) * dot * nx;
            obj.vy -= (1 + obj.bounce) * dot * ny;
        }
    }

    // collisions
    collide(obj, enterNet = false) {
        const or = obj.radius;

        if (enterNet) {
            this.collideWalls(obj);

            // limiting the puck to the back of the nets
            const minX = this.floorLeft - this.goalDepth + or;
            const maxX = this.floorRight + this.goalDepth - or;
            if (obj.x < minX) { obj.x = minX; this.bounceOff(obj,  1, 0); }
            if (obj.x > maxX) { obj.x = maxX; this.bounceOff(obj, -1, 0); }
        }
        
        // left and right wall stoppin the cars
        else {
            if (obj.x < this.floorLeft + or)  { obj.x = this.floorLeft + or;  this.bounceOff(obj,  1, 0); }
            if (obj.x > this.floorRight - or) { obj.x = this.floorRight - or; this.bounceOff(obj, -1, 0); }
        }

        // top and bottom wall stoppin the cars
        if (obj.y < this.floorTop + or)    { obj.y = this.floorTop + or;    this.bounceOff(obj, 0,  1); }
        if (obj.y > this.floorBottom - or) { obj.y = this.floorBottom - or; this.bounceOff(obj, 0, -1); }
    }

    // the collision of the puck with the walls
    collideWalls(obj) {
        const or = obj.radius;

        for (const s of this.walls) {
            const sx = s.x2 - s.x1, sy = s.y2 - s.y1;
            const k = Math.max(0, Math.min(1, ((obj.x - s.x1) * sx + (obj.y - s.y1) * sy) / (sx * sx + sy * sy)));
            const qx = s.x1 + k * sx, qy = s.y1 + k * sy;
            const ox = obj.x - qx, oy = obj.y - qy;
            const dist = Math.hypot(ox, oy);

            if (dist < or && dist > 0) {
                const nx = ox / dist, ny = oy / dist;
                obj.x = qx + nx * or;
                obj.y = qy + ny * or;
                this.bounceOff(obj, nx, ny);
            }
        }
    }

    checkGoal(puck) {
        if (puck.y < this.goalTop || puck.y > this.goalBottom) return null;
        if (puck.x < this.floorLeft && puck.x > this.floorLeft - this.goalDepth) return 'left';
        const rx = this.floorRight;
        if (puck.x > rx && puck.x < rx + this.goalDepth) return 'right';
        return null;
}

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
        this.rink = new Rink(this);
        this.leftcar = new Car(this, 180, 335, 'left_car.png', 0, wasd)
        this.rightcar = new Car(this, 844, 335, 'right_car.png', Math.PI, arrows)
        
    }
    Render() {  //method to draw from game instead of the other subclasses
        this.rink.drawCourt(this.ctx)
        this.leftcar.drawit(this.ctx)
        this.rightcar.drawit(this.ctx)
        this.leftcar.driveit()  //keeep rendering in new positions
        this.rightcar.driveit()
        this.rink.collide(this.leftcar)
        this.rink.collide(this.rightcar)
        this.rink.drawOverlay(this.ctx)
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
