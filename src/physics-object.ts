import * as THREE from "three";
import * as CANNON from "cannon-es";

export class PhysicsObject {
  constructor(
    public physicsBody: CANNON.Body,
    public renderComponent: THREE.Object3D,
  ) {}

  update() {
    this.renderComponent.position.copy(this.physicsBody.position);
    this.renderComponent.quaternion.copy(this.physicsBody.quaternion);
  }
}
