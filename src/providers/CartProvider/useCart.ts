import { useContext } from "react";

import { CartContext } from "@/providers/CartProvider/CartProvider";
import { CartContextType } from "@/providers/CartProvider/types";

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};
