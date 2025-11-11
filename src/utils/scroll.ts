export const stopScroll = () => {
  document.body.style.overflowY = "hidden";
  document.body.style.height = "100dvh";
};

export const startScroll = () => {
  document.body.style.overflowY = "auto";
  document.body.style.height = "auto";
};
