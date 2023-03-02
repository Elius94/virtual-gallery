/** Ceiling */
import * as THREE from 'three';

class Ceiling {
  ceiling: THREE.Mesh;
  ceilingMaterial: THREE.MeshBasicMaterial;
  ceilingGeometry: THREE.PlaneGeometry;
  color: THREE.Color;
  constructor(depth: number, width: number, height: number) {
    this.color = new THREE.Color(0x444444);
    this.ceilingMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/general/concrete.jpg'), side: THREE.DoubleSide });
    this.ceilingGeometry = new THREE.PlaneGeometry(depth, width);
    this.ceilingGeometry.setAttribute('color', new THREE.Float32BufferAttribute(this.color, 3));

    this.ceiling = this.bind(height);
    return this;
  }

  getCeiling() {
    return this.ceiling;
  }

  getCeilingMaterial() {
    return this.ceilingMaterial;
  }

  getCeilingGeometry() {
    return this.ceilingGeometry;
  }

  getColor() {
    return this.color;
  }

  bind(height: number) {
    const tmpCeiling = new THREE.Mesh(this.ceilingGeometry, this.ceilingMaterial);
    tmpCeiling.position.set(0, height, 0);
    tmpCeiling.rotation.x = Math.PI / 2;

    return tmpCeiling;
  }
}

export default Ceiling;
