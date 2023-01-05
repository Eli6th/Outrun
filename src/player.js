export class Player {
    constructor (x, y, width, height, lives, colors) {
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
        this.colors = colors;
        this.color = colors[0];

        this.speed = 3;
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
        if (this.position.x - this.speed >= 0 && this.move.right)
            this.position.x -= this.speed;
        if (this.position.x + this.speed <= 500 && this.move.left)
            this.position.x += this.speed;
        if (this.position.y - this.speed >= 0 && this.move.up)
            this.position.y -= this.speed;
        if (this.position.y + this.speed <= 500 && this.move.down) 
            this.position.y += this.speed;

        // Adjusting if player goes out of bounds
        if (this.position.y - this.speed < 0 && this.move.up)
            this.position.y = 0;
        if (this.position.y + this.speed > 500 - this.width && this.move.down)
            this.position.y = 500 - this.height;
        if (this.position.x - this.speed < 0 && this.move.right)
            this.position.x = 0;
        if (this.position.x + this.speed > 500 - this.width && this.move.left)
            this.position.x = 500 - this.width;
    }

    update_lives(change_num) {
        this.lives = this.lives + change_num;
        if (this.lives == 1) {
            this.color = this.colors[0];
            this.speed = 3;
        } else if (this.lives == 2) {
            this.color = this.colors[1];
            this.speed = 4;
        } else if (this.lives == 3) {
            this.color = this.colors[2];
            this.speed = 5;
        } else if (this.lives == 4) {
            this.color = this.colors[3];
            this.speed = 6;
        } else if (this.lives == 5) {
            this.color = this.colors[4];
            this.speed = 7;
        } else if (this.lives > 5) {
            this.lives = 5;
        }

        localStorage.setItem('playerLives', this.lives);
    }
}