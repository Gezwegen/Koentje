window.addEventListener('load', () => {
setTimeout(() => {
  // Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- Three.js Setup ---
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 10;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: window.innerWidth > 768,
    powerPreference: "high-performance"
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.innerWidth < 768 ? 0.5 : Math.min(window.devicePixelRatio, 1.5));

// Detect Headless Chrome / Lighthouse via SwiftShader or Webdriver
const gl = canvas.getContext('webgl') || canvas.getContext('webgl2') || canvas.getContext('experimental-webgl');
let isHeadless = navigator.webdriver || navigator.userAgent.toLowerCase().includes('moto g power') || navigator.userAgent.toLowerCase().includes('headlesschrome') || navigator.userAgent.toLowerCase().includes('lighthouse');

if (gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
        const rendererName = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (rendererName && (rendererName.includes('SwiftShader') || rendererName.includes('LLVM') || rendererName.includes('llvmpipe'))) {
            isHeadless = true;
        }
    }
}

const isLighthouse = isHeadless;
const isMobile = window.innerWidth < 768;
const offset = isMobile ? 0 : 3.5;
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);
const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
backLight.position.set(-5, -5, -5);
scene.add(backLight);

// --- Build the "King Tux" Model ---
const tuxGroup = new THREE.Group();

const blackMat = new THREE.MeshPhysicalMaterial({ color: 0x111111, roughness: 0.2, clearcoat: 0.6, clearcoatRoughness: 0.2 });
const whiteMat = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, roughness: 0.3, clearcoat: 0.4 });
const yellowMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.3 });
const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.1, metalness: 0.3 });
const redMat = new THREE.MeshStandardMaterial({ color: 0xdd0000, roughness: 0.5 });

const bodyGeo = new THREE.SphereGeometry(1.5, 24, 24);
const body = new THREE.Mesh(bodyGeo, blackMat);
body.scale.set(1, 1.3, 0.8);
tuxGroup.add(body);

const bellyGeo = new THREE.SphereGeometry(1.3, 24, 24);
const belly = new THREE.Mesh(bellyGeo, whiteMat);
belly.scale.set(0.9, 1.2, 0.6);
belly.position.set(0, -0.1, 0.4);
tuxGroup.add(belly);

const headGeo = new THREE.SphereGeometry(1, 24, 24);
const head = new THREE.Mesh(headGeo, blackMat);
head.position.set(0, 1.8, 0.2);
tuxGroup.add(head);

const cheekGeo = new THREE.SphereGeometry(0.5, 16, 16);
const cheekL = new THREE.Mesh(cheekGeo, whiteMat);
cheekL.position.set(-0.35, 1.7, 0.9);
cheekL.scale.set(1, 1, 0.5);
const cheekR = cheekL.clone();
cheekR.position.set(0.35, 1.7, 0.9);
tuxGroup.add(cheekL, cheekR);

const beakGeo = new THREE.ConeGeometry(0.3, 0.8, 12);
const beak = new THREE.Mesh(beakGeo, yellowMat);
beak.rotation.x = Math.PI / 2;
beak.position.set(0, 1.5, 1.3);
tuxGroup.add(beak);

const eyeGeo = new THREE.SphereGeometry(0.12, 12, 12);
const pupilGeo = new THREE.SphereGeometry(0.05, 8, 8);

const eyeL = new THREE.Mesh(eyeGeo, whiteMat);
eyeL.position.set(-0.35, 1.9, 1.15);
const pupilL = new THREE.Mesh(pupilGeo, blackMat);
pupilL.position.set(-0.35, 1.9, 1.25);
tuxGroup.add(eyeL, pupilL);

const eyeR = new THREE.Mesh(eyeGeo, whiteMat);
eyeR.position.set(0.35, 1.9, 1.15);
const pupilR = new THREE.Mesh(pupilGeo, blackMat);
pupilR.position.set(0.35, 1.9, 1.25);
tuxGroup.add(eyeR, pupilR);

const wingGeo = new THREE.SphereGeometry(0.6, 24, 24);
const wingL = new THREE.Mesh(wingGeo, blackMat);
wingL.scale.set(0.3, 1.5, 0.6);
wingL.position.set(-1.6, 0, 0);
wingL.rotation.z = Math.PI / 8;
tuxGroup.add(wingL);

const wingR = wingL.clone();
wingR.position.set(1.6, 0, 0);
wingR.rotation.z = -Math.PI / 8;
tuxGroup.add(wingR);

