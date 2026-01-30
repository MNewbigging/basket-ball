import * as THREE from "three";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { Paddle } from "./paddle";
import { Ball } from "./ball";
import { Basket } from "./basket";

export interface GameKeys {
  arrowLeft: boolean;
  arrowRight: boolean;
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
}

export class Game {
  private renderer: THREE.WebGLRenderer;
  private camera = new THREE.PerspectiveCamera(90);
  private scene = new THREE.Scene();
  private clock = new THREE.Clock();

  private physicsWorld: CANNON.World;
  private physicsDebugger: {
    update: () => void;
  };

  private keys: GameKeys = {
    arrowLeft: false,
    arrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
  };

  private paddle: Paddle;

  private balls: Ball[] = [];
  private ballMaterial: CANNON.Material;

  private baskets: Basket[] = [];

  constructor() {
    // Setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.scene.background = new THREE.Color("#1680AF");
    this.camera.position.set(0, 1.5, 10);

    // Listeners
    window.addEventListener("resize", this.onCanvasResize);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);

    // Physics
    this.physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });

    const paddleMaterial = new CANNON.Material("paddle");
    // todo make multiple mats for different bounciness
    this.ballMaterial = new CANNON.Material("ball");
    const basketMaterial = new CANNON.Material("basket");

    const paddleBallContact = new CANNON.ContactMaterial(
      paddleMaterial,
      this.ballMaterial,
      {
        restitution: 0.8, // the bouncy factor
        friction: 0,
      },
    );
    this.physicsWorld.addContactMaterial(paddleBallContact);

    const basketBallContact = new CANNON.ContactMaterial(
      basketMaterial,
      this.ballMaterial,
      {
        restitution: 0.2,
        friction: 0.1,
      },
    );
    this.physicsWorld.addContactMaterial(basketBallContact);

    this.physicsDebugger = CannonDebugger(this.scene, this.physicsWorld, {
      color: 0xff0000,
    });

    // Paddle
    this.paddle = new Paddle(this.keys, paddleMaterial);
    this.physicsWorld.addBody(this.paddle.body);

    // Baskets
    const basket = new Basket();
    basket.body.position.set(10, 0, 0);
    this.physicsWorld.addBody(basket.body);
  }

  start() {
    document.body.appendChild(this.renderer.domElement);
    this.onCanvasResize();
    this.update();
  }

  update = () => {
    requestAnimationFrame(this.update);

    const dt = this.clock.getDelta();

    this.manageBalls();

    this.paddle.update(dt);

    this.physicsWorld.step(1 / 60, dt, 3);

    this.physicsDebugger.update();

    this.renderer.render(this.scene, this.camera);
  };

  private manageBalls() {
    // Spawn 1 at a time for now
    if (!this.balls.length) {
      const ball = new Ball(this.ballMaterial);
      ball.body.position.set(0, 10, 0);
      this.physicsWorld.addBody(ball.body);
      this.balls.push(ball);
      console.log("spawned blal");
    }

    // Remove if offscreen
    this.balls.forEach((ball, index) => {
      // I need the 3js part for this
    });
  }

  private onCanvasResize = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  };

  private onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        this.keys.arrowLeft = true;
        break;
      case "ArrowRight":
        this.keys.arrowRight = true;
        break;
      case "w":
        this.keys.w = true;
        break;
      case "a":
        this.keys.a = true;
        break;
      case "s":
        this.keys.s = true;
        break;
      case "d":
        this.keys.d = true;
        break;
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        this.keys.arrowLeft = false;
        break;
      case "ArrowRight":
        this.keys.arrowRight = false;
        break;
      case "w":
        this.keys.w = false;
        break;
      case "a":
        this.keys.a = false;
        break;
      case "s":
        this.keys.s = false;
        break;
      case "d":
        this.keys.d = false;
        break;
    }
  };
}

// Test if offscreen logic...
const sphere = new THREE.Sphere();

function isOnScreenSphere(mesh: THREE.Mesh, camera: THREE.Camera) {
  const geometry = mesh.geometry;
  if (!geometry.boundingSphere) {
    geometry.computeBoundingSphere();
  }

  sphere.copy(geometry.boundingSphere!).applyMatrix4(mesh.matrixWorld);

  const frustum = new THREE.Frustum().setFromProjectionMatrix(
    new THREE.Matrix4().multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse,
    ),
  );

  return frustum.intersectsSphere(sphere);
}
