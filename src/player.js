export class Player {
    constructor (x, y, width, height, lives) {
        this.width = width;
        this.height = height;

        this.move = {
            right: false,
            left: false,
            up: false,
            down: false,
        }
        
        this.position = {
            x: x,
            y: y,
        }

        this.lives = lives;
        this.color = "#FFFFFF";

        this.speed = 15;
        this.is_hidden = true;
        this.can_move = true;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update(delta_time) {
        if (!delta_time || !this.can_move) return;

        // Moving
        if (this.position.x - this.speed / delta_time >= 0 && this.move.right)
            this.position.x -= this.speed * this.move.right / delta_time;
        if (this.position.x + this.speed / delta_time <= 500 && this.move.left)
            this.position.x += this.speed / delta_time;
        if (this.position.y - this.speed / delta_time > 0 && this.move.up)
            this.position.y -= this.speed * this.move.up / delta_time;
        if (this.position.y + this.speed / delta_time <= 500 && this.move.down) 
            this.position.y += this.speed * this.move.down / delta_time;

        // Adjusting if player goes out of bounds
        if (this.position.y < 0 && this.move.up)
            this.position.y = 0;
        if (this.position.y + this.speed > 500 && this.move.down)
            this.position.y = 500 - this.height;
        if (this.position.x < 0 && this.move.right)
            this.position.x = 0 + this.width;
        if (this.position.x + this.speed > 500 && this.move.left)
            this.position.x = 500 - this.width;
    }

    update_lives(change_num) {
        this.lives = this.lives + change_num;
        if (this.lives == 1) {
            this.color = "#FFFFFF";
            this.speed = 15;
        } else if (this.lives == 2) {
            this.color = "#9B00FFFF";
            this.speed = 17;
        } else if (this.lives == 3) {
            this.color = "#4200FFFF";
            this.speed = 20;
        } else if (this.lives == 4) {
            this.color = "#0064FFFF";
            this.speed = 22;
        } else if (this.lives == 5) {
            this.color = "#00FDFFFF";
            this.speed = 25;
        } else if (this.lives > 5) {
            this.lives = 5;
        }

        localStorage.setItem('playerLives', this.lives);
    }
}