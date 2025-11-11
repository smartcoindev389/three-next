"use client";

import React, { useState, useEffect, FC } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";

import { useToast } from "@/shared/components/(common)/ui/use-toast";
import { getRoutePath, startResendTimer } from "@/utils/utils-old";
import Button from "shared/components/(auth)/Button";
import useRecaptcha from "@/hooks/useReсaptcha";
import useTwilio, { getTwilioError } from "@/hooks/useTwilio";
import revalidateAccessToken from "@/lib/auth/revalidateAccessToken";

const LoginWithEmailOtpWithRecaptcha: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { verifyRecaptcha, setRecaptchaToken, recaptchaRef, resetRecaptcha } = useRecaptcha();
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCodeLoading, setResendCodeLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpEmail, setOtpEmail] = useState("");
  const { toast } = useToast();
  const { loginWithEmail, sendEmail } = useTwilio();

  useEffect(() => {
    const prelogin = localStorage.getItem("prelogin");

    if (prelogin) setOtpEmail(JSON.parse(prelogin).email);

    startResendTimer(setResendDisabled, setResendTimer);
  }, []);

  const handleVerifyOTP = async () => {
    if (!verificationCode || verificationCode.trim().length !== 6) {
      return toast({ type: "error", description: t("Please enter a valid 6-digit verification code") });
    }

    if (!(await verifyRecaptcha())) return;

    setLoading(true);

    try {
      const data = await loginWithEmail(otpEmail, verificationCode);

      if (!data) throw "Invalid OTP. Please try again.";

      setMessage("Email verified successfully!");

      localStorage.setItem("prelogin", JSON.stringify({ phone: data.contact, email: otpEmail }));
      localStorage.setItem("token", data.access_token);

      await revalidateAccessToken();

      return router.push(getRoutePath() || "/customer/home");
    } catch (error: any) {
      resetRecaptcha();
      setMessage(t(getTwilioError(error)));
    }

    setLoading(false);
  };

  const resendCode = async () => {
    setMessage("");
    setResendCodeLoading(true);

    try {
      await sendEmail(otpEmail);

      setMessage(t("OTP Resent Successfully"));
      startResendTimer(setResendDisabled, setResendTimer);
    } catch (error: any) {
      setMessage(error?.message);
    }

    setTimeout(() => setMessage(""), 3000);
    setResendCodeLoading(false);
  };

  return (
    <div className="mt-24 md:mt-48">
      <h1 className={"lg:text-[40px] font-din-condensed text-2xl text-white font-bold text-center"}>
        {t("Check Your Email")}
      </h1>

      <div className="flex flex-col items-center">
        <p className="text-xl text-white mt-5 font-normal">{t("We have sent a code to your registered email")}</p>
        <p className="!text-white !text-[28px] mt-0">{otpEmail}</p>

        <input
          className="rounded-[5px] border border-[#97E3FF33] bg-[#97E3FF1C] text-white placeholder:text-white text-center w-[300px] h-[60px] outline-none py-4 mt-11"
          placeholder={t("Enter Code")}
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />

        <div className="flex flex-col">
          <Button className="mt-5 !text-base md:!text-xl font-medium bg-[#3F65FD] rounded-md w-[300px]" loading={loading} onClick={handleVerifyOTP}>
            {t("Verify and Sign In")}
          </Button>
          <p className="text-center mt-8 text-white text-base">
            {resendDisabled ? `${t("Resend Code in")} ${resendTimer}s` : ""}
          </p>
          <button
            className="text-white underline text-base font-semibold mt-0"
            disabled={resendTimer !== 0}
            type="button"
            onClick={resendCode}
          >
            {resendCodeLoading ? t("Sending") : t("Resend Code")}
          </button>
        </div>
      </div>
      {message && <p className="error-row text-center mt-4 text-xl">{message}</p>}
    </div>
  );
};

export default LoginWithEmailOtpWithRecaptcha;
