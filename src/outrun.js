// Imports
import { StartArea, WinArea } from './areas.js';

import { Player } from './player.js';
import { InputHandler } from './input.js';
import { handleParticles, createParticles } from './particles.js';

import { World } from './world.js';

import { PatrolEnemy, ChaseEnemy } from './enemy.js';
import { resetLevelAnim, screenShake, postShake } from './animation.js';

// Global constants
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;

// Creating the game canvas
var canvas = document.getElementById("game_panel");
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
var ctx = canvas.getContext("2d");

var death_anim = false;

// Checking if this is player's first time joining
if (!localStorage.getItem('tutorial')) {
    localStorage.setItem('tutorial', true);
    // Display tutorial modal
}

// Setting up the worlds
var frost_fall_enemies = [
    {
        "enemy_type": "ChaseEnemy",
        "width": 10,
        "height": 10,
        "speed": 1,
        "color": "#00a690",
        "turns_to_spawn": 1,
    }
]
var frostfall = new World(
    1,
    "Frostfall", 
    "#a0daff", 
    "#a0ffc4", 
    "#4684a9", 
    "#FFFFFF", 
    "#060630", 
    frost_fall_enemies, 
    ["#FFFFFF", "#9B00FFFF", "#4200FFFF", "#0064FFFF", "#00FDFFFF"]
);
var inferno_isle_enemies = [
    {
        "enemy_type": "ChaseEnemy",
        "width": 10,
        "height": 10,
        "speed": 1,
        "color": "#940000FF",
        "turns_to_spawn": 1,
    },
    {
        "enemy_type": "PatrolEnemy",
        "width": 10,
        "height": 10,
        "speed": 1,
        "patrol_positions": null,
        "color": "#FF0000FF",
        "turns_to_spawn": 1,
    },
    {
        "enemy_type": "PatrolEnemy",
        "width": 10,
        "height": 10,
        "speed": 4,
        "patrol_positions": [[10, 10], [10, 490], [490, 490], [490, 10]],
        "color": "#ff4f23",
        "turns_to_spawn": 5,
    }
]
var inferno_isle = new World(
    2,
    "Inferno Isle", 
    "#fc441b", 
    "#fcb51b", 
    "#fc1b62", 
    "#afafaf", 
    "#323437", 
    inferno_isle_enemies,
    ["#FFFFFF", "#9B00FFFF", "#4200FFFF", "#0064FFFF", "#00FDFFFF"]
);
var reef_enemies = [
    {
        "enemy_type": "ChaseEnemy",
        "width": 10,
        "height": 10,
        "speed": 1,
        "color": "#940000FF",
        "turns_to_spawn": 1,
    },
    {
        "enemy_type": "PatrolEnemy",
        "width": 10,
        "height": 10,
        "speed": 1,
        "patrol_positions": null,
        "color": "#FF0000FF",
        "turns_to_spawn": 1,
    },
    {
        "enemy_type": "PatrolEnemy",
        "width": 10,
        "height": 10,
        "speed": 4,
        "patrol_positions": [[10, 10], [10, 490], [490, 490], [490, 10]],
        "color": "#ff4f23",
        "turns_to_spawn": 5,
    }
]
var reef = new World(
    3,
    "The Reef", 
    "#fc441b", 
    "#fcb51b", 
    "#fc1b62", 
    "#afafaf", 
    "#323437", 
    inferno_isle_enemies,
    ["#FFFFFF", "#9B00FFFF", "#4200FFFF", "#0064FFFF", "#00FDFFFF"]
);

var worlds = [frostfall, inferno_isle]
if (localStorage.getItem('world')) {
    var world = JSON.parse(localStorage.getItem('world'));
} else {
    var world = frostfall;
    localStorage.setItem('world', JSON.stringify(world));
}
var world_counter = document.getElementById("world_counter");

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
if (localStorage.getItem('highscore_world')) {
    var highscore_world = parseInt(localStorage.getItem('highscore_world'));
} else {
    var highscore_world = 1;
    localStorage.setItem('highscore_world', highscore);
}
var highscore_counter = document.getElementById("highscore_counter");
highscore_counter.innerHTML = highscore;
var highscore_world_counter = document.getElementById("world_highscore_counter");
console.log("highscore_world: " + highscore_world);
highscore_world_counter.innerHTML = worlds[highscore_world - 1].name;

if (localStorage.getItem('last_run_score')) {
    var last_run_score = parseInt(localStorage.getItem('last_run_score'));
} else {
    var last_run_score = 1;
    localStorage.setItem('highscore', highscore);
}
if (localStorage.getItem('last_run_world')) {
    var last_run_world = localStorage.getItem('last_run_world');
} else {
    console.log(world);
    console.log(world.name);
    var last_run_world = world.name;
    localStorage.setItem('last_run_world', last_run_world);
}

// Creating player
let player = new Player(50, 50, 10, 10, 1, world.player_color);
if (localStorage.getItem('playerLives')) {
    player.lives = parseInt(localStorage.getItem('playerLives'));
} else {
    player.lives = 1;
    localStorage.setItem('playerLives', player.lives);
}
new InputHandler(player);

