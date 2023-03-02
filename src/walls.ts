/** Walls */
import * as THREE from 'three';

class Walls {
  walls: THREE.Object3D[] = [];
  wallsMaterial: THREE.MeshBasicMaterial[] = [];
  wallsGeometry: THREE.PlaneGeometry[] = [];
  color: THREE.Color;
  constructor(depth: number, width: number, height: number) {
    this.color = new THREE.Color(0x444444);
    this.wallsMaterial.push(new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/general/bricks.jpg'), side: THREE.DoubleSide }));
    this.wallsMaterial.push(new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/general/bricks.jpg'), side: THREE.DoubleSide }));
    this.wallsMaterial.push(new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/general/bricks.jpg'), side: THREE.DoubleSide }));
    this.wallsMaterial.push(new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/general/bricks.jpg'), side: THREE.DoubleSide }));

    for (let i = 0; i < 4; i++) {
      const color = new THREE.Color(0x444444);
      let wall = new THREE.Mesh(new THREE.PlaneGeometry, new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/general/bricks.jpg') }));
      switch (i) {
        case 0:
          this.wallsGeometry.push(new THREE.PlaneGeometry(depth, height));
          this.wallsGeometry[i].setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
          wall = new THREE.Mesh(this.wallsGeometry[i], this.wallsMaterial[i]);
          wall.position.set(0, height / 2, -(width / 2));
          wall.rotation.y = Math.PI;
          break;
        case 1:
          this.wallsGeometry.push(new THREE.PlaneGeometry(width, height));
          this.wallsGeometry[i].setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
          wall = new THREE.Mesh(this.wallsGeometry[i], this.wallsMaterial[i]);
          wall.position.set(depth / 2, height / 2, 0);
          wall.rotation.y = Math.PI / 2;
          break;
        case 2:
          this.wallsGeometry.push(new THREE.PlaneGeometry(depth, height));
          this.wallsGeometry[i].setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
          wall = new THREE.Mesh(this.wallsGeometry[i], this.wallsMaterial[i]);
          wall.position.set(0, height / 2, width / 2);
          wall.rotation.y = Math.PI;
          break;
        case 3:
          this.wallsGeometry.push(new THREE.PlaneGeometry(width, height));
          this.wallsGeometry[i].setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
          wall = new THREE.Mesh(this.wallsGeometry[i], this.wallsMaterial[i]);
          wall.position.set(-(depth / 2), height / 2, 0);
          wall.rotation.y = Math.PI / 2;
      }
      const obj = new THREE.Object3D();
      obj.add(wall);
      this.walls.push(obj);
    }
    return this;
  }

  getWalls() {
    return this.walls;
  }

  getWallsMaterial() {
    return this.wallsMaterial;
  }

  getWallsGeometry() {
    return this.wallsGeometry;
  }

  getColor() {
    return this.color;
  }
}

export default Walls;
