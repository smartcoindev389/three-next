import * as THREE from "three";

const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    transitionProgress: { value: 0 },
    robotHeight: { value: 10 },
  },
  vertexShader: `
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float transitionProgress;
    uniform float robotHeight;
    
    void main() {
      vPosition = position;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float time;
    uniform float transitionProgress;
    uniform float robotHeight;
    
    void main() {
      // Нормализуем Y координату относительно высоты робота
      float normalizedY = (vPosition.y + robotHeight * 0.5) / robotHeight;
      
      // Создаем волновой эффект появления снизу
      float wave = sin(normalizedY * 3.14159 + time * 2.0) * 0.1;
      float progress = smoothstep(0.0, 1.0, transitionProgress - normalizedY + wave);
      
      // Подложка с легким свечением
      vec3 baseColor = vec3(1.0, 1.0, 1.0);
      float alpha = progress * 0.3;
      
      // Добавляем rim lighting
      float rimPower = 1.0 - abs(dot(vNormal, normalize(vPosition)));
      alpha += rimPower * progress * 0.2;
      
      gl_FragColor = vec4(baseColor, alpha);
    }
  `,
  transparent: true,
  side: THREE.DoubleSide,
});

export default material;