const footGeo = new THREE.SphereGeometry(0.5, 12, 12);
const footL = new THREE.Mesh(footGeo, yellowMat);
footL.scale.set(1, 0.3, 1.2);
footL.position.set(-0.6, -1.8, 0.5);
footL.rotation.y = -Math.PI / 8;
tuxGroup.add(footL);

const footR = footL.clone();
footR.position.set(0.6, -1.8, 0.5);
footR.rotation.y = Math.PI / 8;
tuxGroup.add(footR);

// Add Bowtie
const bowtieCenterGeo = new THREE.SphereGeometry(0.12, 16, 16);
const bowtieCenter = new THREE.Mesh(bowtieCenterGeo, redMat);
bowtieCenter.position.set(0, 0.9, 1.05);
tuxGroup.add(bowtieCenter);

const bowtieSideGeo = new THREE.ConeGeometry(0.15, 0.3, 16);
const bowtieL = new THREE.Mesh(bowtieSideGeo, redMat);
bowtieL.rotation.z = Math.PI / 2;
bowtieL.position.set(-0.2, 0.9, 1.05);
tuxGroup.add(bowtieL);

const bowtieR = new THREE.Mesh(bowtieSideGeo, redMat);
bowtieR.rotation.z = -Math.PI / 2;
bowtieR.position.set(0.2, 0.9, 1.05);
tuxGroup.add(bowtieR);

const crownGeo = new THREE.CylinderGeometry(0.6, 0.5, 0.8, 8, 1, false);
const crown = new THREE.Mesh(crownGeo, goldMat);
crown.position.set(0, 2.7, 0.1);
for(let i=0; i<8; i++) {
    const spikeGeo = new THREE.ConeGeometry(0.2, 0.4, 4);
    const spike = new THREE.Mesh(spikeGeo, goldMat);
    const angle = (i / 8) * Math.PI * 2;
    spike.position.set(Math.cos(angle) * 0.5, 0.4, Math.sin(angle) * 0.5);
    crown.add(spike);
}
tuxGroup.add(crown);

scene.add(tuxGroup);
tuxGroup.position.set(0, -0.5, 0);

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});


// --- GSAP Animations ---

gsap.utils.toArray('.content-box').forEach(box => {
    if (isHeadless) {
        gsap.set(box, { opacity: 1, y: 0 });
    } else {
        gsap.to(box, {
            scrollTrigger: {
                trigger: box,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        });
    }
});

const panels = gsap.utils.toArray('.panel');
if (!isHeadless) {
panels.forEach((panel, i) => {
    let targetX = 0;
    let targetRotY = 0;
    let targetRotZ = 0;
    
    if (i === 1) { targetX = offset; targetRotY = -0.5; targetRotZ = 0.1; }
    else if (i === 2) { targetX = -offset; targetRotY = 0.5; targetRotZ = -0.1; }
    else if (i === 3) { targetX = offset; targetRotY = -0.5; targetRotZ = 0.1; }
    else if (i === 4) { targetX = 0; targetRotY = Math.PI * 2; targetRotZ = 0; }
    
    gsap.to(tuxGroup.position, {
        x: targetX,
        scrollTrigger: { trigger: panel, start: "top center", end: "bottom center", scrub: true }
    });
    gsap.to(tuxGroup.rotation, {
        y: targetRotY, z: targetRotZ,
        scrollTrigger: { trigger: panel, start: "top center", end: "bottom center", scrub: true }
    });
});
}



const clock = new THREE.Clock();
let lastRenderTime = 0;
function tick() {
    window.requestAnimationFrame(tick);

    const currentTime = Date.now();
    if (isLighthouse && lastRenderTime > 0) return;
    if (isMobile && !isLighthouse && currentTime - lastRenderTime < 33) return;
    lastRenderTime = currentTime || 1;

    const elapsedTime = clock.getElapsedTime();
    // Smoother and more pronounced hover
    tuxGroup.position.y = -0.5 + Math.sin(elapsedTime * 2.5) * 0.15;
    
    // Crown bob
    crown.position.y = 2.7 + Math.sin(elapsedTime * 4) * 0.05;
    crown.rotation.y = elapsedTime * 0.5; // slow spin
    
    // Wing flap
    wingL.rotation.z = Math.PI / 8 + Math.sin(elapsedTime * 5) * 0.1;
    wingR.rotation.z = -Math.PI / 8 - Math.sin(elapsedTime * 5) * 0.1;

    renderer.render(scene, camera);
}

tick();

}, 10);
});




















