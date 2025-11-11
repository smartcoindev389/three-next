import {
  getBezierPoint,
  percentageCalculatorPosition,
  percentageCalculatorRotation,
  randomFloat,
  blendCoordinates,
  centerBox3,
} from "./utilit";
import * as TRAITS from "./traitsPreset";
import * as THREE from "three";
import gsap from "gsap";

const euler = new THREE.Euler(0, 0, 0, "XYZ");

export function CreateTemplatePresetHello(key, p, callback) {
  /// машим привіт /// chank 1
  const { deInitActivePreset, actions, tRef } = p;

  tRef.current = 0;

  const action = actions["greeting "];
  action.setLoop(THREE.LoopOnce, 1);
  const mixer = action.getMixer();

  const onFinished = (e) => {
    // колбек завершеня анімації
    if (e.action === action) {
      console.log("Анімація завершилась" + key + "!");
      mixer.removeEventListener("finished", onFinished); // відписка завершеня анімації
    }
  };

  mixer.addEventListener("finished", onFinished);

  deInitActivePreset.current.set(key, async () => {
    // додаємо дескриптор
    console.log("Анімація завершилась примусово зупинено");
    mixer.removeEventListener("finished", onFinished); // відписка завершеня анімації
    actions["greeting "].fadeOut(0.3);
    deInitActivePreset.current.delete(key); // видаляємо дескриптор
  }); /////

  action.reset().fadeIn(0.5).play();
  return { frame: null };
}

////////////2
export class startPosition {
  tRef = 0;

  pointsPotationRobot;
  pointsPositionRobot;
  pointsHeadTarget;
  euler = new THREE.Euler(0, 0, 0, "XYZ");
  targetQuat = new THREE.Quaternion().setFromEuler(this.euler);
  onUpdateScroll = 0;
  scrollYOfSet = 0;
  pointsPositionRobotGeneric;
  pointsPotationRobotGeneric;

  p;

