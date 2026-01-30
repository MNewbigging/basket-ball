import * as THREE from "three";
import * as CANNON from "cannon-es";

export class Ball {
  body: CANNON.Body;
  mesh: THREE.Mesh;

  private readonly radius = 0.2;

  constructor(material: CANNON.Material) {
    // Physics
    this.body = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(this.radius),
      position: new CANNON.Vec3(),
      material,
      linearDamping: 0,
      angularDamping: 0,
    });

    // Three mesh
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(this.radius),
      new THREE.MeshBasicMaterial({ color: "pink" }),
    );
  }

  updateMesh() {
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
  }
}
