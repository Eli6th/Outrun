// Imports
import { StartArea, WinArea } from './areas.js';
import { Player } from './player.js';
import { InputHandler } from './input.js';
import { PatrolEnemy, ChaseEnemy } from './enemy.js';
import { resetLevelAnim } from './animation.js';

// Global constants
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;

// Creating the game canvas
var canvas = document.getElementById("game_panel");
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
var ctx = canvas.getContext("2d");

// Setting HTML elements
if (localStorage.getItem('level')) {
    var level = parseInt(localStorage.getItem('level'));
} else {
    var level = 1;
    localStorage.setItem('level', level);
}
var level_counter = document.getElementById("level_counter");

if (localStorage.getItem('highscore')) {
    var highscore = parseInt(localStorage.getItem('highscore'));
} else {
    var highscore = 1;
    localStorage.setItem('highscore', highscore);
}
var highscore_counter = document.getElementById("highscore_counter");
highscore_counter.innerHTML = highscore;

// Creating player
let player = new Player(50, 50, 10, 10, 1);
if (localStorage.getItem('playerLives')) {
    player.lives = parseInt(localStorage.getItem('playerLives'));
} else {
    player.lives = 1;
    localStorage.setItem('playerLives', player.lives);
}
new InputHandler(player);

// Game areas
var win = new WinArea(450, 450, 50, 50);
var start = new StartArea(35 + player.width / 2, 35 + player.height / 2, 30, 30);

// Creating enemies
var enemies = [];

// Creating the canvas and live game
let requestID;
let animating = true;
let last_time = 0;
function UpdateCanvas(timestamp) {
    if (!animating) {
        requestID = requestAnimationFrame(UpdateCanvas);
        return;
    }

    let delta_time = timestamp - last_time;
    last_time = timestamp;

    ctx.clearRect(0, 0, 800, 600);
    win.draw(ctx);
    start.draw(ctx);

    for (var enemy = 0; enemy < enemies.length; enemy++) {
        enemies[enemy].movement(player);
        enemies[enemy].draw(ctx);
    }

    player.update(delta_time);
    player.draw(ctx);

    checkCollisions();

    requestID = requestAnimationFrame(UpdateCanvas);
}
function StartLevel() {
    resetLevelAnim(ctx, requestID);
    animating = false;
    setTimeout(() => {
        animating = true;
        requestID = requestAnimationFrame(UpdateCanvas);
    }, 2000);
    console.log(requestID);

    enemies = []

    var max = 490, min = 0;

    // Reset player position
    player.position.x = 50;
    player.position.y = 50;

    // Spawn Patrol and Chasing Enemies every 5 levels
    for (var i = 0; i < level; i ++) {
        enemies.push(new ChaseEnemy(RandomNum(max, min), RandomNum(max, min), 10, 10, 0.2));
        if (RandomNum(2, 0) == 0) {
            let y = RandomNum(max, min);
            enemies.push(new PatrolEnemy(RandomNum(max, min), RandomNum(max, min), 10, 10, 0.5, [
                [RandomNum(max, min), y], 
                [RandomNum(max, min), y]
            ]));
        } else {
            let x = RandomNum(max, min);
            enemies.push(new PatrolEnemy(RandomNum(max, min), RandomNum(max, min), 10, 10, 0.5, [
                [x, RandomNum(max, min)], 
                [x, RandomNum(max, min)]
            ]));
            console.log(enemies.positions);
        }
    }
    // Spawn Border Patrol Enemies every 5 levels
    for (var i = 0; i < parseInt(level / 5); i ++) {
        enemies.push(new PatrolEnemy(RandomNum(max, min), 100, 10, 10, 1, [[10, 10], [10, 490], [490, 490], [490, 10]]));
    }

    // Update the level counter
    level_counter.innerHTML = level.toString();
    if (level > highscore) {
        highscore = level;
        highscore_counter.innerHTML = highscore.toString();
        localStorage.setItem('highscore', highscore);
    }
    localStorage.setItem('level', level);
}

function RandomNum(max, min) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
function checkCollisions() {
    if (player.position.x >= 450 - player.width && player.position.y >= 450 - player.height) {
        level++;

        if (level % 5 == 0) {
            player.update_lives(1);
        }

        StartLevel();
    }

    // Check for collisions with start area
    if (start.check_collision(player)) {
        player.is_hidden = true;
    } else {
        player.is_hidden = false;
    }

    // Check for collisions by enemies
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].check_collision(player) && !player.is_hidden) {
            player.update_lives(-1);
            if (player.lives <= 0) {
                player.lives = 1;
                level = 1;
            }

            StartLevel();
        }
    }

    if (player.is_hidden) {
        player.color = "#808080";
    } else {
        player.update_lives(0);
    }
}
StartLevel();
UpdateCanvas();