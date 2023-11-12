import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Basic scene setup
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Sphere creation
const geometry = new THREE.SphereGeometry(3, 32, 32)
const material = new THREE.MeshBasicMaterial({ color: 0x91bfff })
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

// Plane creation
const planeGeometry = new THREE.PlaneGeometry(10, 10, 32, 32)
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

// Camera position
camera.position.z = 10

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement)

// Animation loop
function animate() {
  requestAnimationFrame(animate)

  // Required if controls.enableDamping or controls.autoRotate are set to true
  controls.update()

  renderer.render(scene, camera)
}

animate()
