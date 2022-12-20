export class InputHandler {
    constructor (player) {
        document.addEventListener('keydown', (event) => {
            if (event.keyCode == 87 || event.keyCode == 38) {
                player.move.up = true;
            }
            if (event.keyCode == 65 || event.keyCode == 37) {
                player.move.right = true;
            }
            if (event.keyCode == 83 || event.keyCode == 40) {
                player.move.down = true;
            }
            if (event.keyCode == 68 || event.keyCode == 39) {
                player.move.left = true;
            }
        });

        document.addEventListener('keyup', (event) => {
            if (event.keyCode == 87 || event.keyCode == 38) {
                player.move.up = false;
            }
            if (event.keyCode == 65 || event.keyCode == 37) {
                player.move.right = false;
            }
            if (event.keyCode == 83 || event.keyCode == 40) {
                player.move.down = false;
            }
            if (event.keyCode == 68 || event.keyCode == 39) {
                player.move.left = false;
            }
        });
    }
}