import React, { FC } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface AuthFooterProps {
  showResetPassword: boolean;
}

const AuthFooter: FC<AuthFooterProps> = ({ showResetPassword }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="text-white text-base text-center mt-6">
        {t("Don't have an account?")}{" "}
        <Link className="text-white font-bold underline" href="/register">
          {t("Sign Up")}
        </Link>
      </div>
      {showResetPassword && (
        <div className="text-white text-base text-center mt-2">
          {t("Forgot Password?")}{" "}
          <Link
            className="text-white font-bold underline"
            href="/forgot-password"
          >
            {t("Reset")}
          </Link>
        </div>
      )}
    </>
  );
};

export default AuthFooter;
