import { Color, ShaderMaterial, NormalBlending, AdditiveBlending } from "three";
import { GradientMaterialProps, GlowMaterialProps } from "@/types";
import { boardControlsConfig } from "@/shared/config/boardControlsConfig";

const c = boardControlsConfig;

export function hexToVec3(hex: string) {
  const c = new Color(hex);
  return [c.r, c.g, c.b];
}

export function getGradientMaterial(
  args: GradientMaterialProps,
): ShaderMaterial {
  const {
    isActive,
    gradColor1 = c.gradColor1.value,
    gradColor2 = c.gradColor2.value,
    gradRadius = c.gradRadius.value,
    gradCenterX = c.gradCenterX.value,
    gradCenterY = c.gradCenterY.value,
    gradColor1Active = c.gradColor1Active.value,
    gradColor2Active = c.gradColor2Active.value,
    gradRadiusActive = c.gradRadiusActive.value,
    gradCenterXActive = c.gradCenterXActive.value,
    gradCenterYActive = c.gradCenterYActive.value,
    opacity,
  } = args;
  return new ShaderMaterial({
    uniforms: {
      color1: { value: hexToVec3(isActive ? gradColor1Active : gradColor1) },
      color2: { value: hexToVec3(isActive ? gradColor2Active : gradColor2) },
      radius: { value: isActive ? gradRadiusActive : gradRadius },
      center: {
        value: [
          isActive ? gradCenterXActive : gradCenterX,
          isActive ? gradCenterYActive : gradCenterY,
        ],
      },
      opacity: { value: opacity },
    },
    transparent: true,
    depthWrite: false,
    blending: NormalBlending,
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float radius;
    uniform vec2 center;
    uniform float opacity;
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vec2 gradCenter = vec2(0.5) + center * 0.5;
      float dist = distance(vUv, gradCenter) / radius;
      dist = clamp(dist, 0.0, 1.0);
      vec3 color = mix(color1, color2, dist);

      // Більш м'який спад прозорості (імітація блюру)
      float softAlpha = smoothstep(1.0, 0.4, dist); // 0.4 - ще м'якше
      float light = 0.7 + 0.3 * abs(normalize(vNormal).z);
      color *= light;
      gl_FragColor = vec4(color, opacity * softAlpha);
    }
  `,
  });
}

export function getGlowMaterial(args: GlowMaterialProps): ShaderMaterial {
  const {
    glowColor = c.glowColor.value,
    glowStrength = c.glowStrength.value,
    glowBlur = c.glowBlur.value,
    glowIntensity = c.glowIntensity.value,
    glowRadiusX = c.glowRadiusX.value,
    glowHeightX = c.glowHeightX.value,
    glowRadiusY = c.glowRadiusY.value,
    glowWidthY = c.glowWidthY.value,
    opacity,
  } = args;
  return new ShaderMaterial({
    uniforms: {
      glowColor: {
        value: hexToVec3(typeof glowColor === "string" ? glowColor : glowColor),
      },
      glowStrength: { value: glowStrength },
      glowBlur: { value: glowBlur },
      glowIntensity: { value: glowIntensity },
      glowRadiusX: { value: glowRadiusX },
      glowHeightX: { value: glowHeightX },
      glowRadiusY: { value: glowRadiusY },
      glowWidthY: { value: glowWidthY },
      opacity: { value: opacity },
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform float glowStrength;
      uniform float glowBlur;
      uniform float glowIntensity;
      uniform float glowRadiusX;
      uniform float glowHeightX;
      uniform float opacity;
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv - 0.5;
        float halfW = glowRadiusX;
        float halfH = glowHeightX;
        float dx = max(abs(uv.x) - halfW, 0.0);
        float dy = max(abs(uv.y) - halfH, 0.0);
        float dist = sqrt(dx * dx + dy * dy);
        dist = clamp(dist / 0.5, 0.0, 1.0);
        float alpha = pow(1.0 - dist, glowBlur) * glowStrength * glowIntensity;
        gl_FragColor = vec4(glowColor, alpha * opacity);
      }
    `,
  });
}

export function getBoxShadowMaterial(args: {
  shadowColor?: [number, number, number];
  blur?: number;
  spread?: number;
  opacity?: number;
  boardWidth?: number;
  boardHeight?: number;
}) {
  const {
    shadowColor = [1, 1, 1],
    blur = 0.1,
    spread = 0.4,
    opacity = 0.6,
    boardWidth = 1,
    boardHeight = 1,
  } = args;
  return new ShaderMaterial({
    uniforms: {
      shadowColor: { value: shadowColor },
      blur: { value: blur },
      spread: { value: spread },
      opacity: { value: opacity },
      boardWidth: { value: boardWidth },
      boardHeight: { value: boardHeight },
    },
    transparent: true,
    depthWrite: false,
    blending: NormalBlending,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 shadowColor;
      uniform float blur;
      uniform float spread;
      uniform float opacity;
      uniform float boardWidth;
      uniform float boardHeight;
      varying vec2 vUv;
      void main() {
        // Приводимо UV до [-1, 1] з урахуванням пропорцій
        vec2 uv = (vUv - 0.5) * 2.0;
        float aspect = boardWidth / boardHeight;
        uv.x *= aspect;

        // Розмір прямокутника (0.5 = межа дошки)
        float halfW = 0.5;
        float halfH = 0.5;

        // Spread збільшує межу тіні
        float shadowW = halfW + spread / boardWidth;
        float shadowH = halfH + spread / boardHeight;

        // Відстань до краю прямокутника (за межами - тінь)
        float dx = max(abs(uv.x) - shadowW, 0.0);
        float dy = max(abs(uv.y) - shadowH, 0.0);
        float dist = sqrt(dx * dx + dy * dy);

        // Blur — наскільки плавний край
        float shadowAlpha = 1.0 - smoothstep(0.0, blur / max(boardWidth, boardHeight), dist);

        // Усередині прямокутника — тіні нема
        float inside = step(abs(uv.x), shadowW) * step(abs(uv.y), shadowH);
        shadowAlpha *= 1.0 - inside;

        gl_FragColor = vec4(shadowColor, shadowAlpha * opacity);
      }
    `,
  });
}
