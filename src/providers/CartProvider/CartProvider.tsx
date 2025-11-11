"use client";

import { createContext, useMemo, useEffect, PropsWithChildren, FC, useState, useCallback } from "react";
import { LazyQueryHookOptions, useLazyQuery, useMutation, useReactiveVar } from "@apollo/client";
import { usePathname } from "next/navigation";

import { CART, CREATE_GUEST_CART_RAW, CUSTOMER_CART_ID, MERGE_CART } from "@/lib/apollo/queryes/shoppingCart";
import { CartContextType, CartResult } from "@/providers/CartProvider/types";
import { CART_ID_LS_KEY } from "@/providers/CartProvider/constants";
import { isAuthorizedVar } from "@/lib/apollo/client/apollo-wrapper";
import revalidateAccessToken from "@/lib/auth/revalidateAccessToken";

interface Variables {
  cart_id: string | null;
}

interface GuestCartData {
  createGuestCart: { cart: { id: string } };
}

interface CustomerCartData {
  customerCart: { id: string };
}

interface MergeResponse {
  mergeCarts: {
    id: string;
  };
}

interface MergeVariables {
  source_cart_id: string;
}

export const CartContext = createContext<CartContextType | null>(null);

const options: LazyQueryHookOptions<CartResult, Variables> = {
  fetchPolicy: "cache-and-network",
  notifyOnNetworkStatusChange: true,
};

const handleError = (title: string) => (error: unknown) => {
  console.error(`${title}: `, error);

  return { data: null };
};

export const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const isAuthorized = useReactiveVar(isAuthorizedVar);
  const [initialLoading, setInitialLoading] = useState(true);
  const [getGuestCartId] = useMutation<GuestCartData>(CREATE_GUEST_CART_RAW);
  const [getUserCartId] = useLazyQuery<CustomerCartData>(CUSTOMER_CART_ID, { fetchPolicy: "no-cache" });
  const [mergeCartMutation] = useMutation<MergeResponse, MergeVariables>(MERGE_CART);
  const [fetchCartById, { data, loading, refetch, error }] = useLazyQuery<CartResult, Variables>(CART, options);
  const fetchCart = useCallback((cartId?: string) => refetch(cartId ? { cart_id: cartId } : undefined), [refetch]);

  const getCartId = async () => {
    const storedCartId = localStorage.getItem(CART_ID_LS_KEY);

    if (isAuthorized && storedCartId) {
      const { data } = await mergeCartMutation({ variables: { source_cart_id: storedCartId } }).catch(
        handleError("Cart merge failed"),
      );

      localStorage.removeItem(CART_ID_LS_KEY);

      if (data) return data.mergeCarts.id;
    }

    if (isAuthorized) {
      const { data } = await getUserCartId();

      if (data) return data.customerCart.id;
    }

    if (storedCartId) return storedCartId;

    const { data } = await getGuestCartId().catch(handleError("Guest cart query failed"));

    if (data) {
      localStorage.setItem(CART_ID_LS_KEY, data.createGuestCart.cart?.id);

      return data.createGuestCart.cart?.id;
    }
  };

  const initCart = async () => {
    try {
      const cartId = await getCartId(); 
      if (cartId) {
        await fetchCartById({ variables: { cart_id: cartId } });
      } else {
        console.error("Cart ID is not provided");
      }
    } catch (err) {
      console.error("Cart ID is not provided");
    }
    setInitialLoading(false);
  };

  const value = useMemo<CartContextType>(
    () => ({ initialLoading, loading: initialLoading || loading, cart: data?.cart, fetchCart, initCart }),
    [initialLoading, data?.cart, loading, fetchCart],
  );

  useEffect(() => void revalidateAccessToken(), [pathname]);

  useEffect(() => {
    if (isAuthorized !== null) void initCart();
  }, [isAuthorized]);

  useEffect(() => {
    if (error) console.error("CART FETCHING ERROR: ", error);
  }, [error]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
