/** Renderer */
import * as THREE from 'three';

class Renderer {
  height: number = 100;
  renderer: THREE.WebGLRenderer;

  constructor(width: number, height: number, pixelRatio: number) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height);
    return this;
  }

  getRenderer() {
    return this.renderer;
  }

  getHeight() {
    return this.height;
  }

  getDomElement() {
    return this.renderer.domElement;
  }

  resize(width: number, height: number) {
    this.renderer.setSize(width, height);
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer.render(scene, camera);
  }
}

export default Renderer;
