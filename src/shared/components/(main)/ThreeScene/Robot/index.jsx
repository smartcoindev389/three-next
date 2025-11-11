import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  useMemo,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { HolographicMaterial } from "./HolographicMaterial";
import * as THREE from "three";
import gsap from "gsap";

export const Robot = forwardRef((props, ref) => {
  const robotRef = useRef();
  const holographicGroupRef = useRef();
  const normalGroupRef = useRef();
  const insideRef = useRef();
  const mixerRef = useRef();
  const clockRef = useRef(new THREE.Clock());
  const actionsRef = useRef({});
  const animationRef = useRef(null);
  const robotGltf = useLoader(GLTFLoader, "/models/robot/Анімація 1.glb");

  const { sceneObjects, normalScene, centerOffset } = useMemo(() => {
    const normalScene = robotGltf.scene;

    const box = new THREE.Box3().setFromObject(normalScene);
    const center = box.getCenter(new THREE.Vector3());

    const offset = {
      x: -center.x,
      y: -center.y,
      z: -center.z,
    };

    const objects = [];

    normalScene.traverse((child) => {
      if (child.isMesh) {
        const mesh = {
          geometry: child.geometry.clone(),
          material: child.material.clone(),
          skeleton: child.skeleton,
          position: child.position
            .clone()
            .add(new THREE.Vector3(offset.x, offset.y, offset.z)),
          rotation: child.rotation.clone(),
          scale: child.scale.clone(),
          matrixWorld: child.matrixWorld.clone(),
        };
        objects.push(mesh);

        if (!props.onlyOne) {
          child.material.transparent = true;
          child.material.opacity = 0;
        }
      }
    });

    return {
      sceneObjects: objects,
      normalScene: normalScene,
      centerOffset: offset,
    };
  }, [robotGltf]);

  useImperativeHandle(
    ref,
    () => ({
      robot: robotRef.current,

      toggleAnimation: (animationName, onComplete) => {
        if (!mixerRef.current) return;

        const action = actionsRef.current[animationName];
        if (action) {
          if (action.isRunning() && !action.paused) {
            action.paused = true;
          } else if (action.paused) {
            action.paused = false;
          } else {
            action.reset();
            action.setLoop(THREE.LoopOnce);
            action.play();

            if (onComplete) {
              const onFinished = (event) => {
                if (event.action === action) {
                  onComplete();
                  mixerRef.current.removeEventListener("finished", onFinished);
                }
              };
              mixerRef.current.addEventListener("finished", onFinished);
            }
          }
        }
      },

      toNormal: (onComplete) => {
        const transitionProgress = { value: 0 };

        gsap.to(transitionProgress, {
          value: 1,
          duration: 3,
          ease: "power1.inOut",
          onComplete: () => {
            onComplete?.();
            normalGroupRef.current?.traverse((child, i) => {
              if (child.isMesh) {
                child.material.transparent = false;
              }
            });
          },
          onUpdate: () => {
            const opacity = transitionProgress.value;
            holographicGroupRef.current?.children?.forEach((child) => {
              child.material.opacity = 1 - opacity;
            });
            normalGroupRef.current?.traverse((child, i) => {
              if (child.isMesh) {
                child.material.transparent = true;
                child.material.opacity = opacity;
              }
            });
          },
        });
      },
    }),
    [],
  );

  useEffect(() => {
    if (robotGltf.animations && robotGltf.animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(normalScene);

      robotGltf.animations.forEach((clip) => {
        const clonedClip = clip.clone();
        const action = mixerRef.current.clipAction(clonedClip);
        actionsRef.current[clip.name] = action;
      });

      if (props.autoPlay && robotGltf.animations.length > 0) {
        const firstAnimation = robotGltf.animations[0];
        const action = actionsRef.current[firstAnimation.name];
        action.play();
        action.setLoop(THREE.LoopRepeat);
      }

      if (props.onReady) {
        props.onReady();
      }
    }

    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      actionsRef.current = {};
    };
  }, [robotGltf, normalScene, props.autoPlay, props.onReady]);

  useFrame(() => {
    if (mixerRef.current) {
      const delta = clockRef.current.getDelta();
      mixerRef.current.update(delta);
    }
  });

  useEffect(() => {
    gsap.to(insideRef.current.position, {
      x: `+=${-0.01}`,
      y: `+=${0.01}`,
      z: `+=${0.01}`,
      duration: 2,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });
    return () => {
      gsap.killTweensOf(insideRef.current?.position);
      gsap.killTweensOf(insideRef.current?.rotation);
    };
  }, []);

  return (
    <group
      scale={props.scale}
      ref={robotRef}
      position={props.position}
      rotation={props.rotation}
    >
      <group ref={insideRef}>
        <group visible={props.showHolographic} ref={holographicGroupRef}>
          {sceneObjects.map((obj, i) => (
            <mesh
              key={`holo-${i}`}
              geometry={obj.geometry}
              position={obj.position}
              rotation={obj.rotation}
              scale={obj.scale}
              skeleton={obj.skeleton}
              matrixWorld={obj.matrixWorld}
            >
              <HolographicMaterial
                hologramColor={props.hologramColor || "#51a4de"}
                hologramOpacity={1}
                scanlineSize={8}
                signalSpeed={0.5}
              />
            </mesh>
          ))}
        </group>
        <group
          position={[centerOffset.x, centerOffset.y, centerOffset.z]}
          ref={normalGroupRef}
          visible={props.showNormal}
        >
          <primitive object={normalScene} />
        </group>
      </group>
    </group>
  );
});

Robot.displayName = "Robot";
