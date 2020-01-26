// import * as THREE from "./libraries/three.module";

const VERTEX_SHADER_URI = "shaders/shader.vert";
const FRAGMENT_SHADER_URI = "shaders/shader.frag";
const IMAGE_URI = "images/cat.jpg";

let camera, scene, renderer;
let uniforms;
let canvas, colorPicker, resolutionSlider, biasSlider, infoCheckbox;

let scale, offset, isMoving, rect, x, y;

window.onload = () => {
  loadShaders(VERTEX_SHADER_URI, FRAGMENT_SHADER_URI, (vs, fs) => {
    init(vs, fs);
    animate();
  });
}

function loadShaders(vertexShaderUri, fragmentShaderUri, onLoad) {
  const manager = new THREE.LoadingManager();
  const fileLoader = new THREE.FileLoader(manager);
  let vertexShader, fragmentShader;

  fileLoader.load(vertexShaderUri, data => vertexShader = data);
  fileLoader.load(fragmentShaderUri, data => fragmentShader = data);

  manager.onLoad = () => {
    onLoad(vertexShader, fragmentShader);
  }
}

function init(vertexShader, fragmentShader) {
  camera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0, 1);
  camera.position.z = 1;

  scene = new THREE.Scene();

  const geometry = new THREE.PlaneBufferGeometry(2, 2);

  canvas = document.getElementById("canvas");
  const context = canvas.getContext('webgl2', { alpha: false });

  scale = 1;
  offset = new THREE.Vector2(0, 0);
  isMoving = false;
  rect = canvas.getBoundingClientRect();
  x = 0;
  y = 0;

  colorPicker = document.getElementById("color");
  resolutionSlider = document.getElementById("res-range");
  biasSlider = document.getElementById("bias-range");
  infoCheckbox = document.getElementById("checkbox");

  const texture = new THREE.TextureLoader().load(IMAGE_URI);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  const palette = createPalette();

  uniforms = {
    u_time: { value: 1.0 },
    u_resolution: { value: new THREE.Vector2(canvas.width, canvas.height) },
    u_mouse: { value: new THREE.Vector2() },
    rows: { value: 1 },
    cols: { value: 1 },
    mainColor: { value: new THREE.Color() },
    mainTex: { value: texture },
    show: { value: false },
    palette: { value : palette },
    count: { value : palette.image.width },
    bias: { value : 1.0 },
    viewPort: { value: new THREE.Vector4(0, 0, canvas.width, canvas.height) }
  };

  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ canvas, context });
  renderer.setPixelRatio(1);
  renderer.setSize(canvas.width, canvas.height);

  addEventsListeners();
}

function animate(timestamp) {
  requestAnimationFrame(animate);
  onColorPicked();
  onResolutionChanged();
  onBiasChanged();
  uniforms.u_time.value = timestamp / 1000;
  renderer.render(scene, camera);
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function addEventsListeners() {
  // onWindowResized();
  // window.addEventListener( 'resize', onWindowResized, false );

  onColorPicked();
  colorPicker.addEventListener("change", onColorPicked);

  onResolutionChanged();
  resolutionSlider.addEventListener("change", onResolutionChanged);

  onBiasChanged();
  biasSlider.addEventListener("change", onBiasChanged);

  onInfoToggled();
  infoCheckbox.addEventListener("change", onInfoToggled);

  document.addEventListener("mousemove", onMouseMove);
  
  canvas.addEventListener("wheel", onCanvasWheel);
  canvas.addEventListener("mousedown", onCanvasMouseDown);
  canvas.addEventListener("mouseup", onCanvasMouseUp);
  document.addEventListener("mouseout", onCanvasMouseUp);
  canvas.addEventListener("mousemove", onCanvasMouseMove);
}

function onWindowResized() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
}

function onColorPicked() {
  const color = colorPicker.value;
  uniforms.mainColor.value = new THREE.Color(color);
}

