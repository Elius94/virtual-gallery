import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import "./app.css";

const room = {
  width: 600,
  height: 200,
  depth: 600
}

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
light1.position.set(-300, 200, 200);
const light2 = new THREE.PointLight(0xffffff, 1, 100);
light2.position.set(300, 200, 200);
const light3 = new THREE.PointLight(0xffffff, 1, 100);
light3.position.set(-300, 200, -200);
const light4 = new THREE.PointLight(0xffffff, 1, 100);
light4.position.set(300, 200, -200);


const objects = [] as THREE.Object3D[];
let controls: PointerLockControls;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let prevTime = performance.now();

let raycaster: THREE.Raycaster;

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  scene.fog = new THREE.Fog(0xffffff, 0, 2000);

  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 10, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const planeGeometryWalls = new THREE.BoxGeometry(room.depth, room.height, 10);
  const color = new THREE.Color(0x444444);
  planeGeometryWalls.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));

  for (let i = 0; i < 4; i++) {
    const wall = new THREE.Mesh(planeGeometryWalls, wallMaterial);
    if (i === 0) {
      wall.position.set(0, room.height / 2, -(room.depth / 2));
      wall.rotation.y = Math.PI;
    } else if (i === 1) {
      wall.position.set(room.depth / 2, room.height / 2, 0);
      wall.rotation.y = Math.PI / 2;
    } else if (i === 2) {
      wall.position.set(0, room.height / 2, room.depth / 2);
      wall.rotation.y = Math.PI;
    } else {
      wall.position.set(-(room.depth / 2), room.height / 2, 0);
      wall.rotation.y = Math.PI / 2;
    }
    walls.push(wall);
    scene.add(wall);
  }


  const planeGeometry = new THREE.BoxGeometry(room.depth, room.width, 10);
  planeGeometry.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));

  floor = new THREE.Mesh(planeGeometry, floorMaterial);
  floor.position.set(0, 0, 0);
  floor.rotation.x = Math.PI / 2;
  scene.add(floor);

  ceiling = new THREE.Mesh(planeGeometry, ceilingMaterial);
  ceiling.position.set(0, room.height, 0);
  ceiling.rotation.x = Math.PI / 2;
  scene.add(ceiling);

  scene.add(light1);
  scene.add(light2);
  scene.add(light3);
  scene.add(light4);

  controls = new PointerLockControls(camera, document.body);
  const blocker = document.getElementById('blocker') as HTMLElement;
  const instructions = document.getElementById('instructions') as HTMLElement;

  instructions.addEventListener('click', function () {
    controls.lock();
  });

  controls.addEventListener('lock', function () {
    instructions.style.display = 'none';
    blocker.style.display = 'none';
  });

  controls.addEventListener('unlock', function () {
    blocker.style.display = 'block';
    instructions.style.display = '';
  });

  scene.add(controls.getObject());

  const onKeyDown = function (event: KeyboardEvent) {
    switch (event.code) {
      case "ArrowUp": // up
      case "KeyW": // w
        moveForward = true;
        break;
      case "ArrowLeft": // left
      case "KeyA": // a
        moveLeft = true;
        break;
      case "ArrowDown": // down
      case "KeyS": // s
        moveBackward = true;
        break;
      case "ArrowRight": // right
      case "KeyD": // d
        moveRight = true;
        break;
      case 'Space':
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
  };

  const onKeyUp = function (event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        moveForward = false;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = false;
        break;
      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        moveRight = false;
        break;
    }
  };

  raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);
  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);

  const onWindowResize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', onWindowResize, false);
}

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();

  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;

    
    const intersections = raycaster.intersectObjects(objects, false);
    const onObject = intersections.length > 0;
    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(- velocity.x * delta);
    controls.moveForward(- velocity.z * delta);

    controls.getObject().position.y += (velocity.y * delta); // new behavior

    if (controls.getObject().position.y < 10) {
      velocity.y = 0;
      controls.getObject().position.y = 10;

      canJump = true;
    }
  }
  prevTime = time;

  renderer.render(scene, camera);
}
