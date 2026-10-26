import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Card, CardBackStyle, GameMode } from '../types/cards';
import { drawCardFaceCanvas, drawCardBackCanvas } from '../utils/cardDeck';

interface ThreeCafeSceneProps {
  mode: GameMode;
  tableCards: Card[];
  cardBackStyle: CardBackStyle;
  cameraView: 'overhead' | 'cinematic' | 'dama';
  onCardClick?: (card: Card) => void;
  hajBrahimActive?: boolean;
}

export const ThreeCafeScene: React.FC<ThreeCafeSceneProps> = ({
  mode,
  tableCards,
  cardBackStyle,
  cameraView,
  onCardClick,
  hajBrahimActive,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cardsGroupRef = useRef<THREE.Group | null>(null);
  const hajGroupRef = useRef<THREE.Group | null>(null);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 14, 8));
  const targetCamLookRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Procedural Moroccan Zellij Floor Texture
  const createZellijTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Cream / Ivory base
    ctx.fillStyle = '#faf6ed';
    ctx.fillRect(0, 0, 512, 512);

    const step = 64;
    for (let x = 0; x < 512; x += step) {
      for (let y = 0; y < 512; y += step) {
        // Moroccan tile star and ribbon pattern
        ctx.save();
        ctx.translate(x + step / 2, y + step / 2);

        // Cobalt Blue 8-pointed star
        ctx.fillStyle = '#1d4ed8';
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const r = i % 2 === 0 ? 24 : 12;
          const a = (i * Math.PI) / 4;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        // Ochre / Gold inner diamond
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const r = 8;
          const a = (i * Math.PI) / 2 + Math.PI / 4;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        // Terracotta corner borders
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2;
        ctx.strokeRect(-step / 2 + 1, -step / 2 + 1, step - 2, step - 2);

        ctx.restore();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(12, 12);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL Guard (Per Skill Guidelines)
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 2. Scene & Renderer Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#19110b');
    scene.fog = new THREE.FogExp2('#19110b', 0.035);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 14, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Procedural Studio Environment Reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig
    const ambientLight = new THREE.HemisphereLight('#fef3c7', '#3f2e1e', 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#fffbeb', 1.8);
    keyLight.position.set(4, 15, 6);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.PointLight('#f59e0b', 1.2, 20);
    rimLight.position.set(-6, 8, -6);
    scene.add(rimLight);

    // 5. Floor (Moroccan Zellij)
    const floorGeo = new THREE.PlaneGeometry(50, 50);
    const floorMat = new THREE.MeshStandardMaterial({
      map: createZellijTexture(),
      roughness: 0.25,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.2;
    floor.receiveShadow = !isSoftwareGl;
    scene.add(floor);

    // Warm cafe back walls
    const wallGeo = new THREE.BoxGeometry(40, 16, 1);
    const wallMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.85 });
    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.set(0, 5.8, -12);
    scene.add(backWall);

    // 6. Central Moroccan Cafe Round Table
    const tableGroup = new THREE.Group();

    // Tabletop
    const tabletopGeo = new THREE.CylinderGeometry(4.2, 4.2, 0.35, 48);
    const tabletopMat = new THREE.MeshStandardMaterial({
      color: '#854d0e', // rich polished cedar wood
      roughness: 0.35,
      metalness: 0.15,
    });
    const tabletop = new THREE.Mesh(tabletopGeo, tabletopMat);
    tabletop.position.y = 0;
    tabletop.receiveShadow = !isSoftwareGl;
    tabletop.castShadow = !isSoftwareGl;
    tableGroup.add(tabletop);

    // Golden octagonal inlay on table (as seen in screenshots!)
    const octGeo = new THREE.RingGeometry(2.3, 2.45, 8);
    const octMat = new THREE.MeshStandardMaterial({
      color: '#eab308',
      roughness: 0.2,
      metalness: 0.7,
      side: THREE.DoubleSide,
    });
    const oct = new THREE.Mesh(octGeo, octMat);
    oct.rotation.x = -Math.PI / 2;
    oct.position.y = 0.18;
    tableGroup.add(oct);

    // Table Central pedestal leg & base
    const legGeo = new THREE.CylinderGeometry(0.5, 0.7, 2.2, 24);
    const legMat = new THREE.MeshStandardMaterial({ color: '#59320e', roughness: 0.6 });
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.y = -1.1;
    tableGroup.add(leg);

    const baseGeo = new THREE.CylinderGeometry(2.2, 2.4, 0.2, 24);
    const baseMesh = new THREE.Mesh(baseGeo, legMat);
    baseMesh.position.y = -2.1;
    tableGroup.add(baseMesh);

    scene.add(tableGroup);

    // 7. Cards Container Group
    const cardsGroup = new THREE.Group();
    cardsGroupRef.current = cardsGroup;
    scene.add(cardsGroup);

    // 8. 4 Cafe Characters around the table
    // Player 3 (Across, wearing Moroccan Red Fez / Tarbouch and Djellaba)
    const p3Group = createCafeCharacter({
      color: '#713f12', // brown djellaba
      hasTarbouch: true,
      hasBeard: true,
    });
    p3Group.position.set(0, 0.3, -4.8);
    p3Group.rotation.y = 0;
    scene.add(p3Group);

    // Player 2 (Left opponent/partner in green sweater)
    const p2Group = createCafeCharacter({
      color: '#15803d',
      hasTarbouch: false,
      hasBeard: false,
    });
    p2Group.position.set(-4.8, 0.3, 0);
    p2Group.rotation.y = Math.PI / 2;
    scene.add(p2Group);

    // Player 4 (Right opponent in red Moroccan jersey)
    const p4Group = createCafeCharacter({
      color: '#b91c1c',
      hasTarbouch: false,
      hasBeard: false,
    });
    p4Group.position.set(4.8, 0.3, 0);
    p4Group.rotation.y = -Math.PI / 2;
    scene.add(p4Group);

    // 9. Moroccan Tea Set (Berrad d'Atay & Kaissane) on side carved table
    const sideTable = createSideTeaset();
    sideTable.position.set(-4.5, -0.6, -3.5);
    scene.add(sideTable);

    // 10. Vintage Cafe Radio on side stool
    const radio = createVintageRadio();
    radio.position.set(-4.5, 0.5, -3.5);
    scene.add(radio);

    // 11. Haj Brahim's Dama Table in the background
    const hajGroup = createHajBrahimScene();
    hajGroup.position.set(5.5, -0.4, -6.5);
    hajGroupRef.current = hajGroup;
    scene.add(hajGroup);

    // Animation & software WebGL pacing loop
    let frameId = 0;
    let clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const animate = () => {
      const dt = clock.getDelta();

      // Smooth camera interpolation
      if (cameraRef.current) {
        cameraRef.current.position.lerp(targetCamPosRef.current, THREE.MathUtils.damp(0, 1, 4, dt));
        currentLookRef.current.lerp(targetCamLookRef.current, THREE.MathUtils.damp(0, 1, 4, dt));
        cameraRef.current.lookAt(currentLookRef.current);
      }

      // Gentle subtle breathing animations for characters
      const time = clock.getElapsedTime();
      if (p3Group) p3Group.position.y = 0.3 + Math.sin(time * 1.5) * 0.03;
      if (p2Group) p2Group.position.y = 0.3 + Math.sin(time * 1.6 + 1) * 0.03;
      if (p4Group) p4Group.position.y = 0.3 + Math.sin(time * 1.4 + 2) * 0.03;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(animate);
      } else {
        frameId = requestAnimationFrame(animate);
      }
    };

    if (isSoftwareGl) {
      afterDraw(animate);
    } else {
      frameId = requestAnimationFrame(animate);
    }

    // Window resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (isSoftwareGl) {
        clearTimeout(frameId);
      } else {
        cancelAnimationFrame(frameId);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Camera Target based on cameraView prop
  useEffect(() => {
    if (cameraView === 'dama' || hajBrahimActive) {
      // Zoom into Haj Brahim's table in the cafe
      targetCamPosRef.current.set(5.5, 3.8, -3.8);
      targetCamLookRef.current.set(5.5, 0.4, -6.5);
    } else if (cameraView === 'cinematic') {
      // 3D angled panoramic view of table and characters
      targetCamPosRef.current.set(0, 7.5, 6.8);
      targetCamLookRef.current.set(0, 0.4, -1.0);
    } else {
      // Standard cafe high overhead view (as seen in screenshots!)
      targetCamPosRef.current.set(0, 13.5, 6.5);
      targetCamLookRef.current.set(0, 0.1, -0.6);
    }
  }, [cameraView, hajBrahimActive]);

  // Update 3D Table Cards when tableCards change
  useEffect(() => {
    const group = cardsGroupRef.current;
    if (!group) return;

    // Clear old card meshes
    while (group.children.length > 0) {
      const child = group.children[0] as THREE.Mesh;
      if (child.geometry) child.geometry.dispose();
      group.remove(child);
    }

    // 1. Draw central draw deck
    const deckGeo = new THREE.BoxGeometry(1.2, 0.25, 1.8);
    const deckBackCanvas = drawCardBackCanvas(cardBackStyle, 200, 300);
    const deckBackTex = new THREE.CanvasTexture(deckBackCanvas);
    deckBackTex.colorSpace = THREE.SRGBColorSpace;
    const deckMat = new THREE.MeshStandardMaterial({
      map: deckBackTex,
      roughness: 0.35,
    });
    const deckMesh = new THREE.Mesh(deckGeo, deckMat);
    deckMesh.position.set(-1.4, 0.3, 0.4);
    deckMesh.rotation.y = 0.08;
    group.add(deckMesh);

    // 2. Render cards currently lying on the table
    const cardGeo = new THREE.PlaneGeometry(1.15, 1.72);
    const count = tableCards.length;

    tableCards.forEach((card, index) => {
      const canvas = drawCardFaceCanvas(card, 240, 360);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.25,
        metalness: 0.05,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      });

      const mesh = new THREE.Mesh(cardGeo, mat);
      mesh.rotation.x = -Math.PI / 2;

      // Arrange cards nicely in the table center
      const spacing = 1.35;
      const offsetX = (index - (count - 1) / 2) * spacing;
      mesh.position.set(offsetX * 0.9, 0.2 + index * 0.005, -0.2 + (index % 2) * 0.15);
      mesh.rotation.z = (index % 2 === 0 ? 0.04 : -0.04) * (index + 1);

      group.add(mesh);
    });
  }, [tableCards, cardBackStyle]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ touchAction: 'none' }}
    />
  );
};