function onResolutionChanged() {
  const resolution = resolutionSlider.valueAsNumber;
  uniforms.rows.value = resolution;
  uniforms.cols.value = resolution;
}

function onBiasChanged() {
  const bias = biasSlider.valueAsNumber;
  uniforms.bias.value = bias;
}

function onInfoToggled() {
  const showInfos = infoCheckbox.checked;
  uniforms.show.value = showInfos;
}

function onMouseMove(e) {
  uniforms.u_mouse.value.x = e.clientX - rect.left;
  uniforms.u_mouse.value.y = e.clientY - rect.top;
}

function onCanvasWheel(e) {
  e.preventDefault();

  scale += e.deltaY * -0.1;
  scale = clamp(scale, 1, 20);

  updateViewPort();
}

function onCanvasMouseDown(e) {
  x = e.pageX;
  y = e.pageY;
  isMoving = true;
}

function onCanvasMouseUp(e) {
  if(isMoving) {
    x = 0;
    y = 0;
    isMoving = false;
  }
}

function onCanvasMouseMove(e) {
  if(isMoving) {
    const newX = e.pageX;
    const newY = e.pageY;
    const dx = x - newX;
    const dy = y - newY;

    offset.x += dx / scale;
    offset.y -= dy / scale;

    x = newX;
    y = newY;

    updateViewPort();
  }
}

function updateViewPort() {
  const minX = offset.x + canvas.width / 2 - canvas.width / 2 / scale;
  const maxX = offset.x + canvas.width / 2 + canvas.width / 2 / scale;
  const minY = offset.y + canvas.height / 2 - canvas.height / 2 / scale;
  const maxY = offset.y + canvas.height / 2 + canvas.height / 2 / scale;

  const clampMinX = clamp(minX, 0, canvas.width);
  const clampMaxX = clamp(maxX, 0, canvas.width);
  const clampMinY = clamp(minY, 0, canvas.height);
  const clampMaxY = clamp(maxY, 0, canvas.height);

  const dMinX = clampMinX - minX;
  const dMaxX = clampMaxX - maxX;
  const dMinY = clampMinY - minY;
  const dMaxY = clampMaxY - maxY;

  offset.x += dMinX + dMaxX;
  offset.y += dMinY + dMaxY;

  uniforms.viewPort.value = new THREE.Vector4(clampMinX + dMaxX, clampMinY + dMaxY, clampMaxX + dMinX, clampMaxY + dMinY);
}

function createPalette() {
  const colors = [
    { r: 0, g: 0, b: 0 },
    { r: 255, g: 55, b: 55 },
    { r: 255, g: 98, b: 40 },
    { r: 255, g: 212, b: 38 },
    { r: 100, g: 182, b: 20 },
    { r: 44, g: 128, b: 44 },
    { r: 43, g: 185, b: 221 },
    { r: 43, g: 154, b: 174 },
    { r: 61, g: 65, b: 141 },
    { r: 151, g: 77, b: 157 },
    { r: 103, g: 51, b: 31 },
    { r: 255, g: 255, b: 255 },
    { r: 236, g: 192, b: 243 },
    { r: 202, g: 115, b: 175 },
    { r: 129, g: 182, b: 196 },
    { r: 186, g: 204, b: 222 },
    { r: 152, g: 211, b: 173 },
    { r: 249, g: 235, b: 155 },
    { r: 245, g: 219, b: 190 },
    { r: 241, g: 176, b: 160 },
    { r: 254, g: 113, b: 116 },
    { r: 252, g: 118, b: 155 },
    { r: 255, g: 187, b: 202 }
  ];
  
  const data = new Uint8Array(3 * colors.length);
  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];
    const index = i * 3;
    data[index + 0] = color.r;
    data[index + 1] = color.g;
    data[index + 2] = color.b;
  }

  return new THREE.DataTexture(data, colors.length, 1, THREE.RGBFormat);
}