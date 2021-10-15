import * as THREE from 'three';
import './App.css';

let renderer, scene, camera;

let line;
const MAX_POINTS = 300;
let drawCount;

const helper = (num) => {
  return Math.max(-1, Math.min(num, 1));
};

init();
animate();

function init() {
  // info
  const info = document.createElement('div');

  document.body.appendChild(info);

  // renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // scene
  scene = new THREE.Scene();

  // camera
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(0, 0, 1000);

  // geometry
  const geometry = new THREE.BufferGeometry();

  // attributes
  const positions = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));

  // drawcalls
  drawCount = 2; // draw the first 2 points, only
  geometry.setDrawRange(0, drawCount);

  // material
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  // line
  line = new THREE.Line(geometry, material);
  scene.add(line);

  // update positions
  updatePositions();
}
var speedDirectionX = 1;
var speedDirectionY = 1;
// update positions
function updatePositions() {
  const positions = line.geometry.attributes.position.array;

  let x, y, z, index;
  x = y = z = index = 0;

  for (let i = 0, l = MAX_POINTS; i < l; i++) {
    positions[index++] = x;
    positions[index++] = y;
    positions[index++] = z;

    speedDirectionX = helper(speedDirectionX + (1 - 2 * Math.random()) * 0.5);
    speedDirectionY = helper(speedDirectionY + (1 - 2 * Math.random()) * 0.5);

    x += speedDirectionX * 5;
    y += speedDirectionY * 5;
    // z += (Math.random() - 0.5) * 50;
  }
}

// render
function render() {
  renderer.render(scene, camera);
}

// animate
function animate() {
  requestAnimationFrame(animate);

  drawCount = (drawCount + 1) % MAX_POINTS;

  line.geometry.setDrawRange(0, drawCount);

  if (drawCount === 0) {
    // periodically, generate new data

    updatePositions();

    line.geometry.attributes.position.needsUpdate = true; // required after the first render

    line.material.color.setHSL(Math.random(), 1, 0.5);
  }

  render();
}

function App() {
  return <div id='webgl-output'></div>;
}

export default App;
