export function getRandomNumber(min: number, max: number): number {
  return +(Math.random() * (max - min) + min).toFixed(2);
}
