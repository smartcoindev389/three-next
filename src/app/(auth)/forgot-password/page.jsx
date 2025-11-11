"use client";

import { useMutation } from "@apollo/client";
import { FormProvider, useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import Button from "@/shared/components/(auth)/Button/Button";
import InputEmail from "@/shared/components/(common)/InputEmail/InputEmaill";
import { RESET_PASSWORD } from "@/lib/apollo/queryes/auth";

export default function ResetPassword() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const methods = useForm();
  const [resetPassword, { loading, error }] = useMutation(RESET_PASSWORD);

  const onSubmit = async (data) => {
    try {
      const result = await resetPassword({
        variables: {
          email: data.email,
        },
      });

      if (result) {
        localStorage.setItem("restPasswordEmail", data?.email);
      }
      router.push("/forgot-password/confirm-email");
    } catch (error) {
      console.error("Error resetting password:", error.message);
    }
  };

  return (
    <div className="verification-id-wrapper h-[auto] mt-24 md:mt-48">
      <div className="flex flex-col items-center">
        <h1 className="lg:text-[40px] font-din-condensed text-2xl text-white text-center mt-1 font-bold">
          {t("Reset Password")}
        </h1>
        <p className="text-center !text-white !text-lg mt-5 w-[454px] max-w-full">
          {t(
            "Please enter the email address you would like your password reset information sent to",
          )}
        </p>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-11 w-[415px] max-w-full m-[auto]">
              <InputEmail
                className="rounded-[5px] border border-[#97E3FF33] bg-[#97E3FF1C] text-white placeholder:text-white text-center w-full outline-none py-4"
                errors={errors}
                name={"email"}
                options={{ required: t("This field is required") }}
                placeholder={t("Enter your email")}
                register={register}
              />
              {error && (
                <p className={"mt-2 text-2xl text-red-500"}>{error?.message}</p>
              )}

              <Button className="mt-11 bg-[#3F65FD] rounded-md w-full" disabled={loading} type={"submit"}>
                {loading ? t("Sending...") : t("Request Reset Link")}
              </Button>
            </div>
          </form>
        </FormProvider>

        <div className="mt-7">
          <Link
            className="text-white underline text-[15px] font-bold"
            href="/login"
          >
            {t("Back to login")}
          </Link>
        </div>
      </div>
    </div>
  );
}
