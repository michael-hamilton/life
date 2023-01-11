// Game of Life
// © 2015-2023 Michael Hamilton

const c = document.getElementById('canvas');// canvas element
const ctx = c.getContext('2d'); // canvas context
let cells = []; // all the cells in the simulation
let isRunning = false; // running state of the simulation
let isMouseDown = false; // status of mousebutton press
let clickedCellState = 0; // status of first cell clicked
let isUpdating = false; // simulation is updating
let updateTimeout = false; // reference to timeout between updates
let h = w = 10; // dimensions of each cell (in px)
let delay = 10; // current number of cycles
let steps = 0; // current number of cycles

// Initializes grid cells based on size of window
const init = () => {
  for (let y = 0; y < c.height / h; y++) {
    cells[y] = []
    for (let x = 0; x < c.width / w; x++) {
      cells[y][x] = 0;
    }
  }
}

// Handle update between generations
const update = () => {
  const nextGeneration = [];

  const cellValueAtCoordinate = (x, y) => cells[x] && cells[x][y];

  // Returns number of active neighbor cells
  const countActiveNeighbors = (x, y) => {
    let active = 0;

    for(let iy = y-1; iy <= y+1; iy++) {
      for(let ix = x-1; ix <= x+1; ix++) {
        if(!(ix === x && iy === y) && cellValueAtCoordinate(ix, iy)) {
          active++;
        }
      }
    }

    return active;
  }

  // Check each cell and update the result array
  cells.forEach((row, x) => {
    nextGeneration[x] = [];

    row.forEach((cell, y) => {
      let neighbors = countActiveNeighbors(x, y);

      if (cell) {
        if (neighbors === 2 || neighbors === 3) {
          nextGeneration[x][y] = 1;
        }
        else {
          nextGeneration[x][y] = 0;
        }
      }
      else {
        if (neighbors === 3) {
          nextGeneration[x][y] = 1;
        }
        else nextGeneration[x][y] = 0;
      }
    });
  });

  // Copy temporary array back to cells
  cells = [...nextGeneration];
}

// Draw title, instructions, etc
const drawText = () => {
  ctx.fillStyle = '#fff';
  ctx.font = '24px sans-serif';
  ctx.fillText('Game of Life', 10, 20);
  ctx.font = "14px sans-serif";
  ctx.fillText('click cells to toggle on and off', 10, 45);
  ctx.fillText('space to play/pause', 10, 65);
  ctx.fillText('up/down to change delay between generations', 10, 85);
  ctx.fillText('R to reset', 10, 105);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillRect(c.width - 200,0,c.width, 50);
  ctx.fillStyle = 'black';
  ctx.font = '18px sans-serif';
  ctx.fillText(`Generation: ${steps}`, c.width - 190, 18);
  ctx.fillText(`Delay: ${delay}`, c.width - 190, 38);
}

// Main loop
const draw = () => {
  //Clear last frame
  ctx.clearRect(0,0,c.width,c.height);

  //Draw the cells in the current cycle
  cells.forEach((row, y) => {
    row.forEach((cell, x) => {
      ctx.fillStyle = cell ? "#4dc74a" : '#222222';
      ctx.fillRect(x*w+1,y*h+1,w-1,h-1);
    });
  });

  drawText();

  // Update every 'delay' ms
  if (isRunning && !isUpdating) {
    isUpdating = true;
    updateTimeout = setTimeout(() => {
      isUpdating = false;
      update();
      steps++;
    }, delay);
  }

  requestAnimationFrame(draw);
}

// Reset simulation
const handleReset = () => {
  clearTimeout(updateTimeout);
  c.height = window.innerHeight;
  c.width = window.innerWidth;
  isRunning = false;
  isUpdating = false;
  steps = 0;
  init();
};

// Handle when mouse is pressed
c.addEventListener('mousedown', (e) => {
  const x = Math.floor(e.offsetX / w);
  const y = Math.floor(e.offsetY / h);
  clickedCellState = !cells[y][x];
  cells[y][x] = cells[y][x] ? 0 : 1;
  isMouseDown = true;
});

// Handle when mouse is no longer pressed
c.addEventListener('mouseup', (e) => {
  isMouseDown = false;
});

// Toggle the cell at cursor position when canvas is clicked
c.addEventListener('mousemove', (e) => {
  if(isMouseDown) {
    const x = Math.floor(e.offsetX / w);
    const y = Math.floor(e.offsetY / h);
    cells[y][x] = clickedCellState;
  }
});

// Handle keyboard events
window.addEventListener('keydown', (e) => {
  switch(e.code) {
    case 'Space':
      isRunning = !isRunning;
      break;
    case 'KeyR':
      handleReset();
      break;
    case 'ArrowUp':
      delay += 1;
      break;
    case 'ArrowDown':
      delay -= delay > 0 ? 1 : 0;
      break;
  }
});

// Reset simulation when window is resized
window.addEventListener('resize', handleReset);

c.height = window.innerHeight;
c.width = window.innerWidth;

init();
draw();
