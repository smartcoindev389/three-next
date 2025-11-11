import React, { forwardRef, useMemo, useEffect } from "react";
import { Uniform } from "three";
import { Effect } from "postprocessing";

const fragmentShader = `
uniform float strength;

float rand2 (vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 aspectCorrection = vec2(1.0, aspect);

  vec2 dir = normalize(uv - vec2(0.5));
  float dist = length(uv - vec2(0.5));
  float positionalStrength = max(dist - 0.1, 0.0) * 0.1;
  positionalStrength = pow(positionalStrength, 1.5) * 7.0;

  vec4 accum = vec4(0.0);
  for (int i = 0; i < 7; i++) {
    vec2 offs1 = -dir * positionalStrength * strength * ((float(i) + rand2(uv * 5.0)) * 0.2);
    vec2 offs2 = dir * positionalStrength * strength * ((float(i) + rand2(uv * 5.0)) * 0.2);

    accum += texture2D(inputBuffer, uv + offs1);
    accum += texture2D(inputBuffer, uv + offs2);
  }
  accum *= 1.0 / 14.0;

	outputColor = accum;
}`;

class MotionBlurImpl extends Effect {
  constructor(strength = 0) {
    super("MotionBlur", fragmentShader, {
      uniforms: new Map([["strength", new Uniform(strength)]]),
    });
  }

  setStrength(value) {
    this.uniforms.get("strength").value = value;
  }
}

// Компонент ефекту
export const MotionBlur = forwardRef(({ strength = 0 }, ref) => {
  const effect = useMemo(() => new MotionBlurImpl(), []);

  useEffect(() => {
    effect.setStrength(strength);
  }, [strength]);

  return <primitive ref={ref} object={effect} dispose={null} />;
});
