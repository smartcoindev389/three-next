import * as THREE from "three";

function randomPointOnSphere(radius = 1) {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export function generateNearTransforms(
  totalNear,
  sphereRadius,
  scaleMin,
  scaleMax,
) {
  return Array.from({ length: totalNear }, () => {
    const pos = randomPointOnSphere(sphereRadius);
    const jitterDirection = randomPointOnSphere(1); // випадковий напрямок
    return {
      basePosition: pos.clone(),
      jitterDirection, // Додаємо для near
      isFar: false,
      scale: scaleMin + Math.random() * (scaleMax - scaleMin),
      randomX: Math.random() * Math.PI * 2,
      randomY: Math.random() * Math.PI * 2,
      randomZ: Math.random() * Math.PI * 2,
      position: pos.clone(),
      matrix: new THREE.Matrix4(),
    };
  });
}

export function generateFarTransforms(
  totalFar,
  sphereRadius,
  surfaceJitter,
  levitateStrength,
  scaleMin,
  scaleMax,
) {
  return Array.from({ length: totalFar }, () => {
    // Стартова позиція — на поверхні сфери
    const pos = randomPointOnSphere(sphereRadius);

    // Напрямок від центру (нормаль)
    const normal = pos.clone().normalize();

    // Додаємо невеликий випадковий вектор до нормалі (але не в середину)
    const randomVec = new THREE.Vector3(
      (Math.random() - 0.5) * 0.7,
      (Math.random() - 0.5) * 0.7,
      (Math.random() - 0.5) * 0.7,
    );
    // Основний напрямок — назовні, але з розкидом
    const outDir = normal.clone().add(randomVec).normalize();

    // Відліт тільки назовні, на випадкову відстань від 0 до surfaceJitter
    const jitterAmount = Math.random() * surfaceJitter;
    const finalPos = pos.clone().add(outDir.multiplyScalar(jitterAmount));

    const lookAt = outDir;
    const up = new THREE.Vector3(0, 1, 0);
    const m = new THREE.Matrix4()
      .lookAt(new THREE.Vector3(0, 0, 0), lookAt, up)
      .invert();

    // Більшість дрібних, менше великих
    const scale =
      scaleMin + (1 - Math.pow(Math.random(), 2.5)) * (scaleMax - scaleMin);

    return {
      position: finalPos,
      matrix: m,
      randomZ: Math.random() * 2 * Math.PI,
      levitate: {
        axis: Math.random() > 0.5 ? "x" : "y",
        speed: 0.8 + Math.random() * 1.2,
        amplitude: (0.07 + Math.random() * 0.11) * levitateStrength,
        phase: Math.random() * Math.PI * 2,
      },
      basePosition: pos.clone(),
      jitterDirection: outDir,
      isFar: true,
      scale: scale,
    };
  });
}
