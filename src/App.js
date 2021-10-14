import * as THREE from 'three';
import './App.css';
import { useEffect } from 'react';

var speed = 0.015;
var y_a = 0.0001;
var speed_y = 0;
var geometry = new THREE.BoxGeometry(0.1, 0.1, 0.01);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
var animationId = 0;

const init = () => {
  document.body.appendChild(renderer.domElement);

  scene.add(cube);

  camera.position.z = 5;

  var animate = function () {
    animationId = requestAnimationFrame(animate);
    speed_y += y_a;
    cube.position.x += speed;
    cube.position.y += speed_y;
    renderer.render(scene, camera);
  };

  animate();
};

const reRender = () => {
  cancelAnimationFrame(animationId);

  var animate = function () {
    animationId = requestAnimationFrame(animate);
    speed_y += y_a;
    cube.position.x += speed;
    cube.position.y += speed_y;
    renderer.render(scene, camera);
  };

  animate();
};

function App() {
  useEffect(() => {
    init();
  }, []);

  return (
    <div id='webgl-output'>
      <button
        style={{ position: 'absolute', left: '0px' }}
        onClick={() => {
          speed += 0.001;
          console.log(speed);
          reRender();
        }}
      >
        + speed
      </button>
      <button
        style={{ position: 'absolute', left: '100px' }}
        onClick={() => {
          speed -= 0.001;
          console.log(speed);
          reRender();
        }}
      >
        - speed
      </button>
    </div>
  );
}

export default App;
