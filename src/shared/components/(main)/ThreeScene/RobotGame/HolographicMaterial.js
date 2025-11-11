import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function HolographicMaterial({
  fresnelAmount = 0.45,
  fresnelOpacity = 1.0,
  scanlineSize = 8.0,
  hologramBrightness = 1.2,
  signalSpeed = 0.45,
  hologramColor = "#51a4de",
  enableBlinking = true,
  blinkFresnelOnly = true,
  enableAdditive = true,
  hologramOpacity = 1.0,
  side = "FrontSide",
  clippingPlanes = [],
  clipShadows = false,
  ...props
}) {
  const ref = useRef();

  useEffect(
    () => {
      if (!ref.current) return;
      const mat = ref.current;
      const color = new THREE.Color(hologramColor);
      mat.userData.time = 0;

      mat.onBeforeCompile = (shader) => {
        shader.uniforms.time = { value: 0 };
        shader.uniforms.fresnelAmount = { value: fresnelAmount };
        shader.uniforms.fresnelOpacity = { value: fresnelOpacity };
        shader.uniforms.scanlineSize = { value: scanlineSize };
        shader.uniforms.hologramBrightness = { value: hologramBrightness };
        shader.uniforms.signalSpeed = { value: signalSpeed };
        shader.uniforms.hologramColor = { value: color };
        shader.uniforms.enableBlinking = { value: enableBlinking ? 1 : 0 };
        shader.uniforms.blinkFresnelOnly = { value: blinkFresnelOnly ? 1 : 0 };
        shader.uniforms.hologramOpacity = { value: hologramOpacity };

        // Добавляем varying и uniforms в вершинный шейдер
        shader.vertexShader = shader.vertexShader.replace(
          "#include <common>",
          `
        #include <common>
        varying vec3 vNormalW;
        varying vec3 vPositionW;
        varying vec2 vUv;
        `,
        );

        // В vertex shader сохраним нормаль и мировую позицию для использования в fragment
        shader.vertexShader = shader.vertexShader.replace(
          "#include <project_vertex>",
          `
        #include <project_vertex>
        vUv = uv;
        vNormalW = normalize(normalMatrix * normal);
        vPositionW = (modelMatrix * vec4(position, 1.0)).xyz;
        `,
        );

        // Добавим varying и uniforms в fragment shader
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <common>",
          `
        #include <common>
        varying vec3 vNormalW;
        varying vec3 vPositionW;
        varying vec2 vUv;
        uniform float time;
        uniform float fresnelOpacity;
        uniform float scanlineSize;
        uniform float fresnelAmount;
        uniform float signalSpeed;
        uniform float hologramBrightness;
        uniform float hologramOpacity;
        uniform int enableBlinking;
        uniform int blinkFresnelOnly;
        uniform vec3 hologramColor;

        float flicker( float amt, float time ) {
          return clamp( fract( cos( time ) * 43758.5453123 ), amt, 1.0 );
        }
        `,
        );

        // Вставим код в конец main() фрагментного шейдера для эффекта
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <dithering_fragment>",
          `
        #include <dithering_fragment>

        // Вычисляем fresnel
        vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
        float fresnelEffect = dot(viewDirectionW, vNormalW) * (1.6 - fresnelOpacity / 2.0);
        fresnelEffect = clamp(fresnelAmount - fresnelEffect, 0.0, fresnelOpacity);

        // Используем мировые координаты вместо UV для единого эффекта
        float worldY = vPositionW.y;
        
        // Создаем горизонтальные полосы, движущиеся снизу вверх по мировым координатам
        // Уменьшаем scanlineSize для меньшего количества полос
        float scanlineY = worldY * (scanlineSize * 0.3) - time * signalSpeed * 2.0;
        float scanlinePattern = sin(scanlineY * 6.28318) * 0.5 + 0.5;
        
        // Создаем более широкие полосы
        scanlinePattern = smoothstep(0.2, 0.8, scanlinePattern);
        
        // Убираем тонкие линии для более чистого эффекта
        // float fineLines = sin(scanlineY * 25.0) * 0.1 + 0.9;
        
        // Используем только основные полосы
        float scanlines = scanlinePattern * hologramBrightness;
        
        // Создаем голографический цвет для сканлайнов
        vec3 scanlineColor = hologramColor * scanlines;

        vec3 hologramCol = hologramColor * mix(hologramBrightness, vUv.y, 0.3);

        float blinkValue = enableBlinking == 1 ? 0.6 - signalSpeed : 1.0;
        float blink = flicker(blinkValue, time * signalSpeed * 0.02);

        vec3 finalColor;

        if (blinkFresnelOnly == 1) {
          finalColor = (scanlineColor + hologramCol) + fresnelEffect * blink;
        } else {
          finalColor = (scanlineColor + hologramCol) * blink + fresnelEffect;
        }

        // Добавим голографический цвет к итоговому цвету материала
        gl_FragColor.rgb = mix(gl_FragColor.rgb, finalColor, hologramOpacity);

        // Можно чуть увеличить прозрачность для эффекта
        gl_FragColor.a *= hologramOpacity;
        `,
        );
        mat.userData.shader = shader;
      };
    },
    [
      fresnelAmount,
      fresnelOpacity,
      scanlineSize,
      hologramBrightness,
      signalSpeed,
      hologramColor,
      enableBlinking,
      blinkFresnelOnly,
      hologramOpacity,
    ],
    [],
  );

  useFrame((_, delta) => {
    if (ref.current?.userData.shader) {
      ref.current.userData.shader.uniforms.time.value += delta;
    }
  });

  return (
    <meshStandardMaterial
      ref={ref}
      side={
        side === "DoubleSide"
          ? THREE.DoubleSide
          : side === "BackSide"
            ? THREE.BackSide
            : THREE.FrontSide
      }
      blending={enableAdditive ? THREE.AdditiveBlending : THREE.NormalBlending}
      depthWrite={false}
      clippingPlanes={clippingPlanes}
      clipShadows={clipShadows}
      transparent={hologramOpacity < 1.0}
      {...props}
    />
  );
}
