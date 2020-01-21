const WIDTH = 600;
const HEIGHT = 600;
const ROWS = 10;
const COLS = 10;

let img;
let shd;
let colorPicker;

function preload() {
  img = loadImage("images/cat.jpg");
  shd = loadShader('shaders/shader.vert', 'shaders/shader.frag');
}

function setup() {
  createCanvas(WIDTH, HEIGHT, WEBGL);
  colorPicker = createColorPicker(color(255, 228, 202));
  shader(shd);
  shd.setUniform('rows', ROWS);
  shd.setUniform('cols', COLS);
  noStroke();
}

function draw() {
  const clr = colorPicker.color();
  const r = red(clr) / 255;
  const g = green(clr) / 255;
  const b = blue(clr) / 255;
  shd.setUniform("u_resolution", [float(width), float(height)]);
  shd.setUniform("u_mouse", [float(mouseX), float(mouseY)]);
  shd.setUniform("u_time", millis() / 1000.0);
  shd.setUniform('c', [r, g, b]);
  shd.setUniform('text', img);
  quad(-1, -1, 1, -1, 1, 1, -1, 1);
}