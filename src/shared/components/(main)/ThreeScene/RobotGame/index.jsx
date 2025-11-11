import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { MotionBlur } from "@/hooks/MotionBlur";
import gsap from "gsap";

export const RobotGame = forwardRef((props, ref) => {
  const groupRef = useRef();
  const mixerRef = useRef({
    robot: null,
    circle: null,
    cube: null,
    mountains: null,
  });
  const actionsRef = useRef({ robot: [], circle: [], cube: [], mountains: [] });
  const currentAnimationIndex = useRef({
    robot: 0,
    circle: 0,
    cube: 0,
    mountains: 0,
  });
  const rotationSpeed = useRef(50.2);
  const isAnimationPlaying = useRef({
    robot: false,
    circle: false,
    cube: false,
    mountains: false,
  });
  const [shouldBlur, setShouldBlur] = useState(false);
  const [rotationDirection, setRotationDirection] = useState("default");
  const [movementDirection, setMovementDirection] = useState(null); // Track left/right movement for holding
  const maxDistance = 0.5; // Maximum distance for robot movement along x-axis
  const stepSize = maxDistance * 0.001; // 1% of maxDistance per key press
  const moveSpeed = 1.5; // Speed for continuous movement when holding (units per second)

  const gltfRobot = useLoader(GLTFLoader, "/models/game/RobotOld.glb");
  const gltfRobot2 = useLoader(GLTFLoader, "/models/game/RobotMove.glb");
  const gltfCircle = useLoader(GLTFLoader, "/models/game/animation.glb");
  const gltfCube = useLoader(GLTFLoader, "/models/game/Animation cube.glb");
  const gltfMountains = useLoader(GLTFLoader, "/models/game/mountains (4).glb");

  const { scene: robotScene, animations: robotAnimations } = gltfRobot;
  const { scene: robotScene2, animations: robotAnimations2 } = gltfRobot2;
  const { scene: circleScene, animations: circleAnimations } = gltfCircle;
  const { scene: cubeScene, animations: cubeAnimations } = gltfCube;
  const { scene: mountainsScene, animations: mountainsAnimations } =
    gltfMountains;

  const robotRef3D = useRef();
  const robotRef3D2 = useRef();
  const robotGroupRef = useRef();
  const robotGroupRefLevitation = useRef();
  const circleRef3D = useRef();
  const cubeRef3D = useRef();
  const mountainsRef3D = useRef();
  const skinnedMeshRef = useRef(null);
  const skinnedMeshRef2 = useRef(null);

  const boneRef = useRef();
  const boneRef2 = useRef();
  const boneRef3 = useRef();
  const boneRef4 = useRef();

  const arrowPopup = document.querySelector(".disabled-arrow");
  useEffect(() => {
    robotScene.traverse((child) => {
      if (child.isSkinnedMesh) skinnedMeshRef.current = child;
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((mat) => {
          mat.roughness = 0.1;
          mat.metalness = 0;
          mat.needsUpdate = true;
        });
      }
    });

    robotScene2.traverse((child) => {
      if (child.isSkinnedMesh) skinnedMeshRef2.current = child;
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((mat) => {
          mat.roughness = 0.1;
          mat.metalness = 0;
          mat.needsUpdate = true;
        });
      }
      if (child.isBone && child.name === "Bone011") {
        boneRef.current = child;
      }
      if (child.isBone && child.name === "Bone012") {
        boneRef2.current = child;
      }
      if (child.isBone && child.name === "Bone004") {
        boneRef3.current = child;
      }
      if (child.isBone && child.name === "Bone005") {
        boneRef4.current = child;
      }
    });
    // if (boneRef.current) {
    //   const quat = new THREE.Quaternion(
    //     1.1235, // y
    //     -0.045747, // z
    //     0.10979,   // x
    //     0.993      // w
    //   );

    //   gsap.to(boneRef.current.quaternion, {
    //     y: quat.y * 2,
    //     duration: 1,
    //     ease: "sine.inOut",
    //     yoyo: true,
    //     repeat: -1,
    //     onUpdate: () => {
    //       boneRef.current.quaternion.normalize();
    //     }
    //   });
    // }
    // console.log(boneRef, 'boneRef');

    console.log(boneRef.current.rotation);
    // console.log(boneRef2.current.rotation);
    console.log(boneRef3.current.rotation);
    // console.log(boneRef4.current.rotation);
    if (boneRef.current && boneRef3.current) {
      gsap
        .timeline({})
        .to(boneRef.current.rotation, {
          z: "-=0.8",
          x: "+=0.8",
          duration: 1.05,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        })
        .to(
          boneRef3.current.rotation,
          {
            x: "+=0.8",
            y: "+=0.4",
            z: "+=0.8",
            duration: 1.05,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          },
          "<-0.034",
        );
    }

    // if (boneRef.current) {
    //   gsap.to(boneRef.current.rotation, {
    //     z: -0.4,
    //     duration: 1,
    //     ease: "sine.inOut",
    //     yoyo: true,
    //     repeat: -1,
    //   });
    // }
    // if (boneRef2.current) {
    //   gsap.to(boneRef2.current.rotation, {
    //     x: 0.2,
    //     duration: 1,
    //     ease: "sine.inOut",
    //     yoyo: true,
    //     repeat: -1,
    //   });
    // }
    // if (boneRef3.current) {
    //   gsap.to(boneRef3.current.rotation, {
    //     x: -2.002,
    //     duration: 1,
    //     ease: "sine.inOut",
    //     yoyo: true,
    //     repeat: -1,
    //   });
    // }
    // if (boneRef4.current) {
    //   gsap.to(boneRef4.current.rotation, {
    //     x: 0.002,
    //     duration: 1,
    //     ease: "sine.inOut",
    //     yoyo: true,
    //     repeat: -1,
    //   });
    // }

    mountainsScene.traverse((child) => {
      if (child.isMesh && child.material && child.name === "mountains") {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((mat) => {
          mat.roughness = 0.9;
          mat.metalness = 0.9;
          mat.needsUpdate = true;
        });
      }
    });

    // Animation mixers
    const setupMixer = (scene, animations, modelKey) => {
      if (!animations.length) return;
      const mixer = new THREE.AnimationMixer(scene);
      mixerRef.current[modelKey] = mixer;
      actionsRef.current[modelKey] = animations.map((clip) => {
        const action = mixer.clipAction(clip);
        action.setLoop(THREE.LoopOnce);
        action.timeScale = 1.4;
        action.clampWhenFinished = true;
        return action;
      });
      mixer.addEventListener("finished", () => {
        isAnimationPlaying.current[modelKey] = false;
        setShouldBlur(
          isAnimationPlaying.current.robot ||
            isAnimationPlaying.current.circle ||
            isAnimationPlaying.current.cube ||
            isAnimationPlaying.current.mountains,
        );
      });
    };

    if (skinnedMeshRef.current) {
      setupMixer(skinnedMeshRef.current, robotAnimations, "robot");
    }

    setupMixer(circleScene, circleAnimations, "circle");
    setupMixer(cubeScene, cubeAnimations, "cube");
    setupMixer(mountainsScene, mountainsAnimations, "mountains");

    const handleKeyDown = (event) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
          event.key,
        ) &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA"
      ) {
        event.preventDefault();
      }

      if (event.repeat) return; // Ignore long press

      if (event.key === "ArrowUp") {
        setRotationDirection("forward");
        if (robotGroupRef.current) {
          gsap.to(robotGroupRef.current.rotation, {
            y: -0.1,
            x: -0.6,
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(arrowPopup, {
            opacity: 0,
            duration: 0.2,
          });
        }
      } else if (event.key === "ArrowDown") {
        setRotationDirection("backward");
        if (robotGroupRef.current) {
          gsap.to(robotGroupRef.current.rotation, {
            y: Math.PI,
            x: 0.9,
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(arrowPopup, {
            opacity: 0,
            duration: 0.2,
          });
        }
      } else if (event.key === "ArrowLeft") {
        setMovementDirection("left");
        // if (robotRef3D.current) {
        //   const newX = Math.max(-maxDistance, robotRef3D.current.position.x - stepSize);
        //   gsap.to(robotRef3D.current.position, {
        //     x: newX,
        //     duration: 0.1,
        //     ease: "power2.out",
        //   });
        // }
        if (robotGroupRef.current) {
          const newX = Math.max(
            -maxDistance,
            robotGroupRef.current.position.x - stepSize,
          );
          gsap.to(robotGroupRef.current.rotation, {
            z: 0.2,
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(robotGroupRef.current.position, {
            x: newX,
            duration: 0.01,
            ease: "power2.out",
          });
          gsap.to(arrowPopup, {
            opacity: 0,
            duration: 0.2,
          });
        }
      } else if (event.key === "ArrowRight") {
        setMovementDirection("right");
        // if (robotRef3D.current) {
        //   const newX = Math.min(maxDistance, robotRef3D.current.position.x + stepSize);
        //   gsap.to(robotRef3D.current.position, {
        //     x: newX,
        //     duration: 0.1,
        //     ease: "power2.out",
        //   });
        // }
        if (robotGroupRef.current) {
          const newX = Math.min(
            maxDistance,
            robotGroupRef.current.position.x + stepSize,
          );
          gsap.to(robotGroupRef.current.rotation, {
            z: -0.2,
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(robotGroupRef.current.position, {
            x: newX,
            duration: 0.01,
            ease: "power2.out",
          });
          gsap.to(arrowPopup, {
            opacity: 0,
            duration: 0.2,
          });
        }
      }
    };

    const handleKeyUp = (event) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
          event.key,
        ) &&
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA"
      ) {
        event.preventDefault();
      }

      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        setRotationDirection("default");
        if (robotGroupRef.current) {
          gsap.to(robotGroupRef.current.rotation, {
            y: -0.1,
            x: 0,
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(arrowPopup, {
            opacity: 1,
            duration: 0.2,
          });
        }
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        setMovementDirection(null);
        if (robotGroupRef.current) {
          gsap.to(robotGroupRef.current.rotation, {
            y: -0.1,
            x: 0,
            z: 0,
            duration: 0.3,
            ease: "power2.out",
          });
          gsap.to(arrowPopup, {
            opacity: 1,
            duration: 0.2,
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [robotAnimations, circleAnimations, cubeAnimations, mountainsAnimations]);
  const triggeredRef = useRef({
    robot: false,
    circle: false,
    cube: false,
    mountains: false,
  });
  useFrame((_, delta) => {
    Object.keys(mixerRef.current).forEach((model) => {
      const mixer = mixerRef.current[model];
      const action = actionsRef.current[model][0];

      if (mixer && action && isAnimationPlaying.current[model]) {
        const time = action.time; // скільки пройшло
        const duration = action.getClip().duration;
        const progress = time / duration;

        const percentage = Math.floor(progress * 100);
        // console.log(`Прогрес анімації ${model}: ${percentage}`);

        if (percentage === 94 && !triggeredRef.current[model]) {
          console.log(model, "triggered at 50%");

          // Визначити відповідний реф
          const modelRefMap = {
            // robot: robotRef3D,
            circle: circleRef3D,
            cube: cubeRef3D,
            // mountains: mountainsRef3D,
          };
          const robotRefMap = {
            robot: robotRef3D,
          };

          const targetRef = modelRefMap[model];
          const targetRefRobot = robotRefMap[model];
          if (targetRef?.current) {
            gsap.to(targetRef.current.position, {
              z: 10,
              duration: 2,
              ease: "power2.out",
            });
          }
          if (targetRefRobot?.current) {
            gsap.to(targetRefRobot.current.position, {
              y: 10,
              duration: 2,
              ease: "power2.out",
            });
          }
          // setTimeout(() => {
          if (robotGroupRef.current) {
            console.log(robotGroupRef.current, "Group Robot");

            gsap.fromTo(
              robotGroupRef.current.rotation,
              {
                x: -1.18,
              },
              {
                x: 0,
                duration: 1.2,
                ease: "power2.out",
              },
            );

            gsap.to(robotGroupRef.current.position, {
              y: 0.18,
              z: 7.5,
              duration: 1.2,
              ease: "power2.out",
            });
          }

          if (robotRef3D2.current) {
            gsap.to(robotRef3D2.current.rotation, {
              x: Math.PI * 2,
              duration: 2,
              ease: "power2.out",
            });
          }
          if (robotGroupRefLevitation.current) {
            gsap.to(robotGroupRefLevitation.current.position, {
              y: 0.04,
              repeat: -1,
              yoyo: true,
              duration: 1,
              ease: "sine.inOut",
            });
          }
          gsap.to(arrowPopup, {
            opacity: 1,
            duration: 0.2,
          });
          // }, 500);

          triggeredRef.current[model] = true;
        }
        if (progress >= 1) {
          isAnimationPlaying.current[model] = false;
          triggeredRef.current[model] = false;
        }
      }
    });
    mixerRef.current.robot?.update(delta);
    mixerRef.current.circle?.update(delta);
    mixerRef.current.cube?.update(delta);
    mixerRef.current.mountains?.update(delta);

    if (
      groupRef.current &&
      (isAnimationPlaying.current.robot ||
        isAnimationPlaying.current.circle ||
        isAnimationPlaying.current.cube ||
        isAnimationPlaying.current.mountains)
    ) {
      groupRef.current.rotation.z +=
        ((rotationSpeed.current * Math.PI) / 200) * delta;
    }

    // Adjust mountains rotation based on direction
    if (mountainsRef3D.current) {
      let rotationDelta =
        (((rotationSpeed.current * Math.PI) / 180) * delta) / 15;
      if (rotationDirection === "forward") {
        rotationDelta *= 5; // Accelerate forward
      } else if (rotationDirection === "backward") {
        rotationDelta *= -5; // Accelerate backward
      }
      mountainsRef3D.current.rotation.x += rotationDelta;
    }

    // Handle continuous robot movement when holding key
    if (robotGroupRef.current && movementDirection) {
      let targetX = robotGroupRef.current.position.x;
      if (movementDirection === "left") {
        targetX -= moveSpeed * delta;
        targetX = Math.max(-maxDistance, targetX); // Clamp to maxDistance
      } else if (movementDirection === "right") {
        targetX += moveSpeed * delta;
        targetX = Math.min(maxDistance, targetX); // Clamp to maxDistance
      }
      robotGroupRef.current.position.x = targetX;
    }
  });

  useImperativeHandle(ref, () => ({
    playAnimationByIndex: (model, index) => {
      if (!actionsRef.current[model]?.[index]) return;
      currentAnimationIndex.current[model] = index;
      mixerRef.current[model].stopAllAction();
      actionsRef.current[model][index].reset().play();
      isAnimationPlaying.current[model] = true;
      setShouldBlur(true);
    },
    playAllAnimations: () => {
      currentAnimationIndex.current = {
        robot: 0,
        circle: 0,
        cube: 0,
        mountains: 0,
      };
      Object.keys(mixerRef.current).forEach((model) => {
        mixerRef.current[model]?.stopAllAction();
        const action = actionsRef.current[model][0];
        if (action) {
          action.reset().play();
          isAnimationPlaying.current[model] = true;
        }
      });
      setShouldBlur(true);
    },
    animatePositions: (newPositions, duration = 1.5) => {
      const animate = (ref, pos) => {
        gsap.to(ref.current.position, {
          x: pos[0],
          y: pos[1],
          z: pos[2],
          duration,
          ease: "power2.out",
        });
      };
      if (newPositions.robot) animate(robotRef3D, newPositions.robot);
      if (newPositions.circle) animate(circleRef3D, newPositions.circle);
      if (newPositions.cube) animate(cubeRef3D, newPositions.cube);
      if (newPositions.mountains)
        animate(mountainsRef3D, newPositions.mountains);
    },
    toggleRotation: (enable) => {
      rotationSpeed.current = enable ? 40.5 : 0;
    },
    setRotationSpeed: (speed) => {
      rotationSpeed.current = speed;
    },
  }));

  return (
    <>
      <group ref={groupRef} {...props}>
        <primitive
          ref={robotRef3D}
          object={robotScene}
          position={[0, -0.3, -200.5]}
        />
        {/* <primitive ref={robotRef3D2} object={robotScene2} rotation={[0, -0.1, 0]} position={[0, 0.18, 7.5]} /> */}
        <group ref={robotGroupRefLevitation}>
          <group
            ref={robotGroupRef}
            rotation={[0, -0.1, 0]}
            position={[0, -1.18, 9.7]}
          >
            <primitive ref={robotRef3D2} object={robotScene2} />
          </group>
        </group>
        <primitive
          ref={circleRef3D}
          object={circleScene}
          position={[0.05, -0.3, -200.2]}
        />
        <primitive
          ref={cubeRef3D}
          object={cubeScene}
          position={[0, -0.8, -200.2]}
        />
        <primitive
          ref={mountainsRef3D}
          object={mountainsScene}
          position={[0, -26, 0]}
        />

        {/* <primitive ref={robotRef3D} object={robotScene} position={[0, -0.3, -1.1]} />
        <primitive ref={circleRef3D} object={circleScene} position={ [0.05, -0.3, 5.9]} />
        <primitive ref={cubeRef3D} object={cubeScene} position={[0, -0.8, 5.2]} />
        <primitive ref={mountainsRef3D} object={mountainsScene} position={[0, -15, 0]} /> */}
      </group>
      <EffectComposer disableNormalPass>
        <MotionBlur strength={shouldBlur ? 0.5 : 0} />
      </EffectComposer>
    </>
  );
});
