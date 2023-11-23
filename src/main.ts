import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const SPHERE_RADIUS = 5
const SPHERE_WIDTH_SEGMENTS = 128
const SPHERE_HEIGHT_SEGMENTS = 128
const CAMERA_HEIGHT = 20

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const textureLoader = new THREE.TextureLoader()
const earthTexture = textureLoader.load('../world.jpg')
// const earthTexture = textureLoader.load('../world.svg', (texture) => {
//   texture.wrapS = THREE.ClampToEdgeWrapping;
//   texture.wrapT = THREE.ClampToEdgeWrapping;
//   texture.minFilter = THREE.LinearFilter;
//   texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
//   renderer.render(scene, camera);
// });

const geometry = new THREE.SphereGeometry(
  SPHERE_RADIUS,
  SPHERE_WIDTH_SEGMENTS,
  SPHERE_HEIGHT_SEGMENTS
)
geometry.scale(1, 0.983, 1) // Scale sphere into an oblate spheroid
const material = new THREE.MeshBasicMaterial({ map: earthTexture })
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

const planeGeometry = new THREE.PlaneGeometry(
  2 * SPHERE_RADIUS,
  2 * SPHERE_RADIUS,
  SPHERE_WIDTH_SEGMENTS,
  SPHERE_HEIGHT_SEGMENTS
)
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  wireframe: true,
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -Math.PI / 2
plane.receiveShadow = true
scene.add(plane)

scene.add(new THREE.AmbientLight(0xffffff, 0.5))
let directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.castShadow = true
directionalLight.position.set(2, 2, 2)
scene.add(directionalLight)

camera.position.z = CAMERA_HEIGHT
const controls = new OrbitControls(camera, renderer.domElement)
controls.minDistance = SPHERE_RADIUS + 1
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

function onMouseClick(event: MouseEvent) {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(sphere)
  if (intersects.length > 0) {
    console.log('Button on the sphere clicked')
  }
}
window.addEventListener('click', onMouseClick)

// Animation loop
function animate() {
  requestAnimationFrame(animate)
  // Required if controls.enableDamping or controls.autoRotate are set to true
  controls.update()
  renderer.render(scene, camera)
}

animate()
