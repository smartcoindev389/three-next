"use client";

import { useLazyQuery, useMutation } from "@apollo/client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";
import { GENERATE_CUSTOMER_TOKEN } from "@/lib/apollo/queryes/customer";
import { CHECK_CUSTOMER_EMAIL } from "@/lib/apollo/queryes/customer";
import { FC, useEffect } from "react";
import { getRoutePath } from "@/utils/utils-old";
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
import { sendGAEvent } from "@/utils/google-analytics";
import * as fbq from "@/utils/facebook-pixel";
import AuthFooter from "@/shared/components/(auth)/LogInWithReCaptcha/LoginFormFooter/LoginFormFooter";
import useResolver from "@/shared/components/(auth)/LogInWithReCaptcha/LoginWithPassword/useResolver";
import PasswordField from "@/shared/components/(auth)/LogInWithReCaptcha/PasswordField/PasswordField";
import useRecaptcha from "@/hooks/useReсaptcha";
import LoginWithEmail from "@/shared/components/(auth)/LogInWithReCaptcha/LoginWithEmail/LoginWithEmail";
import useTwilio, { getTwilioError } from "@/hooks/useTwilio";
import revalidateAccessToken from "@/lib/auth/revalidateAccessToken";

const defaultValues = {
  email: "",
  remember: false as boolean | undefined,
  password: "",
};

type FormValues = {
  email: string;
  remember?: boolean;
  password?: string;
};

const LoginWithPassword: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const { verifyRecaptcha, setRecaptchaToken, recaptchaRef, resetRecaptcha } = useRecaptcha();
  const [checkCustomerEmail, { loading: checkingEmail, data: emailCheckResponse }] = useLazyQuery(CHECK_CUSTOMER_EMAIL);
  const [generateCustomerToken, { loading }] = useMutation(GENERATE_CUSTOMER_TOKEN);
  const { sendEmail, sendSms } = useTwilio();
  const emailChecked = emailCheckResponse?.checkCustomerEmail?.success;

  const resolver = useResolver(emailChecked);
  const form = useForm({ resolver, defaultValues });

  const onSubmit: SubmitHandler<FormValues> = async ({ email, password }) => {
    if (!password) {
      const isEmailValid = await checkCustomerEmail({
        variables: { email },
        fetchPolicy: "no-cache",
      });

      if (isEmailValid?.data?.checkCustomerEmail?.success) {
        fbq.event("EmailValidated", { method: "email" });
      } else {
        toast({
          type: "error",
          description: t("User doesn't exist, please enter correct email"),
        });
      }

      return;
    }

    if (!(await verifyRecaptcha())) return;

    try {
      const { data } = await generateCustomerToken({
        variables: { email, password },
      }).catch(() => {
        throw t("Incorrect email address and/or password");
      });
      const phone = data.generateCustomerToken.phone;

      localStorage.setItem("prelogin", JSON.stringify({ email, phone }));

      if (data.generateCustomerToken.two_factor_authentication) {
        if (phone) {
          await sendSms(phone);

          return router.push("/login-with-otp");
        } else {
          await sendEmail(email);

          return router.push("/login-with-email-otp");
        }
      }

      fbq.event("Login", {
        category: "Interaction",
        action: "Login",
        method: "email",
      });

      sendGAEvent("login", {
        category: "Interaction",
        action: "Login",
        label: "Method: email",
      });

      localStorage.setItem("token", data.generateCustomerToken.token);

      await revalidateAccessToken();

      router.push(getRoutePath() || "/customer/home");
    } catch (error) {
      resetRecaptcha();
      toast({ type: "error", description: t(getTwilioError(error)) });
    }
  };

  useEffect(() => {
    const guestEmail = localStorage?.getItem("guestEmail") || "";

    if (guestEmail) form.setValue("email", guestEmail);
  }, []);

  return (
    <>
      <Form {...form}>
        <form
          className="text-center mt-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="w-full m-auto">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }: {field: any}) => (
                  <FormItem className="space-y-0" suppressHydrationWarning {...({} as any)}>
                    <FormControl {...({} as any)}>
                      <Input
                        placeholder={t("Enter your Email")}
                        {...field}
                        className={`w-full px-3.5 text-white border border-[#97E3FF33] focus:border-[#545454] focus:ring-0 py-[26px] font-sf-pro-display placeholder:text-white rounded-[5px] text-base`}
                        value={form.getValues().email}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {emailChecked && <PasswordField control={form.control} />}
            </div>
            {!emailChecked && (
              <div className="flex items-center space-x-2 mt-3.5">
                <Checkbox className="border-[#97E3FF33] bg-white" id="terms" />
                <label className="text-base text-white" htmlFor="terms">
                  Remember Me
                </label>
              </div>
            )}
          </div>
          {emailChecked && (
            <div className="w-full flex mt-[20px] justify-center items-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA || ""}
                onChange={setRecaptchaToken}
              />
            </div>
          )}
          <Button
            className="bg-[#3F65FD] w-full h-auto px-8 text-xl font-medium py-3.5 hover:bg-blue rounded-md text-white mt-11"
            type="submit"
            {...({} as any)}
          >
            {loading || checkingEmail ? `${t("Sending")}...` : t("Continue")}
          </Button>
        </form>
      </Form>
      {emailChecked && (
        <LoginWithEmail form={form} verifyRecaptcha={verifyRecaptcha} />
      )}
      <AuthFooter showResetPassword={emailChecked} />
    </>
  );
};

export default LoginWithPassword;
