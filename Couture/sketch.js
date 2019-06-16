const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;

let grid = null;

function setup() {
  createCanvas(600, 600);
  grid = new Grid(CELL_WIDTH, CELL_HEIGHT);
}

function draw() {
  background(240, 220, 200);
  grid.show();
  grid.highlight(mouseX, mouseY);
}