  constructor(key, p, callback) {
    this.p = p;

    this.callback = callback;
    this.scrollYOfSet = document.documentElement.scrollHeight / 26.2;

    const scrollYOfSetProc = () => {
      return (p.viewport.height / 100) * randomFloat(2, 7);
    };

    p.lookTarget3d.current.position.set(0, 0, 40);
    p.nowUnitRobot.current.positionLookAtTarget = { x: 0, y: 0, z: 40 };
    p.nowUnitRobot.current.positionRobot.x = 0;
    p.nowUnitRobot.current.positionRobot.y = 0;
    p.nowUnitRobot.current.positionRobot.z = 0;

    centerBox3(p.robotHolographic.current);
    p.nowUnitRobot.current.positionRobot = centerBox3(p.gltf);

    this.pointsPositionRobotGeneric = () => {
      this.pointsPositionRobot = [
        {
          x: p.nowUnitRobot.current.positionRobot.x,
          y: p.nowUnitRobot.current.positionRobot.y,
          z: p.nowUnitRobot.current.positionRobot.z,
        },

        {
          x: p.nowUnitRobot.current.positionRobot.x + randomFloat(-0.05, 0.05),
          y: p.nowUnitRobot.current.positionRobot.y + randomFloat(-0.05, 0.05),
          z: p.nowUnitRobot.current.positionRobot.z + randomFloat(-0.05, 0.05),
        },

        {
          x: p.nowUnitRobot.current.positionRobot.x + scrollYOfSetProc(),
          y: p.nowUnitRobot.current.positionRobot.y,
          z: p.nowUnitRobot.current.positionRobot.z,
        },

        {
          x: p.nowUnitRobot.current.positionRobot.x - scrollYOfSetProc(),
          y: p.nowUnitRobot.current.positionRobot.y - scrollYOfSetProc(),
          z: p.nowUnitRobot.current.positionRobot.z - randomFloat(1, 3),
        },

        {
          x: p.nowUnitRobot.current.positionRobot.x,
          y: p.nowUnitRobot.current.positionRobot.y,
          z: p.nowUnitRobot.current.positionRobot.z,
        },
      ];
    };
    this.pointsPositionRobotGeneric();

    this.pointsPotationRobotGeneric = () => {
      this.pointsPotationRobot = [
        {
          x: p.nowUnitRobot.current.rotationRobot.x,
          y: p.nowUnitRobot.current.rotationRobot.y,
          z: p.nowUnitRobot.current.rotationRobot.z,
        },

        {
          x: p.nowUnitRobot.current.rotationRobot.x,
          y:
            p.nowUnitRobot.current.rotationRobot.y + randomFloat(-0.005, 0.005),
          z: p.nowUnitRobot.current.rotationRobot.z,
        },

        {
          x: p.nowUnitRobot.current.rotationRobot.x + randomFloat(0.01, 0.05),
          y: p.nowUnitRobot.current.rotationRobot.y + randomFloat(0.05, 0.1),
          z: p.nowUnitRobot.current.rotationRobot.z + randomFloat(0, 0.03),
        },

        {
          x: p.nowUnitRobot.current.rotationRobot.x - randomFloat(0.01, 0.1),
          y: p.nowUnitRobot.current.rotationRobot.y - randomFloat(0.05, 0.2),
          z: p.nowUnitRobot.current.rotationRobot.z - randomFloat(0, 0.05),
        },

        {
          x: p.nowUnitRobot.current.rotationRobot.x,
          y: p.nowUnitRobot.current.rotationRobot.y,
          z: p.nowUnitRobot.current.rotationRobot.z,
        },
      ];
    };
    this.pointsPotationRobotGeneric();

    this.pointsHeadTarget = [
      { x: 30, y: -10, z: 40 },
      { x: 70, y: -25, z: 10 },
      { x: 5, y: -35, z: 35 },
      { x: -50, y: -20, z: 40 },
      { x: 0, y: 0, z: 40 },
    ];

    const dummy = new THREE.Object3D();

    p.deInitActivePreset.current.set(key, async () => {
      // додаємо дескриптор
      console.log("deInitActivePreset startPosition");
      return new Promise((resolve, reject) => {
        const transitionProgress = { value: 0 };

        gsap.to(transitionProgress, {
          value: 1,
          duration: 1,
          ease: "power1.inOut",
          onComplete: () => {
            p.gltf.traverse((child, i) => {
              if (child.isMesh) {
                child.material.transparent = false;
              }
            });

            p.robotHolographic.current.clear();
            p.robotHolographic.current.parent?.remove?.(
              p.robotHolographic.current,
            );
            resolve();
          },
          onUpdate: () => {
            const opacity = transitionProgress.value;
            p.robotHolographic.current?.children?.forEach((child) => {
              child.material.opacity = 1 - opacity;
            });

            p.gltf.traverse((child, i) => {
              if (child.isMesh) {
                child.material.transparent = true;
                child.material.opacity = opacity;
              }
            });

            const bone = p.gltf.getObjectByName("Head");
            const targetPos = p.lookTarget3d.current.position;

            const targetQuaternion = new THREE.Quaternion();

            dummy.position.copy(bone.position);
            dummy.lookAt(targetPos);
            targetQuaternion.copy(dummy.quaternion);

            bone.quaternion.slerp(targetQuaternion, 0.05);
          },
        });
      });
    });
  }

  frame(pFrame) {
    const { delta } = pFrame;

    const fixedDelta = Math.min(delta, 0.016); // ~60 FPS
    this.tRef += Math.min(delta, 0.016) * 0.15;

    if (this.tRef > 1) {
      this.tRef = 0;
      this.pointsPositionRobotGeneric();
      this.pointsPotationRobotGeneric();
      return true;
    }

    this.p.nowUnitRobot.current.positionRobot = getBezierPoint(
      this.pointsPositionRobot,
      this.tRef,
    );

    const target = new THREE.Vector3(0, 0, 0);

    target.x = this.p.nowUnitRobot.current.positionRobot.x;
    target.y =
      this.p.nowUnitRobot.current.positionRobot.y +
      window.scrollY / this.scrollYOfSet;
    target.z = this.p.nowUnitRobot.current.positionRobot.z;

    this.p.gltf.position.lerp(target, 0.005);
    this.p.robotHolographic.current.position.lerp(target, 0.005);

    this.p.nowUnitRobot.current.rotationRobot = getBezierPoint(
      this.pointsPotationRobot,
      this.tRef,
    );

    this.euler.x = this.p.nowUnitRobot.current.rotationRobot.x;
    this.euler.y = this.p.nowUnitRobot.current.rotationRobot.y;
    this.euler.z = this.p.nowUnitRobot.current.rotationRobot.z;

    this.p.gltf.rotation.copy(this.euler);
    this.p.robotHolographic.current.rotation.copy(this.euler);

    const bone = this.p.gltf.getObjectByName("Head");

    return true;
  }
}

