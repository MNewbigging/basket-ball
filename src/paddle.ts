import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GameKeys } from "./game";

export class Paddle {
  body: CANNON.Body;

  private targetTilt = 0; // radians
  private readonly tiltSpeed = 5;
  private readonly tiltStiffness = 10;
  private readonly maxTilt = Math.PI / 3; // 60°
  private euler = new CANNON.Vec3();

  constructor(private keys: GameKeys) {
    // Create physics body
    this.body = new CANNON.Body({
      type: CANNON.Body.KINEMATIC,
      position: new CANNON.Vec3(),
      shape: new CANNON.Box(new CANNON.Vec3(1.5, 0.2, 0.5)),
    });
  }

  update(dt: number) {
    this.updateControls(dt);

    this.body.quaternion.toEuler(this.euler);
    const diff = this.targetTilt - this.euler.z;
    this.body.angularVelocity.set(0, 0, diff * this.tiltStiffness);
  }

  updateControls(dt: number) {
    // Tilt
    const tiltDirection =
      Number(this.keys.arrowLeft) - Number(this.keys.arrowRight);

    this.targetTilt += tiltDirection * this.tiltSpeed * dt;

    this.targetTilt = THREE.MathUtils.clamp(
      this.targetTilt,
      -this.maxTilt,
      this.maxTilt,
    );
  }
}
