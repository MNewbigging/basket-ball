import * as THREE from "three";

export class Game {
  private renderer: THREE.WebGLRenderer;
  private camera = new THREE.PerspectiveCamera();
  private scene = new THREE.Scene();

  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.scene.background = new THREE.Color("#1680AF");

    window.addEventListener("resize", this.onCanvasResize);
  }

  start() {
    document.body.appendChild(this.renderer.domElement);
    this.onCanvasResize();
    this.update();
  }

  update = () => {
    requestAnimationFrame(this.update);

    this.renderer.render(this.scene, this.camera);
  };

  private onCanvasResize = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  };
}
