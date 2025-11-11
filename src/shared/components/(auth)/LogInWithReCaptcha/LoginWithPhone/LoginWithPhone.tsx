"use client";

import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";

import { Checkbox } from "@/shared/components/(common)/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/(common)/ui/form";
import { Input } from "@/shared/components/(common)/ui/input";
import { Button } from "@/shared/components/(common)/ui/button";
import { useToast } from "@/shared/components/(common)/ui/use-toast";
import * as fbq from "@/utils/facebook-pixel";
import useResolver from "@/shared/components/(auth)/LogInWithReCaptcha/LoginWithPhone/useResolver";
import PhoneCodeFormField from "@/shared/components/(auth)/LogInWithReCaptcha/LoginWithPhone/PhoneCodeFormField";
import useRecaptcha from "@/hooks/useReсaptcha";
import AuthFooter from "@/shared/components/(auth)/LogInWithReCaptcha/LoginFormFooter/LoginFormFooter";
import useTwilio, { getTwilioError } from "@/hooks/useTwilio";

const defaultValues = {
  phone_number: "",
  remember: false,
  phoneCode: "+1(United States of America)",
};

type FormValues = {
  phone_number: string;
  remember?: boolean;
  phoneCode: string;
};

const LoginWithPhone: FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const { verifyRecaptcha, setRecaptchaToken, recaptchaRef, resetRecaptcha } =
    useRecaptcha();
  const { sendSms, sending } = useTwilio();

  const resolver = useResolver();
  const form = useForm({ resolver, defaultValues });

  const onSubmit : SubmitHandler<FormValues> = async (data) => {
    const phone =
      data.phoneCode?.substring(0, form.getValues("phoneCode")?.indexOf("(")) +
      data.phone_number || "";

    if (!(await verifyRecaptcha())) return;

    fbq.event("PhoneLoginInitiated", { method: "phone" });
    localStorage.setItem("prelogin", JSON.stringify({ phone }));

    try {
      await sendSms(phone);

      router.push("/login-with-otp");
    } catch (e) {
      toast({ type: "error", description: t(getTwilioError(e)) });
      resetRecaptcha();
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          className="text-center mt-11"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="w-full m-auto">
            <div className="grid grid-cols-1 gap-4">
              <PhoneCodeFormField form={form} />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }: {field: any}) => (
                  <FormItem className="space-y-0" suppressHydrationWarning {...({} as any)}>
                    <FormControl {...({} as any)}>
                      <Input
                        placeholder={t("Phone Number")}
                        {...field}
                        className={`w-full px-3.5 border border-[#ABABAB] focus:border-[#545454] focus:ring-0 py-[26px] font-sf-pro-display placeholder:text-white rounded-[5px] text-base`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center space-x-2 mt-3.5">
              <Checkbox className="border-[#97E3FF33] bg-white" id="terms" />
              <label className="text-base text-white" htmlFor="terms">
                Remember Me
              </label>
            </div>
          </div>
          <div className="w-full flex mt-[20px] justify-center items-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA || ""}
              onChange={setRecaptchaToken}
            />
          </div>
          <Button
            className="bg-[#3F65FD] w-full h-auto px-8 text-xl font-medium py-3.5 hover:bg-blue rounded-[5px] text-white mt-11"
            type="submit"
            {...({} as any)}
          >
            {sending ? t("Sending...") : t("Continue")}
          </Button>
        </form>
      </Form>
      <AuthFooter showResetPassword={false} />
    </>
  );
};

export default LoginWithPhone;
