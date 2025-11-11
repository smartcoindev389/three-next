"use client";

import { Suspense } from "react";
import { useTranslation } from "react-i18next";

import LogInWithReCaptcha from "@/shared/components/(auth)/LogInWithReCaptcha/LogInWithReCaptcha";
import Sso from "@/shared/components/(auth)/SSO/SSO";

const LogInPage = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full pb-12 md:pb-24 px-5 mt-48 md:px-0 max-w-[415px] mx-auto">
      <div className="mx-auto">
        <div className="flex justify-center items-center gap-3">
          <h1 className="text-center font-poppins leading-none mb-1 text-[40px] font-bold text-white">
            {t("Sign In")}
          </h1>
        </div>

        <div className="w-[80%] mx-auto relative mt-[22px] flex items-center justify-center">
          <div className="my-auto h-px w-[63px] bg-[#DDD]" />
          <p className="text-lg text-[#74788D] font-semibold block w-fit px-4 mx-auto relative z-10">
            {t("Social Sign In")}
          </p>
          <div className="my-auto h-px w-[63px] bg-[#DDD]" />
        </div>
        <Suspense>
          <Sso login={true} />
        </Suspense>
        <div className="w-full mx-auto relative mb-[30px] flex items-center justify-center gap-3">
          <div className="my-auto h-px w-full bg-[#DDD]" />
          <p className="text-lg text-[#74788D] font-semibold block w-fit px-4 mx-auto relative z-10">
            {t("or")}
          </p>
          <div className="my-auto h-px w-full bg-[#DDD]" />
        </div>
      </div>
      <LogInWithReCaptcha />
    </div>
  );
};

export default LogInPage;
