type moduleStyles = {
  [key: string]: string;
};

export const getStylesModule = (
  stylesModule: moduleStyles,
  stylesInline?: string,
) => {
  const styles: string[] = [];

  if (stylesInline)
    stylesInline.split(" ").map((e) => {
      styles.push(`${stylesModule[e]}`);
    });

  return styles;
};
