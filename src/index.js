import _ from "lodash";
import * as p5 from "p5";

let grid;
let cols;
let rows;
let resolution = 4; //min 2
let gap = 0;
let windowHeight = Math.floor(window.innerHeight / 100) * 100;
let windowWidth = Math.floor(window.innerWidth / 100) * 100;

const make2DArray = (cols, rows) => {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
};

function countNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + cols) % cols;
      let row = (y + j + rows) % rows;
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}

let s = (sk) => {
  sk.setup = () => {
    sk.createCanvas(windowWidth, windowHeight);
		cols = sk.width / resolution;
    rows = sk.height / resolution;
    grid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = Math.floor(Math.random() * Math.floor(2));
      }
    }
  };

  sk.draw = () => {
    sk.background(0);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * resolution;
        let y = j * resolution;
        if (grid[i][j] == 1) {
          sk.fill('#0f0');
          sk.stroke(0);
          sk.rect(x, y, resolution - gap, resolution - gap);
        }
      }
    }

    let next = make2DArray(cols, rows);

    // Compute next based on grid
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let state = grid[i][j];
        // Count live neighbors!
        let neighbors = countNeighbors(grid, i, j);

        if (state == 0 && neighbors == 3) {
          next[i][j] = 1;
        } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
          next[i][j] = 0;
        } else {
          next[i][j] = state;
        }
      }
    }
		setTimeout(() => {
			grid = next;
		}, 50);
  };
};
new p5(s);
