const WIDTH = 600;
const HEIGHT = 600;
const ROWS = 50;
const COLS = 50;

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
  scale(1, -1);
}

function draw() {
  const clr = colorPicker.color();
  const r = red(clr) / 255;
  const g = green(clr) / 255;
  const b = blue(clr) / 255;
  shd.setUniform("uResolution", [width, height]);
  shd.setUniform("uMouse", [mouseX, mouseY]);
  shd.setUniform("uTime", millis() / 1000.0);
  shd.setUniform('c', [r, g, b]);
  shd.setUniform('text', img);
  quad(-1, -1, 1, -1, 1, 1, -1, 1);
}