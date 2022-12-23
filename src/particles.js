export class Particles {
    constructor () {
        this.position = {
            x: 0,
            y: 0
        }

        this.size = Math.random() * 5 + 1;

        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;

        this.called = false;

        let random_color = Math.random() * 3;
        if (random_color >= 0 && random_color < 1)
            this.color = "#757676"
        else if (random_color >= 1 && random_color < 2)
            this.color = "#f27d0c"
        else if (random_color >= 2)
            this.color = "#800909"

    }

    update_start_position(player_position) {
        if (this.called) return;
        this.position = {
            x: player_position.x,
            y: player_position.y
        }
        this.called = true;
    }

    update() {
        this.position.x += this.speedX;
        this.position.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
}

export function handleParticles(particlesArray, player_position, ctx) {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update_start_position(player_position);
    }

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw(ctx);
        if (particlesArray[i].size <= 0.3) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
}

export function createParticles(particlesArray) {
    // Initialize all of the particles in the particle array
    particlesArray = []
    for (let a = 0; a < 800; a++) {
        particlesArray.push(new Particles());
    }
    return particlesArray;
}