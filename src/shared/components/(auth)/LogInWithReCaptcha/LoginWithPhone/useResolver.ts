import { PhoneNumberUtil } from "google-libphonenumber";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

const phoneUtil = PhoneNumberUtil.getInstance();
const isPhoneValid = (phoneCode: string, phone?: string) => {
  try {
    return phoneUtil.isValidNumber(
      phoneUtil.parseAndKeepRawInput(
        phoneCode.substring(0, phoneCode.indexOf("(")) + phone,
      ),
    );
  } catch (error) {
    return false;
  }
};

const useResolver = () => {
  const { t } = useTranslation();
  const formSchema = useMemo(
    () =>
      z
        .object({
          remember: z.boolean().default(false).optional(),
          phone_number: z
            .string()
            .min(1, { message: t("Phone Number is required") }),
          phoneCode: z
            .string()
            .optional()
            .default("+1(United States of America)"),
        })
        .refine((data) => isPhoneValid(data.phoneCode, data?.phone_number), {
          path: ["phone_number"],
          message: t("Invalid phone number"),
        }),
    [t],
  );

  return useMemo(() => zodResolver(formSchema), [formSchema]);
};

export default useResolver;
