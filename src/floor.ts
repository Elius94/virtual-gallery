/** Floor */
import * as THREE from 'three';

class Floor {
  floor: THREE.Mesh;
  floorMaterial: THREE.MeshBasicMaterial;
  floorGeometry: THREE.PlaneGeometry;
  color: THREE.Color;
  constructor(depth: number, width: number) {
    this.color = new THREE.Color(0x444444);
    this.floorMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/general/wood.jpg'), side: THREE.DoubleSide });
    this.floorGeometry = new THREE.PlaneGeometry(depth, width);
    this.floorGeometry.setAttribute('color', new THREE.Float32BufferAttribute(this.color, 3));

    this.floor = this.bind();
    return this;
  }

  getFloor() {
    return this.floor;
  }

  getFloorMaterial() {
    return this.floorMaterial;
  }

  getFloorGeometry() {
    return this.floorGeometry;
  }

  getColor() {
    return this.color;
  }

  bind() {
    const tmpFloor = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
    tmpFloor.position.set(0, 0, 0);
    tmpFloor.rotation.x = Math.PI / 2;

    return tmpFloor;
  }
}

export default Floor;
