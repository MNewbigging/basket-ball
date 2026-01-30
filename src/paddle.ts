import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GameKeys } from "./game";

export class Paddle {
  body: CANNON.Body;
  mesh: THREE.Mesh;

  private width = 3;
  private height = 0.4;
  private depth = 1;

  private targetTilt = 0; // radians
  private readonly tiltSpeed = 5;
  private readonly tiltStiffness = 10;
  private readonly maxTilt = Math.PI / 3; // 60°
  private euler = new CANNON.Vec3();

  private targetPos = new CANNON.Vec3();
  private readonly moveSpeed = 6;
  private readonly moveStiffness = 10;
  private readonly xMin = -5;
  private readonly xMax = 5;
  private readonly yMin = -7;
  private readonly yMax = 10;

  constructor(
    private keys: GameKeys,
    material: CANNON.Material,
  ) {
    // Create physics body
    this.body = new CANNON.Body({
      type: CANNON.Body.KINEMATIC,
      position: new CANNON.Vec3(),
      shape: new CANNON.Box(
        new CANNON.Vec3(this.width / 2, this.height / 2, this.depth / 2),
      ),
      material,
    });

    // Create threejs mesh
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(this.width, this.height, this.depth),
      new THREE.MeshBasicMaterial({ color: "green" }),
    );
  }

  update(dt: number) {
    const { arrowLeft, arrowRight, w, a, s, d } = this.keys;

    // Tilt
    const tiltDirection = Number(arrowLeft) - Number(arrowRight);
    this.targetTilt += tiltDirection * this.tiltSpeed * dt;
    this.targetTilt = THREE.MathUtils.clamp(
      this.targetTilt,
      -this.maxTilt,
      this.maxTilt,
    );

    // Position
    const yDir = Number(w) - Number(s);
    const xDir = Number(d) - Number(a);

    this.targetPos.y += yDir * this.moveSpeed * dt;
    this.targetPos.y = THREE.MathUtils.clamp(
      this.targetPos.y,
      this.yMin,
      this.yMax,
    );

    this.targetPos.x += xDir * this.moveSpeed * dt;
    this.targetPos.x = THREE.MathUtils.clamp(
      this.targetPos.x,
      this.xMin,
      this.xMax,
    );

    // todo ensure doesn't go outwith movement bounds

    // Update physics to head towards new targets

    // Tilt
    this.body.quaternion.toEuler(this.euler);
    const tiltDiff = this.targetTilt - this.euler.z;
    this.body.angularVelocity.set(0, 0, tiltDiff * this.tiltStiffness);

    // Position
    const posDiff = this.targetPos.vsub(this.body.position);
    this.body.velocity.set(
      posDiff.x * this.moveStiffness,
      posDiff.y * this.moveStiffness,
      0,
    );

    // Update mesh
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);
  }
}
