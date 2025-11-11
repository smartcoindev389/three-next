import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";

import { useToast } from "@/shared/components/(common)/ui/use-toast";
import { UPDATE_CUSTOMER_INFO } from "@/lib/apollo/queryes/customer";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/(common)/ui/dialog";
import { InputPhone } from "@/shared/components/(common)/ui/input-phone";
import PhoneVerification from "@/shared/components/(user)/Forms/Verification/Phone";

/**
 * Component to facilitate changing a user's phone number with validation and toast notifications.
 * @example
 * <ChangePhonePopup currentPhone="123456789" onPhoneChanged={() => {}} classes="custom-class" />
 * @param {Object} props - Component props.
 * @param {string} props.currentPhone - The current phone number of the user.
 * @param {Function} props.onPhoneChanged - Callback function when phone number is successfully changed.
 * @param {string} props.classes - Additional classes for styling the change phone button.
 * @returns {JSX.Element} The rendered component for changing phone numbers.
 * @description
 *   - Uses `useForm` for managing form state.
 *   - Performs phone validation before updating customer info.
 *   - Executes a GraphQL mutation to update phone number.
 *   - Utilizes the toast mechanism to show success/error notifications.
 */
export default function ChangePhonePopup({
  currentPhone,
  onPhoneChanged = (callback) => {},
  classes,
}) {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [updateCustomerDetail] = useMutation(UPDATE_CUSTOMER_INFO);

  const [loading, setLoading] = useState(false);
  const [popupOpened, setPopupOpened] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneVerificationShow, setPhoneVerificationShow] = useState(false);
  const [phoneVerificationError, setPhoneVerificationError] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty, dirtyFields, errors },
  } = useForm({
    defaultValues: {
      phone: currentPhone || "",
    },
  });

  useEffect(() => {
    if (isDirty) {
      reset({
        phone: currentPhone || "",
      });
    }
  }, [currentPhone]);

  useEffect(() => {
    if (phoneVerified) {
      onSubmit(getValues());
    }
  }, [phoneVerified]);

  /**
   * Updates the customer's phone number after verifying the phone.
   * @example
   * updatePhoneNumber(data)
   * undefined
   * @param {Object} data - Contains the new phone details to be updated.
   * @returns {void} No return value.
   * @description
   *   - Shows a phone verification popup if the phone is not verified.
   *   - Updates customer detail with the new phone number as a custom attribute.
   *   - Displays a success toast on successful phone change.
   *   - Handles errors by displaying an error toast with the error message.
   */
  const onSubmit = (data) => {
    setLoading(true);

    if (!phoneVerified) {
      setPhoneVerificationShow(true);

      return;
    }

    updateCustomerDetail({
      variables: {
        input: {
          custom_attributes: [
            { attribute_code: "phone_number", value: data?.phone },
          ],
        },
      },
    })
      .then(() => {
        onPhoneChanged(() => {
          setLoading(false);
          setPopupOpened(false);
          toast({
            type: "success",
            description: t("Phone number changed successfully"),
          });
        });
      })
      .catch((error) => {
        setLoading(false);
        toast({ type: "error", description: error?.message });
      })
      .finally(() => {
        setPhoneVerified(false);
        setPhoneVerificationError("");
      });
  };

  return (
    <>
      <button
        className={`text-base underline text-[#74788D] ${classes}`}
        onClick={() => setPopupOpened(true)}
      >
        {t("Change Phone Number")}
      </button>

      <Dialog open={popupOpened}>
        <DialogTitle />
        <DialogContent
          className="max-w-[90%] sm:max-w-lg lg:max-w-3xl lg:pt-8 lg:pb-10"
          showCloseBtn={false}
        >
          <form
            className={"flex flex-col items-center"}
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3 className="text-3xl text-primary font-din-condensed font-bold text-center">
              {t("Change Phone Number")}
            </h3>
            <div className={"w-full mt-5 mb-4 md:max-w-[280px]"}>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <InputPhone
                    className={`py-1 bg-white ${errors.phone ? "border-[#F46A6A]" : "border-[#ced4dA]"}`}
                    countrySelectorStyleProps={{
                      buttonClassName: "!bg-transparent",
                    }}
                    defaultCountry={(localStorage.getItem("lang") || "en_US")
                      .split("_")[1]
                      .toLowerCase()}
                    disabled={loading}
                    inputProps={{
                      className: `border-0 bg-transparent p-0 focus:!ring-0 focus:text-inherit ${dirtyFields.phone ? "text-inherit" : "text-[#c2c2c2]"}`,
                    }}
                    value={value}
                    onChange={onChange}
                  />
                )}
                rules={{
                  required: true,
                  minLength: 8,
                }}
              />
              {phoneVerificationError && (
                <p className={"text-sm font-medium text-destructive"}>
                  {phoneVerificationError}
                </p>
              )}
            </div>

            <button
              className={`bg-blue leading-0 px-8 py-1 rounded-[50px] text-base text-white mt-2 ${!isDirty || loading ? "opacity-50" : ""}`}
              disabled={!isDirty || loading}
              type={"submit"}
            >
              {loading ? t("Processing...") : t("Update")}
            </button>

            <button
              className={`leading-0 px-6 py-[3px] rounded-[50px] text-base text-[#74788D] mt-3 border border-[#CED4DA] ${loading ? "opacity-50" : ""}`}
              disabled={false}
              type={"button"}
              onClick={() => setPopupOpened(false)}
            >
              {t("Cancel")}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {phoneVerificationShow && (
        <PhoneVerification
          phone={getValues("phone")}
          showOverlay={false}
          onCancel={() => {
            setPhoneVerificationError(
              t("Need to verify phone to save changes."),
            );
            setPhoneVerificationShow(false);
            setLoading(false);
          }}
          onVerify={() => {
            setPhoneVerified(true);
            setPhoneVerificationError("");
            setPhoneVerificationShow(false);
          }}
        />
      )}
    </>
  );
}
