import {
  Bloom,
  EffectComposer,
  HueSaturation,
  TiltShift2,
  Vignette,
} from "@react-three/postprocessing";
import { useMemo } from "react";
import { BlendFunction, KernelSize } from "postprocessing";

interface Props {
  enabled?: boolean;
  quality?: "auto" | "low" | "medium" | "high";
}

export function PostProcessingEffects({ enabled = true }: Props) {
  const settings = useMemo(() => {
    const presets = {
      low: {
        multisampling: 0,
        bloomRadius: 0.3,
        bloomIntensity: 0.3,
        tiltShiftBlur: 0.6,
        kernelSize: KernelSize.VERY_SMALL,
      },
      medium: {
        multisampling: 2,
        bloomRadius: 0.3,
        bloomIntensity: 1.0,
        tiltShiftBlur: 0.7,
        kernelSize: KernelSize.MEDIUM,
      },
      high: {
        multisampling: 4,
        bloomRadius: 0.3,
        bloomIntensity: 1.0,
        tiltShiftBlur: 0.7,
        kernelSize: KernelSize.LARGE,
      },
    };

    return presets.low;
  }, []);

  if (!enabled) return null;

  return (
    <EffectComposer multisampling={settings.multisampling}>
      <Bloom
        kernelSize={settings.kernelSize}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={settings.bloomIntensity}
        mipmapBlur={true}
      />
      <TiltShift2
        blur={settings.tiltShiftBlur}
        taper={2}
        blendFunction={BlendFunction.NORMAL}
      />
      <Vignette
        offset={0.35}
        darkness={0.55}
        blendFunction={BlendFunction.NORMAL}
      />
      <HueSaturation
        hue={0.2}
        saturation={0.1}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
