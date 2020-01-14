const CELL_WIDTH = 20;
const CELL_HEIGHT = 20;
// const COLORS = [
//   new Color(255, 0, 0),
//   // new Color(255, 255, 0),
//   new Color(0, 255, 0),
//   // new Color(0, 255, 255),
//   new Color(0, 0, 255),
//   // new Color(255, 0, 255),
//   new Color(),
//   new Color(255, 255, 255)
// ];

const COLORS = getColors(0, 255);

function getColors(...values) {
  const colors = [];
  const rec = cur => {
    if(cur.length == 3) {
      colors.push(new Color(...cur));
      return;
    }
    for (const value of values) {
      const newCur = cur.slice();
      newCur.push(value);
      rec(newCur);
    }
  };

  rec([]);

  return colors;
}

const METHODS = {
  revert : revert,
  treshold_1 : method1,
  treshold_2 : method2,
  error_diffuse_1 : method3,
  error_diffuse_2 : method4,
  pattern_cross_1 : method5,
  pattern_cross_2 : method6,
}

let grid = null;
let palette = null;
let img = null;
let slider;

function preload() {
  img = loadImage("eevee1.png");
  // img = loadImage("noctali.jpg");
}

function setup() {
  createCanvas(600, 600);
  img.resize(600, 600);
  grid = new Grid(CELL_WIDTH, CELL_HEIGHT);
  palette = new Palette(...COLORS);
  image(img, 0, 0);

  for (const method in METHODS) {
    const callback = METHODS[method];
    createButton(method).mousePressed(callback);
  }

  slider = createSlider(0, 2, 1, 0.1);

  palette.show();
}

function draw() {
  // background(240, 220, 200);
  // grid.show();
  // grid.highlight(mouseX, mouseY);
  // if(random() < 0.5) method4();
  // else method3();
  // console.log(frameRate());
}

function revert() {
  image(img, 0, 0);
  palette.show();
}

function method1() {
  const newImg = createImage(img.width, img.height);
  img.loadPixels();
  newImg.loadPixels();
  for (let x = 0; x < newImg.width; x++) {
    for (let y = 0; y < newImg.height; y++) {
      const index = (x + y * newImg.width) * 4;
      const r = img.pixels[index];
      const g = img.pixels[index + 1];
      const b = img.pixels[index + 2];

      const closest = palette.findClosest({r, g, b});
      
      newImg.pixels[index] = closest.r;
      newImg.pixels[index + 1] = closest.g;
      newImg.pixels[index + 2] = closest.b;
      newImg.pixels[index + 3] = 255;
    }
  }
  newImg.updatePixels();
  image(newImg, 0, 0);
  palette.show();
}

function method2() {
  const newImg = createImage(img.width, img.height);
  img.loadPixels();
  newImg.loadPixels();
  for (let x = 0; x < newImg.width; x++) {
    for (let y = 0; y < newImg.height; y++) {
      const index = (x + y * newImg.width) * 4;
      const r = img.pixels[index];
      const g = img.pixels[index + 1];
      const b = img.pixels[index + 2];

      const closest = palette.findClosestVision({r, g, b});
      
      newImg.pixels[index] = closest.r;
      newImg.pixels[index + 1] = closest.g;
      newImg.pixels[index + 2] = closest.b;
      newImg.pixels[index + 3] = 255;
    }
  }
  newImg.updatePixels();
  image(newImg, 0, 0);
  palette.show();
}

//#region Floyd Dithering
function method3() {
  const newImg = createImage(img.width, img.height);
  img.loadPixels();
  newImg.loadPixels();

  for (let y = 0; y < newImg.height; y++) {
    for (let x = 0; x < newImg.width; x++) {
      const index = (x + y * newImg.width) * 4;
      newImg.pixels[index] = img.pixels[index];
      newImg.pixels[index + 1] = img.pixels[index + 1];
      newImg.pixels[index + 2] = img.pixels[index + 2];
      newImg.pixels[index + 3] = 255;
    }
  }

  for (let y = 0; y < newImg.height; y++) {
    for (let x = 0; x < newImg.width; x++) {
      const index = (x + y * newImg.width) * 4;
      const r = newImg.pixels[index];
      const g = newImg.pixels[index + 1];
      const b = newImg.pixels[index + 2];

      const current = new Color(r, g, b);
      const closest = palette.findClosest(current);
      const error = current.error(closest);
      
      newImg.pixels[index] = closest.r;
      newImg.pixels[index + 1] = closest.g;
      newImg.pixels[index + 2] = closest.b;
      newImg.pixels[index + 3] = 255;

      diffuseError(newImg, error, x + 1, y, 7 / 16);
      diffuseError(newImg, error, x - 1, y + 1, 3 / 16);
      diffuseError(newImg, error, x, y + 1, 5 / 16);
      diffuseError(newImg, error, x + 1, y + 1, 1 / 16);
    }
  }
  newImg.updatePixels();
  image(newImg, 0, 0);
  palette.show();
}

