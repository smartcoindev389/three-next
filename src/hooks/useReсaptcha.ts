import { MutableRefObject, useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";

import { useVerifyRecaptcha } from "@/utils/recaptcha";
import { useToast } from "@/shared/components/(common)/ui/use-toast";

interface UseRecaptchaReturnTYpe {
  verifyRecaptcha: () => Promise<boolean>;
  setRecaptchaToken: (token: string | null) => void;
  recaptchaRef: MutableRefObject<ReCAPTCHA | null>;
  resetRecaptcha: () => void;
}

const useRecaptcha = (): UseRecaptchaReturnTYpe => {
  const [token, setToken] = useState<string | null>(null);
  const { verifyRecaptcha: verify } = useVerifyRecaptcha();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const verifyRecaptcha = useCallback(async () => {
    const isVerified = await verify(token);

    if (!isVerified) {
      toast({
        type: "error",
        description: t(
          "Please verify that you are human by completing the recaptcha challenge.",
        ),
      });
    }

    return isVerified;
  }, [token]);
  const resetRecaptcha = () => {
    recaptchaRef.current?.reset();
  };

  return {
    verifyRecaptcha,
    setRecaptchaToken: setToken,
    recaptchaRef,
    resetRecaptcha,
  };
};

export default useRecaptcha;
