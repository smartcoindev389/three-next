"use client";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

import Button from "@/shared/components/(auth)/Button/Button";

/**
 * Renders a confirmation message that an email with a password reset link will be sent if an account exists.
 * @example
 * ConfirmEmail()
 * // Renders a message informing the user of the email process
 * @returns {JSX.Element} A div containing the message about the email reset process.
 * @description
 *   - Utilizes i18n for translation to support multiple languages.
 *   - The component is styled with various Tailwind CSS classes for responsive design.
 */
export default function ConfirmEmail() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  return (
    <div className="verification-id-wrapper h-[auto] mt-24 md:mt-48">
      <div className="flex flex-col items-center">
        <h1 className="lg:text-[40px] font-din-condensed text-2xl text-white text-center mt-1 font-bold">
          {t("If there is an account associated with")}
        </h1>
        <p className="text-center !text-white !text-lg mt-5 w-[454px] max-w-full">
          {t("you will receive an email with a link to reset your password.")}
        </p>

        <div className="mt-11 w-[415px] max-w-full m-[auto]">
          <svg
            className="m-auto"
            fill="none"
            height="125"
            viewBox="0 0 125 125"
            width="125"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="62.5"
              cy="62.5"
              fill="white"
              r="61.5"
              stroke="#00CE9D"
              strokeWidth="2"
            />
            <path
              d="M81.5616 50.4561C80.9771 49.848 80.068 49.848 79.4835 50.4561L57.4029 72.7563L46.4925 61.6062C45.9081 60.998 44.9989 61.0656 44.4144 61.6062C43.8299 62.2144 43.8948 63.1605 44.4144 63.7687L55.9092 75.3918C56.2989 75.7973 56.8184 76 57.4029 76C57.9874 76 58.442 75.7973 58.8966 75.3918L81.5616 52.4834C82.1461 52.0104 82.1461 51.0643 81.5616 50.4561Z"
              fill="#00CE9D"
            />
          </svg>
        </div>

        <Button className="mt-11 bg-[#3F65FD] rounded-md" onClick={() => router.push("/login")}>
          {t("Sign In")}
        </Button>
      </div>
    </div>
  );
}
