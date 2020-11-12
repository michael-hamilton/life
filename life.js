var c = document.getElementById('canvas'),	//canvas element
  ctx = c.getContext('2d'); //canvas context

cells = [], //arr
  h = w = 10, //dimensions of each cell (in px)
  speed = 100, //number of ms between each draw
  state = false, //current state of game (draw or update)
  steps = 0; //current number of cycles

function init() {
  for(i=0;i<c.height/h;i++) {
    cells[i] = []
    for(j=0;j<c.width/w;j++) {
      cells[i][j] = 0;
    }
  }

  //Toggle the cell at cursor position when canvas is clicked
  c.addEventListener('click', function(e) {
    var x = Math.floor(e.offsetX/w),
      y = Math.floor(e.offsetY/h)
    cells[y][x] = cells[y][x] ? 0 : 1;
  });

  //Start game when 'space' is pressed
  window.addEventListener('keydown', function(e) {
    if(e.keyCode == 32) state = state ? false : true;
  });

  draw();
}

function update() {
  //Temporary array for state of cells in next cycle
  var result = [];

  function val(x, y) {
    return cells[x] && cells[x][y];
  }

  //Returns amount of neighbor cells that are active
  function check(x, y) {
    var amount = 0;

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
  cells.forEach(function(row, x) {
    result[x] = [];
    row.forEach(function(cell, y) {
      var neighbors = check(x, y);
      if(cell) {
        if(neighbors == 2 || neighbors == 3) {
          result[x][y] = 1;
        }
        else {
          result[x][y] = 0;
        }
      }
      else {
        if(neighbors == 3) result[x][y] = 1;
        else result[x][y] = 0;
      }
    });
  });

  //Copy temporary array back to cells
  cells = result;

  steps ++;
  draw();
}

function draw() {
  //Clear last frame
  ctx.clearRect(0,0,c.width,c.height);

  //Draw the cells in the current cycle
  cells.forEach(function(row, y) {
    row.forEach(function(cell, x) {
      ctx.fillStyle = cell ? "#0a90ff" : '#d7d7d7';
      ctx.fillRect(x*w+1,y*h+1,w-1,h-1);
    });
  });

  //Update step counter
  ctx.fillStyle = 'black';
  ctx.font = '18px sans-serif';
  ctx.fillText('Steps: ' + steps, 0, 18);

  //Update every n number of ms as defined by 'speed'
  setTimeout(function() {
    if(state) update();
    else draw();
  }, speed);
}

init();
