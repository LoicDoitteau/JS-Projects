// import * as THREE from "./libraries/three.module";

const VERTEX_SHADER_URI = "shaders/shader.vert";
const FRAGMENT_SHADER_URI = "shaders/shader.frag";
const IMAGE_URI = "images/cat.jpg";
const MATRIX_URI = "images/mat.jpg";
const MATRIX_SIZE = 8;

let camera, scene, renderer;
let uniforms;
let canvas, file, colorPicker, sizeLabel;

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
  sizeLabel = document.getElementById("size");

  uniforms = {
    u_time: { value: 1.0 },
    u_resolution: { value: new THREE.Vector2() },
    u_mouse: { value: new THREE.Vector2() },
    mainColor: { value: new THREE.Color() },
    mainTex: { value: new THREE.Texture() },   
    matTex: { value: new THREE.Texture() },
    matRes: {value : new THREE.Vector2()},
    size: {value : 0}
  };

  const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ canvas, context });
  renderer.setPixelRatio(1);

  loadTexture(IMAGE_URI);
  loadMatTexture(MATRIX_URI, MATRIX_SIZE);

  addEventsListeners();
}

function animate(timestamp) {
  requestAnimationFrame(animate);
  onColorPicked();
  uniforms.u_time.value = timestamp / 1000;
  renderer.render(scene, camera);
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function addEventsListeners() {

  onColorPicked();
  colorPicker.addEventListener("change", onColorPicked);

  file.addEventListener("change", onFileChanged);
}

function onFileChanged() {
  loadTexture(window.URL.createObjectURL(file.files[0]));
}

function onColorPicked() {
  const color = colorPicker.value;
  uniforms.mainColor.value = new THREE.Color(color);
}

function onMouseMove(e) {
  uniforms.u_mouse.value.x = e.clientX - rect.left;
  uniforms.u_mouse.value.y = e.clientY - rect.top;
}

function loadTexture(url) {
  new THREE.TextureLoader().load(url, texture =>{
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
    
      renderer.setSize(texture.image.width, texture.image.height);
      sizeLabel.innerText = `${texture.image.width} x ${texture.image.height}`;
    
      uniforms.mainTex.value = texture;
      uniforms.u_resolution.value =  new THREE.Vector2(canvas.width, canvas.height);
  });
}

function loadMatTexture(url, size,) {
  new THREE.TextureLoader().load(url, texture =>{
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
    
      uniforms.matTex.value = texture;
      uniforms.matRes.value = new THREE.Vector2(texture.image.width, texture.image.height);
      uniforms.size.value = size;
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