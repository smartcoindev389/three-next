import { z } from "zod";
import { useTranslation } from "react-i18next";

const useFormSchema = () => {
  const { t } = useTranslation();

  const passwordSchema = z
    .string()
    .min(8, { message: t("Password must be at least 8 characters long") })
    .regex(/[a-z]/, {
      message: t("Password must contain at least one lowercase letter"),
    })
    .regex(/[A-Z]/, {
      message: t("Password must contain at least one uppercase letter"),
    })
    .regex(/\d/, { message: t("Password must contain at least one number") })
    .regex(/[^a-zA-Z0-9]/, {
      message: t("Password must contain at least one special character"),
    });

  return z
    .object({
      password: z
        .string()
        .min(8, { message: t("Current Password is required") }),
      newPassword: passwordSchema,
      confirmPassword: passwordSchema,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("Passwords do not match"),
      path: ["confirmPassword"],
    })
    .refine((data) => data.password !== data.newPassword, {
      message: t("Old and new passwords cannot be the same."),
      path: ["newPassword"],
    });
};

export default useFormSchema;
