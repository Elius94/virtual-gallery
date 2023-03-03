import * as THREE from 'three';

export interface ArtworkFrameOptions {
    picture: string;
    x: number;
    y: number;
    z: number;
    rotationX?: number;
    rotationY?: number;
    rotationZ?: number;
    size?: number;
    thickness?: number;
    scene?: THREE.Scene;
}

class ArtworkFrame {
    mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
    geometry: THREE.BoxGeometry;
    constructor(props: ArtworkFrameOptions) {
        const { picture, x, y, z, rotationX, rotationY, rotationZ, size, thickness, scene } = props;
        if (!picture) {
            throw new Error('Picture is required');
        }
        if (x === undefined || y === undefined || z === undefined) {
            throw new Error('x, y, and z coordinates are required');
        }
        this.mesh = new THREE.Mesh();
        this.geometry = new THREE.BoxGeometry();
        // Create a new texture from the picture
        new THREE.TextureLoader().loadAsync(picture).then((texture) => {
            // Create a material using the texture
            const material = new THREE.MeshBasicMaterial({ map: texture });

            // Calculate the aspect ratio of the texture
            const aspectRatio = texture.image.width / texture.image.height;

            const realSize = size || 200;
            const realWidth = realSize;
            const realHeight = realSize / aspectRatio;
            const realThickness = thickness || 0.1;

            // Create a box geometry for the artwork frame
            this.geometry = new THREE.BoxGeometry(realWidth, realHeight, realThickness);

            // Scale the geometry down slightly on the x and y axes
            this.geometry.scale(0.9, 0.9, 1);

            // Create a mesh from the geometry and material
            this.mesh = new THREE.Mesh(this.geometry, material);

            // Set the rotation of the mesh using the given coordinates
            this.mesh.rotation.set(rotationX || 0, rotationY || 0, rotationZ || 0);

            // Set the position of the mesh using the given coordinates
            this.mesh.position.set(x, y, z);

            // Add the mesh to the scene
            if (scene) {
                scene.add(this.mesh);
            }
        });
        return this;
    }

    setPosition(x: number, y: number, z: number) {
        this.mesh.position.set(x, y, z);
    }

    setRotation(x: number, y: number, z: number) {
        this.mesh.rotation.set(x, y, z);
    }

    setSize(size: number) {
        const aspectRatio = this.geometry.parameters.width / this.geometry.parameters.height;
        const realWidth = size;
        const realHeight = size / aspectRatio;
        this.geometry = new THREE.BoxGeometry(realWidth, realHeight, this.geometry.parameters.depth);
        this.geometry.scale(0.9, 0.9, 1);
        this.mesh.geometry = this.geometry;
    }

    getSize() {
        return this.geometry.parameters.width;
    }

    getPosition() {
        return this.mesh.position;
    }

    getRotation() {
        return this.mesh.rotation;
    }

    increasePosition(x: number, y: number, z: number) {
        this.mesh.position.x += x;
        this.mesh.position.y += y;
        this.mesh.position.z += z;
        return this.getPosition();
    }
}

export default ArtworkFrame;