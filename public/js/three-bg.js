import * as THREE from 'three';

const canvas = document.querySelector('#webgl-canvas');

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Objects
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;

const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    // Spread particles
    posArray[i] = (Math.random() - 0.5) * 15; // Range -7.5 to 7.5
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: '#00f260', // Matches accent color
    transparent: true,
    opacity: 0.8,
});

// Mesh
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Geometric Shapes floating
const geometryTorus = new THREE.TorusGeometry(3, 0.2, 16, 100);
const materialTorus = new THREE.MeshBasicMaterial({
    color: '#0575e6',
    wireframe: true,
    transparent: true,
    opacity: 0.1
});
const torus = new THREE.Mesh(geometryTorus, materialTorus);
scene.add(torus);

// Position Camera
camera.position.z = 3;

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;

function onDocumentMouseMove(event) {
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;
}

document.addEventListener('mousemove', onDocumentMouseMove);

// Animation Loop
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Rotate Space
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    torus.rotation.x = elapsedTime * 0.1;
    torus.rotation.y = elapsedTime * 0.15;

    // Mouse Parallax
    particlesMesh.rotation.y += mouseX * 0.0001;
    particlesMesh.rotation.x += mouseY * 0.0001;

    // Animate individual particles (wave effect)
    // Accessing positions needs to be performant, let's keep it simple for now

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();

// Resize Handler
window.addEventListener('resize', () => {
    // Update Camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update Renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
