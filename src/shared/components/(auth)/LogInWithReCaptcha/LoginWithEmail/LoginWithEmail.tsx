"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import * as fbq from "@/utils/facebook-pixel";
import { useToast } from "@/shared/components/(common)/ui/use-toast";
import useTwilio, { getTwilioError } from "@/hooks/useTwilio";

interface LoginWithEmailProps {
  verifyRecaptcha: () => Promise<boolean>;
  form: any;
}

const LoginWithEmail: FC<LoginWithEmailProps> = ({ verifyRecaptcha, form }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { sendEmail, sending } = useTwilio();
  const { toast } = useToast();

  const handleEmailLoginCode = async () => {
    if (!(await verifyRecaptcha())) return;

    const email = form.getValues("email");

    fbq.event("EmailCodeLoginAttempt", { method: "email_code" });
    localStorage.setItem("prelogin", JSON.stringify({ email }));

    try {
      await sendEmail(email);

      router.push("/login-with-email-otp");
    } catch (e) {
      toast({ type: "error", description: t(getTwilioError(e)) });
    }
  };

  return (
    <>
      <div className="w-full mx-auto relative my-[30px]">
        <div className="absolute my-auto top-0 bottom-0 left-0 h-px w-full bg-[#D9D9D9]" />
        <p className="text-lg text-[#74788D] font-semibold block w-fit px-4 mx-auto bg-white relative z-10">
          or
        </p>
      </div>
      <button
        className="w-full text-base font-medium py-3.5 rounded-[5px] border border-[#ABABAB] text-[#74788D]"
        type="button"
        onClick={handleEmailLoginCode}
      >
        {sending ? `${t("Sending")}...` : t("Email Login Code")}
      </button>
    </>
  );
};

export default LoginWithEmail;
