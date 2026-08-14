"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { getActiveStage, getProductStageSlice, getStageProgress } from "./introStages";
import { buildContactFaces, type ContactFace } from "./contactCubeFaces";
import type { SirketBilgisi, UrunKategorisi, IletisimBilgisi } from "@/sanity/queries";

type IntroCanvasProps = {
  progress: number;
  sirket: SirketBilgisi | null;
  urunler: UrunKategorisi[];
  iletisim: IletisimBilgisi | null;
  activeFaceIndex: number;
  onSelectCompany: () => void;
  onSelectProduct: (urun: UrunKategorisi) => void;
  onSelectContact: (face: ContactFace) => void;
};

const CARVED_TEXT = "HAMMAN MADENCİLİK A.Ş.";

// Fraction of the block's front face the carved name may span.
const CARVED_TEXT_FACE_FILL = 0.8;

// Pre-converted typeface JSON rather than the raw TTF: three's TTFLoader cannot
// be imported here (it does a bare `https://` import of opentype.js, which
// webpack rejects with UnhandledSchemeError and the build fails). The TTF is
// converted to this format ahead of time and subsetted to the 13 glyphs the
// company name needs — including the Turkish İ (U+0130) and Ş (U+015E) — by
// `scripts/generate-carved-font.mjs`. FontLoader parses this format natively,
// so no font-parsing code ships to the client. Regenerate the asset if
// CARVED_TEXT changes; the script fails loudly on a missing glyph.
const CARVED_FONT_URL = "/fonts/playfair-display-bold-carved.typeface.json";

// Marble block dimensions. Named because three things are derived from them:
// the row spacing below, the fit of the carved text to the front face, and the
// camera distance that frames a block. Changing the box here keeps all three
// correct instead of leaving magic numbers behind.
const BLOCK_WIDTH = 2;
const BLOCK_HEIGHT = 1.4;
const BLOCK_DEPTH = 1.4;

// The contact cube. Named for the same reason the block dimensions are: the
// camera framing, the face textures and the click target are all derived from it.
const CONTACT_CUBE_SIZE = 1.6;

// Widest the cube can ever be on screen. cameraZToFit fits exactly the width it
// is handed and knows nothing about rotation (see its docblock), so the stage
// must hand it the worst case itself. Because reaching all six faces needs
// rotation about two axes, the cube can be turned corner-on, where its extent
// along a screen axis is the space diagonal `size * sqrt(3)` = 2.771 — not the
// face diagonal 2.263 that a Y-only spin would peak at. Using the bound rather
// than the peak of today's particular transitions means no future face
// ordering can quietly start cropping.
const CONTACT_CUBE_MAX_EXTENT = CONTACT_CUBE_SIZE * Math.sqrt(3);

// Which cube face each contact channel is painted on, and the cube orientation
// that brings that face square to camera.
//
// `buildContactFaces` returns at most six channels and a cube has exactly six
// faces, which is the correspondence the design is built on — so a channel gets
// a real face, not a fraction of a turn. Distributing N channels evenly around
// a single axis (N/count * 2*PI) only lands on an actual face when N divides
// into the four Y-facing sides, so with 5 or 6 channels — or with 4, on the
// top/bottom pair — it parks the cube on an edge or a corner.
//
// The first four ring the equator, so the common case (a site with four or
// fewer channels) reads as a simple horizontal turn; the fifth and sixth are
// the top and bottom, which is the only way to reach six faces at all, since
// rotating about Y alone can never bring +Y or -Y forward.
//
// `material` indexes BoxGeometry's material groups, which are ordered
// +X, -X, +Y, -Y, +Z, -Z. `euler` is the rotation that maps that face's outward
// normal onto +Z, i.e. straight at the camera.
const CONTACT_FACE_SLOTS: { material: number; euler: THREE.Euler }[] = [
  { material: 4, euler: new THREE.Euler(0, 0, 0) }, // +Z front
  { material: 0, euler: new THREE.Euler(0, -Math.PI / 2, 0) }, // +X right
  { material: 5, euler: new THREE.Euler(0, Math.PI, 0) }, // -Z back
  { material: 1, euler: new THREE.Euler(0, Math.PI / 2, 0) }, // -X left
  { material: 2, euler: new THREE.Euler(Math.PI / 2, 0, 0) }, // +Y top
  { material: 3, euler: new THREE.Euler(-Math.PI / 2, 0, 0) }, // -Y bottom
];

