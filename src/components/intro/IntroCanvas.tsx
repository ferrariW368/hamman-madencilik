"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { getActiveStage, getStageProgress } from "./introStages";
import type { SirketBilgisi } from "@/sanity/queries";

type IntroCanvasProps = {
  progress: number;
  sirket: SirketBilgisi | null;
  onSelectCompany: () => void;
};

const CARVED_TEXT = "HAMMAN MADENCİLİK A.Ş.";

// Pre-converted typeface JSON rather than the raw TTF: three's TTFLoader cannot
// be imported here (it does a bare `https://` import of opentype.js, which
// webpack rejects with UnhandledSchemeError and the build fails). The TTF is
// converted to this format ahead of time and subsetted to the 13 glyphs the
// company name needs — including the Turkish İ (U+0130) and Ş (U+015E) — by
// `scripts/generate-carved-font.mjs`. FontLoader parses this format natively,
// so no font-parsing code ships to the client. Regenerate the asset if
// CARVED_TEXT changes; the script fails loudly on a missing glyph.
const CARVED_FONT_URL = "/fonts/playfair-display-bold-carved.typeface.json";

// Blocks are 2 units wide, so the spacing must exceed 2 for the row to read as
// five separate blocks rather than one continuous stepped slab.
const BLOCK_SPACING = 2.6;

// The five-block row spans ~12.4 units. Horizontal FOV is derived from the
// vertical one by aspect, so a portrait phone sees a far narrower slice of the
// world than a desktop window and the outer blocks fall outside the frustum.
// The row is scaled down on narrow viewports to keep all five in shot.
// Reference aspect is a typical desktop window, where the scale stays 1.
const BLOCK_ROW_REFERENCE_ASPECT = 1.6;

// Mean authored depth of the five blocks (z = -2 .. -3.6).
const BLOCK_ROW_DEPTH = -2.8;

// Scaling is uniform rather than x-only on purpose: it keeps the blocks cubic
// instead of squashing them into thin slabs, and because gaps and widths scale
// together the gap:width ratio is scale-invariant — so the row can never
// re-fuse into a single slab no matter how narrow the viewport gets.
//
// Scaling about the origin also drags the row toward the camera, which shrinks
// the visible width again and eats most of the margin it just bought. Pushing
// the group back by the depth the scale removed keeps the row at its authored
// distance, so a phone gets the same framing margin as a desktop window.
function layoutBlockRow(row: THREE.Object3D, aspect: number): void {
  const scale = Math.min(1, aspect / BLOCK_ROW_REFERENCE_ASPECT);
  row.scale.setScalar(scale);
  row.position.z = BLOCK_ROW_DEPTH * (1 - scale);
}

const FOG_STONE = new THREE.Color(0x4b5560);
const FOG_CREAM = new THREE.Color(0xf5f2ec);

function createMarbleTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#F5F2EC";
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "rgba(138, 111, 58, 0.35)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 14; i++) {
    ctx.beginPath();
    const startX = Math.random() * size;
    ctx.moveTo(startX, 0);
    let x = startX;
    for (let y = 0; y <= size; y += 16) {
      x += (Math.random() - 0.5) * 24;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createMountain(): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(40, 40, 60, 60);
  geometry.rotateX(-Math.PI / 2);
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const z = position.getZ(i);
    const dist = Math.sqrt(x * x + z * z);
    const ridge = Math.sin(x * 0.3) * Math.cos(z * 0.25) * 2.2;
    const falloff = Math.max(0, 1 - dist / 22);
    const height = ridge * falloff + Math.sin(dist * 0.5) * 0.4 * falloff;
    position.setY(i, height);
  }
  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({ color: 0x4b5560, roughness: 1, flatShading: true });
  return new THREE.Mesh(geometry, material);
}

function createBlock(marbleTexture: THREE.Texture): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(2, 1.4, 1.4);
  const material = new THREE.MeshStandardMaterial({ map: marbleTexture, roughness: 0.5, metalness: 0.05 });
  return new THREE.Mesh(geometry, material);
}

