"use client";

import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Link from "next/link";

import InputPassword from "@/shared/components/(auth)/InputPassword/InputPassword";
import Button from "shared/components/(auth)/Button";
import { SET_NEW_PASSWORD } from "@/lib/apollo/queryes/auth";

export default function SocialPasswordField() {
  const { t, i18n } = useTranslation();
  const [updateCustomerPassword] = useMutation(SET_NEW_PASSWORD);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const methods = useForm();

  const checkPasswordMatch = (value) => {
    const originalPassword = getValues("password");

    return value === originalPassword || t("Passwords do not match");
  };

  const onSubmit = async (data) => {
    try {
      const queryParams = new URLSearchParams(window.location.search);

      const token = queryParams.get("token");
      const email = queryParams.get("email");

      await updateCustomerPassword({
        variables: {
          email: email,
          resetPasswordToken: token,
          newPassword: data.confirm_password,
        },
      });

      router.push("/forgot-password/reset-sucessful");
    } catch (error) {
      console.error("Error reset password:", error.message);
    }
  };

  return (
    <div className="verification-id-wrapper h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="lg:text-[40px] font-din-condensed text-2xl text-[#434345] text-center mt-1 font-bold">
          {t("Enter Password")}
        </h1>
        <p className="text-center !text-[#74788D] !text-lg mt-5 w-[454px] max-w-full">
          {t("Please enter your new password")}
        </p>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="text-center">
            <div className="mt-11 w-[415px] max-w-full m-[auto]">
              <InputPassword
                className="rounded-[5px] border border-[#ABABAB] bg-white text-start outline-none p-4 w-full placeholder:text-[#74788D]"
                errors={errors}
                name="password"
                options={{ required: t("This field is required") }}
                placeholder="Password"
                register={register}
              />
              <InputPassword
                className="rounded-[5px] border border-[#ABABAB] bg-white text-start outline-none p-4 w-full placeholder:text-[#74788D]"
                errors={errors}
                inputContainerClasses={"mt-4"}
                name="confirm_password"
                options={{
                  required: t("This field is required"),
                  validate: checkPasswordMatch,
                }}
                placeholder="Confirm Password"
                register={register}
              />
            </div>
            <Button className="mt-11" type={"submit"}>
              {t("Submit")}
            </Button>
          </form>
        </FormProvider>

        <div className="mt-7">
          <Link
            className="text-[#74788D] underline text-[15px] font-bold"
            href="/login"
          >
            {t("Back to login")}
          </Link>
        </div>
      </div>
    </div>
  );
}
