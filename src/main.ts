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

// Load Earth texture map
const textureLoader = new THREE.TextureLoader()
const earthTexture = textureLoader.load('../world.jpg')

// Sphere creation
const geometry = new THREE.SphereGeometry(5, 32, 32)
// Scale the Y-axis to create an oblate spheroid shape
// The Earth's polar radius is about 98.3% of its equatorial radius
geometry.scale(1, 0.983, 1)

const material = new THREE.MeshBasicMaterial({ map: earthTexture })
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

// Plane creation
const planeGeometry = new THREE.PlaneGeometry(12, 12, 32, 32)
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
camera.position.z = 20

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement)

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

function onMouseClick(event: MouseEvent) {
  // Calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera)

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObject(sphere)

  if (intersects.length > 0) {
    // Check if the intersection point is within your button area
    // This is where you define the logic to determine if the clicked area is a button
    // For example, checking the intersection point's coordinates
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
