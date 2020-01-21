const WIDTH = 200;
const HEIGHT = 200;
// const ROWS = 200;
// const COLS = 200;

// let img;
let shd;
let colorPicker;

function preload() {
  // img = loadImage("images/cat.jpg");
  shd = loadShader('shaders/shader.vert', 'shaders/shader.frag');
}

function setup() {
  createCanvas(WIDTH, HEIGHT, WEBGL);
  colorPicker = createColorPicker(color(52, 52, 52));
  shader(shd);
  noStroke();
}

function draw() {
  const clr = colorPicker.color();
  const r = red(clr) / 255;
  const g = green(clr) / 255;
  const b = blue(clr) / 255;
  shd.setUniform('c', [r, g, b]);
  quad(-1, -1, 1, -1, 1, 1, -1, 1);
}