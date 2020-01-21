const SIZE = 600;
let RESOLUTION;

let img;
let shd;
let colorPicker;
let checkbox;

function preload() {
  img = loadImage("images/cat.jpg");
  shd = loadShader('shaders/shader.vert', 'shaders/shader.frag');
}

function setup() {
  createCanvas(SIZE, SIZE, WEBGL);

  pixelDensity(1);

  colorPicker = createColorPicker(color(255, 228, 202));
  resolutionSlider = createSlider(1, SIZE, 50, 1);
  checkbox = createCheckbox('show grid', false);

  shader(shd);
  noStroke();
}

function draw() {
  const clr = colorPicker.color();
  const r = red(clr) / 255;
  const g = green(clr) / 255;
  const b = blue(clr) / 255;

  RESOLUTION = resolutionSlider.value();

  shd.setUniform("uResolution", [width, height]);
  shd.setUniform("uMouse", [mouseX, mouseY]);
  shd.setUniform("uTime", millis() / 1000.0);

  shd.setUniform('rows', RESOLUTION);
  shd.setUniform('cols', RESOLUTION);
  shd.setUniform('c', [r, g, b]);
  shd.setUniform('text', img);
  shd.setUniform('show', checkbox.checked());

  quad(-1, -1, 1, -1, 1, 1, -1, 1);
}