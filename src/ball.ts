import * as CANNON from "cannon-es";

export class Ball {
  body: CANNON.Body;

  constructor(material: CANNON.Material) {
    this.body = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(0.2),
      position: new CANNON.Vec3(),
      material,
      linearDamping: 0,
      angularDamping: 0,
    });
  }
}
