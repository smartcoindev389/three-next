import { getBezierPoint, getBezier1D, blendCoordinates } from "./utilit";
import * as THREE from "three";

const target = new THREE.Vector3(0, 0, 0);
const euler = new THREE.Euler(0, 0, 0, "XYZ");

export const frame_default = function frame_default(frameP) {
  const { delta } = frameP;

  const fixedDelta = Math.min(delta, 0.016); // ~60 FPS
  this.t +=
    fixedDelta *
    (this.speedBezier
      ? getBezier1D(this.speedBezier, this.t)
      : (this.speed ?? 0.6));

  if (this.t > 1) {
    this.t = 1;
    requestAnimationFrame(this.callback);
  }

  this.p.nowUnitRobot.current.positionRobot = getBezierPoint(
    this.pointsPositionRobot,
    this.t,
  );

  target.x = this.p.nowUnitRobot.current.positionRobot.x;
  target.y =
    this.p.nowUnitRobot.current.positionRobot.y +
    window.scrollY / this.scrollYOfSet;
  target.z = this.p.nowUnitRobot.current.positionRobot.z;

  this.p.gltf.position.lerp(target, 0.5);

  this.p.nowUnitRobot.current.rotationRobot = getBezierPoint(
    this.pointsPotationRobot,
    this.t,
  );

  euler.x = this.p.nowUnitRobot.current.rotationRobot.x;
  euler.y = this.p.nowUnitRobot.current.rotationRobot.y;
  euler.z = this.p.nowUnitRobot.current.rotationRobot.z;

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
};

export function blendCoordinates_default() {
  this.pointsPositionRobot[0] = this.p.nowUnitRobot.current.positionRobot;
  this.pointsPositionRobot[1] = blendCoordinates(
    this.pointsPositionRobot[1],
    this.p.nowUnitRobot.current.positionRobot,
    0.6,
  );

  this.pointsPotationRobot[0] = this.p.nowUnitRobot.current.rotationRobot;
  this.pointsPotationRobot[1] = blendCoordinates(
    this.pointsPotationRobot[1],
    this.p.nowUnitRobot.current.rotationRobot,
    0.6,
  );

  this.pointsHeadTarget[0] = this.p.nowUnitRobot.current.positionLookAtTarget;
  this.pointsHeadTarget[1] = blendCoordinates(
    this.pointsHeadTarget[1],
    this.p.nowUnitRobot.current.positionLookAtTarget,
    0.6,
  );
}
