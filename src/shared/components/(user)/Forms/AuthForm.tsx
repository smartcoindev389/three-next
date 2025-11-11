import { useState, useEffect, FC, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from "next/navigation";
import { useMutation, useLazyQuery } from "@apollo/client";
import Link from "next/link";
import { toast } from "react-toastify";

import { saveRoutePath, getFormData } from "@/utils/utils-old";
import { SET_GUEST_EMAIL_ON_CART } from "@/lib/apollo/queryes/checkout";
import { CHECK_CUSTOMER_EMAIL } from "@/lib/apollo/queryes/customer";
import BaseButton from "@/shared/components/(main)/BaseButton/BaseButton";
import Title from "@/shared/components/(common)/Title/Title";

type FormData = {
  email?: string;
  name?: string;
};

interface AuthFormProps {
  cartId: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onGuestAuth: (email?: string, name?: string) => Promise<void>;
}

const ErrorMsg: FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <span className="text-lg">{t("An account with this email already exists")}</span>
      <div>
        <span>{t("Please try to")} </span>
        <Link className="underline text-blue" href="/login">
          {t("Sign In")}{" "}
        </Link>
        <span>{t("or use another email")}</span>
      </div>
    </div>
  );
};

const AuthForm: FC<AuthFormProps> = ({ cartId, loading, setLoading, onGuestAuth }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [formData, setFormData] = useState<FormData>({});
  const [setGuestEmail] = useMutation(SET_GUEST_EMAIL_ON_CART);
  const [checkEmailAvailability, { data: emailData }] = useLazyQuery(CHECK_CUSTOMER_EMAIL, { fetchPolicy: "no-cache" });

  const handleRedirect = (routeName: string) => {
    saveRoutePath(pathname);
    router.push(routeName);
  };

  const submitAuthForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormData(getFormData(event));
  };

  const resetFormData = () => setFormData({});

  const initGuest = async () => {
    setLoading(true);

    try {
      const variables = { cart_id: cartId, email: formData.email };
      const res = await setGuestEmail({
        variables,
        onError: ({ graphQLErrors }) => toast.error(graphQLErrors[0].message),
      });
      const email = res?.data?.setGuestEmailOnCart?.cart?.email;

      await onGuestAuth(email, formData.name);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Some error occurred");
    }

    setLoading(false);
    resetFormData();
  };

  useEffect(() => {
    if (formData?.email) void checkEmailAvailability({ variables: { email: formData.email } });
  }, [formData]);

  useEffect(() => {
    if (!emailData) return;

    if (emailData.checkCustomerEmail.success === false) {
      void initGuest();
    } else {
      resetFormData();
      toast.error(<ErrorMsg />);
    }
  }, [emailData]);

  return (
    <>
      <div className="w-full h-fit rounded-[8px] border border-[#CACBCF] shadow py-4 px-5">
        <Title>{t("Checkout")}</Title>
        <div className="text-[#545454] text-lg md:text-[23px] font-medium">{t("Have an account?")}</div>
        <div className="text-[#545454] text-base md:text-[18px]">
          {t("Sign in to checkout faster or continue as a guest")}{" "}
        </div>
        <div className="grid grid-cols-2 mt-4 gap-1.5">
          <BaseButton onClick={() => handleRedirect("/login")}>{t("Sign In")}</BaseButton>
          <BaseButton
            className="bg-white border border-[#CACBCF] !text-blue"
            onClick={() => handleRedirect("/register")}
          >
            {t("Create an Account")}
          </BaseButton>
        </div>
      </div>
      <div className="w-full h-fit rounded-[8px] border border-[#CACBCF] shadow py-4 px-5 mt-3.5 flex flex-col justify-between">
        <form onSubmit={submitAuthForm}>
          <Title>{t("Guest Checkout")}</Title>
          <div className="text-[#949390] text-[18px] font-medium">{t("Enter your information")}</div>
          <input
            required
            className="rounded-[6px] border border-[#CACBCF] h-14 w-full mt-3 text-[16px] placeholder-[#c2c2c2]"
            defaultValue={typeof window !== "undefined" ? localStorage.getItem("guestName") || "" : ""}
            name="name"
            placeholder={t("Enter your name")}
          />
          <input
            required
            className="rounded-[6px] border border-[#CACBCF] h-14 w-full mt-4 text-[16px] placeholder-[#c2c2c2]"
            defaultValue={typeof window !== "undefined" ? localStorage.getItem("guestEmail") || "" : ""}
            name="email"
            placeholder={t("Enter your email")}
            type="email"
          />
          <BaseButton className="mt-4 w-full md:w-[265px]" type="submit">
            {loading ? t("Processing...") : t("Continue")}
          </BaseButton>
        </form>
      </div>
    </>
  );
};

export default AuthForm;
