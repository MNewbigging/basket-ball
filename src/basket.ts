import * as CANNON from "cannon-es";

export class Basket {
  body: CANNON.Body;

  private readonly width = 2;
  private readonly depth = 0.5;
  private readonly thickness = 0.14;
  private readonly sideHeight = 1;

  constructor() {
    this.body = new CANNON.Body({
      type: CANNON.BODY_TYPES.STATIC,
      mass: 0,
    });

    const bottom = new CANNON.Box(
      new CANNON.Vec3(this.width, this.thickness, this.depth),
    );

    const leftSide = new CANNON.Box(
      new CANNON.Vec3(this.thickness, this.sideHeight, this.depth),
    );

    const rightSide = new CANNON.Box(
      new CANNON.Vec3(this.thickness, this.sideHeight, this.depth),
    );

    this.body.addShape(bottom);

    this.body.addShape(
      leftSide,
      new CANNON.Vec3(-this.width, this.sideHeight - this.thickness, 0),
    );

    this.body.addShape(
      rightSide,
      new CANNON.Vec3(this.width, this.sideHeight - this.thickness, 0),
    );
  }
}
