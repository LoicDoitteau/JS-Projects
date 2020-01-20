const WIDTH = 600;
const HEIGHT = 600;
const ROWS = 600;
const COLS = 600;
const CELL_SIZE = Math.min(WIDTH / COLS, HEIGHT / ROWS);
const COLORS = [
  new Color(),
  new Color(255, 55, 55),
  new Color(255, 98, 40),
  new Color(255, 212, 38),
  new Color(100, 182, 20),
  new Color(44, 128, 44),
  new Color(43, 185, 221),
  new Color(43, 154, 174),
  new Color(61, 65, 141),
  new Color(151, 77, 157),
  new Color(103, 51, 31),
  new Color(255, 255, 255),
  new Color(236, 192, 243),
  new Color(202, 115, 175),
  new Color(129, 182, 196),
  new Color(186, 204, 222),
  new Color(152, 211, 173),
  new Color(249, 235, 155),
  new Color(245, 219, 190),
  new Color(241, 176, 160),
  new Color(254, 113, 116),
  new Color(252, 118, 155),
  new Color(255, 187, 202)
];

// const COLORS = getColors(0, 255);

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
  reset : reset,
  treshold_1 : method1,
  treshold_2 : method2,
  error_diffuse_1 : method3,
  error_diffuse_2 : method4,
  pattern_cross_1 : method5,
  pattern_cross_2 : method6,
  pattern_hash_1 : method7,
  pattern_hash_2 : method8,
  pattern_points_1 : method9,
  pattern_points_2 : method10,
}

let grid = null;
let palette = null;
let img = null;
let canvas = null;
let slider;

function preload() {
  // img = loadImage("images/eevee2.png");
  // img = loadImage("images/typhlo.jpg");
  // img = loadImage("images/noctali2.jpg");
  img = loadImage("images/charizard.png");
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  canvas = createGraphics(WIDTH, HEIGHT);
  img.resize(ROWS, COLS);
  grid = new Grid(canvas, ROWS, COLS, CELL_SIZE);
  palette = new Palette(...COLORS);
  
  for (const method in METHODS) {
    const callback = METHODS[method];
    createButton(method).mousePressed(callback);
  }
  
  slider = createSlider(0, 2, 1, 0.1);
  
  reset();
}

function draw() {
  image(canvas, 0, 0);
  const x = Math.floor(mouseX / CELL_SIZE)
  const y = Math.floor(mouseY / CELL_SIZE)
  grid.highlight(x, y);
  palette.show();
}

function reset() {
  img.loadPixels();
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      const cellIndex = x + y * COLS;
      const imgIndex = cellIndex * 4;
      const r = img.pixels[imgIndex];
      const g = img.pixels[imgIndex + 1];
      const b = img.pixels[imgIndex + 2];

      grid.cells[cellIndex].color = new Color(r, g, b);
    }
  }
  grid.show();
}

function method1() {
  img.loadPixels();
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      const cellIndex = x + y * COLS;
      const imgIndex = cellIndex * 4;
      const r = img.pixels[imgIndex];
      const g = img.pixels[imgIndex + 1];
      const b = img.pixels[imgIndex + 2];

      const current = new Color(r, g, b);
      const closest = palette.findClosest(current);
      
      grid.cells[cellIndex].color = closest;
    }
  }
  grid.show();
}

function method2() {
  img.loadPixels();
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      const cellIndex = x + y * COLS;
      const imgIndex = cellIndex * 4;
      const r = img.pixels[imgIndex];
      const g = img.pixels[imgIndex + 1];
      const b = img.pixels[imgIndex + 2];

      const current = new Color(r, g, b);
      const closest = palette.findClosestVision(current);
      
      grid.cells[cellIndex].color = closest;
    }
  }
  grid.show();
}

//#region Floyd Dithering
function method3() {
  img.loadPixels();

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cellIndex = x + y * COLS;
      const imgIndex = cellIndex * 4;
      const r = img.pixels[imgIndex];
      const g = img.pixels[imgIndex + 1];
      const b = img.pixels[imgIndex + 2];

      grid.cells[cellIndex].color = new Color(r, g, b);
    }
  }

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cellIndex = x + y * COLS;
      
      const current = grid.cells[cellIndex].color;
      const closest = palette.findClosest(current);
      const error = current.error(closest);
      
      grid.cells[cellIndex].color = closest;

      diffuseError(error, x + 1, y, 7 / 16);
      diffuseError(error, x - 1, y + 1, 3 / 16);
      diffuseError(error, x, y + 1, 5 / 16);
      diffuseError(error, x + 1, y + 1, 1 / 16);
    }
  }
  grid.show();
}

