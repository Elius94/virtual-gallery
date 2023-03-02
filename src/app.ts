import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import "./app.css";
import Scene from './scene';
import Floor from './floor';
import Ceiling from './ceiling';
import Player from './player';
import Renderer from './renderer';
import Walls from './walls';

const room = {
  width: 2200,
  height: 400,
  depth: 1300
}

let scene: Scene;
let player: Player;
let renderer: Renderer;
let floor: Floor;
let ceiling: Ceiling;
let walls: Walls;

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
  scene = new Scene();
  player = new Player({ height: 100 });
  renderer = new Renderer(window.innerWidth, window.innerHeight, window.devicePixelRatio);
  document.body.appendChild(renderer.getDomElement());

  walls = new Walls(room.depth, room.width, room.height);
  walls.getWalls().forEach(wall => {
    scene.add(wall);
    objects.push(wall);
  });

  floor = new Floor(room.depth, room.width);
  scene.add(floor.getFloor());

  ceiling = new Ceiling(room.depth, room.width, room.height);
  scene.add(ceiling.getCeiling());

  scene.add(light1);
  scene.add(light2);
  scene.add(light3);
  scene.add(light4);

  controls = new PointerLockControls(player.getPlayer(), document.body);
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
    player.resize(window.innerWidth, window.innerHeight);
    renderer.resize(window.innerWidth, window.innerHeight);
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

    velocity.x -= velocity.x * player.getSpeedMultiplier() * delta;
    velocity.z -= velocity.z * player.getSpeedMultiplier() * delta;

    velocity.y -= 9.8 * player.getMass() * delta; // 100.0 = mass

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

    if (controls.getObject().position.y < player.getHeight()) {
      velocity.y = 0;
      controls.getObject().position.y = player.getHeight();

      canJump = true;
    }
  }
  prevTime = time;

  renderer.render(scene.getScene(), player.getPlayer());
}