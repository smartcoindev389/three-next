/**
 * Конвертує пікселі у vw відносно ширини 1920px (як get-d у SCSS)
 * @param {number} target - значення у пікселях
 * @returns {string} - значення у vw
 */
export function getD(target) {
  const vwContext = 1920 * 0.01; // 19.2
  const value = target / vwContext;
  return `${value}vw`;
}
