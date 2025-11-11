"use client";

import { useEffect, FC } from "react";
import { useTranslation } from "react-i18next";

const SuccessSignIn: FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => window.close(), 3000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-3xl font-semibold mb-4 text-red-500">
        {t("Authentication Failed")}
      </h1>
      <p>{t("Please try again later")}..</p>
    </div>
  );
};

export default SuccessSignIn;
