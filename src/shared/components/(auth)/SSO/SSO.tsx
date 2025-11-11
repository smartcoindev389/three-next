"use client";

import { FC } from "react";

import SSOButton from "./SSOButton/SSOButton";

import { SSOProviders } from "@/shared/components/(auth)/SSO/types";
import * as fbq from "@/utils/facebook-pixel";

interface SSOProps {
  login: boolean;
}

const SSO: FC<SSOProps> = ({ login }) => {
  const handleClick = (provider: SSOProviders) => {
    fbq.event("StartSocialSignUp", {
      method: provider.toLowerCase(),
      content_name: "Social Registration",
    });
  };

  return (
    <div className="mx-auto flex justify-center gap-x-6 w-fit md:w-full py-8">
      {Object.values(SSOProviders).map((provider) => (
        <SSOButton
          key={provider}
          action={login ? "login" : "sign_up"}
          provider={provider}
          onClick={handleClick}
        />
      ))}
    </div>
  );
};

export default SSO;
