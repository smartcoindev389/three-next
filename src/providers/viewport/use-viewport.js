import { useContext } from "react";

import ViewportContext from "./viewport-context";

export const useViewport = () => {
  const context = useContext(ViewportContext);

  if (!context) {
    throw new Error("useViewport must be used within a ViewportProvider");
  }

  return context;
};