function method4() {
  const newImg = createImage(img.width, img.height);
  img.loadPixels();
  newImg.loadPixels();

  for (let y = 0; y < newImg.height; y++) {
    for (let x = 0; x < newImg.width; x++) {
      const index = (x + y * newImg.width) * 4;
      newImg.pixels[index] = img.pixels[index];
      newImg.pixels[index + 1] = img.pixels[index + 1];
      newImg.pixels[index + 2] = img.pixels[index + 2];
      newImg.pixels[index + 3] = 255;
    }
  }

  for (let y = 0; y < newImg.height; y++) {
    for (let x = 0; x < newImg.width; x++) {
      const index = (x + y * newImg.width) * 4;
      const r = newImg.pixels[index];
      const g = newImg.pixels[index + 1];
      const b = newImg.pixels[index + 2];

      const current = new Color(r, g, b);
      const closest = palette.findClosestVision(current);
      const error = current.error(closest);
      
      newImg.pixels[index] = closest.r;
      newImg.pixels[index + 1] = closest.g;
      newImg.pixels[index + 2] = closest.b;
      newImg.pixels[index + 3] = 255;

      diffuseError(newImg, error, x + 1, y, 7 / 16);
      diffuseError(newImg, error, x - 1, y + 1, 3 / 16);
      diffuseError(newImg, error, x, y + 1, 5 / 16);
      diffuseError(newImg, error, x + 1, y + 1, 1 / 16);
    }
  }
  newImg.updatePixels();
  image(newImg, 0, 0);
  palette.show();
}

function diffuseError(img, error, x, y, scale) {
  if (x < 0 || x >= img.width || y < 0 || y >= img.height) return;
  const index = (x + y * img.width) * 4;
  img.pixels[index] += error.r * scale * slider.value();
  img.pixels[index + 1] += error.g * scale * slider.value();
  img.pixels[index + 2] += error.b * scale * slider.value();
}
//#endregion

//#region Ordered Dithering
// const MAT_LENGTH = 2;
// const matrix = [
//   0,  2,
//   3,  1
// ];


// const MAT_LENGTH = 5;
// const matrix = [
//   32,  16,  8,  16,  32,
//   16,  8,   4,  8,   16,
//   8,   4,   0,  4,   8,
//   16,  8,   4,  8,   16,
//   32,  16,  8,  16,  32
// ];
// const matrix = [
//   0,  8,  2,  10,
//   12, 4,  14, 6,
//   3,  11, 1,  9,
//   15, 7,  13, 5
// ];

function method5() {
  const MAT_LENGTH = 8;
  const matrix = [
    0,  48, 12, 60, 3,  51, 15, 63,
    32, 16, 44, 28, 35, 19, 47, 31,
    8,  56, 4,  52, 11, 59, 7,  55,
    40, 24, 36, 20, 43, 27, 39, 23,
    2,  50, 14, 62, 1,  49, 13, 61,
    34, 18, 46, 30, 33, 17, 45, 29,
    10, 58, 6,  54, 9,  57, 5,  53,
    42, 26, 38, 22, 41, 25, 37, 21
  ];
  const newImg = createImage(img.width, img.height);
  img.loadPixels();
  newImg.loadPixels();
  for (let x = 0; x <= newImg.width; x++) {
    for (let y = 0; y <= newImg.height; y++) {
      const index = (x + y * newImg.width) * 4;
      const dx = x % MAT_LENGTH;
      const dy = y % MAT_LENGTH;
      const treshold = 255 * slider.value() * ((matrix[dx + dy * MAT_LENGTH] + 1) / (MAT_LENGTH * MAT_LENGTH) - 0.5);
      const r = img.pixels[index] + treshold;
      const g = img.pixels[index + 1] + treshold;
      const b = img.pixels[index + 2] + treshold;

      const closest = palette.findClosest({r, g, b});
      
      newImg.pixels[index] = closest.r;
      newImg.pixels[index + 1] = closest.g;
      newImg.pixels[index + 2] = closest.b;
      newImg.pixels[index + 3] = 255;
    }
  }
  newImg.updatePixels();
  image(newImg, 0, 0);
  palette.show();
}

function method6() {
  const MAT_LENGTH = 8;
  const matrix = [
    0,  48, 12, 60, 3,  51, 15, 63,
    32, 16, 44, 28, 35, 19, 47, 31,
    8,  56, 4,  52, 11, 59, 7,  55,
    40, 24, 36, 20, 43, 27, 39, 23,
    2,  50, 14, 62, 1,  49, 13, 61,
    34, 18, 46, 30, 33, 17, 45, 29,
    10, 58, 6,  54, 9,  57, 5,  53,
    42, 26, 38, 22, 41, 25, 37, 21
  ];
  const newImg = createImage(img.width, img.height);
  img.loadPixels();
  newImg.loadPixels();
  for (let x = 0; x <= newImg.width - MAT_LENGTH; x += MAT_LENGTH) {
    for (let y = 0; y <= newImg.height - MAT_LENGTH; y += MAT_LENGTH) {
      for(let dx = 0; dx < MAT_LENGTH; dx++) {
        for(let dy = 0; dy < MAT_LENGTH; dy++) {
          const index = (x + dx + (y + dy) * newImg.width) * 4;
          const treshold = 255 * slider.value() * ((matrix[dx + dy * MAT_LENGTH] + 1) / (MAT_LENGTH * MAT_LENGTH) - 0.5);
          const r = img.pixels[index] + treshold;
          const g = img.pixels[index + 1] + treshold;
          const b = img.pixels[index + 2] + treshold;
    
          const closest = palette.findClosestVision({r, g, b});
          
          newImg.pixels[index] = closest.r;
          newImg.pixels[index + 1] = closest.g;
          newImg.pixels[index + 2] = closest.b;
          newImg.pixels[index + 3] = 255;
        }
      }
    }
  }
  newImg.updatePixels();
  image(newImg, 0, 0);
  palette.show();
}

//#endregion