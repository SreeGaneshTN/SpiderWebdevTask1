let canvas = document.querySelector('canvas');
let intro = document.querySelector('.front');
let Game = document.querySelector('#game');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
let second = document.querySelector('.timer h2');
let sec = 0;
let ctx = canvas.getContext('2d');
let rate = 150;
let score = 0;
const dx = 1,
    dy = 1;
let radius;
let circlearray = [];
let area = 0;
let x, y, ss;

let colors = [
    '#23313d',
    '#684674',
    '#84254a',
    '#ffffff',
    '#fcd671'
]
var game = {
    start: function() {
        intro.style.display = 'none';
        Game.style.visibility = 'visible';
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 10);
        timer();
    },
    clear: function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    resume: function() {
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 10);
        timer();
    },
    pause: function() {
        clearInterval(this.interval);
        clearInterval(ss);
    },
    stop: function() {
        clearInterval(this.interval);
        clearInterval(ss);
        alert("GAME OVER!!");
        Game.style.visibility = 'hidden';
        document.querySelector('.score').style.display = 'block';
        document.querySelector('.score span').innerHTML += score;
    },

}

function restart() {
    sec = 0;
    rate = 150;
    score = 0;
    area = 0;
    circlearray = [];
    document.querySelector('.score span').innerHTML = 'Your Score is';
    document.querySelector('.score').style.display = 'none';
    game.start();
}
var mouse = {
    x: null,
    y: null,
}

//Function to generate circles inside screen//

function randomIntFromRange(min, max) {

    return Math.floor(Math.random() * (max - min + 1) + min)

}

function rotate(velocity, angle) {

    const rotatedVelocities = {

        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),

        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)

    };



    return rotatedVelocities;

}
// Collision between balls are resolved using oblique collision//

function resolveCollision(particle, otherParticle) {

    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;

    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;

    const yDist = otherParticle.y - particle.y;



    // Prevent accidental overlap of particles

    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {



        // Grab angle between the two colliding particles

        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);



        // Store mass in var for better readability in collision equation

        const m1 = particle.mass;

        const m2 = otherParticle.mass;



        // Velocity before equation

        const u1 = rotate(particle.velocity, angle);

        const u2 = rotate(otherParticle.velocity, angle);



        // Velocity after 1d collision equation

        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };

        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };



        // Final velocity after rotating axis back to original location

        const vFinal1 = rotate(v1, -angle);

        const vFinal2 = rotate(v2, -angle);



        // Swap particle velocities for realistic bounce effect

        particle.velocity.x = vFinal1.x;

        particle.velocity.y = vFinal1.y;



        otherParticle.velocity.x = vFinal2.x;

        otherParticle.velocity.y = vFinal2.y;

    }

}




function distance(x1, y1, x2, y2) {

    const xDist = x2 - x1

    const yDist = y2 - y1



    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))

}

function circle(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = {
        x: dx,
        y: dy,
    }
    this.mass = 1;
    this.radius = radius;
    this.color = color;

    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();


    }

    this.update = function(circlearray) {
        this.draw();
        for (let i = 0; i < circlearray.length; i++) {
            if (this === circlearray[i]) continue;
            if (distance(this.x, this.y, circlearray[i].x, circlearray[i].y) - (this.radius + circlearray[i].radius) < 0) {
                resolveCollision(this, circlearray[i]);
            }
        }


        if (this.x + this.radius > canvas.width || this.x < this.radius)
            this.velocity.x = -this.velocity.x;
        if (this.y + this.radius > canvas.height || this.y < this.radius) { this.velocity.y = -this.velocity.y; }


        this.x += this.velocity.x;
        this.y += this.velocity.y;

    }
}

function updateGameArea() {
    game.clear();
    game.frameNo += 1;

    if (game.frameNo == 1 || everyinterval(rate)) {
        radius = Math.floor(Math.random() * 30 + 5);
        x = randomIntFromRange(radius, canvas.width - radius);
        y = randomIntFromRange(radius, canvas.height - radius);
        if (circlearray.length > 1) {
            for (let i = 0; i < circlearray.length; i++) {
                if (distance(x, y, circlearray[i].x, circlearray[i].y) - (radius + circlearray[i].radius) < 0) {
                    radius = Math.floor(Math.random() * 30 + 5);
                    x = randomIntFromRange(radius, canvas.width - radius);
                    y = randomIntFromRange(radius, canvas.height - radius);
                    i = -1;
                }

            }
        }
        idx = Math.floor(Math.random() * colors.length);
        area += (Math.PI * radius * radius);
        circlearray.push(new circle(x, y, dx, dy, radius, colors[idx]));
    }
    for (i = 0; i < circlearray.length; i += 1) {
        circlearray[i].update(circlearray);
    }
    if (area >= (0.3 * canvas.height * canvas.width))
        game.stop();
}

window.addEventListener('click', function(e) {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
    for (let i = 0; i < circlearray.length; i++) {
        if (distance(mouse.x, mouse.y, circlearray[i].x, circlearray[i].y) - 2 * (circlearray[i].radius) < 0) {
            circlearray.splice(i, 1);
            area -= Math.PI * radius * radius;
            score++;
            break;
        }
    }
})

function gauntlet() {
    console.log('clicked');
    for (let i = 0; i < circlearray.length; i++) {
        console.log('clicked');
        circlearray.splice(i, 1);
        area -= Math.PI * radius * radius;
        if (i == (circlearray.length) / 2)
            break;
    }
}

function timer() {
    ss = setInterval(setsec, 1000);
}

function setsec() {
    sec++;
    if (sec % 30 == 20)
        rate = 50;
    second.innerHTML = sec;
}

function everyinterval(n) {
    if ((game.frameNo / n) % 1 == 0) { return true; }
    return false;
}