export class CreateTemplatePreset1 {
  t = 0;
  onUpdateScroll = 0;
  scrollYOfSet = 0;

  constructor(key, p, callback) {
    this.p = p;
    this.scrollYOfSet = document.documentElement.scrollHeight / 26.2;

    this.callback = () => {
      this.p.activeFramePreset.current = new levitation("key", this.p);
      new CreateTemplatePresetHello("key", this.p, null);
      callback?.();
    };

    this.pointsPositionRobot = percentageCalculatorPosition(
      [
        { x: 0, y: 0, z: 0 },
        { x: 0, y: -2, z: 0 },
        { x: 0, y: -2, z: 0 },
        { x: 0, y: -2, z: 13 },
        { x: 0, y: -2, z: 14 },
        { x: 0, y: 0, z: 15 },
      ],
      this.p.viewport.width,
      this.p.viewport.height,
    );

    this.pointsPotationRobot = percentageCalculatorRotation([
      { x: 0, y: 5, z: 0 },
      { x: 0, y: 20, z: 0 },
      { x: 0, y: 20, z: 0 },
      { x: 0, y: -20, z: 0 },
      { x: 0, y: -30, z: 0 },
      { x: 20, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
    ]);

    this.pointsHeadTarget = [
      { x: 0, y: 0, z: 40 },
      { x: 0, y: 0, z: 40 },
      { x: 10, y: -10, z: 40 },
      { x: 20, y: -20, z: 40 },
      { x: 0, y: 0, z: 40 },
      { x: 0, y: 0, z: 40 },
      { x: 0, y: 0, z: 40 },
    ];

    TRAITS.blendCoordinates_default.call(this);
  }

  frame = TRAITS.frame_default;
}

////////////2
export class CreateTemplatePreset2 {
  t = 0;

  constructor(key, p, callback) {
    this.p = p;

    this.callback = () => {
      this.p.activeFramePreset.current = new levitation("key", this.p);
      callback?.();
    };

    this.scrollYOfSet = document.documentElement.scrollHeight / 26.2;

    this.pointsPositionRobot = percentageCalculatorPosition(
      [
        { x: 0, y: 0, z: 0 },
        { x: 20, y: 20, z: 0 },
        { x: 30, y: 0, z: 7 },
        { x: 50, y: -5, z: 9 },
        { x: 25, y: -65, z: 11 },
        { x: 0, y: -45, z: 13 },
        { x: -22, y: -40, z: 15 },
        { x: -22, y: -35, z: 15 },
      ],
      p.viewport.width,
      p.viewport.height,
    );

    this.pointsPotationRobot = percentageCalculatorRotation([
      { x: 0, y: 0, z: 0 },
      { x: 20, y: 20, z: 0 },
      { x: 20, y: 20, z: 0 },
      { x: 10, y: 20, z: 10 },
      { x: 10, y: -35, z: 10 },
      { x: 20, y: -20, z: 10 },
      { x: -1, y: 1, z: -1 },
      { x: 0, y: 1, z: 0 },
    ]);

    this.pointsHeadTarget = [
      { x: 30, y: -10, z: 40 },
      { x: 70, y: -25, z: 10 },
      { x: 5, y: -35, z: 35 },
      { x: -50, y: -20, z: 40 },
      { x: -10, y: -5, z: 40 },
      { x: 0, y: 0, z: 40 },
    ];

    TRAITS.blendCoordinates_default.call(this);
  }

  frame = TRAITS.frame_default;
}
/////////////////

////////////2
export class CreateTemplatePreset2Bottom {
  t = 0;

  constructor(key, p, callback) {
    this.p = p;
    this.scrollYOfSet = document.documentElement.scrollHeight / 26.2;

    this.callback = () => {
      this.p.activeFramePreset.current = new levitation("key", this.p);
      callback?.();
    };

    this.pointsPositionRobot = percentageCalculatorPosition(
      [
        { x: 0, y: 0, z: 10 },
        { x: 0, y: 0, z: 10 },
        { x: 0, y: 0, z: 10 },
        { x: 0, y: 0, z: 15 },
      ],
      p.viewport.width,
      p.viewport.height,
    );

    this.pointsPotationRobot = percentageCalculatorRotation([
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
    ]);

    this.pointsHeadTarget = [
      { x: 0, y: 0, z: 40 },
      { x: 0, y: 0, z: 40 },
      { x: 0, y: 0, z: 40 },
    ];

    TRAITS.blendCoordinates_default.call(this);
  }

