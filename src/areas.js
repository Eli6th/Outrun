export class WinArea {
    constructor (x, y, width, height) {
        this.width = width;
        this.height = height;
        
        this.position = {
            x: x,
            y: y,
        }

        this.color = "#fcba03";
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

export class StartArea {
    constructor (x, y, width, height) {
        this.width = width;
        this.height = height;
        
        this.position = {
            x: x,
            y: y,
        }

        this.color = "#00ff00";
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
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