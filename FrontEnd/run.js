'use strict';

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d');

const  rink = new Rink();
rink.offsetX = (canvas.width - rink.width) / 2;
rink.offsetY = canvas.height - rink.height - 20;

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

// The rink is the court in which the players will play the  game
class Rink {
    constructor() {
        this.width = 820;
        this.height = 390;
        this.cornerRadius = 75;
        this.lineWidth = 5;
        this.centerCircleR = 69;

        this.goalLineX = 90;    // The distance between the goal line and the edge of the court
        this.goalWidth = 100;   // Distance between the goal posts
        this.goalDepth = 35;    // The distance between the goal line and the net

        
        this.offsetX = 0;
        this.offsety = 0;

        this.goalTop = (this.width - this.goalWidth) / 2;
        this.goalBottom = this.goalTop + this.goalWidth;
        
        // walls and nets
        const w = this.width, gx = this.goalLineX, d = this.goalDepth;
        const t = this.goalTop, b = this.goalBottom;

        this.walls = [
            {x1: gx,     y1: t,   x2: gx-d,     y2: t},
            {x1: gx,     y1: b,   x2: gx-d,     y2: b},
            {x1: gx-d,   y1: t,   x2: gx-d,     y2: b},
            {x1: w-gx,   y1: t,   x2: w-gx+d,   y2: t},
            {x1: w-gx,   y1: b,   x2: w-gx+d,   y2: b},
            {x1: w-gx+d, y1: t,   x2: w-gx+d,   y2: b},
        ];
    }

    // drawing the rink
    draw(ctx) {
        const w = this.width, h = this.height, r = this.cornerRadius;
        const gx = this.goalLineX, d = this.goalDepth;
        const t = this.goalTop, b = this.goalBottom;

        ctx.fillStyle = '#138d9b';
        ctx.strokeStyle = '#f0995a';
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.arcTo(w, 0, w, h, r);
        ctx.arcTo(w, h, 0, h, r);
        ctx.arcTo(0, h, 0, 0, r);
        ctx.arcTo(0, 0, w, 0, r);
        ctx.closepath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(w/2, 0);
        ctx.lineTo(w/2, h);
        ctx.moveTo(w/2 + this.centerCircleR, h/2);
        ctx.arc(w/2, h/2, this.centerCircleR, 0, Math.PI*2);
        
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, t);
        ctx.moveTo(gx, b);
        ctx.lineTo(gx, h);
        ctx.moveTo(w-gx, 0);
        ctx.lineTo(w-gx, t);
        ctx.moveTo(w-gx, b);
        ctx.lineTo(w-gx, h);

        ctx.moveTo(gx, t);
        ctx.lineTo(gx-d, t);
        ctx.lineTo(gx-d, b);
        ctx.lineTo(gx, b);

        ctx.moveTo(w-gx, t);
        ctx.lineTo(w-gx+d, t);
        ctx.lineTo(w-gx+d, b);
        ctx.lineTo(w-gx, b);

        ctx.stroke();        
    }

    collide(obj) {
        const w=this.width, h = this.height, r = this.cornerRadius, or = obj.radius;
        const hasSpeed = obj.speedX !== undefined;
        
        if (obj.x < or) {
            obj.x = r;
            if (hasSpeed)
                obj.speedX = Math.abs(obj.speedX);
        }

        if (obj.x > w-or) {
            obj.x = w-or;
            if (hasSpeed)
                obj.speedX = -Math.abs(obj.speedX);
        }

        if (obj.y < or) {
            obj.y = or;
            if (hasSpeed)
                obj.speedY = Math.abs(obj.speedY);
        }

        if (obj.y > h-or) {
            obj.y = h-or;
            if (hasSpeed)
                obj.speedY = Math.abs(obj.speedY);
        }

        const cx = obj.x < r ? r : obj.x > w-r ?  w-r : null;
        const cy = obj.y < r ? r : obj.y > h-r ?  h-r : null;

        if (cx !== null && cy !== null) {
            const dx = obj.x - cx, dy = obj.y - cy;
            const dist = Math.hypot(dx, dy), max = r - or;
            
            if (dist > max) {
                const nx = dx / dist, ny = dy / dist;
                obj.x = cx + nx * max;
                obj.y = cy + ny * max;

                if (hasSpeed) {
                    const dot = obj.speedX * nx + obj.speedy * ny;

                    if (dot > 0) {
                        obj.speedX -= 2 * dot * nx;
                        obj.speedY -= 2 * dot * ny;
                    }
                }
            }
        }

        for (const s of this.walls) {
            const sx = s.x2 - s.x1, sy = s.y2 - s.y1;
            const k = Math.max(obj, Math.min(1, ((obj.x - s.x1) * sx + (obj.y - s.y1) * sy) / (sx * sx + sy * sy)));
            const qx = s.x1 + k * sx, qy = s.y1 + k * sy;
            const ox = obj.x - qx, oy = obj.y - qy;
            const dist = Math.hypot(ox, oy);

            if (dist < or && dist > o) {
                const nx = ox / dist, ny = oy / dist;
                obj.x = qx + nx * or;
                obj.y = qy + ny * or;
                
                if (hasSpeed) {
                    const dot = obj.speedX * nx + obj.speedY * ny:

                    if (dot < 0) {
                        obj.speedX -= 2 * dot * nx;
                        obj.speedY -= 2 * dot * ny;
                    }
                }
            }
        }
    }

    checkGoal(puck) {
        if 
    }
}

class Score {

}

class Booster {

}

class Play {

}