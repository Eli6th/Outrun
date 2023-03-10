export function resetLevelAnim(ctx, requestID) {
    if (requestID != null) {
        cancelAnimationFrame(requestID);
    }

    // Set the initial position of the rectangle
    let x = 0;
    let y = 0;
  
    // Define the delay between frames (in milliseconds)
    const delay = 10;

    // Clear the canvas
    ctx.clearRect(0, 0, 800, 600);
  
    // Define the function to update the animation
    function update() {
      // Set the fill style
      ctx.fillStyle = "lightgray";
  
      // Draw the rectangle
      ctx.fillRect(x, y, 50, 50);
  
      // Update the position of the rectangle
      x += 50;
  
      // If the rectangle reaches the end of the row, move to the next row
      if (x >= 500) {
        x = 0;
        y += 50;
      }
  
      // If all the rectangles have been drawn, stop the animation
      if (y >= 500) {
        console.log("Done");
        return true;
      }
  
      // Wait for the specified delay before requesting the next frame
      setTimeout(function() {
        requestAnimationFrame(update);
      }, delay);
    }
  
    // Start the animation
    requestAnimationFrame(update);
}

export function screenShake(ctx) {
    ctx.save();
    var dx = Math.random()*10;
    var dy = Math.random()*10;
    ctx.translate(dx, dy);  
}

export function postShake(ctx) {
    ctx.restore();
}