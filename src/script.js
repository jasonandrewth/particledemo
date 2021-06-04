import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

const attributes = {
  count: 4000,
  distance: 2000,
};

/**
 * Mouse
 */
let mouseX = 0,
  mouseY = 0;

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.001);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Galaxy
 */
let geometry = null;
let material = null;
let galaxy = null;

const sprite = textureLoader.load("/textures/particles/5.png");

const generateStars = () => {
  //Destroy prev
  if (galaxy !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(galaxy);
  }

  geometry = new THREE.BufferGeometry();
  const vertices = [];

  for (let i = 0; i < attributes.count; i++) {
    const x = attributes.distance * Math.random() - 1000;
    const y = attributes.distance * Math.random() - 1000;
    const z = attributes.distance * Math.random() - 1000;

    vertices.push(x, y, z);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  material = new THREE.PointsMaterial({
    color: 0xa32cc4,
    size: 35,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: sprite,
    //   map: sprite,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    //   vertexColors: true,
  });

  galaxy = new THREE.Points(geometry, material);
  scene.add(galaxy);

  /**
   * Animate
   */
  const clock = new THREE.Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    //Rotate
    galaxy.rotation.x = elapsedTime / 16;

    // Render
    renderer.render(scene, camera);

    //mouse
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
  };

  tick();
};

gui
  .add(attributes, "count")
  .min(2000)
  .max(10000)
  .step(100)
  .onFinishChange(generateStars);

gui
  .add(attributes, "distance")
  .min(1500)
  .max(8000)
  .step(100)
  .onFinishChange(generateStars);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  55,
  sizes.width / sizes.height,
  2,
  2000
);
camera.position.z = 1000;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Mousemovement
 */
document.body.addEventListener("pointermove", onPointerMove);

function onPointerMove(event) {
  if (event.isPrimary === false) return;

  mouseX = event.clientX - sizes.width / 2;
  mouseY = event.clientY - sizes.height / 2;
}
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

generateStars();
