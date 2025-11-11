"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { useToast } from "@/shared/components/(common)/ui/use-toast";
import { GET_CUSTOMER_ACCOUNT_DATA } from "@/lib/apollo/queryes/customer";
import { UPDATE_CUSTOMER_2FA } from "@/lib/apollo/queryes/loginSecurity";
import { getCustomerCustomAttribute } from "@/utils/utils-old";
import Loader from "@/shared/components/(common)/Loader/Loader";
import PhoneVerification from "@/shared/components/(user)/Forms/Verification/Phone";
import ChangePhonePopup from "@/shared/components/(user)/Forms/ChangePhonePopup";
import Title from "@/shared/components/(common)/Title/Title";
import { AUTH_REMINDER_LS_KEY } from "@/shared/components/(user)/OptionalSecurityPopup/OptionalSecurityPopup";

const LoginSecurity = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();

  const { data, loading, refetch } = useQuery(GET_CUSTOMER_ACCOUNT_DATA);
  const [update2FA, { loading: updateLoading }] =
    useMutation(UPDATE_CUSTOMER_2FA);

  const [customerData, setCustomerData] = useState({});
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const [phoneVerificationShow, setPhoneVerificationShow] = useState(false);
  const [phoneVerificationError, setPhoneVerificationError] = useState("");

  useEffect(() => {
    if (data?.customer) {
      setCustomerData(data?.customer);
      setTwoFactorAuth(
        getCustomerCustomAttribute(
          data?.customer,
          "two_factor_authentication",
        ) === "1",
      );
      setPhoneNumber(
        getCustomerCustomAttribute(data?.customer, "phone_number"),
      );
    }
  }, [data]);

  useEffect(() => {
    if (phoneVerificationError) {
      toast({
        type: "error",
        description: phoneVerificationError,
      });
      setPhoneVerificationError("");
      setTwoFactorAuth(!twoFactorAuth);
    }
  }, [phoneVerificationError]);

  const onTwoFactorAuthChange = ({ target: { checked } }) => {
    if (!phoneNumber && checked)
      return toast({
        type: "error",
        description: t("Phone Number is required"),
      });

    setTwoFactorAuth(checked);

    if (checked) {
      setPhoneVerificationShow(true);

      return;
    }

    _sendUpdateRequest(checked);
  };

  const _sendUpdateRequest = (newValue) => {
    update2FA({
      variables: {
        two_factor_authentication: newValue,
      },
    })
      .then(() => {
        toast({
          type: "success",
          description: newValue
            ? t(
                "Thanks for adding an extra layer of security! Two-Factor Authentication is now enabled for your account.",
              )
            : t(
                "Your Two-Factor Authentication has been successfully disabled. We're here to help if you ever decide to re-enable it!",
              ),
        });

        if (newValue) {
          localStorage.setItem(AUTH_REMINDER_LS_KEY, Date.now().toString());
        } else {
          localStorage.removeItem(AUTH_REMINDER_LS_KEY);
        }
      })
      .catch(() => {
        toast({
          type: "error",
          description: t("Something went wrong. Please, try again later."),
        });
        setTwoFactorAuth(!newValue);
      });
  };

  return (
    <div className="flex w-full bg-[#F8F8FB] min-h-[calc(100vh-70px)]">
      <div className="pt-6 pb-12 px-5 sm:px-[50px] sm:py-[40px] min-h-full bg-white w-full">
        {loading || Object.keys(customerData).length === 0 ? (
          <Loader className={"h-full"} />
        ) : (
          <>
            <Title className="text-paragraph mt-0 mb-[30px]">
              {t("Login and Security")}
            </Title>
            <label className="w-full flex cursor-pointer select-none items-center gap-3 mb-6">
              <div className="text-base text-primary mr-5">
                {t("Two-Factor Authentication")}
              </div>
              <div className="relative">
                <input
                  checked={twoFactorAuth}
                  className="sr-only peer"
                  type="checkbox"
                  onChange={onTwoFactorAuthChange}
                />
                <span className="box block h-8 w-14 rounded-full peer bg-[#CED4DA] peer-checked:bg-blue outline-0" />
                <div
                  className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition peer peer-checked:translate-x-full`}
                />
              </div>
              <div className="text-base text-primary font-bold uppercase">
                {twoFactorAuth ? t("on") : t("off")}
              </div>
            </label>

            <div className="flex gap-3">
              <svg
                fill="none"
                height="30"
                viewBox="0 0 30 30"
                width="30"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M13.4494 0.0699798C9.80039 0.526748 6.93364 1.91027 4.38286 4.44539C1.46766 7.34271 0.00108517 10.8698 6.00019e-07 14.9858C-0.00108397 19.137 1.46814 22.6848 4.39816 25.6066C6.16998 27.3735 8.00338 28.5111 10.2969 29.2668C13.2133 30.2276 16.711 30.2452 19.5821 29.3131C24.5912 27.6871 28.2504 23.7724 29.6086 18.5868C30.0265 16.9911 30.1248 14.3201 29.8304 12.5638C28.9306 7.19802 25.1694 2.70857 20.0321 0.868393C18.1344 0.188708 15.2732 -0.158344 13.4494 0.0699798ZM12.5324 2.53288C8.0064 3.43812 4.24283 6.80494 2.85639 11.189C2.40882 12.6041 2.24807 13.9356 2.32182 15.6154C2.56705 21.1984 6.28061 25.7959 11.7753 27.3189C12.8508 27.6171 13.1337 27.6453 15.0028 27.6406C16.8368 27.6359 17.1768 27.6017 18.248 27.3135C22.6317 26.1339 26.0029 22.8136 27.3018 18.3964C27.6948 17.0598 27.8387 14.4413 27.6001 12.9666C26.9562 8.98676 24.344 5.4755 20.6558 3.63256C18.8129 2.71169 17.1712 2.34902 14.9175 2.36488C14.0365 2.37113 12.9632 2.44671 12.5324 2.53288ZM14.6066 5.74275C14.3569 5.80897 14.1231 5.99055 13.9744 6.23365C13.7492 6.60209 13.7383 6.8708 13.738 12.1293C13.7376 16.8548 13.764 17.6948 13.924 18.031C14.3477 18.9213 15.6579 18.9213 16.0816 18.031C16.2416 17.6948 16.268 16.8548 16.2677 12.1293C16.2673 6.84868 16.2573 6.60342 16.0285 6.22909C15.8971 6.01422 15.7749 5.83853 15.757 5.83853C15.739 5.83853 15.562 5.79335 15.3635 5.73807C15.1651 5.68279 14.8245 5.68495 14.6066 5.74275ZM14.0338 21.1412C13.529 21.6446 13.4181 22.0622 13.637 22.6356C14.1367 23.945 15.9554 23.9115 16.3946 22.5847C16.6917 21.6866 15.9664 20.7397 14.9815 20.7397C14.5242 20.7397 14.3716 20.8043 14.0338 21.1412Z"
                  fill="#434345"
                  fillRule="evenodd"
                />
              </svg>
              <p className="text-base text-[#74788D] max-w-3xl leading-[1.2]">
                <strong className="mr-1">
                  {t("Two-factor authentication (2FA)")}
                </strong>
                {t(
                  "involves a verification code sent to your phone to be entered during login as an added step to password. This added layer of security significantly reduces the risk of unauthorized access, as even if a password is compromised, the second factor is still needed to gain entry.",
                )}
              </p>
            </div>

            {!phoneNumber && (
              <div className="flex gap-3 mt-6">
                <svg
                  fill="none"
                  height="30"
                  viewBox="0 0 30 30"
                  width="30"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M13.4494 0.0699798C9.80039 0.526748 6.93364 1.91027 4.38286 4.44539C1.46766 7.34271 0.00108517 10.8698 6.00019e-07 14.9858C-0.00108397 19.137 1.46814 22.6848 4.39816 25.6066C6.16998 27.3735 8.00338 28.5111 10.2969 29.2668C13.2133 30.2276 16.711 30.2452 19.5821 29.3131C24.5912 27.6871 28.2504 23.7724 29.6086 18.5868C30.0265 16.9911 30.1248 14.3201 29.8304 12.5638C28.9306 7.19802 25.1694 2.70857 20.0321 0.868393C18.1344 0.188708 15.2732 -0.158344 13.4494 0.0699798ZM12.5324 2.53288C8.0064 3.43812 4.24283 6.80494 2.85639 11.189C2.40882 12.6041 2.24807 13.9356 2.32182 15.6154C2.56705 21.1984 6.28061 25.7959 11.7753 27.3189C12.8508 27.6171 13.1337 27.6453 15.0028 27.6406C16.8368 27.6359 17.1768 27.6017 18.248 27.3135C22.6317 26.1339 26.0029 22.8136 27.3018 18.3964C27.6948 17.0598 27.8387 14.4413 27.6001 12.9666C26.9562 8.98676 24.344 5.4755 20.6558 3.63256C18.8129 2.71169 17.1712 2.34902 14.9175 2.36488C14.0365 2.37113 12.9632 2.44671 12.5324 2.53288ZM14.6066 5.74275C14.3569 5.80897 14.1231 5.99055 13.9744 6.23365C13.7492 6.60209 13.7383 6.8708 13.738 12.1293C13.7376 16.8548 13.764 17.6948 13.924 18.031C14.3477 18.9213 15.6579 18.9213 16.0816 18.031C16.2416 17.6948 16.268 16.8548 16.2677 12.1293C16.2673 6.84868 16.2573 6.60342 16.0285 6.22909C15.8971 6.01422 15.7749 5.83853 15.757 5.83853C15.739 5.83853 15.562 5.79335 15.3635 5.73807C15.1651 5.68279 14.8245 5.68495 14.6066 5.74275ZM14.0338 21.1412C13.529 21.6446 13.4181 22.0622 13.637 22.6356C14.1367 23.945 15.9554 23.9115 16.3946 22.5847C16.6917 21.6866 15.9664 20.7397 14.9815 20.7397C14.5242 20.7397 14.3716 20.8043 14.0338 21.1412Z"
                    fill="#FF0000"
                    fillRule="evenodd"
                  />
                </svg>
                <p className="text-base text-destructive max-w-3xl leading-[1.2]">
                  {t(
                    "To activate two-factor authentication need to add phone number on the",
                  )}
                  <strong className="mx-1">{t("account information")}</strong>
                  {t("page or by clicking to the button below.")}
                </p>
              </div>
            )}

            <ChangePhonePopup
              classes={"mt-8"}
              currentPhone={phoneNumber}
              onPhoneChanged={(callback) => {
                refetch().then(() => {
                  callback();
                });
              }}
            />
          </>
        )}
      </div>

      {phoneVerificationShow && (
        <PhoneVerification
          headerText={t("2 Factor Authentication")}
          phone={phoneNumber}
          submitBtnText={t("Enable 2FA")}
          onCancel={() => {
            setPhoneVerificationShow(false);
            setPhoneVerificationError(
              t("Need to verify phone to save changes."),
            );
          }}
          onVerify={() => {
            setPhoneVerificationShow(false);
            _sendUpdateRequest(twoFactorAuth);
          }}
        />
      )}

      {updateLoading && (
        <div className="bg-opacity-50 bg-white fixed flex h-screen items-center justify-center left-0 top-0 w-full z-[9999999990]">
          <Loader className={"!bg-transparent"} />
        </div>
      )}
    </div>
  );
};

export default LoginSecurity;