// Procedural 3D Stylized Moroccan Cafe Character
function createCafeCharacter({
  color,
  hasTarbouch,
  hasBeard,
}: {
  color: string;
  hasTarbouch: boolean;
  hasBeard: boolean;
}): THREE.Group {
  const group = new THREE.Group();

  // 1. Torso / Djellaba
  const torsoGeo = new THREE.CylinderGeometry(0.85, 1.25, 2.2, 16);
  const torsoMat = new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
  const torso = new THREE.Mesh(torsoGeo, torsoMat);
  torso.position.y = 1.1;
  group.add(torso);

  // 2. Head
  const headGeo = new THREE.SphereGeometry(0.55, 16, 16);
  const skinMat = new THREE.MeshStandardMaterial({ color: '#f3c79c', roughness: 0.5 });
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.y = 2.5;
  group.add(head);

  // 3. Eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: '#1e293b' });
  const eyeGeo = new THREE.SphereGeometry(0.07, 8, 8);

  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.18, 2.55, 0.5);
  group.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.18, 2.55, 0.5);
  group.add(rightEye);

  // 4. Tarbouch (Iconic Moroccan Red Fez)
  if (hasTarbouch) {
    const tarbouchGeo = new THREE.CylinderGeometry(0.38, 0.44, 0.65, 16);
    const tarbouchMat = new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.7 });
    const tarbouch = new THREE.Mesh(tarbouchGeo, tarbouchMat);
    tarbouch.position.y = 3.05;
    group.add(tarbouch);

    // Black tassel
    const tasselMat = new THREE.MeshBasicMaterial({ color: '#09090b' });
    const tasselGeo = new THREE.CylinderGeometry(0.04, 0.08, 0.4, 8);
    const tassel = new THREE.Mesh(tasselGeo, tasselMat);
    tassel.position.set(0.25, 2.85, 0);
    tassel.rotation.z = -0.4;
    group.add(tassel);
  }

  // 5. White Beard
  if (hasBeard) {
    const beardGeo = new THREE.ConeGeometry(0.35, 0.6, 12);
    const beardMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.9 });
    const beard = new THREE.Mesh(beardGeo, beardMat);
    beard.rotation.x = Math.PI;
    beard.position.set(0, 2.15, 0.4);
    group.add(beard);
  }

  // 6. Arms resting on table holding cards
  const armMat = torsoMat;
  const leftArmGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.5, 12);

  const leftArm = new THREE.Mesh(leftArmGeo, armMat);
  leftArm.position.set(-0.95, 1.4, 0.65);
  leftArm.rotation.x = Math.PI / 3;
  leftArm.rotation.z = -Math.PI / 6;
  group.add(leftArm);

  const rightArm = new THREE.Mesh(leftArmGeo, armMat);
  rightArm.position.set(0.95, 1.4, 0.65);
  rightArm.rotation.x = Math.PI / 3;
  rightArm.rotation.z = Math.PI / 6;
  group.add(rightArm);

  // Stylized Hand cards (3 cards fanned in hands)
  const handCardsGroup = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const cardMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.7, 1.1),
      new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.4 })
    );
    cardMesh.position.set((i - 1) * 0.22, 1.4, 1.3);
    cardMesh.rotation.y = (i - 1) * 0.15;
    cardMesh.rotation.x = -0.3;
    handCardsGroup.add(cardMesh);
  }
  group.add(handCardsGroup);

  return group;
}

