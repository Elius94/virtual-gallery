import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';

import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

import { Octree } from 'three/examples/jsm/math/Octree.js';
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper.js';

import { Capsule } from 'three/examples/jsm/math/Capsule.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { TAARenderPass } from "three/examples/jsm/postprocessing/TAARenderPass.js";

import { GUI } from './lil-gui.module.min.js';
//import ArtworkFrame, { ArtworkFrameOptions } from './Artwork.js';

import "./app.css"
import "./touch-pad.css"
import TouchControls from './touch-controller/TouchControls.js';
import ArtworkFrame, { ArtworkFrameOptions } from './Artwork.js';

// Check if we are running in a mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const TUNING = true;

let textureQuality = isMobile ? "LD" : "HD";
// check if in the url there is "debug" parameter
let debug = window.location.search.indexOf('debug') !== -1;
let aa_sl = 1;
let aa_unbiased = false;
let stats: any = null;
let selectedShader = GammaCorrectionShader
let selectedToneMapping = "ACESFilmicToneMapping";
let toneMappingExp = 0.85;
let toneMappingMethods = {
  sRGBEncoding: THREE.sRGBEncoding,
  LinearToneMapping: THREE.LinearToneMapping,
  ReinhardToneMapping: THREE.ReinhardToneMapping,
  CineonToneMapping: THREE.CineonToneMapping,
  ACESFilmicToneMapping: THREE.ACESFilmicToneMapping,
  CustomToneMapping: THREE.CustomToneMapping,
}

