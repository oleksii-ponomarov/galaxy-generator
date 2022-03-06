import * as THREE from "three";

import gui from "./base/gui";
import scene from "./base/scene";
import textureLoader from "./base/loader";

const starTexture = textureLoader.load("/textures/star.png");

const parameters = {
  count: 100000,
  size: 0.02,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  sharpness: 3,
  insideColor: "#88aaff",
  outsideColor: "#ffaa88",
};

let galaxyGeometry = null;
let galaxyMaterial = null;
let galaxy = null;

gui
  .add(parameters, "count")
  .min(10)
  .max(500000)
  .step(100)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "radius")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "branches")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(0.1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.01)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "sharpness")
  .min(1)
  .max(10)
  .step(0.01)
  .onFinishChange(generateGalaxy);
gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

function generateGalaxy() {
  if (galaxy !== null) {
    // Destroy old galaxy
    galaxyGeometry.dispose();
    galaxyMaterial.dispose();
    scene.remove(galaxy);
  }

  // Geometry
  galaxyGeometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    // Positions
    const radius = Math.random() * parameters.radius;
    const branch = i % parameters.branches;
    const branchAngle = (branch / parameters.branches) * 2 * Math.PI;
    const spinAngle = radius * parameters.spin;

    const randomX =
      Math.pow(Math.random(), parameters.sharpness) *
      parameters.randomness *
      (Math.random() < 0.5 ? -1 : 1);
    const randomY =
      Math.pow(Math.random(), parameters.sharpness) *
      parameters.randomness *
      (Math.random() < 0.5 ? -1 : 1);
    const randomZ =
      Math.pow(Math.random(), parameters.sharpness) *
      parameters.randomness *
      (Math.random() < 0.5 ? -1 : 1);

    positions[i3] = Math.sin(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.cos(branchAngle + spinAngle) * radius + randomZ;

    // Colors
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  galaxyGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  galaxyGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // Material
  galaxyMaterial = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    alphaMap: starTexture,
    transparent: true,
    vertexColors: true,
  });

  // Points
  galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
  scene.add(galaxy);
}

export default generateGalaxy;