  frame = TRAITS.frame_default;
}

////////////2
export class CreateTemplatePreset4 {
  t = 0;
  flagCektion = 0;
  p;

  constructor(key, p, callback) {
    this.p = p;

    this.callback = () => {
      this.p.activeFramePreset.current = new levitation("key", this.p);
      callback?.();
    };

    this.scrollYOfSet = document.documentElement.scrollHeight / 26.2;

    /*
    p.deInitActivePreset.current.set(key, async () => { // додаємо дескриптор
      return new Promise((resolve, reject) => {
        this.resolve = resolve;

      });

    });
*/

    this.pointsPositionRobot = percentageCalculatorPosition(
      [
        { x: -22, y: 0, z: 15 },
        { x: -40, y: 5, z: 15 },
        { x: -60, y: 8, z: 15 },
      ],
      p.viewport.width,
      p.viewport.height,
    );

    this.pointsPositionRobot2 = percentageCalculatorPosition(
      [
        { x: 60, y: -40, z: 15 },
        { x: 22, y: -40, z: 15 },
        { x: 22, y: -40, z: 15 },
      ],
      p.viewport.width,
      p.viewport.height,
    );

    this.pointsPotationRobot = percentageCalculatorRotation([
      { x: 0, y: 0, z: 0 },
      { x: 20, y: 20, z: 0 },
      { x: 0, y: 0, z: 0 },
    ]);

    this.pointsPotationRobot2 = percentageCalculatorRotation([
      { x: 0, y: 0, z: 0 },
      { x: 20, y: 20, z: 0 },
      { x: 20, y: 20, z: 0 },
      { x: 10, y: 20, z: 10 },
      { x: 10, y: -35, z: 10 },
      { x: 20, y: -20, z: 10 },
      { x: 20, y: -20, z: 10 },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
    ]);

    console.log("this.pointsPotationRobot", this.pointsPotationRobot);

    this.pointsHeadTarget = [
      { x: -50, y: -20, z: 40 },
      { x: -50, y: -20, z: 40 },
      { x: 0, y: 0, z: 40 },
    ];

    this.pointsHeadTarget2 = [
      { x: 30, y: -10, z: 40 },
      { x: 70, y: -25, z: 10 },
      { x: 5, y: -35, z: 35 },
      { x: -50, y: -20, z: 40 },
      { x: 0, y: 0, z: 40 },
    ];

    TRAITS.blendCoordinates_default.call(this);
  }

  frame(p) {
    const { delta } = p;

    const fixedDelta = Math.min(delta, 0.016); // ~60 FPS
    this.t += fixedDelta * (window.scrollY / 2000);

    if (this.t > 1) {
      if (this.flagCektion === 0) {
        this.pointsPositionRobot = this.pointsPositionRobot2;
        this.pointsPotationRobot = this.pointsPotationRobot2;
        this.pointsHeadTarget = this.pointsHeadTarget2;

        this.flagCektion = 1;
        this.t = 0;
        this.scrM = 55;
        this.p.gltf.position.x = this.pointsPositionRobot[0].x;
        this.p.gltf.position.y = this.pointsPositionRobot[0].y;
        this.p.gltf.position.z = this.pointsPositionRobot[0].z;

        this.p.nowUnitRobot.current.positionRobot.x =
          this.pointsPositionRobot[0].x;
        this.p.nowUnitRobot.current.positionRobot.y =
          this.pointsPositionRobot[0].y;
        this.p.nowUnitRobot.current.positionRobot.x =
          this.pointsPositionRobot[0].z;
        return true;
      } else {
        this.t = 1;
        requestAnimationFrame(this.callback);
      }
    }

    this.p.nowUnitRobot.current.positionRobot = getBezierPoint(
      this.pointsPositionRobot,
      this.t,
    );

    const target = new THREE.Vector3(0, 0, 0);

    target.x = this.p.nowUnitRobot.current.positionRobot.x;
    target.y =
      this.p.nowUnitRobot.current.positionRobot.y +
      window.scrollY / this.scrollYOfSet;
    target.z = this.p.nowUnitRobot.current.positionRobot.z;

    this.p.gltf.position.lerp(target, 0.05);

    this.p.nowUnitRobot.current.rotationRobot = getBezierPoint(
      this.pointsPotationRobot,
      this.t,
    );

    euler.x = this.p.nowUnitRobot.current.rotationRobot.x; // * Math.PI / 180;
    euler.y = this.p.nowUnitRobot.current.rotationRobot.y; // * Math.PI / 180;
    euler.z = this.p.nowUnitRobot.current.rotationRobot.z; // * Math.PI / 180;

    this.p.gltf.rotation.copy(euler);

    this.p.nowUnitRobot.current.positionLookAtTarget = getBezierPoint(
      this.pointsHeadTarget,
      this.t,
    );

    const bone = this.p.gltf.getObjectByName("Head");

    this.p.lookTarget3d.current.position.x =
      this.p.nowUnitRobot.current.positionLookAtTarget.x;
    this.p.lookTarget3d.current.position.y =
      this.p.nowUnitRobot.current.positionLookAtTarget.y;
    this.p.lookTarget3d.current.position.z =
      this.p.nowUnitRobot.current.positionLookAtTarget.z;

    bone.lookAt(this.p.lookTarget3d.current.position);

    return true;
  }
}
/////////////////

////////////2
export class CreateTemplatePreset5 {
  t = 0;

