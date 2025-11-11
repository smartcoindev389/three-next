"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";

import { getRoutePath, startResendTimer } from "@/utils/utils-old";
import { useToast } from "@/shared/components/(common)/ui/use-toast";
import Button from "shared/components/(auth)/Button";
import useRecaptcha from "@/hooks/useReсaptcha";
import useTwilio, { getTwilioError } from "@/hooks/useTwilio";
import revalidateAccessToken from "@/lib/auth/revalidateAccessToken";

const LoginWithPhoneOtpWithRecaptcha = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendCodeLoading, setResendCodeLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const { verifyRecaptcha, setRecaptchaToken, recaptchaRef, resetRecaptcha } =
    useRecaptcha();
  const { sendSms, loginWithSms } = useTwilio();
  const router = useRouter();

  useEffect(() => {
    const prelogin = localStorage.getItem("prelogin");

    if (prelogin) setPhoneNumber(JSON.parse(prelogin).phone);

    startResendTimer(setResendDisabled, setResendTimer);
  }, []);

  const handleVerifyOTP = async () => {
    if (!verificationCode || verificationCode.trim().length !== 6) {
      return toast({
        type: "error",
        description: t("Please enter a valid 6-digit verification code"),
      });
    }

    if (!(await verifyRecaptcha())) return;

    setVerifyLoading(true);

    try {
      const data = await loginWithSms(phoneNumber, verificationCode);

      if (!data) throw "Invalid OTP. Please try again.";

      localStorage.setItem(
        "prelogin",
        JSON.stringify({ phone: phoneNumber, email: data.contact }),
      );
      localStorage.setItem("token", data.access_token);

      toast({ type: "success", description: "Phone verified successfully!" });

      await revalidateAccessToken();

      return router.push(getRoutePath() || "/customer/home");
    } catch (error: any) {
      resetRecaptcha();
      toast({ type: "error", description: t(getTwilioError(error)) });
    }

    setVerifyLoading(false);
  };

  const resendCode = async () => {
    setResendCodeLoading(true);

    try {
      await sendSms(phoneNumber);
      toast({ type: "success", description: t("OTP Resent Successfully") });
      startResendTimer(setResendDisabled, setResendTimer);
    } catch (error: any) {
      resetRecaptcha();
      toast({
        type: "error",
        description: error?.message || t("Error sending OTP."),
      });
    }

    setResendCodeLoading(false);
  };

  return (
    <div className="verification-id-wrapper h-[calc(100vh-346px)] mt-24 md:mt-48">
      <div className="flex flex-col items-center">
        <h1 className="lg:text-[40px] font-din-condensed text-2xl text-white text-center mt-1 font-bold">
          {t("Check Your Phone")}
        </h1>
        <p className="text-center !text-white !text-lg mt-5">
          {t("We have sent a One time Verification Code to your phone")}
        </p>
        <div className="flex justify-center items-center">
          <p className="!text-white text-[28px]">{phoneNumber}</p>
        </div>
        <input
          className="rounded-[5px] border border-[#97E3FF33] bg-[#97E3FF1C] text-white placeholder:text-white text-center w-[300px] outline-none py-4 mt-11"
          placeholder={t("Enter Code")}
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <div className="w-full flex flex-col items-center">
          <Button
            className="mt-5 !text-base md:!text-xl font-medium bg-[#3F65FD] rounded-md w-[300px]"
            loading={verifyLoading}
            onClick={handleVerifyOTP}
          >
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
    </div>
  );
};

export default LoginWithPhoneOtpWithRecaptcha;