// Pre-built once at module load, never per frame. Quaternions rather than a
// pair of eased Euler angles because slerp interpolates along the single
// shortest arc between two orientations: easing rotation.x and rotation.y
// independently would take a 270-degree detour on any step whose two targets
// live on different axes, and would have to reason about Euler order to get the
// composed orientation exact.
const CONTACT_FACE_QUATERNIONS = CONTACT_FACE_SLOTS.map((slot) =>
  new THREE.Quaternion().setFromEuler(slot.euler)
);

// Spacing must exceed BLOCK_WIDTH for the row to read as five separate blocks
// rather than one continuous stepped slab.
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

// Fraction of the frame width a close-up subject is allowed to occupy. The
// remainder is breathing room, split evenly left and right.
const FRAME_FILL = 0.85;

/**
 * Camera z that keeps a `subjectWidth`-wide subject inside the frame.
 *
 * The close-up stages (`company`, and `products` / `contact` in Tasks 12-13)
 * all frame a roughly block-sized object at a camera distance authored against
 * a desktop window. Horizontal FOV is the vertical FOV widened by aspect, so a
 * portrait phone sees a far narrower slice of the world and crops the subject —
 * the same failure that hit the approach row. Rather than each stage
 * rediscovering that, they share this helper: pass the subject's width, the z
 * of the plane that width lives on (a block's front face is at +BLOCK_DEPTH/2,
 * because that is the plane whose apparent size the viewer judges), and the
 * distance the stage was authored at.
 *
 * Never returns less than `authoredZ`, so wide viewports keep exactly the
 * authored framing and only narrow ones pull back. Pure arithmetic on numbers,
 * no allocation — safe to call from render() every frame.
 *
 * What it does NOT do — read before reusing:
 *
 * - **Width only.** It ignores the subject's height entirely, so a tall subject
 *   can crop top and bottom while this reports a comfortable fit. Check the
 *   vertical separately if a stage frames something taller than it is wide.
 * - **Assumes the subject is centred on the camera axis** and viewed straight
 *   down -z. An off-centre subject (a product block parked to one side) is
 *   silently mis-framed: the helper fits its width but not its offset.
 * - **Ignores rotation — the caller owns it.** The width you pass is the width
 *   it fits. The company stage passes BLOCK_WIDTH (2.0), but the block rotates
 *   to 108 degrees and a rotating box's silhouette peaks at
 *   `sqrt(BLOCK_WIDTH^2 + BLOCK_DEPTH^2)` = 2.441 units at ~35 degrees, which
 *   is ~92% of the frame at 375x812 rather than the declared 85%. The 8% margin
 *   survives, so this is deliberately not compensated — but a stage that
 *   rotates further, or a wider subject, must pass the swept width itself.
 * - **No `far` clamp.** A degenerate aspect (a 0-width viewport, a collapsed
 *   container) makes the returned distance grow without bound; nothing here
 *   caps it at the camera's `far` of 100. `readSize()`'s 1px floor is what
 *   currently stops that.
 *
 * And the fog caveat for Tasks 12-13: `Fog` is (8, 30), so a subject that needs
 * to sit further than ~8 units from the camera starts dissolving into fog. At
 * fov 50 and a 375x812 phone that threshold is a subject width of about 2.7
 * units. A wider subject wants a narrower authored width (or a vertical
 * arrangement), not a longer pull-back.
 */
function cameraZToFit(
  camera: THREE.PerspectiveCamera,
  subjectWidth: number,
  subjectPlaneZ: number,
  authoredZ: number
): number {
  const halfVerticalFov = (camera.fov * Math.PI) / 360;
  const distance = subjectWidth / (FRAME_FILL * 2 * Math.tan(halfVerticalFov) * camera.aspect);
  return Math.max(authoredZ, subjectPlaneZ + distance);
}

const FOG_STONE = new THREE.Color(0x4b5560);
const FOG_CREAM = new THREE.Color(0xf5f2ec);

// The canvas size the veining was authored against. Vein width, spacing and
// jitter scale from it, so a 512px face texture gets veins of the same visual
// weight as the 256px block texture rather than twice as many, half as wide —
// and at 256 the scale is 1, so the block texture is drawn with exactly the
// constants it always was.
const MARBLE_REFERENCE_SIZE = 256;

