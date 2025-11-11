"use client";

import { FC, useLayoutEffect } from "react";
import { upperFirst } from "lodash-es";
import { useRouter } from "next/navigation";

import { sendGAEvent } from "@/utils/google-analytics";
import { getRoutePath } from "@/utils/utils-old";
import revalidateAccessToken from "@/lib/auth/revalidateAccessToken";

const actionMap: Record<string, string> = {
  login: "Login",
  sign_up: "Sign up",
};

interface AuthTokenProviderProps {
  token?: string;
  action: string;
  provider: string;
}

const getEvent = (action: string, provider: string) => {
  return {
    category: "Interaction",
    action: actionMap[action] || action,
    label: `Method: ${upperFirst(provider)}`,
  };
};

const AuthTokenProvider: FC<AuthTokenProviderProps> = ({ token, action = "login", provider }) => {
  const router = useRouter();

  useLayoutEffect(() => {
    if (!token) return;

    localStorage.setItem("token", token);
    revalidateAccessToken().then(() => {
      sendGAEvent(action, getEvent(action, provider));
      router.replace(getRoutePath() || "/customer/home");
    });
  }, []);

  return null;
};

export default AuthTokenProvider;