// Game areas
var win = new WinArea(450, 450, 50, 50, world.primary_color_1);
var start = new StartArea(35 + player.width / 2, 35 + player.height / 2, 30, 30, world.primary_color_2);

// Creating a holder for particles
var particles = [];
particles = createParticles(particles);

// Creating enemies
var enemies = [];

// Creating the canvas and live game
let requestID;
let animating = false;
let last_time = 0;
const FRAMES_PER_SECOND = 60; 
const FRAME_MIN_TIME = (1000/60) * (60 / FRAMES_PER_SECOND) - (1000/60) * 0.5;
function UpdateCanvas(timestamp) {
    let delta_time = timestamp - last_time;

    if(delta_time < FRAME_MIN_TIME){ //skip the frame if the call is too early
        requestAnimationFrame(UpdateCanvas);
        return; // return as there is nothing to do
    }

    if (!animating) {
        requestID = requestAnimationFrame(UpdateCanvas);
        return;
    }

    last_time = timestamp;

    ctx.clearRect(0, 0, 800, 600);

    if (death_anim) {
        // Create a death animation, with a death screen
        handleParticles(particles, player.position, ctx);
        screenShake(ctx);
    }

    win.draw(ctx);
    start.draw(ctx);

    for (var enemy = 0; enemy < enemies.length; enemy++) {
        enemies[enemy].movement(player);
        enemies[enemy].draw(ctx);
    }

    player.update(delta_time);
    player.draw(ctx);

    if (death_anim) {
        postShake(ctx);
    }

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

    // Reset player position
    player.position.x = 50;
    player.position.y = 50;

    // Loop through world's enemies and add them to enemy array
    enemies = []
    for (var i = 0; i < world.types_of_enemies.length; i++) {
        for(var a = 0; a < parseInt(level / world.types_of_enemies[i].turns_to_spawn); a++) {
            if (world.types_of_enemies[i].enemy_type == "PatrolEnemy") {
                enemies.push(new PatrolEnemy(
                    world.types_of_enemies[i].width,
                    world.types_of_enemies[i].height,
                    world.types_of_enemies[i].speed,
                    world.types_of_enemies[i].patrol_positions,
                    world.types_of_enemies[i].color,
                    world.types_of_enemies[i].turns_to_spawn
                ));
            } else if (world.types_of_enemies[i].enemy_type == "ChaseEnemy") {
                enemies.push(new ChaseEnemy(
                    world.types_of_enemies[i].width,
                    world.types_of_enemies[i].height,
                    world.types_of_enemies[i].speed,
                    world.types_of_enemies[i].color,
                    world.types_of_enemies[i].turns_to_spawn
                ));
            }

        }
    }

    // Update the level counter
    level_counter.innerHTML = level.toString();
    world_counter.innerHTML = world.name;
    if (world.id_num > highscore_world) {
        highscore = level;
        highscore_counter.innerHTML = highscore.toString();
        localStorage.setItem('highscore', highscore);

        highscore_world = world.id_num;
        highscore_world_counter.innerHTML = worlds[highscore_world - 1].name;
        localStorage.setItem('highscore_world', highscore_world);
    } else if (level > highscore && world.id_num == highscore_world) {
        highscore = level;
        highscore_counter.innerHTML = highscore.toString();
        localStorage.setItem('highscore', highscore);
    }
    localStorage.setItem('level', level);
}
function StartWorld() {
    // Updating colors of the world
    document.documentElement.style.setProperty('--color_one', world.primary_color_1);
    document.documentElement.style.setProperty('--color_two', world.primary_color_2);
    document.documentElement.style.setProperty('--color_three', world.primary_color_3);
    document.documentElement.style.setProperty('--background-color-theme', world.background_color);
    document.documentElement.style.setProperty('--normal-text-color-theme', world.text_color);
    win = new WinArea(450, 450, 50, 50, world.primary_color_3);
    start = new StartArea(35 + player.width / 2, 35 + player.height / 2, 30, 30, world.primary_color_2);
}

function checkCollisions() {
    if (player.position.x >= 450 - player.width && player.position.y >= 450 - player.height) {
        level++;

        if (level == 21) {
            for (var i = 0; i < worlds.length; i++) {
                if (world.name == worlds[i].name && i == worlds.length - 1) {
                    console.log("Index is: " + i);
                    console.log("Freeplay unlocked");
                    break;
                } else if (world.name == worlds[i].name) {
                    level = 1;
                    world = worlds[i + 1];
                    localStorage.setItem('world', JSON.stringify(world));
                    StartWorld();
                    break;
                }
            }
        }

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
            if (death_anim) return;

            death_anim = true;

            player.can_move = false;
            player.update_lives(-1);

            // Check if player is dead
            if (player.lives <= 0) {
                last_run_score = level;
                localStorage.setItem('last_run_score', last_run_score);
                last_run_world = world.name;
                localStorage.setItem('last_run_world', last_run_world);
                player.lives = 1;
                level = 1;
            }

            setTimeout(() => {
                particles = createParticles(particles);
                player.can_move = true;
                StartLevel();
                death_anim = false;
            }, 800);
        }
    }

    if (player.is_hidden) {
        player.color = "#808080";
    } else {
        player.update_lives(0);
    }
}
StartWorld();
StartLevel();
UpdateCanvas();