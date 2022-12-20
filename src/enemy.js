export class PatrolEnemy {
    constructor (x, y, width, height, speed, positions) {
        this.width = width;
        this.height = height;

        this.move = {
            right: false,
            left: false,
            up: false,
            down: false,
        }

        this.color = "#FF0000FF";

        this.speed = speed;

        this.position = {
            x: x,
            y: y,
        }
        this.patrolPositions = positions;
        this.positionCounter = 0;
        this.currentPosition = this.patrolPositions[this.positionCounter];
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
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
    constructor (x, y, width, height, speed) {
        this.width = width;
        this.height = height;

        this.move = {
            right: false,
            left: false,
            up: false,
            down: false,
        }

        this.color = "#940000FF";

        this.speed = speed;

        this.position = {
            x: x,
            y: y,
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
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