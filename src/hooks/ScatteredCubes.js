// components/ScatteredCubes.js
"use client";
import { useMemo, useRef } from "react";
import { InstancedMesh, Object3D } from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export function ScatteredCubes({
  count = 300,
  minDist = 20,
  maxDist = 60,
  scaleMin = 0.2,
  scaleMax = 0.6,
}) {
  const meshRef = useRef < InstancedMesh > null;
  const dummy = useRef(new Object3D());

  const gltf = useLoader(GLTFLoader, "/models/cube/Cube L.glb", (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);
  });

  const { geometry, material } = useMemo(() => {
    const mesh = gltf.scene.getObjectByProperty("type", "Mesh");
    return {
      geometry: mesh?.geometry.clone(),
      material: mesh?.material.clone(),
    };
  }, [gltf]);

  const cubes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const dir = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      ).normalize();
      const dist = minDist + Math.random() * (maxDist - minDist);
      const scale = scaleMin + Math.random() * (scaleMax - scaleMin);
      arr.push({ position: dir.multiplyScalar(dist), scale });
    }
    return arr;
  }, [count, minDist, maxDist, scaleMin, scaleMax]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    cubes.forEach((cube, i) => {
      dummy.current.position.copy(cube.position);
      dummy.current.rotation.set(
        time * 0.1 + i,
        time * 0.2 + i * 0.5,
        time * 0.3 + i * 0.2,
      );
      dummy.current.scale.setScalar(cube.scale);
      dummy.current.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.current.matrix);
    });
    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  if (!geometry || !material) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, cubes.length]}
      frustumCulled={true}
    />
  );
}