function method4() {
  img.loadPixels();

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cellIndex = x + y * COLS;
      const imgIndex = cellIndex * 4;
      const r = img.pixels[imgIndex];
      const g = img.pixels[imgIndex + 1];
      const b = img.pixels[imgIndex + 2];

      grid.cells[cellIndex].color = new Color(r, g, b);
    }
  }

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cellIndex = x + y * COLS;

      const current = grid.cells[cellIndex].color;
      const closest = palette.findClosestVision(current);
      const error = current.error(closest);
      
      grid.cells[cellIndex].color = closest;

      diffuseError(error, x + 1, y, 7 / 16);
      diffuseError(error, x - 1, y + 1, 3 / 16);
      diffuseError(error, x, y + 1, 5 / 16);
      diffuseError(error, x + 1, y + 1, 1 / 16);
    }
  }
  grid.show();
}

function diffuseError(error, x, y, scale) {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return;
  const cellIndex = x + y * COLS;
  const color = grid.cells[cellIndex].color;
  color.r += error.r * scale * slider.value();
  color.g += error.g * scale * slider.value();
  color.b += error.b * scale * slider.value();
}
//#endregion

//#region Ordered Dithering

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

  img.loadPixels();

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cellIndex = x + y * COLS;
      const imgIndex = cellIndex * 4;
      const dx = x % MAT_LENGTH;
      const dy = y % MAT_LENGTH;
      const treshold = 255 * slider.value() * ((matrix[dx + dy * MAT_LENGTH] + 1) / (MAT_LENGTH * MAT_LENGTH) - 0.5);
      const r = img.pixels[imgIndex] + treshold;
      const g = img.pixels[imgIndex + 1] + treshold;
      const b = img.pixels[imgIndex + 2] + treshold;

      const current = new Color(r, g, b);
      const closest = palette.findClosest(current);
      grid.cells[cellIndex].color = closest;
    }
  }
  grid.show();
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

  img.loadPixels();

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cellIndex = x + y * COLS;
      const imgIndex = cellIndex * 4;
      const dx = x % MAT_LENGTH;
      const dy = y % MAT_LENGTH;
      const treshold = 255 * slider.value() * ((matrix[dx + dy * MAT_LENGTH] + 1) / (MAT_LENGTH * MAT_LENGTH) - 0.5);
      const r = img.pixels[imgIndex] + treshold;
      const g = img.pixels[imgIndex + 1] + treshold;
      const b = img.pixels[imgIndex + 2] + treshold;

      const current = new Color(r, g, b);
      const closest = palette.findClosestVision(current);
      grid.cells[cellIndex].color = closest;
    }
  }
  grid.show();
}

function method7() {
  const MAT_LENGTH = 6;
  const matrix = [
    4,	8,	16,	8,	4,	0,
    8,	16,	8,	4,	0,	4,
    16,	8,	4,	0,	4,	8,
    8,	4,	0,	4,	8,	16,
    4,	0,	4,	8,	16,	8,
    0,	4,	8,	16,	8,	4
  ];

  img.loadPixels();

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cellIndex = x + y * COLS;
      const imgIndex = cellIndex * 4;
      const dx = x % MAT_LENGTH;
      const dy = y % MAT_LENGTH;
      const treshold = 128 * slider.value() * ((matrix[dx + dy * MAT_LENGTH]) / 16 - 0.5);
      const r = img.pixels[imgIndex] + treshold;
      const g = img.pixels[imgIndex + 1] + treshold;
      const b = img.pixels[imgIndex + 2] + treshold;

      const current = new Color(r, g, b);
      const closest = palette.findClosest(current);
      grid.cells[cellIndex].color = closest;
    }
  }
  grid.show();
}

