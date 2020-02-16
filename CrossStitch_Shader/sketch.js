// import * as THREE from "./libraries/three.module";

const VERTEX_SHADER_URI = "shaders/shader.vert";
const FRAGMENT_SHADER_URI = "shaders/shader.frag";
const IMAGE_URI = "images/cat.jpg";

let camera, scene, renderer;
let uniforms;
let canvas, file, colorPicker,
resolutionSliderX, resolutionSliderY, biasSlider,
infoCheckbox, sizeLabel, gammaSlider, tresholdSlider,
shadesSlider, offsetSlider, filterSlider,
brightnessSlider, saturationSlider, contrastSlider;

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
  const context = canvas.getContext('webgl2', { alpha: false, preserveDrawingBuffer: true });
  rect = canvas.getBoundingClientRect();

  file = document.getElementById("file");
  colorPicker = document.getElementById("color");
  resolutionSliderX = document.getElementById("res-range-x");
  resolutionSliderY = document.getElementById("res-range-y")
  biasSlider = document.getElementById("bias-range");
  infoCheckbox = document.getElementById("checkbox");
  sizeLabel = document.getElementById("size");
  gammaSlider = document.getElementById("gamma-range");
  tresholdSlider = document.getElementById("treshold-range");
  shadesSlider = document.getElementById("shades-range");
  offsetSlider = document.getElementById("offset-range");
  filterSlider = document.getElementById("filter-range");
  brightnessSlider = document.getElementById("brightness-range");
  saturationSlider = document.getElementById("saturation-range");
  contrastSlider = document.getElementById("contrast-range");

  uniforms = {
    u_time: { value: 1.0 },
    u_resolution: { value: new THREE.Vector2() },
    u_mouse: { value: new THREE.Vector2() },
    rows: { value: 1 },
    cols: { value: 1 },
    mainColor: { value: new THREE.Color() },
    mainTex: { value: new THREE.Texture() },
    show: { value: false },
    palette: { value : new THREE.Texture() },
    count: { value : 0 },
    bias: { value : 1.0 },
    viewPort: { value: new THREE.Vector4() },
    filterSize: { value : 0 },
    offset: { value : 0.0 },
    gamma: { value : 1.0 },
    treshold: { value : 1.0 },
    shades: { value : 255.0 },
    brightness: { value : 0.0 },
    saturation: { value : 1.0 },
    contrast: { value : 1.0 }
  };

  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ canvas, context });
  renderer.setPixelRatio(1);

  loadTexture(IMAGE_URI);
  setupPalette();

  addEventsListeners();
}

function animate(timestamp) {
  requestAnimationFrame(animate);
  onColorPicked();
  onResolutionChanged();
  onBiasChanged();
  onGammaChanged();
  onTresholdChanged();
  onShadesChanged();
  onOffsetChanged();
  onFilterChanged();
  onBrightnessChanged();
  onSaturationChanged();
  onContrastChanged();
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
  resolutionSliderX.addEventListener("change", onResolutionChanged);
  resolutionSliderY.addEventListener("change", onResolutionChanged);

  onBiasChanged();
  biasSlider.addEventListener("change", onBiasChanged);

  onGammaChanged();
  gammaSlider.addEventListener("change", onGammaChanged);

  onTresholdChanged();
  tresholdSlider.addEventListener("change", onTresholdChanged);

  onShadesChanged();
  shadesSlider.addEventListener("change", onShadesChanged);

  onOffsetChanged();
  offsetSlider.addEventListener("change", onOffsetChanged);

  onFilterChanged();
  filterSlider.addEventListener("change", onFilterChanged);

  onBrightnessChanged();
  brightnessSlider.addEventListener("change", onBrightnessChanged);

  onContrastChanged();
  contrastSlider.addEventListener("change", onContrastChanged);

  onSaturationChanged();
  saturationSlider.addEventListener("change", onSaturationChanged);

  onInfoToggled();
  infoCheckbox.addEventListener("change", onInfoToggled);

  document.addEventListener("mousemove", onMouseMove);
  
  canvas.addEventListener("wheel", onCanvasWheel);
  canvas.addEventListener("mousedown", onCanvasMouseDown);
  canvas.addEventListener("mouseup", onCanvasMouseUp);
  document.addEventListener("mouseout", onCanvasMouseUp);
  canvas.addEventListener("mousemove", onCanvasMouseMove);

  file.addEventListener("change", onFileChanged);
}

