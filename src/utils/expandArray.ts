export function expandArray<T>(times: number, array: T[]): T[] {
  if (times <= 0) return [];
  return Array(times).fill(array).flat();
}
