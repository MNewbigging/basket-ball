import * as THREE from "three";
import * as CANNON from "cannon-es";

export class Basket {
  body: CANNON.Body;
  mesh: THREE.Group;

  private readonly width = 1.8;
  private readonly depth = 0.5;
  private readonly thickness = 0.1;
  private readonly sideHeight = 0.6;

  private material = new THREE.MeshBasicMaterial({ color: "blue" });

  constructor() {
    // Create physics body
    this.body = new CANNON.Body({
      type: CANNON.BODY_TYPES.STATIC,
      mass: 0,
    });

    const bottom = new CANNON.Box(
      new CANNON.Vec3(this.width, this.thickness, this.depth),
    );
    this.body.addShape(bottom);

    const leftSide = new CANNON.Box(
      new CANNON.Vec3(this.thickness, this.sideHeight, this.depth),
    );
    this.body.addShape(
      leftSide,
      new CANNON.Vec3(-this.width, this.sideHeight - this.thickness, 0),
    );

    const rightSide = new CANNON.Box(
      new CANNON.Vec3(this.thickness, this.sideHeight, this.depth),
    );
    this.body.addShape(
      rightSide,
      new CANNON.Vec3(this.width, this.sideHeight - this.thickness, 0),
    );

    // Create three mesh
    this.mesh = new THREE.Group();

    const botMesh = new THREE.Mesh(
      new THREE.BoxGeometry(this.width * 2, this.thickness * 2, this.depth * 2),
      this.material,
    );
    this.mesh.add(botMesh);

    const leftSideMesh = new THREE.Mesh(
      new THREE.BoxGeometry(
        this.thickness * 2,
        this.sideHeight * 2,
        this.depth * 2,
      ),
      this.material,
    );
    this.mesh.add(leftSideMesh);
    leftSideMesh.position.set(-this.width, this.sideHeight - this.thickness, 0);

    const rightSideMesh = new THREE.Mesh(
      new THREE.BoxGeometry(
        this.thickness * 2,
        this.sideHeight * 2,
        this.depth * 2,
      ),
      this.material,
    );
    this.mesh.add(rightSideMesh);
    rightSideMesh.position.set(this.width, this.sideHeight - this.thickness, 0);
  }

  updateMesh() {
    this.mesh.position.copy(this.body.position);
  }
}
