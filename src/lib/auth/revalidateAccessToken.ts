import { signOut } from "next-auth/react";

import { isTokenExpired, isTokenExpiringSoon } from "@/lib/auth/authToken";
import { fetchRefreshedToken } from "@/lib/auth/serverActions";
import { isAuthorizedVar } from "@/lib/apollo/client/apollo-wrapper";

let refreshPromise: Promise<string | null> | null = null;

export const resetToken = async () => {
  localStorage.clear();
  isAuthorizedVar(false);

  await signOut({ redirect: false });

  return null;
};

const refreshToken = async (token: string) => {
  if (!refreshPromise) refreshPromise = fetchRefreshedToken(token);

  const refreshedToken = await refreshPromise;

  refreshPromise = null;

  if (!refreshedToken) return resetToken();

  localStorage.setItem("token", refreshedToken);

  return refreshedToken;
};

const getRefreshedToken = () => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");

  if (!token) return null;

  if (isTokenExpired(token)) return resetToken();

  if (isTokenExpiringSoon(token)) return refreshToken(token);

  return token;
};

const revalidateAccessToken = async (): Promise<string | null> => {
  const token = await getRefreshedToken();

  isAuthorizedVar(!!token);

  return token;
};

export default revalidateAccessToken;