export function IntroCanvas({ progress, sirket, onSelectCompany }: IntroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  // Same reason as progressRef: the effect runs once, so it must reach the
  // current callback rather than close over the one from the first render.
  const onSelectCompanyRef = useRef(onSelectCompany);
  onSelectCompanyRef.current = onSelectCompany;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // The container can be briefly zero-sized (first paint, display toggles);
    // a 0 height would make the camera aspect Infinity/NaN and blank the scene.
    const readSize = () => ({
      width: Math.max(1, container.clientWidth),
      height: Math.max(1, container.clientHeight),
    });

    const { width, height } = readSize();

    const scene = new THREE.Scene();
    const fog = new THREE.Fog(0x4b5560, 8, 30);
    scene.fog = fog;
    // The sky deliberately shares the fog's Color instance: any stage that lerps
    // the fog lerps the horizon with it, so the silhouette reads as atmospheric
    // depth instead of meeting a hard seam against a black void.
    // Because of that aliasing: mutate fog.color, never scene.background.
    // scene.background.set(...) would silently rewrite the fog colour too, and
    // reassigning scene.background would break the link. Every stage branch in
    // render() must set its own fog colour rather than inherit the last one.
    scene.background = fog.color;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 3, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 640 ? 1.5 : 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const sun = new THREE.DirectionalLight(0xffffff, 0.8);
    sun.position.set(5, 8, 5);
    scene.add(sun);

    const mountain = createMountain();
    mountain.position.y = -1.5;
    scene.add(mountain);

    const marbleTexture = createMarbleTexture();
    // Parented to a group so the whole row can be scaled to the viewport aspect
    // as one unit, in setup and on every resize.
    const approachRow = new THREE.Group();
    layoutBlockRow(approachRow, width / height);
    scene.add(approachRow);

    const approachBlocks: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const block = createBlock(marbleTexture);
      block.position.set((i - 2) * BLOCK_SPACING, -0.5, -2 - i * 0.4);
      block.visible = false;
      approachRow.add(block);
      approachBlocks.push(block);
    }

    const companyBlock = createBlock(marbleTexture);
    companyBlock.position.set(0, 0, 0);
    companyBlock.visible = false;
    scene.add(companyBlock);

    // The font request is asynchronous and can resolve after unmount, by which
    // point cleanup's scene.traverse disposal has already run — anything added
    // then would never be freed. The flag is checked before allocating, so the
    // late path creates nothing at all rather than creating-then-disposing.
    let disposed = false;

    new FontLoader().load(CARVED_FONT_URL, (font) => {
      if (disposed) return;
      const textGeometry = new TextGeometry(CARVED_TEXT, {
        font,
        size: 0.16,
        depth: 0.03,
        curveSegments: 4,
      });
      textGeometry.center();
      const textMesh = new THREE.Mesh(
        textGeometry,
        new THREE.MeshStandardMaterial({ color: 0x2b2620, roughness: 0.85 })
      );
      textMesh.position.z = 0.71;
      // Parented into the scene graph, so the traverse-based cleanup disposes
      // its geometry and material without any hand-listing.
      companyBlock.add(textMesh);
    });

    function render() {
      const p = progressRef.current;
      const stage = getActiveStage(p);
      const local = getStageProgress(p, stage);

      // Every branch declares the full scene state, including the fog colour.
      // render() must be a pure function of progress: progress can jump
      // arbitrarily (loop-back from 1.0 to 0, a Skip, a fast flick, or scroll
      // restoration landing mid-page), so a branch that inherited the previous
      // frame's fog would render the wrong palette until the user happened to
      // scroll back through the stage that sets it.
      if (stage.id === "mountain") {
        camera.position.set(0, 3 - local * 1.5, 14 - local * 6);
        camera.lookAt(0, 0, 0);
        mountain.visible = true;
        approachBlocks.forEach((b) => (b.visible = false));
        companyBlock.visible = false;
        fog.color.copy(FOG_STONE);
      } else if (stage.id === "approach") {
        camera.position.set(0, 1.5 - local * 0.5, 8 - local * 5);
        camera.lookAt(0, 0, -2);
        mountain.visible = local < 0.6;
        approachBlocks.forEach((b) => (b.visible = true));
        companyBlock.visible = false;
        fog.color.copy(FOG_STONE).lerp(FOG_CREAM, local);
      } else if (stage.id === "company") {
        camera.position.set(0, 0.3, 3.5);
        camera.lookAt(0, 0, 0);
        mountain.visible = false;
        approachBlocks.forEach((b) => (b.visible = false));
        companyBlock.visible = true;
        companyBlock.rotation.y = local * Math.PI * 0.6;
        fog.color.copy(FOG_CREAM);
      } else {
        // Stages products / contact are added by later tasks.
        mountain.visible = false;
        approachBlocks.forEach((b) => (b.visible = false));
        companyBlock.visible = false;
        fog.color.copy(FOG_CREAM);
      }

      renderer.render(scene, camera);
    }

    let frameId: number;
    function animate() {
      frameId = requestAnimationFrame(animate);
      render();
    }
    animate();

    // Allocated once, reused by every click — nothing here is per-frame, but
    // the same no-allocation-in-the-hot-path rule applies to the pointer path.
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function handleClick(event: MouseEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      if (getActiveStage(progressRef.current).id === "company" && companyBlock.visible) {
        const hits = raycaster.intersectObject(companyBlock, true);
        if (hits.length > 0) {
          onSelectCompanyRef.current();
        }
      }
    }
    renderer.domElement.addEventListener("click", handleClick);

    function handleResize() {
      const size = readSize();
      const aspect = size.width / size.height;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(size.width, size.height);
      layoutBlockRow(approachRow, aspect);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", handleClick);

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      marbleTexture.dispose();
      renderer.dispose();

      // React may already have detached the canvas with the container subtree.
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}