  constructor(key, p, callback) {
    this.p = p;

    this.callback = () => {
      this.p.activeFramePreset.current = new levitation("key", this.p);
      callback?.();
    };

    this.scrollYOfSet = document.documentElement.scrollHeight / 26.2;

    this.pointsPositionRobot = percentageCalculatorPosition(
      [
        { x: 22, y: -90, z: 15 },
        { x: 22, y: -90, z: 12 },
        { x: 22, y: -90, z: 8 },
        { x: 50, y: -90, z: 5 },
      ],
      p.viewport.width,
      p.viewport.height,
    );

    this.pointsPotationRobot = percentageCalculatorRotation([
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
    ]);

    this.pointsHeadTarget = [
      { x: 30, y: -10, z: 40 },
      { x: 70, y: -25, z: 10 },
      { x: 5, y: -35, z: 35 },
      { x: -50, y: -20, z: 40 },
      { x: 0, y: 0, z: 40 },
    ];

    TRAITS.blendCoordinates_default.call(this);
  }

  frame = TRAITS.frame_default;
}
/////////////////

////////////2
export class CreateTemplatePreset6 {
  t = 0;

  constructor(key, p, callback) {
    this.p = p;
    this.scrollYOfSet = document.documentElement.scrollHeight / 26.2;

    this.callback = () => {
      this.p.activeFramePreset.current = new levitation("key", this.p);
      callback?.();
    };

    this.pointsPositionRobot = percentageCalculatorPosition(
      [
        { x: 0, y: -50, z: 5 },
        { x: -5, y: -50, z: 10 },
        { x: -5, y: -50, z: 10 },
        { x: -5, y: -50, z: 10 },
      ],
      p.viewport.width,
      p.viewport.height,
    );

    this.pointsPotationRobot = percentageCalculatorRotation([
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 30 },
      { x: 0, y: 0, z: 0 },
    ]);

    this.pointsHeadTarget = [
      { x: 30, y: -10, z: 40 },
      { x: 70, y: -25, z: 10 },
      { x: 5, y: -35, z: 35 },
      { x: -50, y: -20, z: 40 },
      { x: 0, y: 0, z: 40 },
    ];

    TRAITS.blendCoordinates_default.call(this);
  }

  frame = TRAITS.frame_default;
}

////////////2
export class CreateTemplatePreset7 {
  t = 0;

