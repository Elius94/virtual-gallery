import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';

import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import { Octree } from 'three/examples/jsm/math/Octree.js';
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper.js';

import { Capsule } from 'three/examples/jsm/math/Capsule.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';

import { GUI } from './lil-gui.module.min.js';

import TouchControls from './touch-controller/TouchControls.js'
import ArtworkFrame, { ArtworkFrameOptions } from './Artwork.js';
import "./app.css"
import "./touch-pad.css"

const txtLoader = new THREE.TextureLoader();
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const pictures: ArtworkFrame[] = [];

/* @ts-ignore */
THREE.ColorManagement.enabled = true;

//scene.background = new THREE.Color(0x88ccee);
// Put a picture in the background
//const texture = txtLoader.load('./textures/general/DSC02177-Modifica.jpg');
// Add spotlights to the scene
/*const spotLights = [
  new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2, 0.5),
];

spotLights[0].position.set(10, 10, 0);
spotLights[0].target.position.set(0, 0, 0);
spotLights[0].castShadow = true;

scene.add(spotLights[0]);*/

const texture = txtLoader.load(
  './textures/general/Giau_2.jpg',
  () => {
    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(renderer, texture);
    scene.background = rt.texture;
  });

scene.background = texture;
scene.fog = new THREE.Fog(0x88ccee, 0, 150);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.rotation.order = 'YXZ';

const fillLight1 = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.2);
fillLight1.position.set(2, 1, 1);
scene.add(fillLight1);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(- 5, 25, - 1);
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0.01;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.right = 30;
directionalLight.shadow.camera.left = - 30;
directionalLight.shadow.camera.top = 30;
directionalLight.shadow.camera.bottom = - 30;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.radius = 4;
directionalLight.shadow.bias = - 0.00006;
scene.add(directionalLight);

//const container = document.getElementById('container') as HTMLElement;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
//renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;
/* @ts-ignore */
//renderer.gammaFactor = 2.0;
document.body.appendChild(renderer.domElement);

/* @ts-ignore */
const target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat,
  encoding: THREE.sRGBEncoding,
	type: THREE.FloatType
});

const composer = new EffectComposer(renderer, target);
composer.setPixelRatio(window.devicePixelRatio);
composer.setSize(window.innerWidth, window.innerHeight)
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new ShaderPass(GammaCorrectionShader));


const stats = new (Stats as any)();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);

const GRAVITY = 30;

const STEPS_PER_FRAME = 5;

const worldOctree = new Octree();

const playerCollider = new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1, 0), 0.35);

const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();

let playerOnFloor = false;
//let mouseTime = 0;

const keyStates = {} as { [key: string]: boolean };

document.addEventListener('keydown', (event) => {
  keyStates[event.code] = true;
});

document.addEventListener('keyup', (event) => {
  keyStates[event.code] = false;
});

document.body.addEventListener('mousedown', () => {
  document.body.requestPointerLock();
  //mouseTime = performance.now();
});

document.body.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement === document.body) {
    camera.rotation.y -= event.movementX / 500;
    camera.rotation.x -= event.movementY / 500;
  }
});


const blocker = document.getElementById('blocker') as HTMLElement;
const instructions = document.getElementById('instructions') as HTMLElement;

instructions.addEventListener('click', function () {
  hideInstructions();
});

function hideInstructions() {
  instructions.style.display = 'none';
  blocker.style.display = 'none';
}

function showInstructions() {
  blocker.style.display = 'block';
  instructions.style.display = '';
}

document.addEventListener("pointerlockchange", () => {
  if (document.pointerLockElement !== document.body) {
    showInstructions();
  } else {
    hideInstructions();
  }
});

window.addEventListener('resize', onWindowResize);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

function playerCollisions() {
  const result = worldOctree.capsuleIntersect(playerCollider);
  playerOnFloor = false;

  if (result) {
    playerOnFloor = result.normal.y > 0;
    if (!playerOnFloor) {
      playerVelocity.addScaledVector(result.normal, - result.normal.dot(playerVelocity));
    }

    playerCollider.translate(result.normal.multiplyScalar(result.depth));
  }
}

function updatePlayer(deltaTime: number) {
  let damping = Math.exp(- 4 * deltaTime) - 1;

  if (!playerOnFloor) {
    playerVelocity.y -= GRAVITY * deltaTime;
    // small air resistance
    damping *= 0.1;
  }

  playerVelocity.addScaledVector(playerVelocity, damping);

  const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
  playerCollider.translate(deltaPosition);

  playerCollisions();
  camera.position.copy(playerCollider.end);
}

function getForwardVector() {
  camera.getWorldDirection(playerDirection);
  playerDirection.y = 0;
  playerDirection.normalize();
  return playerDirection;
}

function getSideVector() {

  camera.getWorldDirection(playerDirection);
  playerDirection.y = 0;
  playerDirection.normalize();
  playerDirection.cross(camera.up);

  return playerDirection;

}

