"use client";

import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { useReactiveVar } from "@apollo/client";

import { isAuthorizedVar } from "@/lib/apollo/client/apollo-wrapper";

const useAuthGuard = (): boolean | null => {
  const router = useRouter();
  const isAuthorized = useReactiveVar(isAuthorizedVar);

  useLayoutEffect(() => {
    if (isAuthorized === false) router.push("/login");
  }, [router, isAuthorized]);

  return isAuthorized;
};

export default useAuthGuard;
