/** Player */
import * as THREE from 'three';

class Player {
  height: number = 100;
  mass: number = 75;
  speedMultiplier: number = 5;  
  camera: THREE.PerspectiveCamera;

  constructor(config: { height: number }) {
    this.height = config.height;
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
    this.camera.position.set(0, this.height, 0);
    return this;
  }

  getPlayer() {
    return this.camera;
  }

  getSpeedMultiplier() {
    return this.speedMultiplier;
  }

  getMass() {
    return this.mass;
  }

  getHeight() {
    return this.height;
  }

  resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }
}

export default Player;