  constructor(key, p, callback) {
    this.p = p;
    this.scrollYOfSet = document.documentElement.scrollHeight / 26.2;

    this.callback = () => {
      this.p.activeFramePreset.current = new levitation("key", this.p);
      callback?.();
    };

    this.pointsPositionRobot = percentageCalculatorPosition(
      [
        { x: 5, y: -50, z: 5 },
        { x: 5, y: -50, z: 10 },
        { x: 5, y: -50, z: 10 },
        { x: 5, y: -50, z: 10 },
      ],
      p.viewport.width,
      p.viewport.height,
    );

    this.pointsPotationRobot = percentageCalculatorRotation([
      { x: 5, y: 0, z: 0 },
      { x: 10, y: 0, z: -10 },
      { x: 0, y: 0, z: 0 },
    ]);

    this.pointsHeadTarget = [
      { x: 0, y: 0, z: 40 },
      { x: 0, y: 0, z: 40 },
      { x: 0, y: 0, z: 40 },
      { x: 0, y: 0, z: 40 },
      { x: 0, y: 0, z: 40 },
    ];

    TRAITS.blendCoordinates_default.call(this);
  }

  frame = TRAITS.frame_default;
}

////////////2
export class CreateTemplatePreset8 {
  t = 0;

  constructor(key, p, callback) {
    this.p = p;
    this.scrollYOfSet = document.documentElement.scrollHeight / 26.2;

    this.callback = () => {
      this.p.activeFramePreset.current = new levitation("key", this.p);
      callback?.();
    };

    this.pointsPositionRobot = percentageCalculatorPosition(
      [
        { x: 0, y: 0, z: 10 },
        { x: 15, y: -50, z: 10 },
        { x: 25, y: -60, z: 10 },
        { x: 50, y: -70, z: 10 },
      ],
      p.viewport.width,
      p.viewport.height,
    );

    this.pointsPotationRobot = percentageCalculatorRotation([
      { x: 5, y: 0, z: 0 },
      { x: 5, y: 0, z: 0 },
      { x: 5, y: 0, z: 0 },
    ]);

    this.pointsHeadTarget = [
      { x: 0, y: 0, z: 40 },
      { x: 6, y: 0, z: 40 },
      { x: 10, y: -10, z: 40 },
      { x: 30, y: -10, z: 45 },
    ];

    TRAITS.blendCoordinates_default.call(this);
    this.speed = 0.8;
  }

  frame = TRAITS.frame_default;
}

////////////2
export class levitation {
  gltf;
  lookTarget3d;
  tRef;

  pointsPotationRobot;
  pointsPositionRobot;
  pointsHeadTarget;
  euler = new THREE.Euler(0, 0, 0, "XYZ");
  targetQuat = new THREE.Quaternion().setFromEuler(this.euler);
  onUpdateScroll = 0;
  scrollYOfSet = 0;
  pointsPositionRobotGeneric;
  pointsPotationRobotGeneric;

  p;

