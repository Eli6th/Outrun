export class PatrolEnemy {
    constructor (width, height, speed, patrol_positions, color, turns_to_spawn) {
        this.turns_to_spawn = turns_to_spawn;
        
        this.width = width;
        this.height = height;

        this.move = {
            right: false,
            left: false,
            up: false,
            down: false,
        }

        this.color = color;

        this.speed = speed;

        this.patrolPositions = patrol_positions;

        this.starting_positions();
    }

    starting_positions() {
        var max = 490;
        var min = 10;

        this.position = {
            x: RandomNum(max, min),
            y: RandomNum(max, min),
        }

        if (this.patrolPositions != null) {
            this.positionCounter = 0;
            this.currentPosition = this.patrolPositions[this.positionCounter];
            return;
        }
        
        if (RandomNum(2, 0) == 0) {
            let y = RandomNum(max, min);
            this.patrolPositions = [
                [RandomNum(max, min), y], 
                [RandomNum(max, min), y]
            ]
        } else {
            let x = RandomNum(max, min);
            this.patrolPositions = [
                [x, RandomNum(max, min)], 
                [x, RandomNum(max, min)]
            ]
        }

        this.positionCounter = 0;
        this.currentPosition = this.patrolPositions[this.positionCounter];
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 0.5 * this.width, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    movement(player_pos) {
        if (
        (this.position.x >= this.currentPosition[0] - 5 && this.position.x <= this.currentPosition[0] + 5) 
        &&
        (this.position.y >= this.currentPosition[1] - 5 && this.position.y <= this.currentPosition[1] + 5)
        ) {
            this.positionCounter++;
            if (this.positionCounter == this.patrolPositions.length) {
                this.positionCounter = 0;
            }
          
            this.currentPosition = this.patrolPositions[this.positionCounter];
        } else {
            if (this.position.x > this.currentPosition[0] + this.speed) {
                this.position.x -= this.speed;
            } else if (this.position.x < this.currentPosition[0] - this.speed) {
                this.position.x += this.speed;
            }
            
            if (this.position.y > this.currentPosition[1] + this.speed) {
                this.position.y -= this.speed;
            } else if (this.position.y < this.currentPosition[1] - this.speed) {
                this.position.y += this.speed;
            }
        }
    }

    check_collision(player) {
        // Calculate the x and y positions of the player
        var playerX = player.position.x + (player.width / 2);
        var playerY = player.position.y + (player.height / 2);
        
        // Calculate the x and y positions of the area
        var areaX = this.position.x + (this.width / 2);
        var areaY = this.position.y + (this.height / 2);
        
        // Calculate the distance between the two objects
        var dx = playerX - areaX;
        var dy = playerY - areaY;
        var distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if the distance is less than the sum of the two radii (the widths divided by 2)
        if (distance < (player.width / 2 + this.width / 2)) {
            return true; // Collision detected
        } else {
            return false; // No collision
        }
    }
}

export class ChaseEnemy {
    constructor (width, height, speed, color, turns_to_spawn) {
        this.turns_to_spawn = turns_to_spawn;

        this.width = width;
        this.height = height;

        this.move = {
            right: false,
            left: false,
            up: false,
            down: false,
        }

        this.color = color;

        this.speed = speed;

        this.starting_positions();
    }

    starting_positions() {
        var max = 490;
        var min = 10;

        this.position = {
            x: RandomNum(max, min),
            y: RandomNum(max, min),
        }
    }

    draw(ctx) {
        var point1 = {
            x: this.position.x,
            y: this.position.y + this.height / 2,
        }
        var point2 = {
            x: this.position.x + this.width / 2,
            y: this.position.y - this.height / 2,
        }
        var point3 = {
            x: this.position.x - this.width / 2,
            y: this.position.y - this.height / 2,
        }
        
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        ctx.lineTo(point2.x, point2.y);
        ctx.lineTo(point3.x, point3.y);
        ctx.lineTo(point1.x, point1.y);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }

    movement(player) {
        var player_pos = player.position;
        if (
            (this.position.x >= player_pos.x - 5 && this.position.x <= player_pos.x + 5)
            &&
            (this.position.y >= player_pos.y - 5 && this.position.y <= player_pos.y + 5)
            ||
            player.is_hidden
            )
            return
        else {
            if (this.position.x > player_pos.x + this.speed)
                this.position.x -= this.speed
            else if (this.position.x < player_pos.x - this.speed)
                this.position.x += this.speed

            if (this.position.y > player_pos.y + this.speed)
                this.position.y -= this.speed
            else if (this.position.y < player_pos.y - this.speed)
                this.position.y += this.speed
        }
    }

    check_collision(player) {
        // Calculate the x and y positions of the player
        var playerX = player.position.x + (player.width / 2);
        var playerY = player.position.y + (player.height / 2);
        
        // Calculate the x and y positions of the area
        var areaX = this.position.x + (this.width / 2);
        var areaY = this.position.y + (this.height / 2);
        
        // Calculate the distance between the two objects
        var dx = playerX - areaX;
        var dy = playerY - areaY;
        var distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if the distance is less than the sum of the two radii (the widths divided by 2)
        if (distance < (player.width / 2 + this.width / 2)) {
            return true; // Collision detected
        } else {
            return false; // No collision
        }
    }
}

export function RandomNum(max, min) {
    return Math.floor(Math.random() * (max - min) ) + min;
}