"use client";

import { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { signIn } from "next-auth/react";

import SSOIcon from "../SSOIcon/SSOIcon";

import { SSOProviders } from "@/shared/components/(auth)/SSO/types";
import { useToast } from "@/shared/components/(common)/ui/use-toast";
import Loader from "@/shared/components/(common)/Loader/Loader";

interface SSOButtonProps {
  provider: SSOProviders;
  onError?: (error: unknown) => unknown;
  onClick?: (provider: SSOProviders) => unknown;
  action: string;
}

const SSOButton: FC<SSOButtonProps> = ({
  provider,
  onError,
  onClick,
  action,
}) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const handleSignIn = useCallback(async () => {
    try {
      setLoading(true);

      await signIn(provider, {
        redirectTo: `/login/success?provider=${provider}&action=${action}`,
      });

      if (onClick) onClick(provider);
    } catch (error) {
      setLoading(false);
      toast({
        type: "error",
        description: t("An unexpected error occurred. Please try again later"),
      });
      console.error(error);

      if (onError) onError(error);
    }
  }, [provider, onClick, onError, toast, t]);

  return (
    <>
      {loading && <Loader className="fixed inset-0 !bg-transparent" />}
      <button
        className={`relative border border-[#ABABAB] bg-transparent hover:bg-gray-300/50 rounded-md px-[15px] py-2.5`}
        disabled={loading}
        style={{ opacity: loading ? 0.5 : 1 }}
        onClick={handleSignIn}
      >
        <SSOIcon provider={provider} />
      </button>
    </>
  );
};

export default SSOButton;