  constructor(key, p, callback) {
    const {
      gltf,
      lookTarget3d,
      tRef,
      nowUnitRobot,
      speed,
      onUpdateScroll,
      width,
      height,
    } = p;
    this.gltf = gltf;
    this.lookTarget3d = lookTarget3d;
    this.tRef = tRef;
    this.callback = callback;
    //this.speed = speed;
    this.nowUnitRobot = nowUnitRobot;
    this.onUpdateScroll = onUpdateScroll;
    this.scrollYOfSet = document.documentElement.scrollHeight / 26.2;
    tRef.current = 0;
    const scrollYOfSetProc = () => {
      return (height / 100) * randomFloat(2, 7);
    };

    this.pointsPositionRobotGeneric = () => {
      this.pointsPositionRobot = [
        {
          x: this.nowUnitRobot.current.positionRobot.x,
          y: this.nowUnitRobot.current.positionRobot.y,
          z: this.nowUnitRobot.current.positionRobot.z,
        },

        {
          x:
            this.nowUnitRobot.current.positionRobot.x +
            randomFloat(-0.05, 0.05),
          y:
            this.nowUnitRobot.current.positionRobot.y +
            randomFloat(-0.05, 0.05),
          z:
            this.nowUnitRobot.current.positionRobot.z +
            randomFloat(-0.05, 0.05),
        },

        {
          x: this.nowUnitRobot.current.positionRobot.x + scrollYOfSetProc(),
          y: this.nowUnitRobot.current.positionRobot.y,
          z: this.nowUnitRobot.current.positionRobot.z,
        },

        {
          x: this.nowUnitRobot.current.positionRobot.x - scrollYOfSetProc(),
          y: this.nowUnitRobot.current.positionRobot.y - scrollYOfSetProc(),
          z: this.nowUnitRobot.current.positionRobot.z - randomFloat(1, 3),
        },

        {
          x: this.nowUnitRobot.current.positionRobot.x,
          y: this.nowUnitRobot.current.positionRobot.y,
          z: this.nowUnitRobot.current.positionRobot.z,
        },
      ];
    };
    this.pointsPositionRobotGeneric();

    this.pointsPotationRobotGeneric = () => {
      this.pointsPotationRobot = [
        {
          x: this.nowUnitRobot.current.rotationRobot.x,
          y: this.nowUnitRobot.current.rotationRobot.y,
          z: this.nowUnitRobot.current.rotationRobot.z,
        },

        {
          x: this.nowUnitRobot.current.rotationRobot.x,
          y:
            this.nowUnitRobot.current.rotationRobot.y +
            randomFloat(-0.005, 0.005),
          z: this.nowUnitRobot.current.rotationRobot.z,
        },

        {
          x:
            this.nowUnitRobot.current.rotationRobot.x + randomFloat(0.01, 0.05),
          y: this.nowUnitRobot.current.rotationRobot.y + randomFloat(0.05, 0.1),
          z: this.nowUnitRobot.current.rotationRobot.z + randomFloat(0, 0.03),
        },

        {
          x: this.nowUnitRobot.current.rotationRobot.x - randomFloat(0.01, 0.1),
          y: this.nowUnitRobot.current.rotationRobot.y - randomFloat(0.05, 0.2),
          z: this.nowUnitRobot.current.rotationRobot.z - randomFloat(0, 0.05),
        },

        {
          x: this.nowUnitRobot.current.rotationRobot.x,
          y: this.nowUnitRobot.current.rotationRobot.y,
          z: this.nowUnitRobot.current.rotationRobot.z,
        },
      ];
    };
    this.pointsPotationRobotGeneric();

    this.pointsHeadTarget = [
      { x: 30, y: -10, z: 40 },
      { x: 70, y: -25, z: 10 },
      { x: 5, y: -35, z: 35 },
      { x: -50, y: -20, z: 40 },
      { x: 0, y: 0, z: 40 },
    ];

    this.pointsPositionRobot[0] = this.nowUnitRobot.current.positionRobot;
    this.pointsPositionRobot[1] = blendCoordinates(
      this.pointsPositionRobot[1],
      this.nowUnitRobot.current.positionRobot,
      0.6,
    );

    this.pointsPotationRobot[0] = nowUnitRobot.current.rotationRobot;
    this.pointsPotationRobot[1] = blendCoordinates(
      this.pointsPotationRobot[1],
      this.nowUnitRobot.current.rotationRobot,
      0.6,
    );

    this.pointsHeadTarget[0] = this.nowUnitRobot.current.positionLookAtTarget;
    this.pointsHeadTarget[1] = blendCoordinates(
      this.pointsHeadTarget[1],
      this.nowUnitRobot.current.positionLookAtTarget,
      0.6,
    );
  }

  frame(p) {
    const { delta } = p;

    const fixedDelta = Math.min(delta, 0.016); // ~60 FPS
    this.tRef.current += Math.min(delta, 0.016) * 0.15;

    if (this.tRef.current > 1) {
      this.tRef.current = 0;
      this.pointsPositionRobotGeneric();
      this.pointsPotationRobotGeneric();
      return true;
    }

    this.nowUnitRobot.current.positionRobot = getBezierPoint(
      this.pointsPositionRobot,
      this.tRef.current,
    );

    const target = new THREE.Vector3(0, 0, 0);

    target.x = this.nowUnitRobot.current.positionRobot.x;
    target.y =
      this.nowUnitRobot.current.positionRobot.y +
      window.scrollY / this.scrollYOfSet;
    target.z = this.nowUnitRobot.current.positionRobot.z;

    this.gltf.position.lerp(target, 0.02);

    this.nowUnitRobot.current.rotationRobot = getBezierPoint(
      this.pointsPotationRobot,
      this.tRef.current,
    );

    this.euler.x = this.nowUnitRobot.current.rotationRobot.x;
    this.euler.y = this.nowUnitRobot.current.rotationRobot.y;
    this.euler.z = this.nowUnitRobot.current.rotationRobot.z;

    this.gltf.rotation.copy(this.euler);

    const bone = this.gltf.getObjectByName("Head");

    bone.lookAt(this.lookTarget3d.current.position);

    return true;
  }
}