function onFileChanged() {
  loadTexture(window.URL.createObjectURL(file.files[0]));
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
  const resolutionX = resolutionSliderX.valueAsNumber;
  const resolutionY = resolutionSliderY.valueAsNumber;
  uniforms.cols.value = resolutionX;
  uniforms.rows.value = resolutionY;
}

function onBiasChanged() {
  const bias = biasSlider.valueAsNumber;
  uniforms.bias.value = bias;
}

function onGammaChanged() {
  const gamma = gammaSlider.valueAsNumber;
  uniforms.gamma.value = gamma;
}

function onTresholdChanged() {
  const treshold = tresholdSlider.valueAsNumber;
  uniforms.treshold.value = treshold;
}

function onShadesChanged() {
  const shades = shadesSlider.valueAsNumber;
  uniforms.shades.value = shades;
}

function onOffsetChanged() {
  const offset = offsetSlider.valueAsNumber;
  uniforms.offset.value = offset;
}

function onFilterChanged() {
  const filter = filterSlider.valueAsNumber;
  uniforms.filterSize.value = filter;
}

function onBrightnessChanged() {
  const brightness = brightnessSlider.valueAsNumber;
  uniforms.brightness.value = brightness;
}

function onSaturationChanged() {
  const saturation = saturationSlider.valueAsNumber;
  uniforms.saturation.value = saturation;
}

function onContrastChanged() {
  const contrast = contrastSlider.valueAsNumber;
  uniforms.contrast.value = contrast;
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

function addColorPicker(value) {
  const element = document.getElementById("palette");
  const colorPicker = document.createElement("input");
  colorPicker.type = "color";
  colorPicker.value = value;
  colorPicker.addEventListener("input", onPaletteChanged);
  element.appendChild(colorPicker);
  onPaletteChanged();
}

function onPaletteChanged() {
  const palette = createPalette();
  uniforms.palette.value = palette;
  uniforms.count.value = palette.image.width;
}

function setupPalette() {
  const colors = [
    "#000000",
    "#FF3737",
    "#FF6228",
    "#FFD426",
    "#64B614",
    "#2C802C",
    "#2BB9DD",
    "#2B9AAE",
    "#3D418D",
    "#974D9D",
    "#67331F",
    "#FFFFFF",
    "#ECC0F3",
    "#CA73AF",
    "#81B6C4",
    "#BACCDE",
    "#98D3AD",
    "#F9EB9B",
    "#F5DBBE",
    "#F1B0A0",
    "#FE7174",
    "#FC769B",
    "#FFBBCA"
  ];

  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];
    addColorPicker(color);
  }
}

function createPalette() {
  const colors = document.querySelectorAll("#palette input[type=color]");
  
  const data = new Uint8Array(3 * colors.length);
  for (let i = 0; i < colors.length; i++) {
    const color = new THREE.Color(colors[i].value);
    const index = i * 3;
    data[index + 0] = color.r * 255;
    data[index + 1] = color.g * 255;
    data[index + 2] = color.b * 255;
  }

  return new THREE.DataTexture(data, colors.length, 1, THREE.RGBFormat);
}

function resetPalette() {
  const colors = document.querySelectorAll("#palette input[type=color]");
  for (const color of colors) {
    color.remove();
  }
  addColorPicker("#000000");
  addColorPicker("#FFFFFF");
}

function loadTexture(url) {
  new THREE.TextureLoader().load(url, texture =>{
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
    
      renderer.setSize(texture.image.width, texture.image.height);
      sizeLabel.innerText = `${texture.image.width} x ${texture.image.height}`;
    
      uniforms.mainTex.value = texture;
      uniforms.u_resolution.value =  new THREE.Vector2(canvas.width, canvas.height)
      uniforms.viewPort.value = new THREE.Vector4(0, 0, canvas.width, canvas.height);

      scale = 1;
      offset = new THREE.Vector2(0, 0);
      isMoving = false;
      rect = canvas.getBoundingClientRect();
      x = 0;
      y = 0;

      resolutionSliderX.max = canvas.width;
      resolutionSliderX.value = canvas.width;
      resolutionSliderY.max = canvas.height;
      resolutionSliderY.value = canvas.height;
  });
}

function exportImage() {
  var a = document.createElement('a');
  a.href = canvas.toDataURL();
  a.download = "output.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}