function controls(deltaTime: number) {

  // gives a bit of air control
  const speedDelta = deltaTime * (playerOnFloor ? 25 : 8);

  if (keyStates['KeyW']) {
    playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));
  }

  if (keyStates['KeyS']) {
    playerVelocity.add(getForwardVector().multiplyScalar(- speedDelta));
  }

  if (keyStates['KeyA']) {
    playerVelocity.add(getSideVector().multiplyScalar(- speedDelta));
  }

  if (keyStates['KeyD']) {
    playerVelocity.add(getSideVector().multiplyScalar(speedDelta));
  }

  if (playerOnFloor) {
    if (keyStates['Space']) {
      playerVelocity.y = 10;
    }
  }
}

const padElement = document.getElementById('container3d') as HTMLDivElement
new TouchControls(padElement.parentNode) as any

padElement.addEventListener('YawPitch', (event: any) => {
  console.log(event)
  camera.rotation.y -= event.deltaY / 500;
  camera.rotation.x -= event.deltaX / 500;
})

padElement.addEventListener('move', (event: any) => {
  console.log(event)
})



let mixer: THREE.AnimationMixer
const loader = new GLTFLoader().setPath('./models/gltf/');
const fbxLoader = new FBXLoader()
fbxLoader.setPath('./models/fbx/')

function loadModel(url: string) {
  return new Promise((resolve, reject) => {
    loader.load(url, (gltf) => {
      resolve(gltf)
    }, undefined, (error) => {
      reject(error)
    })
  })
}


