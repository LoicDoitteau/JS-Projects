const SIZE = 600;
let RESOLUTION;

let palette;
let img;
let shd;
let colorPicker;
let checkbox;

function createPalette() {
  const COLORS = [
    color(0, 0, 0),
    color(255, 55, 55),
    color(255, 98, 40),
    color(255, 212, 38),
    color(100, 182, 20),
    color(44, 128, 44),
    color(43, 185, 221),
    color(43, 154, 174),
    color(61, 65, 141),
    color(151, 77, 157),
    color(103, 51, 31),
    color(255, 255, 255),
    color(236, 192, 243),
    color(202, 115, 175),
    color(129, 182, 196),
    color(186, 204, 222),
    color(152, 211, 173),
    color(249, 235, 155),
    color(245, 219, 190),
    color(241, 176, 160),
    color(254, 113, 116),
    color(252, 118, 155),
    color(255, 187, 202)
  ];
  const palette = createImage(COLORS.length, 1);
  palette.loadPixels();
  for (let x = 0; x < COLORS.length; x++) {
    const color = COLORS[x];
    palette.set(x, 0, color);
  }
  palette.updatePixels();
  return palette;
}

function preload() {
  img = loadImage("images/cat.jpg");
  shd = loadShader('shaders/shader.vert', 'shaders/shader.frag');
}

function setup() {
  createCanvas(SIZE, SIZE, WEBGL);

  pixelDensity(1);

  palette = createPalette();
  colorPicker = createColorPicker(color(255, 228, 202));
  resolutionSlider = createSlider(1, SIZE, 50, 1);
  checkbox = createCheckbox('infos', false);

  shader(shd);

  shd.setUniform('texture', img);
  shd.setUniform('palette', palette);
  shd.setUniform('count', 22);

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
  shd.setUniform('color', [r, g, b]);
  shd.setUniform('show', checkbox.checked());

  quad(-1, -1, 1, -1, 1, 1, -1, 1);
}