// Procedural Moroccan Berrad d'Atay (Silver Teapot) & Glasses
function createSideTeaset(): THREE.Group {
  const group = new THREE.Group();

  // Side cedarwood stool
  const stoolGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.15, 24);
  const stoolMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.5 });
  const stool = new THREE.Mesh(stoolGeo, stoolMat);
  stool.position.y = 1.0;
  group.add(stool);

  const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.0, 12);
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3;
    const leg = new THREE.Mesh(legGeo, stoolMat);
    leg.position.set(Math.cos(a) * 1.0, 0.5, Math.sin(a) * 1.0);
    group.add(leg);
  }

  // Silver Moroccan Teapot (Berrad d'Atay)
  const silverMat = new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    metalness: 0.95,
    roughness: 0.15,
  });

  // Pot belly
  const bellyGeo = new THREE.SphereGeometry(0.38, 16, 16);
  const belly = new THREE.Mesh(bellyGeo, silverMat);
  belly.position.set(-0.3, 1.45, 0);
  belly.scale.set(1, 1.2, 1);
  group.add(belly);

  // Pot lid & finial
  const lidGeo = new THREE.ConeGeometry(0.2, 0.25, 16);
  const lid = new THREE.Mesh(lidGeo, silverMat);
  lid.position.set(-0.3, 1.95, 0);
  group.add(lid);

  // Curved Spout
  const spoutGeo = new THREE.CylinderGeometry(0.06, 0.1, 0.6, 12);
  const spout = new THREE.Mesh(spoutGeo, silverMat);
  spout.position.set(-0.05, 1.65, 0);
  spout.rotation.z = -Math.PI / 4;
  group.add(spout);

  // Tea glasses (Kaissane d'Atay)
  const glassMat = new THREE.MeshStandardMaterial({
    color: '#fef08a',
    roughness: 0.2,
    metalness: 0.3,
    transparent: true,
    opacity: 0.85,
  });
  const glassGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.32, 12);

  [
    { x: 0.4, z: -0.2 },
    { x: 0.5, z: 0.2 },
    { x: 0.2, z: 0.4 },
  ].forEach(pos => {
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(pos.x, 1.25, pos.z);
    group.add(glass);
  });

  return group;
}

