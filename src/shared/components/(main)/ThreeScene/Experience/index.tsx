"use client";

import { Suspense, memo } from "react";
import ModelFBO from "shared/components/(main)/ThreeScene/Experience/ModelFBO";

const Experience = memo(function Experience({
  assetPath = "/assets/about/Nikamal.png",
  opacity = 1,
  photoW = 4,
}: {
  assetPath?: string;
  opacity?: number;
  photoW?: number;
}) {
  return (
    <Suspense fallback={null}>
      <ModelFBO 
        src={assetPath} 
        opacity={opacity}
        photoW={photoW}
      />
    </Suspense>
  );
});

export default Experience;
