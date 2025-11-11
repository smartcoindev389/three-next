import { useMemo } from "react";

interface Adaptive {
  point: number;
  blobRadius: number;
  blobPointSize: number;
  blobPointDensity: number;
  logoScale: number;
  logoEnableMouseReaction: boolean;
  cameraZ: number;
  blobMoveY: number;
  blobMoveX: number;
  cropFaseZ: number;
  universeDensity: number;
  universeInitialRadius: number;
  universeMinPointSize: number;
  universeMaxPointSize: number;
  universeMaxPointsPerRenderFrame: number;
  starsCloseDensity: number;
  starsFarDensity: number;
  starsFlowSpeed: number;
  starsEnbaleMouseReaction: boolean;
}

// You can freely add your breakpoints to configure scene objects
const adaptive: Adaptive[] = [
  {
    point: Infinity,
    blobRadius: 5.5,
    blobPointSize: 8,
    blobPointDensity: 80, // blobPointDensity^2
    blobMoveY: 7.5,
    blobMoveX: 6,
    cropFaseZ: 3, //Crop blobs Face (The less the stronger crop)
    logoScale: 5,
    logoEnableMouseReaction: true,
    cameraZ: 15, // Only for Stars Layer
    universeDensity: 5000,
    universeInitialRadius: 2.5,
    universeMinPointSize: 1,
    universeMaxPointSize: 6,
    universeMaxPointsPerRenderFrame: 15,
    starsFlowSpeed: 0.01,
    starsCloseDensity: 600,
    starsFarDensity: 300,
    starsEnbaleMouseReaction: true,
  },
  {
    point: 1025,
    blobRadius: 2.75,
    blobPointSize: 4,
    blobPointDensity: 50,
    blobMoveY: 7,
    blobMoveX: 0,
    cropFaseZ: 2.75,
    logoScale: 2.5,
    logoEnableMouseReaction: false,
    cameraZ: 25,
    universeDensity: 5000,
    universeInitialRadius: 1.5,
    universeMinPointSize: 0.1,
    universeMaxPointSize: 4,
    universeMaxPointsPerRenderFrame: 10,
    starsFlowSpeed: 0.01,
    starsCloseDensity: 600,
    starsFarDensity: 300,
    starsEnbaleMouseReaction: false,
  },
];

export const getParams = (width: number): Adaptive => {
  let result = {};
  adaptive
    .sort((a, b) => a.point + b.point)
    .forEach((_) => {
      if (width <= _.point) result = _;
    });
  return result as Adaptive;
};

export const useHeightScale = () => {
  return useMemo(() => window.innerHeight * 0.07, []);
};
