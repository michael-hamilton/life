// Life
// © 2015-2020 Michael Hamilton

const c = document.getElementById('canvas');//canvas element
const ctx = c.getContext('2d'); //canvas context
let cells = []; //arr
let h = w = 12; //dimensions of each cell (in px)
let state = false; //current state of game (draw or update)
let steps = 0; //current number of cycles
let speed = 10; //current number of cycles

c.height = window.innerHeight;
c.width = window.innerWidth;

const init = () => {
  for (let i = 0; i < c.height / h; i++) {
    cells[i] = []
    for(let j = 0; j < c.width / w; j++) {
      cells[i][j] = 0;
    }
  }

  draw();
}

const update = () => {
  //Temporary array for state of cells in next cycle
  const result = [];

  const val = (x, y) => cells[x] && cells[x][y];

  //Returns amount of neighbor cells that are active
  const check = (x, y) => {
    let amount = 0;

    if(val(x-1, y-1)) amount++;
    if(val(x, y-1)) amount++;
    if(val(x+1, y-1)) amount++;
    if(val(x-1, y)) amount++;
    if(val(x+1, y)) amount++;
    if(val(x-1, y+1)) amount++;
    if(val(x, y+1)) amount++;
    if(val(x+1, y+1)) amount++;

    return amount;
  }

  //Check each cell and update the result array
  cells.forEach((row, x) => {
    result[x] = [];
    row.forEach((cell, y) => {
      let neighbors = check(x, y);
      if (cell) {
        if (neighbors === 2 || neighbors === 3) {
          result[x][y] = 1;
        }
        else {
          result[x][y] = 0;
        }
      }
      else {
        if (neighbors === 3) {
          result[x][y] = 1;
        }
        else result[x][y] = 0;
      }
    });
  });

  //Copy temporary array back to cells
  cells = result;

  steps ++;
  draw();
}

const draw = () => {
  //Clear last frame
  ctx.clearRect(0,0,c.width,c.height);

  //Draw the cells in the current cycle
  cells.forEach((row, y) => {
    row.forEach((cell, x) => {
      ctx.fillStyle = cell ? "#0a90ff" : '#d7d7d7';
      ctx.fillRect(x*w+1,y*h+1,w-1,h-1);
    });
  });

  //Update step counter
  ctx.fillStyle = 'black';
  ctx.fillRect(c.width - 200,0,c.width, 24);
  ctx.font = '18px sans-serif';
  ctx.fillText(`Space to play/pause`, 10, 20);
  ctx.fillText(`R to reset`, 10, 40);
  ctx.fillStyle = 'white';
  ctx.font = '18px sans-serif';
  ctx.fillText(`Generation: ${steps}`, c.width - 190, 18);

  //Update every n number of ms as defined by 'speed'
  setTimeout(() => {
    if (state) {
      update();
    }
    else {
      draw();
    }
  }, speed);
}

//Toggle the cell at cursor position when canvas is clicked
c.addEventListener('mousedown', function(e) {
  const x = Math.floor(e.offsetX/w);
  const y = Math.floor(e.offsetY/h);
  cells[y][x] = cells[y][x] ? 0 : 1;
});

//Start game when 'space' is pressed
window.addEventListener('keydown', function(e) {
  console.log(e.code);
  switch(e.code) {
    case 'Space':
      state = !state;
      break;
    case 'KeyR':
      state = false;
      steps = 0;
      init();
      break;
  }
});

window.addEventListener('resize', () => {
  c.height = window.innerHeight;
  c.width = window.innerWidth;

  state = false;
  steps = 0;
  init();
});

init();
