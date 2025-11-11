import { useControls } from "leva";

export function setRobot({ robot, trajectoryData }) {
  robot.position.set(
    trajectoryData.position.x,
    trajectoryData.position.y,
    trajectoryData.position.z,
  );

  robot.rotation.set(
    trajectoryData.rotation.x,
    trajectoryData.rotation.y,
    trajectoryData.rotation.z,
  );

  robot.scale.setScalar(trajectoryData.scale);
}

export const lights = [
  [100, 100, 100],
  [-100, -100, 100],
  [100, -100, 100],
  [-100, -100, 100],
];

export function calculateFlexibleTrajectory({
  progress,
  startPos,
  controlPoints,
  rotationPoints = null,
  scalePoints = null,
  robotScale,
}) {
  if (!rotationPoints) {
    rotationPoints = controlPoints.map(() => ({ x: 0, y: 0, z: 0 }));
  }

  if (!scalePoints) {
    scalePoints = controlPoints.map((_, index, array) => {
      const progress = index / (array.length - 1);
      return 1 - (1 - 0.6) * progress;
    });
  } else {
    scalePoints = scalePoints.map((scale) => {
      return scale * robotScale;
    });
  }

  const n = controlPoints.length - 1; // Степень кривой Безье
  const t = progress;

  // Функция для вычисления биномиального коэффициента
  function binomial(n, k) {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;

    let result = 1;
    for (let i = 1; i <= k; i++) {
      result = (result * (n - i + 1)) / i;
    }
    return result;
  }

  // Функция для вычисления базисных функций Бернштейна
  function bernstein(n, i, t) {
    return binomial(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i);
  }

  // Вычисляем позицию по обобщенной кривой Безье
  let relativeX = 0,
    relativeY = 0,
    relativeZ = 0;
  let rotationX = 0,
    rotationY = 0,
    rotationZ = 0;
  let scale = 0;

  for (let i = 0; i <= n; i++) {
    const basis = bernstein(n, i, t);

    // Позиция
    relativeX += basis * controlPoints[i].x;
    relativeY += basis * controlPoints[i].y;
    relativeZ += basis * controlPoints[i].z;

    // Поворот
    rotationX += basis * rotationPoints[i].x;
    rotationY += basis * rotationPoints[i].y;
    rotationZ += basis * rotationPoints[i].z;

    // Масштаб
    scale += basis * scalePoints[i];
  }

  // Абсолютные координаты
  const x = startPos.x + relativeX;
  const y = startPos.y + relativeY;
  const z = startPos.z + relativeZ;

  // Добавляем банкинг если включен
  let finalRotationZ = rotationZ;

  return {
    position: { x, y, z },
    rotation: {
      x: rotationX,
      y: rotationY,
      z: finalRotationZ,
    },
    scale: Math.max(0.3, scale),
    progress: progress,
  };
}

export function useNebulaControls() {
  return useControls("NebulaV2", {
    bigCount: { value: 1900, min: 100, max: 20000, step: 100 },
    farCount: { value: 2500, min: 0, max: 20000, step: 100 },
    scaleMin: { value: 0.01, min: 0.01, max: 1, step: 0.01 },
    scaleMax: { value: 0.41, min: 0.01, max: 2, step: 0.01 },
    surfaceJitter: { value: 3, min: 0, max: 20, step: 0.1 },
    moveStrengthX: { value: 0.01, min: 0, max: 0.1, step: 0.001 },
    moveStrengthY: { value: 0.01, min: 0, max: 0.1, step: 0.001 },
    levitateStrength: { value: 2, min: 0, max: 10, step: 0.1 },
    enableSway: true,
    enableMouse: true,
    sphereRadius: { value: 10, min: 1, max: 30, step: 0.1 },
    cursorRadiusMax: { value: 3.5, min: 0, max: 10, step: 0.1 },
    cursorRadiusLerp: { value: 1.1, min: 0.01, max: 2, step: 0.01 },
    compressScale: { value: 0.7, min: 0.3, max: 1.5, step: 0.1 },
    enableCompress: true,
    enableShake: true,
    enableExplosion: true,
  });
}

export function useMovingLightControls() {
  return useControls("MovingLight", {
    radius: { value: 28, min: 5, max: 60 },
    speed: { value: 0.65, min: 0, max: 2 },
    color: "#621e72",
    intensity: { value: 29, min: 0, max: 100 },
    distance: { value: 49, min: 1, max: 100 },
    decay: { value: 0.09, min: 0, max: 1 },
    offset: { value: 0, min: -20, max: 20 },
    angle: { value: Math.PI / 8, min: 0, max: Math.PI / 2 },
    edgeAngle: { value: Math.PI / 10, min: 0, max: Math.PI / 2 },
    penumbra: { value: 0.1, min: 0, max: 1 },
    fixed: false,
    verticalStep: { value: 10, min: 0, max: 30 },
    edgeScale: { value: 0.4, min: 0.1, max: 1 },
    startPhase: { value: 0, min: 0, max: Math.PI * 2 },
  });
}

export function useAmbientControls() {
  return useControls("AmbientLight", {
    ambientColor: { value: "#5500aa" },
    ambientIntensity: { value: 50, min: 0, max: 50, step: 0.1 },
  });
}

export function addRobotAnimation({
  flightData,
  tlConfig = { progress: 1, duration: 1, ease: "power2.inOut" },
  controlPoints,
  rotationPoints,
  scalePoints,
  whenSecond,
  tl,
  startPos,
  robot,
  robotScale,
}) {
  tl.to(
    flightData,
    {
      ...tlConfig,
      onUpdate: () => {
        if (!robot) return;
        const { progress } = flightData;
        const trajectoryData = calculateFlexibleTrajectory({
          progress,
          startPos,
          controlPoints,
          rotationPoints,
          scalePoints,
          robotScale,
        });

        setRobot({
          robot,
          trajectoryData,
        });
      },
    },
    whenSecond,
  );
}
