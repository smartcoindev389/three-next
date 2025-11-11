import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

const useResolver = (showPasswordField: boolean) => {
  const { t } = useTranslation();
  const passwordSchema = useMemo(
    () =>
      z
        .string()
        .min(8, { message: t("Password must be at least 8 characters long") })
        .regex(/[a-z]/, {
          message: t("Password must contain at least one lowercase letter"),
        })
        .regex(/[A-Z]/, {
          message: t("Password must contain at least one uppercase letter"),
        })
        .regex(/\d/, {
          message: t("Password must contain at least one number"),
        })
        .regex(/[^a-zA-Z0-9]/, {
          message: t("Password must contain at least one special character"),
        }),
    [t],
  );

  const formSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, { message: t("Email address is required") })
          .email(t("Invalid email format")),
        remember: z.boolean().default(false).optional(),
        password: showPasswordField ? passwordSchema : z.string().optional(),
      }),
    [showPasswordField, t, passwordSchema],
  );

  return useMemo(() => zodResolver(formSchema), [formSchema]);
};

export default useResolver;
