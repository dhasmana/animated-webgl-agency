// LENIS
const lenis = new Lenis({ smooth: true })
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// SWIPER
new Swiper('.swiper', {
  loop: true,
  pagination: { el: '.swiper-pagination' }
})

// GSAP
gsap.registerPlugin(ScrollTrigger)

// THREE.JS
let scene, camera, renderer, mesh, sphere, clock
const mouse = new THREE.Vector2(0.5, 0.5)
const mouseTarget = new THREE.Vector2(0.5, 0.5)

window.addEventListener('mousemove', e => {
  mouseTarget.x = e.clientX / window.innerWidth
  mouseTarget.y = 1 - e.clientY / window.innerHeight
})

function initWebGL() {
  scene = new THREE.Scene()
  clock = new THREE.Clock()

  camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100)
  camera.position.z = 1

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('webgl'),
    alpha: true
  })

  renderer.setSize(innerWidth, innerHeight)

  const geometry = new THREE.PlaneGeometry(2, 2, 64, 64)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: mouse }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec2 uMouse;
      varying vec2 vUv;

      void main() {
        float dist = distance(vUv, uMouse);
        float ripple = sin(dist * 20.0 - uTime * 3.0);
        float color = 0.3 + ripple * 0.15;
        gl_FragColor = vec4(vec3(color), 1.0);
      }
    `
  })

  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  const sphereGeo = new THREE.SphereGeometry(0.25, 64, 64)
  const sphereMat = new THREE.MeshPhysicalMaterial({
    transmission: 1,
    roughness: 0,
    thickness: 1
  })

  sphere = new THREE.Mesh(sphereGeo, sphereMat)
  sphere.position.z = 0.4
  scene.add(sphere)

  scene.add(new THREE.AmbientLight(0xffffff, 0.6))

  animate()
}

function animate() {
  mouse.lerp(mouseTarget, 0.08)
  mesh.material.uniforms.uMouse.value.copy(mouse)
  mesh.material.uniforms.uTime.value = clock.getElapsedTime()

  sphere.rotation.y += 0.003
  sphere.position.x = (mouse.x - 0.5) * 0.3

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

initWebGL()
