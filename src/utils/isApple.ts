export const isApple = () => {
  const userAgent = navigator.userAgent || navigator.vendor;

  return /iPad|iPhone|iPod|Mac/.test(userAgent);
};
