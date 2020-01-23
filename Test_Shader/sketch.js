// import * as THREE from "./libraries/three.module";

let camera, scene, renderer;
let textureLoader;
let uniforms;
let colorPicker, resolutionSlider, infoCheckbox;

window.onload = function() {
  init();
  animate();
}

function init() {
  camera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0, 1);
  camera.position.z = 1;

  scene = new THREE.Scene();

  const geometry = new THREE.PlaneBufferGeometry(2, 2);

  const canvas = document.getElementById("canvas");
  const context = canvas.getContext('webgl2', { alpha: false });

  colorPicker = document.getElementById("color");
  resolutionSlider = document.getElementById("range");
  infoCheckbox = document.getElementById("checkbox");

  textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("images/cat.jpg");
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  const palette = createPalette();

  uniforms = {
    u_time: { value: 1.0 },
    u_resolution: { value: new THREE.Vector2(canvas.width, canvas.height) },
    u_mouse: { value: new THREE.Vector2() },
    rows: { value: 1 },
    cols: { value: 1 },
    color: { value: new THREE.Color() },
    mainTex: { value: texture },
    show: { value: false },
    palette: { value : palette },
    count: {value : palette.image.width}
  };

  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById("vs").textContent,
    fragmentShader: document.getElementById("fs").textContent
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ canvas, context });
  renderer.setPixelRatio(1);
  renderer.setSize(canvas.width, canvas.height);

  addEventsListeners();

  document.onmousemove = function(e) {
    uniforms.u_mouse.value.x = e.pageX
    uniforms.u_mouse.value.y = e.pageY
  }
}

function animate(timestamp) {
  requestAnimationFrame(animate);
  uniforms.u_time.value = timestamp / 1000;
  renderer.render(scene, camera);
}

function addEventsListeners() {
  // onWindowResized();
  // window.addEventListener( 'resize', onWindowResized, false );

  onColorPicked();
  colorPicker.addEventListener("change", onColorPicked);

  onResolutionChanged();
  resolutionSlider.addEventListener("change", onResolutionChanged);

  onInfoToggled();
  infoCheckbox.addEventListener("change", onInfoToggled);
}

function onWindowResized() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
}

function onColorPicked() {
  const color = colorPicker.value;
  uniforms.color.value = new THREE.Color(color);
}

function onResolutionChanged() {
  const resolution = resolutionSlider.valueAsNumber;
  uniforms.rows.value = resolution;
  uniforms.cols.value = resolution;
}

function onInfoToggled() {
  const showInfos = infoCheckbox.checked;
  uniforms.show.value = showInfos;
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