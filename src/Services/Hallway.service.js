// @flow
import * as THREE from "three";

let renderer;
let canvas;
let eventListener;

/**
 * Creates a Light sphere with the given color
 * @param {number} color - hex value of the light color
 */
const createLight = (color: number): THREE.PointLight => {
  const intensity = 1.5;

  // Set up point light
  const pointLight = new THREE.PointLight(color, intensity, 20);
  pointLight.castShadow = true;
  pointLight.shadow.camera.near = 1;
  pointLight.shadow.camera.far = 60;
  pointLight.shadow.bias = -0.005; // reduces self-shadowing on double-sided objects

  //Create sphere to represent the pointlight
  const lightSphereGeometry = new THREE.SphereBufferGeometry(0.3, 12, 6);
  const lightSpherematerial = new THREE.MeshBasicMaterial({ color: color });
  lightSpherematerial.color.multiplyScalar(intensity);
  const lightSphere = new THREE.Mesh(lightSphereGeometry, lightSpherematerial);
  pointLight.add(lightSphere);

  //Create sphere wrapper for pointlight
  const texture = new THREE.CanvasTexture(generateTexture());
  texture.magFilter = THREE.NearestFilter;
  texture.wrapT = THREE.RepeatWrapping;
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set(0.5, 3.5);
  const wrapperGeometry = new THREE.SphereBufferGeometry(2, 32, 8);
  const wrapperMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    alphaMap: texture,
    alphaTest: 0.5,
  });

  const sphere = new THREE.Mesh(wrapperGeometry, wrapperMaterial);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  pointLight.add(sphere);
  // custom distance material
  var distanceMaterial = new THREE.MeshDistanceMaterial({
    alphaMap: wrapperMaterial.alphaMap,
    alphaTest: wrapperMaterial.alphaTest,
  });
  sphere.customDistanceMaterial = distanceMaterial;
  return pointLight;
};

const generateTexture = () => {
  let c = document.createElement("canvas");
  c.width = 2;
  c.height = 2;
  var context = c.getContext("2d");
  context.fillStyle = "white";
  context.fillRect(0, 1, 2, 1);
  return c;
};

export function start(container: HTMLDivElement) {
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    1,
    1000
  );
  camera.position.set(0, 10, 40);
  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x111122));

  const pointLights: THREE.PointLight[] = [];
  [0xee6666, 0x333388].forEach(color => {
    const newLight = createLight(color);
    pointLights.push(newLight);
    scene.add(newLight);
  });

  var geometry = new THREE.BoxBufferGeometry(30, 30, 1000);
  var material = new THREE.MeshPhongMaterial({
    color: 0xa0adaf,
    shininess: 10,
    specular: 0x111111,
    side: THREE.BackSide,
  });
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 10;
  mesh.receiveShadow = true;
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  canvas = container.appendChild(renderer.domElement);

  eventListener = window.addEventListener("click", () => {
    const newLight = createLight(
      [0xee6666, 0x333388][Math.floor(Math.random() * 2)]
    );
    pointLights.push(newLight);
    scene.add(newLight);
  });
  window.addEventListener("mousemove", event => {
    camera.position.x = (1 - event.clientX / window.innerWidth) * 20 - 10;
    camera.position.y = (event.clientY / window.innerHeight) * 20;
    camera.lookAt(0, 10, -30);
  });

  animate(pointLights, scene, camera);
}

function animate(
  pointLights: THREE.PointLight[],
  scene: THREE.Scene,
  camera: THREE.Camera
) {
  requestAnimationFrame(() => animate(pointLights, scene, camera));
  render(pointLights, scene, camera);
}

function render(
  pointLights: THREE.PointLight[],
  scene: THREE.Scene,
  camera: THREE.Camera
) {
  let time = performance.now() * 0.001;
  pointLights.forEach(light => {
    light.position.x = Math.sin(time * 0.6) * 9;
    light.position.y = Math.sin(time * 0.7) * 9 + 8;
    light.position.z = light.position.z * 1.002 - 0.01;
    light.rotation.x = time;
    light.rotation.z = time;
    time += 100;
  });
  if (pointLights[0] && pointLights[0].position.z < -1000) {
    scene.remove(pointLights.shift());
  }
  renderer.render(scene, camera);
}

export function stop() {
  canvas.remove();
  window.removeEventListener("click", eventListener);
}
