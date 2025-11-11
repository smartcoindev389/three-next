import { useState, useEffect, FC } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FetchResult, useMutation } from "@apollo/client";
import { toast } from "react-toastify";

import {
  SMS_TEXT_ALERT,
  UPDATE_CUSTOMER_NEWSLETTER_MUTATION,
} from "@/lib/apollo/queryes/newletter";
import { getCustomerCustomAttribute } from "@/utils/utils-old";
import Checkbox from "@/shared/components/(user)/Forms/NotificationsForm/Checkbox";
import { Customer } from "@/types/types";

interface NotificationsFormProps {
  customer: Customer;
  onNotificationsUpdated: () => Promise<void>;
  classes?: string;
}

interface UpdateEmailNotifications {
  updateCustomer: {
    customer: {
      firstname: string;
      is_subscribed: boolean;
    };
  };
}

interface UpdateSmsNotifications {
  updateCustomerV2: {
    customer: {
      custom_attributes: Array<{
        code: string;
        value: string;
      }>;
    };
  };
}

enum NotificationType {
  smsAlert = "sms_alert",
  newsletter = "newsletter",
}

const NotificationsForm: FC<NotificationsFormProps> = ({
  customer,
  onNotificationsUpdated,
  classes = "",
}) => {
  const { t } = useTranslation();
  const defaultValues = {
    is_subscribed: customer?.is_subscribed,
    sms_alert: getCustomerCustomAttribute(customer, "sms_alert") === "1",
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, dirtyFields },
  } = useForm({ defaultValues });

  const [subscribeEmailNewsletter] = useMutation(
    UPDATE_CUSTOMER_NEWSLETTER_MUTATION,
  );
  const [smsAlert] = useMutation(SMS_TEXT_ALERT);
  const [loading, setLoading] = useState(false);

  const getSuccessMessage = (
    data: UpdateSmsNotifications | UpdateEmailNotifications,
    type: string,
  ) => {
    const value =
      "updateCustomer" in data
        ? data.updateCustomer.customer.is_subscribed
        : getCustomerCustomAttribute(
            data.updateCustomerV2.customer,
            "sms_alert",
          );

    return value
      ? t(
          `Thanks for ${type} subscribing! Get ready for exciting updates straight to your inbox!`,
        )
      : t(
          `We're sorry to see you go! Your ${type} subscription has been successfully canceled. You're welcome back anytime!`,
        );
  };

  const onSubmit = async ({
    is_subscribed,
    sms_alert,
  }: Record<string, boolean>) => {
    setLoading(true);

    const promises: Promise<
      FetchResult<UpdateEmailNotifications | UpdateSmsNotifications>
    >[] = [];
    const types: NotificationType[] = [];

    if (dirtyFields.is_subscribed) {
      promises.push(subscribeEmailNewsletter({ variables: { is_subscribed } }));
      types.push(NotificationType.newsletter);
    }

    if (dirtyFields.sms_alert) {
      promises.push(smsAlert({ variables: { sms_alert } }));
      types.push(NotificationType.smsAlert);
    }

    const promisesResults = await Promise.allSettled(promises);

    promisesResults.forEach((result, index) => {
      const type =
        types[index] === "sms_alert"
          ? "SMS/Text Alerts"
          : "Newsletter/Email Alerts";

      if (result.status === "fulfilled" && result.value.data) {
        toast.success(getSuccessMessage(result.value.data, type));
      }

      if (result.status === "rejected") {
        toast.error(
          t(
            `Something went wrong on ${type} status changing. Please, try again later.`,
          ),
        );
      }
    });

    await onNotificationsUpdated();

    setLoading(false);
  };

  useEffect(() => {
    if (isDirty) reset(defaultValues);
  }, [customer]);

  return (
    <form
      className={`flex flex-wrap gap-x-4 ${classes}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Checkbox
        inputProps={register("is_subscribed")}
        label={t("Newsletter/Email Alerts")}
      />
      <Checkbox
        inputProps={register("sms_alert")}
        label={t("SMS/Text Alerts")}
      />

      <div className="mt-2.5 w-full">
        <button
          className={`bg-blue leading-0 px-7 py-2 rounded-[50px] text-base text-white ${!isDirty || loading ? "opacity-50" : ""}`}
          disabled={!isDirty || loading}
          type={"submit"}
        >
          {loading ? t("Processing...") : t("Update")}
        </button>
      </div>
    </form>
  );
};

export default NotificationsForm;