const artworks = [
  {
    name: "Opere d'arte 1",
    description: "Descrizione dell'opera 1",
    position: { x: 2.1649999999999983, y: 4.97000000000001, z: 11.944999999999922 },
    rotation: { x: 6.2849999999999016, y: 3.1400000000000365, z: 81.67999999999611 },
    size: 1.69, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/000031-2.jpg"
  },
  {
    name: "Opere d'arte 2",
    description: "Descrizione dell'opera 2",
    position: { x: 0.6150000000000004, y: 4.97000000000001, z: 11.944999999999922 },
    rotation: { x: 6.2849999999999016, y: 3.1400000000000365, z: 81.67999999999611 },
    size: 1.69, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC09646.jpg"
  },
  {
    name: "Opere d'arte 3",
    description: "Descrizione dell'opera 3",
    position: { x: -0.9350000000000006, y: 4.97000000000001, z: 11.944999999999922 },
    rotation: { x: 6.2849999999999016, y: 3.1400000000000365, z: 81.67999999999611 },
    size: 1.69, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC00675-Edit.jpg"
  },
  {
    name: "Opere d'arte 4",
    description: "Descrizione dell'opera 4",
    position: { x: -7.284999999999908, y: 1.7700000000000518, z: 11.944999999999922 },
    rotation: { x: 6.2849999999999016, y: 3.1400000000000365, z: 81.67999999999611 },
    size: 1.69, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC08787.jpg"
  },
  {
    name: "Opere d'arte 5",
    description: "Descrizione dell'opera 5",
    position: { x: 5, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DJI_0711-3-Pano.jpg"
  },
  {
    name: "Opere d'arte 6",
    description: "Descrizione dell'opera 6",
    position: { x: 6, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DJI_0713.jpg"
  },
  {
    name: "Opere d'arte 7",
    description: "Descrizione dell'opera 7",
    position: { x: 7, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC00184.jpg"
  },
  {
    name: "Opere d'arte 8",
    description: "Descrizione dell'opera 8",
    position: { x: 8, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC00256-2.jpg"
  },
  {
    name: "Opere d'arte 9",
    description: "Descrizione dell'opera 9",
    position: { x: 9, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC00310.jpg"
  },
  {
    name: "Opere d'arte 10",
    description: "Descrizione dell'opera 10",
    position: { x: 10, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC00402.jpg"
  },
  {
    name: "Opere d'arte 11",
    description: "Descrizione dell'opera 11",
    position: { x: 11, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC00410.jpg"
  },
  {
    name: "Opere d'arte 12",
    description: "Descrizione dell'opera 12",
    position: { x: 12, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC00556.jpg"
  },
  {
    name: "Opere d'arte 13",
    description: "Descrizione dell'opera 13",
    position: { x: 13, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC00619.jpg"
  },
  {
    name: "Opere d'arte 14",
    description: "Descrizione dell'opera 14",
    position: { x: 14, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC00675-Edit.jpg"
  },
  {
    name: "Opere d'arte 15",
    description: "Descrizione dell'opera 15",
    position: { x: 15, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC01045.jpg"
  },
  {
    name: "Opere d'arte 16",
    description: "Descrizione dell'opera 16",
    position: { x: 16, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC01508.jpg"
  },
  {
    name: "Opere d'arte 17",
    description: "Descrizione dell'opera 17",
    position: { x: 17, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC01600-Enhanced.jpg"
  },
  {
    name: "Opere d'arte 18",
    description: "Descrizione dell'opera 18",
    position: { x: -8.739999999999778, y: 1.500000000000002, z: 3.6950000000000425 },
    rotation: { x: -8.109999999999971, y: 1.5699999999999934, z: 89.79499999999987 },
    size: 2.51, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC01894-2.jpg"
  },
  {
    name: "Opere d'arte 19",
    description: "Descrizione dell'opera 19",
    position: { x: -8.739999999999778, y: 1.500000000000002, z: 0.06499999999989829 },
    rotation: { x: -8.109999999999971, y: 1.5699999999999934, z: 89.79499999999987 },
    size: 2.51, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC02631.jpg"
  },
  {
    name: "Opere d'arte 20",
    description: "Descrizione dell'opera 20",
    position: { x: 9.134999999999804, y: 4.699999999999943, z: -1.815000000000004 },
    rotation: {
      x: -0.014999999999999925,
      y: -1.569999999999999,
      z: 87.94999999999895
    },
    size: 1.674, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC02687.jpg"
  },
  {
    name: "Opere d'arte 21",
    description: "Descrizione dell'opera 21",
    position: { x: -7.284999999999908, y: 1.7700000000000518, z: -11.95499999999987 },
    rotation: { x: 6.2849999999999016, y: 3.1400000000000365, z: 81.67999999999611 },
    size: 1.69, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC07915.jpg"
  },
  {
    name: "Opere d'arte 22",
    description: "Descrizione dell'opera 22",
    position: { x: 22, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC07940.jpg"
  },
  {
    name: "Opere d'arte 23",
    description: "Descrizione dell'opera 23",
    position: { x: 23, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC08093.jpg"
  },
  {
    name: "Opere d'arte 24",
    description: "Descrizione dell'opera 24",
    position: { x: 24, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC08479.jpg"
  },
  {
    name: "Opere d'arte 25",
    description: "Descrizione dell'opera 25",
    position: { x: 25, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC08641.jpg"
  },
  {
    name: "Opere d'arte 26",
    description: "Descrizione dell'opera 26",
    position: { x: 26, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC08688.jpg"
  },
  {
    name: "Opere d'arte 27",
    description: "Descrizione dell'opera 27",
    position: { x: -8.739999999999778, y: 1.500000000000002, z: -3.555000000000115 },
    rotation: { x: -8.109999999999971, y: 1.5699999999999934, z: 89.79499999999987 },
    size: 2.51, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC08782.jpg"
  },
  {
    name: "Opere d'arte 28",
    description: "Descrizione dell'opera 28",
    position: { x: 28, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC08787.jpg"
  },
  {
    name: "Opere d'arte 29",
    description: "Descrizione dell'opera 29",
    position: { x: 29, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC08872.jpg"
  },
  {
    name: "Opere d'arte 30",
    description: "Descrizione dell'opera 30",
    position: { x: 30, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC09047.jpg"
  },
  {
    name: "Opere d'arte 31",
    description: "Descrizione dell'opera 31",
    position: { x: 31, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC09077.jpg"
  },
  {
    name: "Opere d'arte 32",
    description: "Descrizione dell'opera 32",
    position: { x: 32, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC09167.jpg"
  },
  {
    name: "Opere d'arte 33",
    description: "Descrizione dell'opera 33",
    position: { x: -8.739999999999778, y: 1.500000000000002, z: -7.185000000000078 },
    rotation: { x: -8.109999999999971, y: 1.5699999999999934, z: 89.79499999999987 },
    size: 2.51, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC09594.jpg"
  },
  {
    name: "Opere d'arte 34",
    description: "Descrizione dell'opera 34",
    position: { x: 34, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/DSC09646.jpg"
  },
  {
    name: "Opere d'arte 35",
    description: "Descrizione dell'opera 35",
    position: { x: 35, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_00469-2.jpg"
  },
  {
    name: "Opere d'arte 36",
    description: "Descrizione dell'opera 36",
    position: { x: 36, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_00494.jpg"
  },
  {
    name: "Opere d'arte 37",
    description: "Descrizione dell'opera 37",
    position: { x: 9.134999999999804, y: 4.699999999999943, z: 1.8099999999998895 },
    rotation: {
      x: -0.014999999999999925,
      y: -1.569999999999999,
      z: 87.94999999999895
    },
    size: 1.674, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_02957.jpg"
  },
  {
    name: "Opere d'arte 38",
    description: "Descrizione dell'opera 38",
    position: { x: 38, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_03043.jpg"
  },
  {
    name: "Opere d'arte 39",
    description: "Descrizione dell'opera 39",
    position: { x: 39, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_03049.jpg"
  },
  {
    name: "Opere d'arte 40",
    description: "Descrizione dell'opera 40",
    position: { x: 40, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_03465.jpg"
  },
  {
    name: "Opere d'arte 41",
    description: "Descrizione dell'opera 41",
    position: { x: 41, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_04298.jpg"
  },
  {
    name: "Opere d'arte 42",
    description: "Descrizione dell'opera 42",
    position: { x: 0.5650000000000241, y: 4.970000000000005, z: -11.939999999999905 },
    rotation: { x: 6.2849999999999016, y: 3.145000000000036, z: 81.67999999999611 },
    size: 11.09, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_04301-Pano-2.jpg"
  },
  {
    name: "Opere d'arte 43",
    description: "Descrizione dell'opera 43",
    position: { x: 9.134999999999804, y: 4.699999999999943, z: 9.059999999999846 },
    rotation: {
      x: -0.014999999999999925,
      y: -1.569999999999999,
      z: 87.94999999999895
    },
    size: 1.674, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_04791.jpg"
  },
  {
    name: "Opere d'arte 44",
    description: "Descrizione dell'opera 44",
    position: { x: 9.134999999999804, y: 4.699999999999943, z: -9.06999999999984 },
    rotation: {
      x: -0.014999999999999925,
      y: -1.569999999999999,
      z: 87.94999999999895
    },
    size: 1.674, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_05089.jpg"
  },
  {
    name: "Opere d'arte 45",
    description: "Descrizione dell'opera 45",
    position: { x: 9.134999999999804, y: 4.699999999999943, z: 5.434999999999932 },
    rotation: {
      x: -0.014999999999999925,
      y: -1.569999999999999,
      z: 87.94999999999895
    },
    size: 1.674, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_05106.jpg"
  },
  {
    name: "Opere d'arte 46",
    description: "Descrizione dell'opera 46",
    position: { x: 46, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_05265.jpg"
  },
  {
    name: "Opere d'arte 47",
    description: "Descrizione dell'opera 47",
    position: { x: 47, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_05356.jpg"
  },
  {
    name: "Opere d'arte 48",
    description: "Descrizione dell'opera 48",
    position: { x: 48, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_05713.jpg"
  },
  {
    name: "Opere d'arte 49",
    description: "Descrizione dell'opera 49",
    position: { x: -8.739999999999778, y: 1.500000000000002, z: 7.3249999999999655 },
    rotation: { x: -8.109999999999971, y: 1.5699999999999934, z: 89.79499999999987 },
    size: 2.51, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_06140.jpg"
  },
  {
    name: "Opere d'arte 50",
    description: "Descrizione dell'opera 50",
    position: { x: 50, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_07048.jpg"
  },
  {
    name: "Opere d'arte 51",
    description: "Descrizione dell'opera 51",
    position: { x: 9.134999999999804, y: 4.699999999999943, z: -5.4449999999999354 },
    rotation: {
      x: -0.014999999999999925,
      y: -1.569999999999999,
      z: 87.94999999999895
    },
    size: 1.674, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_07235-Modifica-2.jpg"
  },
  {
    name: "Opere d'arte 52",
    description: "Descrizione dell'opera 52",
    position: { x: 52, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_07597.jpg"
  },
  {
    name: "Opere d'arte 53",
    description: "Descrizione dell'opera 53",
    position: { x: 53, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_07606.jpg"
  },
  {
    name: "Opere d'arte 54",
    description: "Descrizione dell'opera 54",
    position: { x: 54, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_07845-HDR.jpg"
  },
  {
    name: "Opere d'arte 55",
    description: "Descrizione dell'opera 55",
    position: { x: 55, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 90 },
    size: 1.2, // Numero di scala per l'opera 1
    url: "./textures/artworks/SD/EL_09782.jpg"
  },
]

let selectedArtwork = 0;

/* @ts-ignore */
window.pictures = [];

// Check if quality argument is passed in the url and set the texture quality accordingly
const args = new URLSearchParams(location.search);
if (args.has('quality')) {
  textureQuality = args.get('quality') || "HD";
}

const txtLoader = new THREE.TextureLoader();
const clock = new THREE.Clock();
const scene = new THREE.Scene();

//scene.background = new THREE.Color(0x88ccee);
// Put a picture in the background
//const texture = txtLoader.load('./textures/general/DSC02177-Modifica.jpg');
// Add spotlights to the scene
const spotLights = [
  new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2, 0.5),
];

spotLights[0].position.set(10, 10, 0);
spotLights[0].target.position.set(0, 0, 0);
spotLights[0].castShadow = true;

scene.add(spotLights[0]);

const texture = txtLoader.load(
  `./textures/general/${textureQuality}/PANO0001_pano.jpg`,
  () => {
    const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
    rt.fromEquirectangularTexture(renderer, texture);
    scene.background = rt.texture;
  });

scene.fog = new THREE.Fog(0x88ccee, 0, 170);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.rotation.order = 'YXZ';

const fillLight1 = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.2);
fillLight1.position.set(2, 1, 1);
scene.add(fillLight1);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(- 5, 20, - 1);
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

const container = document.getElementById('container-renderer') as HTMLElement;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
//renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.toneMapping = THREE.LinearToneMapping;
// renderer.toneMapping = THREE.ReinhardToneMapping;
// renderer.toneMapping = THREE.CineonToneMapping;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMapping = THREE.CustomToneMapping;

/* @ts-ignore */
renderer.toneMapping = toneMappingMethods[selectedToneMapping];
renderer.toneMappingExposure = toneMappingExp;
//renderer.gammaFactor = 2.0;
container.appendChild(renderer.domElement);

const target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  format: THREE.RGBAFormat,
  encoding: THREE.sRGBEncoding,
  //type: THREE.FloatType,
  anisotropy: renderer.capabilities.getMaxAnisotropy()
});

const composer = new EffectComposer(renderer, target);

const taaRenderPass = new TAARenderPass(scene, camera, 0xffffff, 1);
taaRenderPass.unbiased = aa_unbiased;
taaRenderPass.sampleLevel = aa_sl;
composer.addPass(taaRenderPass); // default

const rp = new RenderPass(scene, camera);
rp.enabled = false;
composer.addPass(rp);
composer.addPass(new ShaderPass(selectedShader));

composer.setPixelRatio(window.devicePixelRatio);
composer.setSize(window.innerWidth, window.innerHeight)


const GRAVITY = 30;

const STEPS_PER_FRAME = 5;

const worldOctree = new Octree();

const playerCollider = new Capsule(new THREE.Vector3(0, 0.1, 0), new THREE.Vector3(0, 1, 0), 0.35);

const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();

let playerOnFloor = false;
//let mouseTime = 0;

const keyStates = {} as { [key: string]: boolean };
let ctrlKey = false;
let shiftKey = false;

if (!isMobile) {
  document.addEventListener('keydown', (event) => {
    keyStates[event.code] = true;
    ctrlKey = event.ctrlKey;
    shiftKey = event.shiftKey;
  });

  document.addEventListener('keyup', (event) => {
    keyStates[event.code] = false;
    ctrlKey = event.ctrlKey;
    shiftKey = event.shiftKey;
  });

  container.addEventListener('mousedown', () => {
    //console.log('requestPointerLock')
    document.body.requestPointerLock();
  });

  document.body.addEventListener('mousemove', (event) => {
    if (document.pointerLockElement === document.body) {
      camera.rotation.y -= event.movementX / 500;
      camera.rotation.x -= event.movementY / 500;
    }
  });
}

const progress = document.querySelector('#loader-box') as HTMLElement;

function setLoaderPercentage(percentage: number) {
  const loader = document.querySelector('.loader') as HTMLElement;
  const loaderWidth = percentage / 100 * window.innerWidth * 0.9; // 90% of window width
  loader.style.width = `${loaderWidth}px`;
}

const welcomeTexts = [
  { text: 'Hi!', delay: 1000, size: "30vw" },
  { text: 'Welcome to my', delay: 1000, size: "12vw" },
  { text: 'Virtual Gallery', delay: 1500, size: "10vw" },
  { text: 'Enjoy your visit =)', delay: 1000, size: "8vw" },
];

function setWelcomeText(text: string, size: string) {
  const welcomeText = document.querySelector('#welcomeText') as HTMLElement;
  welcomeText.innerText = text;
  welcomeText.style.fontSize = size;
}

function startWelcomeTextCarosel(index: number) {
  setTimeout(() => {
    setWelcomeText(welcomeTexts[index].text, welcomeTexts[index].size);
    index++;
    if (index < welcomeTexts.length) {
      startWelcomeTextCarosel(index++);
    }
  }, welcomeTexts[index].delay);
}

const blocker = document.getElementById('blocker') as HTMLElement;
const instructions = document.getElementById('instructions') as HTMLElement;

if (!isMobile) {
  instructions.addEventListener('click', function () {
    hideInstructions();
    document.body.requestPointerLock();
  });
}

function hideInstructions() {
  blocker.classList.add('hidden-05');
  /*instructions.style.display = 'none';
  blocker.style.display = 'none';*/
}

function showInstructions() {
  blocker.classList.remove('hidden-05');
  /*instructions.style.display = 'block';
  blocker.style.display = 'block';*/
}

if (!isMobile) {
  document.addEventListener("pointerlockchange", () => {
    if (document.pointerLockElement !== document.body) {
      showInstructions();
    } else {
      hideInstructions();
    }
  });
}

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

  if (TUNING) {
    const precision = shiftKey ? 0.1 : 1;
    const multiplier = 0.01 * precision;
    if (keyStates['PageUp']) {
      /* @ts-ignore */
      window.pictures[selectedArtwork].increasePosition(0, multiplier, 0);
    }
    if (keyStates['PageDown']) {
      /* @ts-ignore */
      window.pictures[selectedArtwork].increasePosition(0, -multiplier, 0);
    }
    if (keyStates['ArrowLeft']) {
      /* @ts-ignore */
      window.pictures[selectedArtwork].increasePosition(-multiplier, 0, 0);
    }
    if (keyStates['ArrowRight']) {
      /* @ts-ignore */
      window.pictures[selectedArtwork].increasePosition(multiplier, 0, 0);
    }
    if (keyStates['ArrowUp']) {
      /* @ts-ignore */
      window.pictures[selectedArtwork].increasePosition(0, 0, -multiplier);
    }
    if (keyStates['ArrowDown']) {
      /* @ts-ignore */
      window.pictures[selectedArtwork].increasePosition(0, 0, multiplier);
    }
    const v = ctrlKey ? multiplier : -multiplier;
    if (keyStates['KeyZ']) {
      /* @ts-ignore */
      window.pictures[selectedArtwork].increaseRotation(0, v, 0);
    }
    if (keyStates['KeyX']) {
      /* @ts-ignore */
      window.pictures[selectedArtwork].increaseRotation(v, 0, 0);
    }
    if (keyStates['KeyY']) {
      /* @ts-ignore */
      window.pictures[selectedArtwork].increaseRotation(0, 0, v);
    }
    if (keyStates['NumpadAdd']) {
      /* @ts-ignore */
      window.pictures[selectedArtwork].increaseSize(multiplier);
    }
    if (keyStates['NumpadSubtract']) {
      /* @ts-ignore */
      window.pictures[selectedArtwork].increaseSize(-multiplier);
    }

    // Print the current position, rotation and size of the selected artwork
    if (keyStates['KeyP']) {
      /* @ts-ignore */
      console.log(window.pictures[selectedArtwork].getPosition());
      /* @ts-ignore */
      console.log(window.pictures[selectedArtwork].getRotation());
      /* @ts-ignore */
      console.log(window.pictures[selectedArtwork].getSize());
    }
  }
}

if (isMobile) {
  const padElement = document.getElementById('container3d') as HTMLDivElement
  new TouchControls(padElement) as any

  padElement.addEventListener('YawPitch', (event: any) => {
    //console.log(event)
    camera.rotation.x -= event.detail.deltaY / 200;
    camera.rotation.y -= event.detail.deltaX / 200;
  })

  padElement.addEventListener('move', (event: any) => {
    //console.log(event.detail.deltaY)
    const x = -(event.detail.deltaX)
    const y = event.detail.deltaY

    const speedDelta = 0.01 * (playerOnFloor ? 12 : 4);
    playerVelocity.add(getForwardVector().multiplyScalar(y * speedDelta));
    playerVelocity.add(getSideVector().multiplyScalar(x * speedDelta));
  })
}

// Instantiate a loader
let mixers: THREE.AnimationMixer[] = [];
const manager = new THREE.LoadingManager();

manager.onLoad = function () {
  console.log('Loading complete!');
  progress.classList.add('hidden');
  if (!isMobile) {
    showInstructions();
  }
  animate();
};

manager.onError = function (url) {
  console.log('There was an error loading ' + url);
};

manager.onProgress = function (_url, itemsLoaded, itemsTotal) {
  //console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
  const percentage = itemsLoaded / itemsTotal * 100;
  setLoaderPercentage(percentage);
};

const loader = new GLTFLoader(manager).setPath(`./models/gltf/${textureQuality}/`);
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('./loader/');
loader.setDRACOLoader(dracoLoader);

/*function loadModel(url: string) {
  return new Promise((resolve, reject) => {
    loader.load(url, (gltf) => {
      resolve(gltf)
    }, undefined, (error) => {
      reject(error)
    })
  })
}*/

startWelcomeTextCarosel(0);

// load a room model
// Room model 1
//loader.load('vr_art_gallery_-_el1.glb', (gltf: GLTF) => {
loader.load('Virtual Gallery.gltf', (gltf: GLTF) => {
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  //gltf.scene.scale.set(0.05, 0.05, 0.05);
  scene.add(gltf.scene);
  worldOctree.fromGraphNode(gltf.scene);

  gltf.scene.traverse((child: any) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material.map) {
        child.material.map.anisotropy = maxAnisotropy;
      }
    }
  });

  const helper = new OctreeHelper(worldOctree, 0x00ff00);
  helper.visible = false;
  scene.add(helper);

  /* @ts-ignore */
  const gui = new GUI({ width: 200 }) as any;
  gui.add({ debug: debug }, 'debug')
    .onChange(function (value: boolean) {
      helper.visible = value;
      debug = value;
      if (value) {
        stats = new (Stats as any)();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        container.appendChild(stats.domElement);
      } else {
        container.removeChild(stats.domElement);
      }
    });
  gui.add({ "Antialiasing Level": aa_sl }, 'Antialiasing Level', [1, 2, 3, 4])
    .onChange(function (value: number) {
      aa_sl = value;
      taaRenderPass.sampleLevel = aa_sl;
    });

  if (TUNING) {
    gui.add({ "Antialiasing unbiased": aa_unbiased }, 'Antialiasing unbiased')
      .onChange(function (value: boolean) {
        aa_unbiased = value;
        taaRenderPass.unbiased = aa_unbiased;
      });
  }

  gui.add({ quality: textureQuality }, 'quality', ['LD', 'SD', 'MD', 'HD'])
    .onChange(function (value: string) {
      textureQuality = value;
      location.replace(`?quality=${value}`)
    });

  if (TUNING) {
    gui.add({ "Tone Mapping": selectedToneMapping }, 'Tone Mapping', Object.keys(toneMappingMethods))
      .onChange(function (value: string) {
        selectedToneMapping = value;
        /* @ts-ignore */
        renderer.toneMapping = toneMappingMethods[selectedToneMapping];
      });

    gui.add({ "Tone Mapping Exposure": toneMappingExp }, 'Tone Mapping Exposure')
      .onChange(function (value: number) {
        toneMappingExp = value;
        renderer.toneMappingExposure = toneMappingExp;
      });
    // Organizzazione mostra!!!
    gui.add({ "Selected Artwork": selectedArtwork }, 'Selected Artwork', artworks.map((_a, i) => i))
      .onChange(function (value: number) {
        selectedArtwork = value;
      });
  }
  // Add plants to the scene
  /*const plant3 = './additional_models/rigged_indoor-plant_animation_test.glb'


  loadModel(plant3).then((gltf: any) => {
    //for (let i = 0; i < 2; i++) {
      gltf.scene.scale.set(2, 2, 2);
      gltf.scene.position.set(3, 0, 4);
      gltf.scene.rotation.set(0, 0, 0);

      mixers.push(new THREE.AnimationMixer(gltf.scene))
      const mixer = mixers[0];
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
      worldOctree.fromGraphNode(gltf.scene);
    //}
  })*/
  /*loadModel(plant3).then((gltf: any) => {
    gltf.scene.scale.set(2, 2, 2);
    gltf.scene.position.set(-13, 0, 4);
    gltf.scene.rotation.set(0, 0, 0);

    mixers.push(new THREE.AnimationMixer(gltf.scene))
    const mixer = mixers[mixers.length - 1];
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
  })*/

  for (var i = 0; i < artworks.length; i++) {
    const picture = {
      picture: artworks[i].url,
      size: artworks[i].size,
      x: artworks[i].position.x,
      y: artworks[i].position.y,
      z: artworks[i].position.z,
      rotationX: artworks[i].rotation.x,
      rotationY: artworks[i].rotation.y,
      rotationZ: artworks[i].rotation.z,
      thickness: 0.01,
      scene: scene,
    } as ArtworkFrameOptions;
    const p = new ArtworkFrame(picture);
    /* @ts-ignore */
    window.pictures.push(p)
  }
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
  if (debug) stats.update();
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  mixers.forEach(mixer => mixer.update(delta))
}