// Procedural Vintage Moroccan Cafe Radio
function createVintageRadio(): THREE.Group {
  const group = new THREE.Group();

  const bodyGeo = new THREE.BoxGeometry(0.9, 0.55, 0.4);
  const bodyMat = new THREE.MeshStandardMaterial({ color: '#59320e', roughness: 0.4 });
  const radioBody = new THREE.Mesh(bodyGeo, bodyMat);
  radioBody.position.y = 1.0;
  group.add(radioBody);

  // Glowing tuning dial
  const dialGeo = new THREE.PlaneGeometry(0.6, 0.2);
  const dialMat = new THREE.MeshBasicMaterial({ color: '#fef08a' });
  const dial = new THREE.Mesh(dialGeo, dialMat);
  dial.position.set(0, 1.05, 0.21);
  group.add(dial);

  return group;
}

// Procedural Haj Brahim Playing Dama in the cafe background
function createHajBrahimScene(): THREE.Group {
  const group = new THREE.Group();

  // Haj Brahim's square wooden table
  const tableGeo = new THREE.BoxGeometry(3.0, 0.2, 3.0);
  const tableMat = new THREE.MeshStandardMaterial({ color: '#78350f', roughness: 0.4 });
  const table = new THREE.Mesh(tableGeo, tableMat);
  table.position.y = 1.2;
  group.add(table);

  // Dama Checkered Board (8x8 green and beige tiles)
  const boardGeo = new THREE.PlaneGeometry(2.4, 2.4);
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        ctx.fillStyle = (r + c) % 2 === 1 ? '#15803d' : '#fef3c7';
        ctx.fillRect(c * 32, r * 32, 32, 32);
      }
    }
  }
  const boardTex = new THREE.CanvasTexture(canvas);
  boardTex.colorSpace = THREE.SRGBColorSpace;
  const boardMat = new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.3 });
  const boardMesh = new THREE.Mesh(boardGeo, boardMat);
  boardMesh.rotation.x = -Math.PI / 2;
  boardMesh.position.y = 1.31;
  group.add(boardMesh);

  // Sample Draughts Counters on the board
  const pieceGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.06, 16);
  const yellowMat = new THREE.MeshStandardMaterial({ color: '#fef08a', roughness: 0.3 });
  const redMat = new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.3 });

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) {
        const piece = new THREE.Mesh(pieceGeo, redMat);
        piece.position.set((c - 3.5) * 0.28, 1.35, (r - 3.5) * 0.28);
        group.add(piece);
      }
    }
  }

  for (let r = 5; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) {
        const piece = new THREE.Mesh(pieceGeo, yellowMat);
        piece.position.set((c - 3.5) * 0.28, 1.35, (r - 3.5) * 0.28);
        group.add(piece);
      }
    }
  }

  // Haj Brahim character sitting opposite the board
  const hajTorsoGeo = new THREE.CylinderGeometry(0.9, 1.3, 2.4, 16);
  const hajTorsoMat = new THREE.MeshStandardMaterial({ color: '#713f12', roughness: 0.85 }); // Moroccan djellaba
  const hajTorso = new THREE.Mesh(hajTorsoGeo, hajTorsoMat);
  hajTorso.position.set(0, 2.0, -1.8);
  group.add(hajTorso);

  // Haj Brahim Head & White Beard
  const hajHeadGeo = new THREE.SphereGeometry(0.55, 16, 16);
  const hajSkinMat = new THREE.MeshStandardMaterial({ color: '#f5d0b0', roughness: 0.6 });
  const hajHead = new THREE.Mesh(hajHeadGeo, hajSkinMat);
  hajHead.position.set(0, 3.4, -1.8);
  group.add(hajHead);

  // White Tagiya (prayer cap)
  const tagiyaGeo = new THREE.CylinderGeometry(0.48, 0.52, 0.3, 16);
  const whiteMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5 });
  const tagiya = new THREE.Mesh(tagiyaGeo, whiteMat);
  tagiya.position.set(0, 3.8, -1.8);
  group.add(tagiya);

  // Glasses
  const glassesGeo = new THREE.TorusGeometry(0.12, 0.02, 8, 16);
  const glassRimMat = new THREE.MeshBasicMaterial({ color: '#09090b' });
  const lGlass = new THREE.Mesh(glassesGeo, glassRimMat);
  lGlass.position.set(-0.18, 3.45, -1.3);
  group.add(lGlass);

  const rGlass = new THREE.Mesh(glassesGeo, glassRimMat);
  rGlass.position.set(0.18, 3.45, -1.3);
  group.add(rGlass);

  // White Beard
  const beardGeo = new THREE.ConeGeometry(0.42, 0.8, 16);
  const beard = new THREE.Mesh(beardGeo, whiteMat);
  beard.rotation.x = Math.PI;
  beard.position.set(0, 2.9, -1.4);
  group.add(beard);

  return group;
}
