import * as THREE from "three";

export function blendCoordinates(a, b, t) {
  return {
    x: a.x * (1 - t) + b.x * t,
    y: a.y * (1 - t) + b.y * t,
    z: a.z * (1 - t) + b.z * t,
  };
}

function binomial(n, k) {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res *= (n - i + 1) / i;
  }
  return res;
}

function bernstein(n, i, t) {
  return binomial(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i);
}

export function getBezierPoint(controlPoints, t) {
  const n = controlPoints.length - 1;

  let x = 0,
    y = 0,
    z = 0;

  for (let i = 0; i <= n; i++) {
    const b = bernstein(n, i, t);
    x += b * controlPoints[i].x;
    y += b * controlPoints[i].y;
    z += b * controlPoints[i].z;
  }
  return { x, y, z };
}
//////////////

export function getBezier1D(controlPoints, t) {
  const n = controlPoints.length - 1;

  let value = 0;
  for (let i = 0; i <= n; i++) {
    value += bernstein(n, i, t) * controlPoints[i];
  }
  return value;
}

/*
type PercentPoint = { x: number; y: number; z?: number };
type CanvasPoint = { x: number; y: number; z: number };

export function percentageCalculatorPosition(
  points: PercentPoint[],
  width: number,
  height: number,
  depth: number = 100
): CanvasPoint[] {
  return points.map(p => ({
    x: (p.x / 100) * width,   // 0..width
    y: (p.y / 100) * height,  // 0..height
    z: p.z !== undefined ? (p.z / 100) * depth : 0,
  }));
}
*/

export function percentageCalculatorPosition(
  points,
  width,
  height,
  depth = 100,
) {
  const kx = width / 100;
  const ky = height / 100;
  const kz = depth / 100;

  return points.map((p) => ({
    x: p.x * kx,
    y: p.y * ky,
    z: (p.z ?? 0) * kz,
  }));
}

export function percentageCalculatorRotation(
  rotations,
  maxX = 2 * Math.PI,
  maxY = 2 * Math.PI,
  maxZ = 2 * Math.PI,
) {
  const kx = maxX / 100;
  const ky = maxY / 100;
  const kz = maxZ / 100;

  return rotations.map((r) => ({
    x: (r.x ?? 0) * kx,
    y: (r.y ?? 0) * ky,
    z: (r.z ?? 0) * kz,
  }));
}

export function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

export const centerBox3 = (gltf) => {
  const box = new THREE.Box3().setFromObject(gltf);
  const size = new THREE.Vector3();
  box.getSize(size);

  const center = new THREE.Vector3();
  box.getCenter(center); // отримує центр моделі

  gltf.position.x -= center.x;
  gltf.position.y -= center.y;
  gltf.position.z -= center.z;

  return { x: gltf.position.x, y: gltf.position.y, z: gltf.position.z };
};