function method8() {
  const MAT_LENGTH = 6;
  const matrix = [
    4,	8,	16,	8,	4,	0,
    8,	16,	8,	4,	0,	4,
    16,	8,	4,	0,	4,	8,
    8,	4,	0,	4,	8,	16,
    4,	0,	4,	8,	16,	8,
    0,	4,	8,	16,	8,	4
  ];

  img.loadPixels();

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cellIndex = x + y * COLS;
      const imgIndex = cellIndex * 4;
      const dx = x % MAT_LENGTH;
      const dy = y % MAT_LENGTH;
      const treshold = 128 * slider.value() * ((matrix[dx + dy * MAT_LENGTH]) / 16 - 0.5);
      const r = img.pixels[imgIndex] + treshold;
      const g = img.pixels[imgIndex + 1] + treshold;
      const b = img.pixels[imgIndex + 2] + treshold;

      const current = new Color(r, g, b);
      const closest = palette.findClosestVision(current);
      grid.cells[cellIndex].color = closest;
    }
  }
  grid.show();
}

function method9() {
  // const MAT_LENGTH = 9;
  // const matrix = [
  //   0,	7,	12,	15,	16,	15,	12,	7,	0,	
  //   7,	14,	19,	22,	23,	22,	19,	14,	7,	
  //   12,	19,	24,	27,	28,	27,	24,	19,	12,	
  //   15,	22,	27,	30,	31,	30,	27,	22,	15,	
  //   16,	23,	28,	31,	32,	31,	28,	23,	16,	
  //   15,	22,	27,	30,	31,	30,	27,	22,	15,	
  //   12,	19,	24,	27,	28,	27,	24,	19,	12,	
  //   7,	14,	19,	22,	23,	22,	19,	14,	7,	
  //   0,	7,	12,	15,	16,	15,	12,	7,	0	
  // ];
  const MAT_LENGTH = 7;
  const matrix = [
    0,	5,	8,	9,	8,	5,	0,	
    5,	10,	13,	14,	13,	10,	5,	
    8,	13,	16,	17,	16,	13,	8,	
    9,	14,	17,	18,	17,	14,	9,	
    8,	13,	16,	17,	16,	13,	8,	
    5,	10,	13,	14,	13,	10,	5,	
    0,	5,	8,	9,	8,	5,	0,	
  ];

  img.loadPixels();

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cellIndex = x + y * COLS;
      const imgIndex = cellIndex * 4;
      const dx = x % MAT_LENGTH;
      const dy = y % MAT_LENGTH;
      const treshold = 128 * slider.value() * ((matrix[dx + dy * MAT_LENGTH]) / 18 - 0.5);
      const r = img.pixels[imgIndex] + treshold;
      const g = img.pixels[imgIndex + 1] + treshold;
      const b = img.pixels[imgIndex + 2] + treshold;

      const current = new Color(r, g, b);
      const closest = palette.findClosest(current);
      grid.cells[cellIndex].color = closest;
    }
  }
  grid.show();
}

function method10() {
  // const MAT_LENGTH = 9;
  // const matrix = [
  //   0,	7,	12,	15,	16,	15,	12,	7,	0,	
  //   7,	14,	19,	22,	23,	22,	19,	14,	7,	
  //   12,	19,	24,	27,	28,	27,	24,	19,	12,	
  //   15,	22,	27,	30,	31,	30,	27,	22,	15,	
  //   16,	23,	28,	31,	32,	31,	28,	23,	16,	
  //   15,	22,	27,	30,	31,	30,	27,	22,	15,	
  //   12,	19,	24,	27,	28,	27,	24,	19,	12,	
  //   7,	14,	19,	22,	23,	22,	19,	14,	7,	
  //   0,	7,	12,	15,	16,	15,	12,	7,	0	
  // ];
  const MAT_LENGTH = 7;
  const matrix = [
    0,	5,	8,	9,	8,	5,	0,	
    5,	10,	13,	14,	13,	10,	5,	
    8,	13,	16,	17,	16,	13,	8,	
    9,	14,	17,	18,	17,	14,	9,	
    8,	13,	16,	17,	16,	13,	8,	
    5,	10,	13,	14,	13,	10,	5,	
    0,	5,	8,	9,	8,	5,	0,	
  ];

  img.loadPixels();

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cellIndex = x + y * COLS;
      const imgIndex = cellIndex * 4;
      const dx = x % MAT_LENGTH;
      const dy = y % MAT_LENGTH;
      const treshold = 128 * slider.value() * ((matrix[dx + dy * MAT_LENGTH]) / 18 - 0.5);
      const r = img.pixels[imgIndex] + treshold;
      const g = img.pixels[imgIndex + 1] + treshold;
      const b = img.pixels[imgIndex + 2] + treshold;

      const current = new Color(r, g, b);
      const closest = palette.findClosestVision(current);
      grid.cells[cellIndex].color = closest;
    }
  }
  grid.show();
}
//#endregion