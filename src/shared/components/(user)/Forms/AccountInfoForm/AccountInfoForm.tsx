import { useState, useEffect, FC, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";

import EmailVerification from "../Verification/Email";
import PhoneVerification from "../Verification/Phone";

import { useToast } from "@/shared/components/(common)/ui/use-toast";
import { UPDATE_CUSTOMER_INFO } from "@/lib/apollo/queryes/customer";
import { Customer } from "@/types/types";
import Input from "@/shared/components/(user)/Forms/AccountInfoForm/Input";
import PhoneController from "@/shared/components/(user)/Forms/AccountInfoForm/PhoneController";

interface AccountInfoFormProps {
  customer?: Customer;
  customerPhone?: string;
  onInfoUpdated: () => Promise<void>;
  classes?: string;
}

type FormValues = Record<string, string>;

const AccountInfoForm: FC<AccountInfoFormProps> = ({
  customer = {},
  customerPhone = "",
  onInfoUpdated,
  classes = "",
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const defaultValues: FormValues = {
    firstname: customer?.firstname || "",
    lastname: customer?.lastname || "",
    email: customer?.email || "",
    phone: customerPhone,
  };
  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty, dirtyFields, errors },
  } = useForm<FormValues>({ defaultValues });

  const [updateCustomerDetail] = useMutation(UPDATE_CUSTOMER_INFO);

  const [loading, setLoading] = useState(false);

  const [emailVerificationShow, setEmailVerificationShow] = useState(false);
  const [emailVerificationError, setEmailVerificationError] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const [phoneVerificationShow, setPhoneVerificationShow] = useState(false);
  const [phoneVerificationError, setPhoneVerificationError] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);

  useEffect(() => {
    if (isDirty) reset(defaultValues);
  }, [customer]);

  useEffect(() => {
    if (emailVerified || phoneVerified) {
      void onSubmit(getValues());
    }
  }, [emailVerified, phoneVerified]);

  const onSubmit = async ({ firstname, lastname }: FormValues) => {
    setLoading(true);

    if (dirtyFields.email && !emailVerified) {
      setEmailVerificationShow(true);

      return;
    }

    if (dirtyFields.phone && !phoneVerified) {
      setPhoneVerificationShow(true);

      return;
    }

    try {
      await updateCustomerDetail({
        variables: { input: { firstname, lastname } },
      });
      await onInfoUpdated();

      setLoading(false);
      toast({
        type: "success",
        description: t("Information changed successfully"),
      });
    } catch (error) {
      const description = error instanceof Error ? error.message : error;

      setLoading(false);
      toast({ type: "error", description });
    }

    setEmailVerified(false);
    setPhoneVerified(false);
  };

  const fields = useMemo(
    () => [
      {
        name: "firstname",
        label: "Last Name",
      },
      {
        name: "lastname",
        label: "First Name",
      },
      {
        name: "email",
        errorMsg: emailVerificationError,
        label: "Email",
      },
    ],
    [emailVerificationError],
  );

  return (
    <>
      <form
        className={`flex flex-wrap gap-x-4 ${classes}`}
        onSubmit={handleSubmit(onSubmit)}
      >
        {fields.map(({ name, label, errorMsg }) => (
          <Input
            key={name}
            dirty={dirtyFields[name]}
            error={Boolean(errors[name])}
            errorMsg={errorMsg}
            inputProps={register(name, { required: true })}
            label={t(label)}
            loading={loading}
          />
        ))}
        <Input
          key="phone"
          dirty={dirtyFields["phone"]}
          error={Boolean(errors["phone"])}
          errorMsg={phoneVerificationError}
          inputProps={register("phone", { required: true })}
          label={t("SMS phone number")}
          loading={loading}
        >
          <PhoneController
            control={control}
            dirty={dirtyFields.phone}
            error={Boolean(errors["phone"])}
            loading={loading}
          />
        </Input>

        <div className="mt-5 w-full">
          <button
            className={`bg-blue leading-0 px-7 py-2 rounded-[50px] text-base text-white ${!isDirty || loading ? "opacity-50" : ""}`}
            disabled={!isDirty || loading}
            type={"submit"}
          >
            {loading ? t("Processing...") : t("Update")}
          </button>
        </div>
      </form>
      {emailVerificationShow && (
        <EmailVerification
          email={getValues("email")}
          onCancel={() => {
            setLoading(false);
            setEmailVerificationShow(false);
            setEmailVerificationError(
              t("Need to verify email to save changes."),
            );
          }}
          onVerify={() => {
            setEmailVerificationError("");
            setEmailVerificationShow(false);
            setEmailVerified(true);
          }}
        />
      )}
      {phoneVerificationShow && (
        <PhoneVerification
          phone={getValues("phone")}
          onCancel={() => {
            setLoading(false);
            setPhoneVerificationShow(false);
            setPhoneVerificationError(
              t("Need to verify phone to save changes."),
            );
          }}
          onVerify={() => {
            setPhoneVerificationError("");
            setPhoneVerificationShow(false);
            setPhoneVerified(true);
          }}
        />
      )}
    </>
  );
};

export default AccountInfoForm;
