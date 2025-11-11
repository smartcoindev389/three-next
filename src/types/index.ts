/* eslint-disable @typescript-eslint/no-explicit-any */
export type BoardProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  isActive?: boolean;
  idx: number;
  boardHeight?: number;
  boardWidth?: number;
  boardDepth?: number;
  handleToggle?: (idx: number) => void;
  gradientMaterial?: any;
  glowMaterial?: any;
  edgeActiveColor?: string;
  edgeColor?: string;
  glowBoxScaleX?: number;
  glowBoxScaleY?: number;
  glowBoxScaleZ?: number;
  mainText?: string;
  subText?: string;
  subtitle?: string;
  mainFont?: string;
  subFont?: string;
  mainFontSize?: number;
  subFontSize?: number;
  showReadMore?: boolean;
  opacity?: number;
      /////////////
  correctionMainTextY?: number;
  correctionSubtitleY?: number;
  correctionSubTextY?: number;
  anchorY?: "top" | "middle" | "bottom";
};

export type BoardData = {
  id: string | null | undefined;
  position: [number, number, number];
  mainText: string;
  subText: string;
  mainFont?: string;
  subFont?: string;
  animationDelay?: number;
  finalPosition?: [number, number, number];
  isActive?: boolean;
  type?: BoardType;
  personProps?: {
    assetPath: string;
    name: string;
    role?: string;
    description?: string;
    opacity?: number;
  };
};

export type BoardGroupProps = {
  id: string;
  boards: BoardData[];
  BOARD_SIZE: [number, number, number];
  boardHeight: number;
  boardWidth: number;
  handleToggle?: (idx: number) => void;
  gradientMaterial: any;
  glowMaterial: any;
  edgeActiveColor: string;
  edgeColor: string;
  glowBoxScaleX: number;
  glowBoxScaleY: number;
  glowBoxScaleZ: number;
  layoutMode?: LayoutMode;
  gridCols?: number;
  gridRows?: number;
  spacing?: { x: number; y: number };
  randomOffset?: { x: number; y: number };
  checkerboardCols1?: number;
  checkerboardCols2?: number;
  triggerAnimation?: boolean;
  onAnimationComplete?: () => void;
  mainFontSize?: number;
  subFontSize?: number;
  showReadMore?: boolean;
  shouldScatter?: boolean;
  animationDelay?: number;
  scatterType?: "radial" | "towards-camera" | "by-scroll";
};

export type LayoutMode =
  | "grid"
  | "grid-fixed"
  | "checkerboard"
  | "random"
  | "circle"
  | "animated-entry";

export type BoardType = "default" | "person" | "inactive";

export interface GradientMaterialProps {
  isActive?: boolean;
  globalOpacity?: number;
  gradColor1: string;
  gradColor2: string;
  gradRadius: number;
  gradCenterX: number;
  gradCenterY: number;
  gradColor1Active: string;
  gradColor2Active: string;
  gradRadiusActive: number;
  gradCenterXActive: number;
  gradCenterYActive: number;
  [key: string]: any;
}

export interface GlowMaterialProps {
  globalOpacity?: number;
  glowColor: string;
  glowStrength: number;
  glowBlur: number;
  glowIntensity: number;
  glowRadiusX: number;
  glowHeightX: number;
  glowRadiusY: number;
  glowWidthY: number;
  [key: string]: any;
}