// Cream ground plus bronze veining, filling a square canvas of any size.
function paintMarble(ctx: CanvasRenderingContext2D, size: number): void {
  const scale = size / MARBLE_REFERENCE_SIZE;
  ctx.fillStyle = "#F5F2EC";
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "rgba(138, 111, 58, 0.35)";
  ctx.lineWidth = 1.5 * scale;
  const step = 16 * scale;
  const jitter = 24 * scale;
  for (let i = 0; i < 14; i++) {
    ctx.beginPath();
    const startX = Math.random() * size;
    ctx.moveTo(startX, 0);
    let x = startX;
    for (let y = 0; y <= size; y += step) {
      x += (Math.random() - 0.5) * jitter;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

function createSquareCanvas(size: number): CanvasRenderingContext2D {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  return canvas.getContext("2d")!;
}

function createMarbleTexture(): THREE.CanvasTexture {
  const ctx = createSquareCanvas(256);
  paintMarble(ctx, 256);
  const texture = new THREE.CanvasTexture(ctx.canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Resolution of one labelled cube face. The face is 1.6 world units and never
// occupies more than ~60% of the frame, so on a 1265px-wide desktop canvas it
// lands around 420px and on a 562px portrait buffer around 275px — 512 keeps
// the lettering oversampled at both without being wasteful (six of these is
// ~1.5MB of texture memory after upload).
const CONTACT_FACE_TEXTURE_SIZE = 512;

// Fraction of the face the label may span, matching CARVED_TEXT_FACE_FILL's
// role on the company block: the label is measured and shrunk to fit rather
// than assumed to fit, so a longer channel name can never overflow the face.
const CONTACT_LABEL_FILL = 0.78;

/**
 * A marble cube face with its channel name on it.
 *
 * The stage is a *contact* cube — the whole point is choosing a channel — so a
 * face has to say which channel it is. This uses the technique already in the
 * file (`CanvasTexture` over a 2D canvas) rather than `TextGeometry`: the
 * carved-text route needs the subsetted typeface JSON, which is subsetted to
 * the 13 glyphs of the company name and would have to be regenerated to cover
 * six channel labels, and it would add six more triangulated meshes to the
 * scene. A canvas texture needs no font asset, no new dependency, and no extra
 * geometry — and unlike the carved text it cannot intersect the solid it sits
 * on, because it *is* the surface.
 */
function createContactFaceTexture(label: string): THREE.CanvasTexture {
  const size = CONTACT_FACE_TEXTURE_SIZE;
  const ctx = createSquareCanvas(size);
  paintMarble(ctx, size);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const maxWidth = size * CONTACT_LABEL_FILL;
  // Serif to sit with the display face used elsewhere on the site. Georgia is
  // present on Windows and macOS; the generic `serif` fallback keeps a short
  // label legible anywhere, and nothing here depends on a webfont having
  // loaded (a canvas drawn before a webfont arrives would silently keep the
  // fallback glyphs, which is why no webfont is named).
  const setFont = (px: number) => {
    ctx.font = `600 ${px}px Georgia, "Times New Roman", serif`;
  };
  let fontSize = size * 0.15;
  setFont(fontSize);
  const naturalWidth = ctx.measureText(label).width;
  if (naturalWidth > maxWidth) {
    fontSize *= maxWidth / naturalWidth;
    setFont(fontSize);
  }

  ctx.fillStyle = "#2B2620";
  ctx.fillText(label, size / 2, size / 2);

  // A bronze rule under the label, sized to the text actually drawn. Picks up
  // the same bronze as the veining and the "Tüm Sayfayı Gör" link, and gives
  // the face a deliberate front/back so a rotating cube reads as turning.
  const ruleHalf = Math.min(maxWidth, ctx.measureText(label).width) / 2;
  ctx.strokeStyle = "#8A6F3A";
  ctx.lineWidth = size * 0.011;
  ctx.beginPath();
  ctx.moveTo(size / 2 - ruleHalf, size * 0.615);
  ctx.lineTo(size / 2 + ruleHalf, size * 0.615);
  ctx.stroke();

  return new THREE.CanvasTexture(ctx.canvas);
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
  const geometry = new THREE.BoxGeometry(BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_DEPTH);
  const material = new THREE.MeshStandardMaterial({ map: marbleTexture, roughness: 0.5, metalness: 0.05 });
  return new THREE.Mesh(geometry, material);
}

export function IntroCanvas({
  progress,
  sirket,
  urunler,
  iletisim,
  activeFaceIndex,
  onSelectCompany,
  onSelectProduct,
  onSelectContact,
}: IntroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  // Same reason as progressRef: the effect runs once, so it must reach the
  // current callback rather than close over the one from the first render.
  const onSelectCompanyRef = useRef(onSelectCompany);
  onSelectCompanyRef.current = onSelectCompany;
  const onSelectProductRef = useRef(onSelectProduct);
  onSelectProductRef.current = onSelectProduct;
  // The click handler maps the clicked block back to its product. The effect
  // builds one block per product exactly once, so the array it read at mount
  // could be a different object by the time a click arrives; the ref keeps the
  // lookup pointed at the current data. (The block *count* is still fixed at
  // mount — see the note above the block construction.)
  const urunlerRef = useRef(urunler);
  urunlerRef.current = urunler;
  const onSelectContactRef = useRef(onSelectContact);
  onSelectContactRef.current = onSelectContact;
  // Which face is turned to camera. Owned by IntroScene (the arrow buttons live
  // in the DOM overlay, not in the scene), read by render() every frame and by
  // the click handler — hence a ref rather than a dep.
  const activeFaceIndexRef = useRef(activeFaceIndex);
  activeFaceIndexRef.current = activeFaceIndex;

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

    // One block per featured product, built once at mount — never in render().
    // Each is a separate geometry + material (same as the approach row), and
    // each is parented into the scene, so cleanup's scene.traverse disposes all
    // N of them without any hand-listing. They all sit at the origin because
    // only ever one is visible at a time, and because cameraZToFit assumes the
    // subject is centred on the camera axis.
    //
    // The count is fixed at mount: the effect has an empty dep array, so a
    // `urunler` prop that later changed *length* would leave the block count
    // stale. `urunler` is fetched server-side and handed down for the lifetime
    // of the page, so this does not arise in practice; the click path reads
    // urunlerRef so a same-length re-fetch still resolves to current data.
    const productBlocks: THREE.Mesh[] = urunler.map(() => {
      const block = createBlock(marbleTexture);
      block.position.set(0, 0, 0);
      block.visible = false;
      scene.add(block);
      return block;
    });

    // The contact channels the CMS actually has values for, in the order
    // buildContactFaces returns them. Built here rather than in the component
    // body so it is allocated once at mount instead of on every progress tick
    // (~60/s during a scroll) for a value only the effect ever reads. Same
    // mount-time capture as `urunler` above: `iletisim` is server-fetched and
    // handed down for the lifetime of the page, so it does not go stale.
    //
    // The list can legitimately be EMPTY — every social field is optional and
    // even telefon/eposta can be blank in a half-filled document. See the
    // contact branch of render() for what that renders as.
    const contactFaces = buildContactFaces({
      instagramUrl: iletisim?.instagramUrl,
      facebookUrl: iletisim?.facebookUrl,
      xUrl: iletisim?.xUrl,
      youtubeUrl: iletisim?.youtubeUrl,
      eposta: iletisim?.eposta,
      telefon: iletisim?.telefon,
    });

    // One material per cube face, in BoxGeometry's group order. A face that has
    // a channel gets that channel's label painted on it; the leftovers (a site
    // with fewer than six channels) get the plain block marble, so an unused
    // side is blank rather than mislabelled.
    //
    // Built in a single pass rather than "six plain ones, then overwrite some":
    // an overwritten material would never be reachable from the scene graph and
    // so would never be disposed.
    const contactFaceTextures: THREE.CanvasTexture[] = [];
    const contactCubeMaterials = [0, 1, 2, 3, 4, 5].map((materialIndex) => {
      const faceIndex = CONTACT_FACE_SLOTS.findIndex((slot) => slot.material === materialIndex);
      const face = faceIndex >= 0 ? contactFaces[faceIndex] : undefined;
      if (!face) {
        return new THREE.MeshStandardMaterial({ map: marbleTexture, roughness: 0.4 });
      }
      const texture = createContactFaceTexture(face.label);
      contactFaceTextures.push(texture);
      return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.4 });
    });

    // Built unconditionally even when there are no faces — one geometry and six
    // materials is cheaper than making this nullable and then special-casing it
    // in hideAll(), render() and the click handler. It is simply never shown.
    // Parented into the scene, so cleanup's traverse disposes the geometry and
    // all six materials (it already handles the material-array case); the
    // canvas textures are not owned by the materials, so they are disposed
    // explicitly alongside marbleTexture, which is the pattern already here.
    const contactCube = new THREE.Mesh(
      new THREE.BoxGeometry(CONTACT_CUBE_SIZE, CONTACT_CUBE_SIZE, CONTACT_CUBE_SIZE),
      contactCubeMaterials
    );
    contactCube.visible = false;
    scene.add(contactCube);

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

      // DO NOT REMOVE: at size 0.16 this string is ~2.98 units wide against a
      // 2-unit face, so unscaled it hangs off both edges and, once the block
      // rotates, the letters visibly pass through the block solid. The scale is
      // measured rather than hardcoded so it stays correct if CARVED_TEXT, the
      // font size, or the block ever changes; it only ever shrinks (a string
      // that already fits is left alone).
      textGeometry.computeBoundingBox();
      const bounds = textGeometry.boundingBox;
      if (bounds) {
        const textWidth = bounds.max.x - bounds.min.x;
        if (textWidth > 0) {
          textMesh.scale.setScalar(Math.min(1, (BLOCK_WIDTH * CARVED_TEXT_FACE_FILL) / textWidth));
        }
      }

      // Just proud of the front face, so the lettering is never z-fighting it.
      textMesh.position.z = BLOCK_DEPTH / 2 + 0.01;
      // Parented into the scene graph, so the traverse-based cleanup disposes
      // its geometry and material without any hand-listing.
      companyBlock.add(textMesh);
    });

    // Indexed loop rather than forEach: this runs every frame and a callback
    // literal would be a fresh closure per call.
    function setApproachBlocksVisible(visible: boolean) {
      for (let i = 0; i < approachBlocks.length; i++) {
        approachBlocks[i].visible = visible;
      }
    }

    // Shows exactly one product block and hides the rest, so "two products on
    // screen at once" is not a state this can reach. Pass -1 (what
    // getProductStageSlice returns when there are no products) to show none.
    // Indexed for the same reason as above: it runs every frame.
    function setVisibleProductBlock(index: number) {
      for (let i = 0; i < productBlocks.length; i++) {
        productBlocks[i].visible = i === index;
      }
    }

    // Everything the stages own, switched off. Each branch of render() then
    // turns back on only what it shows, so a branch states its own concerns
    // instead of hand-writing a line for every object in the scene. Adding an
    // object is one line here plus one line in the branches that show it —
    // rather than an edit to every branch, which is the bookkeeping that let a
    // branch forget to write fog.color in the first place.
    //
    // Fog is deliberately NOT defaulted here. There is no safe default: getting
    // it wrong is invisible until someone scrolls, so every branch must state
    // its own colour and be seen to state it.
    function hideAll() {
      mountain.visible = false;
      setApproachBlocksVisible(false);
      companyBlock.visible = false;
      setVisibleProductBlock(-1);
      contactCube.visible = false;
    }

    function render() {
      const p = progressRef.current;
      const stage = getActiveStage(p);
      const local = getStageProgress(p, stage);

      hideAll();

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
        fog.color.copy(FOG_STONE);
      } else if (stage.id === "approach") {
        camera.position.set(0, 1.5 - local * 0.5, 8 - local * 5);
        camera.lookAt(0, 0, -2);
        mountain.visible = local < 0.6;
        setApproachBlocksVisible(true);
        fog.color.copy(FOG_STONE).lerp(FOG_CREAM, local);
      } else if (stage.id === "company") {
        // 3.5 is the authored desktop distance and is what wide viewports get;
        // narrow ones pull back just far enough to keep the whole block in shot.
        camera.position.set(0, 0.3, cameraZToFit(camera, BLOCK_WIDTH, BLOCK_DEPTH / 2, 3.5));
        camera.lookAt(0, 0, 0);
        companyBlock.visible = true;
        companyBlock.rotation.y = local * Math.PI * 0.6;
        fog.color.copy(FOG_CREAM);
      } else if (stage.id === "products") {
        // The stage is sub-divided evenly, one slice per product, so `index`
        // walks the array as the user scrolls and `localProgress` restarts at 0
        // for each. index === -1 means the CMS returned no featured products:
        // setVisibleProductBlock(-1) then shows nothing and the stage degrades
        // to an empty cream scene rather than throwing.
        const { index, localProgress } = getProductStageSlice(p, productBlocks.length);
        setVisibleProductBlock(index);
        if (index >= 0) {
          productBlocks[index].rotation.y = localProgress * Math.PI * 0.5;
        }
        // Same close-up framing contract as the company stage: 3.5 is the
        // authored desktop distance, narrow viewports pull back only as far as
        // they must. The block is at the origin, which is what the helper
        // assumes; the rotation peaks at the same 2.441-unit swept width the
        // company stage already verified fits, and stays inside fog `near`.
        camera.position.set(0, 0.3, cameraZToFit(camera, BLOCK_WIDTH, BLOCK_DEPTH / 2, 3.5));
        camera.lookAt(0, 0, 0);
        fog.color.copy(FOG_CREAM);
      } else if (stage.id === "contact") {
        // The cube is shown only when the CMS actually gave us a channel. With
        // no faces it would be a marble cube that looks exactly like a full one
        // (the faces carry no labels) but silently does nothing when clicked —
        // a dead affordance. Hiding it degrades the stage to an empty cream
        // scene instead, the same way the products stage degrades with no
        // featured products. The loop-back is unaffected either way.
        if (contactFaces.length > 0) {
          contactCube.visible = true;
          // Turn the *selected channel's own face* square to camera. Clamped
          // because the slot table is the six a cube has; buildContactFaces
          // cannot return more, and the clamp means it could not misindex if it
          // ever did. slerp mutates in place along the shortest arc and
          // allocates nothing — the target quaternions are module constants.
          const slot = Math.min(activeFaceIndexRef.current, CONTACT_FACE_QUATERNIONS.length - 1);
          contactCube.quaternion.slerp(CONTACT_FACE_QUATERNIONS[slot], 0.1);
        }
        // 4 is the authored desktop distance; narrow viewports pull back only as
        // far as they must. Unlike the two block stages this passes the worst-
        // case extent rather than the authored width — see
        // CONTACT_CUBE_MAX_EXTENT. The cube is at the origin, so the helper's
        // centred-subject assumption holds. Vertical was checked separately (the
        // helper ignores height): the cube's vertical extent peaks at the face
        // diagonal 2.263, and the frustum is 2.98 units tall at the cube centre
        // on desktop and 6.4 at the portrait pull-back, so width is the binding
        // constraint at every aspect. Measured peaks are in the task report.
        camera.position.set(0, 0, cameraZToFit(camera, CONTACT_CUBE_MAX_EXTENT, CONTACT_CUBE_SIZE / 2, 4));
        camera.lookAt(0, 0, 0);
        fog.color.copy(FOG_CREAM);
      } else {
        // Unreachable by construction — StageId has five members and all five
        // are handled above. Kept so that adding a sixth stage cannot land in a
        // branch with no fog of its own, which is the failure this file is most
        // prone to.
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

      const stageId = getActiveStage(progressRef.current).id;

      if (stageId === "company" && companyBlock.visible) {
        const hits = raycaster.intersectObject(companyBlock, true);
        if (hits.length > 0) {
          onSelectCompanyRef.current();
        }
      }

      if (stageId === "products") {
        // Whichever block render() last made visible is the one on screen, so
        // it is the only one that can have been clicked — and its index is the
        // product's index. Scanned rather than recomputed from progress so the
        // hit test can never disagree with what the user actually sees.
        let visibleIndex = -1;
        for (let i = 0; i < productBlocks.length; i++) {
          if (productBlocks[i].visible) {
            visibleIndex = i;
            break;
          }
        }
        if (visibleIndex >= 0) {
          const hits = raycaster.intersectObject(productBlocks[visibleIndex], true);
          const urun = urunlerRef.current[visibleIndex];
          if (hits.length > 0 && urun) {
            onSelectProductRef.current(urun);
          }
        }
      }

      // This is the only path in the app that can open a new browser tab, so it
      // is gated three times over and every gate is about what the user can
      // actually see: the contact stage must be the active one, the cube must be
      // the thing render() last made visible (so an empty face list, which never
      // shows the cube, can never reach here), and the ray must actually hit it.
      // A scroll, a swipe or a click on empty sky cannot satisfy all three — a
      // `click` event only fires on a press and release in the same place, and
      // the arrow buttons are DOM siblings above the canvas, so pressing one
      // never reaches this handler at all.
      if (stageId === "contact" && contactCube.visible) {
        const hits = raycaster.intersectObject(contactCube, true);
        if (hits.length > 0) {
          // The face the user is looking at, not one derived from the ray: the
          // cube carries no per-face content, so hit-testing which of the six
          // sides the ray struck would open a channel the user did not choose.
          const face = contactFaces[activeFaceIndexRef.current];
          if (face) onSelectContactRef.current(face);
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
      // Textures are not owned by the materials that reference them, so
      // material.dispose() in the traverse above does not free them.
      marbleTexture.dispose();
      contactFaceTextures.forEach((texture) => texture.dispose());
      renderer.dispose();

      // React may already have detached the canvas with the container subtree.
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}