// load a room model
// Room model 1
loader.load('vr_art_gallery_-_el1.glb', (gltf: GLTF) => {
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  gltf.scene.scale.set(0.05, 0.05, 0.05);
  scene.add(gltf.scene);
  worldOctree.fromGraphNode(gltf.scene);

  gltf.scene.traverse((child: any) => {
    if (child.isMesh && child.material.map !== null) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material.map) {
        child.material.map.anisotropy = maxAnisotropy;
        child.material.map.encoding = THREE.sRGBEncoding;

      }
    }
  });

  const helper = new OctreeHelper(worldOctree, 0x00ff00);
  helper.visible = false;
  scene.add(helper);

  /* @ts-ignore */
  const gui = new GUI({ width: 200 }) as any;
  gui.add({ debug: false }, 'debug')
    .onChange(function (value: boolean) {
      helper.visible = value;
    });

  // Add plants to the scene
  const plant3 = './additional_models/rigged_indoor-plant_animation_test.glb'


  loadModel(plant3).then((gltf: any) => {
    gltf.scene.scale.set(2, 2, 2);
    gltf.scene.position.set(3, 0, 4);
    gltf.scene.rotation.set(0, 0, 0);

    mixer = new THREE.AnimationMixer(gltf.scene)
    const action = mixer.clipAction((gltf as any).animations[0]);
    action.play();

    gltf.scene.traverse((child: any) => {
      if (child.isMesh && child.material.map !== null) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material.map) {
          child.material.map.anisotropy = maxAnisotropy;
          child.material.map.encoding = THREE.sRGBEncoding;

        }
      }
    });
    scene.add(gltf.scene);
  })
  loadModel(plant3).then((gltf: any) => {
    gltf.scene.scale.set(2, 2, 2);
    gltf.scene.position.set(-13, 0, 4);
    gltf.scene.rotation.set(0, 0, 0);

    mixer = new THREE.AnimationMixer(gltf.scene)
    const action = mixer.clipAction((gltf as any).animations[0]);
    action.play();

    gltf.scene.traverse((child: any) => {
      if (child.isMesh && child.material.map !== null) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material.map) {
          child.material.map.anisotropy = maxAnisotropy;
          child.material.map.encoding = THREE.sRGBEncoding;

        }
      }
    });
    scene.add(gltf.scene);
  })

  const picture1 = {
    picture: './textures/artworks/DSC09167.jpg',
    size: 3,
    x: -2.06,
    y: 1.5,
    z: 1.55,
    rotationX: 0,
    rotationY: 1.58,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture1));

  const picture2 = {
    picture: './textures/artworks/20230129-DSC09047.jpg',
    size: 3,
    x: -2.06,
    y: 1.5,
    z: 4.6,
    rotationX: 0,
    rotationY: 1.58,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture2));

  const picture3 = {
    picture: './textures/artworks/20230129-DSC09046-Pano.jpg',
    size: 2.7,
    x: -2.06,
    y: 1.5,
    z: 7.5,
    rotationX: 0,
    rotationY: 1.58,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture3));

  const picture4 = {
    picture: './textures/artworks/20200912-EL_05659.jpg',
    size: 3.1,
    x: -2.06,
    y: 1.5,
    z: 10.5,
    rotationX: 0,
    rotationY: 1.58,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture4));
  /* FIRST WALL - OUTSIDE */


  const picture5 = {
    picture: './textures/artworks/20230129-DSC08872.jpg',
    size: 3.1,
    x: 1.75,
    y: 1.5,
    z: 17.2,
    rotationX: 0,
    rotationY: 3.15,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture5));

  const picture6 = {
    picture: './textures/artworks/20230129-DSC08944.jpg',
    size: 1.5,
    x: -1.15,
    y: 1.5,
    z: 16.3,
    rotationX: 0,
    rotationY: 3.15,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture6));

  const picture7 = {
    picture: './textures/artworks/20230121-DSC08641.jpg',
    size: 3,
    x: 1.75,
    y: 1.5,
    z: -5.2,
    rotationX: 0,
    rotationY: 3.15,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture7));

  const picture8 = {
    picture: './textures/artworks/20221008-DSC00675-Edit.jpg',
    size: 1.5,
    x: -1.15,
    y: 1.5,
    z: -4.31,
    rotationX: 0,
    rotationY: 3.15,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture8));

  /* FIRST_AREA: EDGES */

  const picture9 = {
    picture: './textures/artworks/20220702-DSC09633-Pano.jpg',
    size: 1.5,
    x: -2.58,
    y: 1.5,
    z: 1.55,
    rotationX: 0,
    rotationY: 1.58,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture9));

  const picture10 = {
    picture: './textures/artworks/20221218-DSC01894.jpg',
    size: 3,
    x: -2.58,
    y: 1.5,
    z: 4.6,
    rotationX: 0,
    rotationY: 1.58,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture10));

  const picture11 = {
    picture: './textures/artworks/20220521-DSC08782.jpg',
    size: 3,
    x: -2.58,
    y: 1.5,
    z: 7.5,
    rotationX: 0,
    rotationY: 1.58,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture11));

  const picture12 = {
    picture: './textures/artworks/20220521-DSC08787-2.jpg',
    size: 1.5,
    x: -2.58,
    y: 1.5,
    z: 10.5,
    rotationX: 0,
    rotationY: 1.58,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture12));
  /* FIRST WALL - INSIDE */

  const picture13 = {
    picture: './textures/artworks/20211218-EL_07597.jpg',
    size: 3,
    x: -7.04,
    y: 1.5,
    z: 1.55,
    rotationX: 0,
    rotationY: 1.58,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture13));

  const picture14 = {
    picture: './textures/artworks/20211218-EL_07606.jpg',
    size: 3,
    x: -7.04,
    y: 1.5,
    z: 4.6,
    rotationX: 0,
    rotationY: 1.58,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture14));

  const picture15 = {
    picture: './textures/artworks/20221231-DSC02631.jpg',
    size: 3,
    x: -7.04,
    y: 1.5,
    z: 7.5,
    rotationX: 0,
    rotationY: 1.58,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture15));

  const picture16 = {
    picture: './textures/artworks/20221004-DSC00619.jpg',
    size: 3,
    x: -7.04,
    y: 1.5,
    z: 10.5,
    rotationX: 0,
    rotationY: 1.58,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture16));
  /* SECOND WALL - INSIDE */

  const picture17 = {
    picture: './textures/artworks/20200612-EL_04301-Pano.jpg',
    size: 4,
    x: -5,
    y: 1.5,
    z: -5.2,
    rotationX: 0,
    rotationY: 3.15,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture17));

  const picture19 = {
    picture: './textures/artworks/20200807-EL_04791.jpg',
    size: 1.6,
    x: -7.58,
    y: 1.5,
    z: 1.55,
    rotationX: 0,
    rotationY: 1.58,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture19));

  const picture20 = {
    picture: './textures/artworks/20200812-EL_05265.jpg',
    size: 3,
    x: -7.58,
    y: 1.5,
    z: 4.3,
    rotationX: 0,
    rotationY: 1.58,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture20));

  const picture21 = {
    picture: './textures/artworks/20180818-EL_03465.jpg',
    size: 3,
    x: -7.58,
    y: 1.5,
    z: 7.7,
    rotationX: 0,
    rotationY: 1.58,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture21));

  const picture22 = {
    picture: './textures/artworks/20180817-EL_02957.jpg',
    size: 2,
    x: -7.58,
    y: 1.5,
    z: 10.5,
    rotationX: 0,
    rotationY: 1.58,
    rotationZ: 0,
    thickness: 0.1,
    scene: scene,
  } as ArtworkFrameOptions;
  pictures.push(new ArtworkFrame(picture22));
  /* SECOND WALL - OUTSIDE */

  // expose Picture 1 to the console
  /* @ts-ignore */
  window.pictures = pictures;

  animate();
});


function teleportPlayerIfOob() {
  if (camera.position.y <= - 25) {
    playerCollider.start.set(0, 0.35, 0);
    playerCollider.end.set(0, 1, 0);
    playerCollider.radius = 0.35;
    camera.position.copy(playerCollider.end);
    camera.rotation.set(0, 0, 0);
  }
}

function animate() {
  const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME;
  // we look for collisions in substeps to mitigate the risk of
  // an object traversing another too quickly for detection.
  for (let i = 0; i < STEPS_PER_FRAME; i++) {
    controls(deltaTime);
    updatePlayer(deltaTime);
    teleportPlayerIfOob();
  }

  renderer.render(scene, camera);
  composer.render();
  stats.update();
  requestAnimationFrame(animate);
}