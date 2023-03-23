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
declare class ArtworkFrame {
    mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
    geometry: THREE.BoxGeometry;
    constructor(props: ArtworkFrameOptions);
    setPosition(x: number, y: number, z: number): void;
    setRotation(x: number, y: number, z: number): void;
    setSize(size: number): void;
    getSize(): number;
    getPosition(): THREE.Vector3;
    getRotation(): THREE.Euler;
    increasePosition(x: number, y: number, z: number): THREE.Vector3;
}
export default ArtworkFrame;
//# sourceMappingURL=Artwork.d.ts.map