/**
 * Додає ефект левітації до позиції dummy для кубика
 * @param {THREE.Object3D} dummy - об'єкт для трансформації
 * @param {object} levitate - параметри левітації (axis, speed, amplitude, phase)
 * @param {number} t - час (elapsedTime)
 * @param {number} levitateStrength - глобальна сила левітації
 */
export function applyLevitation(dummy, levitate, t, levitateStrength) {
  if (levitate && levitateStrength > 0) {
    const osc =
      Math.sin(t * levitate.speed + levitate.phase) * levitate.amplitude;
    if (levitate.axis === "x") {
      dummy.position.x += osc;
    } else {
      dummy.position.y += osc;
    }
  }
}
