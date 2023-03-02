/** Scene */
import * as THREE from 'three';

class Scene {
  scene: THREE.Scene;
  ref: {} | undefined;

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    this.scene.fog = new THREE.Fog(0xffffff, 0, 4000);
    
    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    this.scene.add(light);
  }

  getScene() {
    return this.scene;
  }

  add(object: THREE.Object3D) {
    this.scene.add(object);
  }

  remove(object: THREE.Object3D) {
    this.scene.remove(object);
  }

  bind() {
    this.ref = {};
  }
}

export default Scene;
