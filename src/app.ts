import * as THREE from 'three';

import { PointerLockControls } from '../node-modules/three/examples/jsm/controls/PointerLockControls.js';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;

let walls: THREE.Mesh[] = [];
let floor: THREE.Mesh;
let ceiling: THREE.Mesh;

const wallMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/General/bricks.jpg') });
const floorMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/General/wood.jpg') });
const ceilingMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/General/concrete.jpg') });

const light1 = new THREE.PointLight(0xffffff, 1, 100);
light1.position.set(-30, 20, 20);
const light2 = new THREE.PointLight(0xffffff, 1, 100);
light2.position.set(30, 20, 20);
const light3 = new THREE.PointLight(0xffffff, 1, 100);
light3.position.set(-30, 20, -20);
const light4 = new THREE.PointLight(0xffffff, 1, 100);
light4.position.set(30, 20, -20);

let controls: PointerLockControls;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let prevTime = performance.now();

init();
animate();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 10, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const planeGeometry = new THREE.BoxGeometry(60, 20, 60);
  for (let i = 0; i < planeGeometry.faces.length; i += 2) {
    const color = new THREE.Color(0x444444);
    planeGeometry.faces[i].color = color;
    planeGeometry.faces[i + 1].color = color;
  }

  for (let i = 0; i < 4; i++) {
    const wall = new THREE.Mesh(planeGeometry, wallMaterial);
    if (i === 0) {
      wall.position.set(0, 10, -30);
      wall.rotation.y = Math.PI / 2;
    } else if (i === 1) {
      wall.position.set(30, 10, 0);
    } else if (i === 2) {
      wall.position.set(0, 10, 30);
      wall.rotation.y = Math.PI / 2;
    } else {
      wall.position.set(-30, 10, 0);
      wall.rotation.y = Math.PI;
    }
    walls.push(wall);
    scene.add(wall);
  }

  floor = new THREE.Mesh(planeGeometry, floorMaterial);
  floor.position.set(0, 0, 0);
  floor.rotation.x = Math.PI / 2;
  scene.add(floor);

  ceiling = new THREE.Mesh(planeGeometry, ceilingMaterial);
  ceiling.position.set(0, 20, 0);
  ceiling.rotation.x = Math.PI / 2;
  scene.add(ceiling);

  scene.add(light1);
  scene.add(light2);
  scene.add(light3);
  scene.add(light4);

  controls = new THREE.PointerLockControls(camera, document.body);
  scene.add(controls.getObject());
  
  const onKeyDown = function (event: KeyboardEvent) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true;
        break;
      case 37: // left
      case 65: // a
        moveLeft = true;
        break;
      case 40: // down
      case 83: // s
        moveBackward = true;
        break;
      case 39: // right
      case 68: // d
        moveRight = true;
        break;
    }
  };

  const onKeyUp = function (event: KeyboardEvent) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false;
        break;
      case 37: // left
      case 65: // a
        moveLeft = false;
        break;
      case 40: // down
      case 83: // s
        moveBackward = false;
        break;
      case 39: // right
      case 68: // d
        moveRight = false;
        break;
    }
  };

  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
}

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();
  const delta = (time - prevTime) / 1000;

  if (moveForward) {
    controls.getObject().translateZ(-400 * delta);
  }
  if (moveBackward) {
    controls.getObject().translateZ(400 * delta);
  }
  if (moveLeft) {
    controls.getObject().translateX(-400 * delta);
  }
  if (moveRight) {
    controls.getObject().translateX(400 * delta);
  }

  prevTime = time;

  renderer.render(scene, camera);
}
