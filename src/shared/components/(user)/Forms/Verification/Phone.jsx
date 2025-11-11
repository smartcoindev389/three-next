import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { renderPhoneNumber } from "@/shared/components/(user)/Forms/Verification/CommonFunction";
import { resetResendTimer, startResendTimer } from "@/utils/utils-old";
import { Input } from "@/shared/components/(common)/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/(common)/ui/dialog";
import useTwilio from "@/hooks/useTwilio";

export default function PhoneVerification({
  phone,
  onCancel = () => {},
  onVerify = () => {},
  showOverlay = true,
  headerText = "",
  submitBtnText = "",
}) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [codeSend, setCodeSend] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendCodeLoading, setResendCodeLoading] = useState(false);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const { sendSms, updatePhone } = useTwilio();

  useEffect(() => {
    _sendCode().then(() => {
      setCodeSend(true);
    });
  }, []);

  const handleResendCode = () => {
    setResendCodeLoading(true);
    _sendCode().then(() => {
      setResendCodeLoading(false);
    });
  };

  const _sendCode = async () => {
    try {
      await sendSms(phone);

      startResendTimer(setResendDisabled, setResendTimer);
    } catch (e) {
      toast.error(t("Error sending OTP. Please try again."));
    }
  };

  const onSubmit = async ({ enterCode }) => {
    setSendOtpLoading(true);

    try {
      await updatePhone(phone, enterCode);

      resetResendTimer(setResendDisabled, resendTimer, setResendTimer);
      onVerify();
    } catch (error) {
      const description = typeof error === "string" ? error : t("Error verifying OTP. Please try again.");

      toast.error(description);
    }

    setSendOtpLoading(false);
  };

  return (
    <Dialog open={true}>
      <DialogTitle />
      <DialogContent
        className="max-w-[90%] sm:max-w-lg lg:max-w-3xl lg:pt-8 lg:pb-10"
        showCloseBtn={false}
        showOverlay={showOverlay}
      >
        <form
          className={"flex flex-col items-center"}
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="text-3xl text-primary font-din-condensed font-bold text-center">
            {headerText ? headerText : t("Verify Phone")}
          </h3>
          <p className="text-center text-base text-primary mt-5 mb-3.5">
            {t("Enter Code sent to")} {renderPhoneNumber(phone)}
          </p>

          <div className={"w-full mb-4 md:max-w-[280px]"}>
            <Input
              {...register("enterCode", {
                required: true,
                minLength: {
                  value: 6,
                  message: t(`The value must be at least 6 characters long.`),
                },
              })}
              autoComplete="one-time-code"
              className={`h-auto px-4 py-3 w-full ${errors?.enterCode ? "border-[#F46A6A]" : "border-[#ced4dA]"} rounded-md placeholder:text-[#C2C2C2] text-center`}
              placeholder={t("Enter Code")}
            />
            {errors?.enterCode && (
              <p className={"text-sm font-medium text-destructive"}>
                {errors?.enterCode?.message}
              </p>
            )}
          </div>

          <button
            className={`bg-blue leading-0 px-8 py-1 rounded-[50px] text-base text-white mt-2 ${sendOtpLoading ? "opacity-50" : ""}`}
            disabled={sendOtpLoading}
            type={"submit"}
          >
            {sendOtpLoading
              ? t("Processing...")
              : submitBtnText
                ? submitBtnText
                : t("Verify Phone")}
          </button>

          <button
            className={`leading-0 px-6 py-[3px] rounded-[50px] text-base text-[#74788D] mt-3 border border-[#CED4DA] ${sendOtpLoading ? "opacity-50" : ""}`}
            disabled={false}
            type={"button"}
            onClick={onCancel}
          >
            {t("Cancel")}
          </button>

          {codeSend && (
            <div className={"flex flex-col items-center mt-6"}>
              {resendDisabled && (
                <p className="text-center text-[#74788D] text-sm">
                  {t("Resend Code in")} 00:
                  {resendTimer < 10 ? "0" + resendTimer : resendTimer}
                </p>
              )}
              <button
                aria-label={t("Resend Code")}
                className={`text-sm font-semibold px-7 py-0 bg-white hover:bg-white underline  ${resendDisabled || resendCodeLoading ? "text-[#74788D]" : "text-blue"}`}
                disabled={resendDisabled || resendCodeLoading}
                type={"button"}
                onClick={handleResendCode}
              >
                {resendCodeLoading ? t("Sending") : t("Resend Code")}
              </button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
