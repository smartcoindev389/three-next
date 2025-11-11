import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";

import { useToast } from "@/shared/components/(common)/ui/use-toast";
import { SUBSCRIBE_EMAIL_TO_NEWSLETTER } from "@/lib/apollo/queryes/newletter";
import Title from "@/shared/components/(common)/Title/Title";
import { emailRegExp } from "@/constants/regexp";

interface SubscribeProps {
  className: string;
}

type UseToastReturn = {
  toast: (args: any) => void;
};

interface IFormInput {
  email: string;
}

/**
 * Newsletter subscription component for handling email sign-ups.
 *
 * This component renders a form where users can enter their email to subscribe to a newsletter.
 * It integrates with GraphQL to submit the email, performs form validation, and displays toast
 * notifications for success, errors, or alerts.
 *
 * @component
 * @example
 * <Subscribe className="custom-class" />
 *
 * @param {SubscribeProps} props - The props for the Subscribe component.
 * @param {string} [props.className] - Optional custom CSS class to style the component's container.
 *
 * @returns {React.JSX.Element} The rendered JSX element that contains the subscription form.
 *
 * @description
 * This component provides an interface for subscribing to a newsletter. It includes:
 * - An email input field with validation (required and regex pattern check).
 * - A submit button to trigger the subscription process.
 * - Success and error toast notifications based on the outcome of the GraphQL mutation.
 * - A form validation error message for invalid email input.
 *
 * It uses:
 * - React Hooks (`useState`, `useForm` for form handling).
 * - GraphQL Mutation (`useMutation` from Apollo Client) for submitting email.
 * - `useToast` for displaying toast messages (success, error, alert).
 */
const Subscribe: FC<SubscribeProps> = ({
  className,
}: SubscribeProps): React.JSX.Element => {
  const { t } = useTranslation();
  const [subscribeEmailToNewsletter] = useMutation(
    SUBSCRIBE_EMAIL_TO_NEWSLETTER,
  );
  const [email, setEmail] = useState<string>("");
  const { toast } = useToast() as UseToastReturn;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  /**
   * Handles email subscription to a newsletter.
   * @example
   * handleSubscribe(email)
   * // Displays success or error message as a toast notification
   * @returns {void} Does not return a value.
   * @description
   *   - Displays an alert toast if the email field is empty.
   *   - Calls `subscribeEmailToNewsletter` and handles success and error responses with appropriate toast notifications.
   *   - Resets the email field upon successful subscription.
   */
  const onSubmit = (): void => {
    if (!email) {
      toast({
        type: "alert",
        description: t("Please, fill the email field to subscribe."),
      });

      return;
    }

    subscribeEmailToNewsletter({
      variables: {
        email: email,
      },
      onCompleted: (data) => {
        setEmail("");
        toast({
          type: "success",
          description: t("Subscription has been succeeded! Thank you!"),
        });
      },
      onError: (error) => {
        const errorData = error?.graphQLErrors[0];

        if (errorData?.extensions?.category === "graphql-already-exists") {
          toast({
            type: "error",
            description: t(
              "Looks like you're already subscribed to our newsletter! No need to subscribe again.",
            ),
          });
          setEmail("");

          return;
        }

        toast({
          type: "error",
          description: t(
            "Subscription has been failed. Please, try again later.",
          ),
        });
      },
    });
  };

  return (
    <>
      <div className="flex md:justify-center gap-2 self-center text-3xl font-bold text-center text-darkslategray-300">
        <svg
          fill="none"
          height="55"
          viewBox="0 0 55 55"
          width="55"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="27.5"
            cy="27.5"
            fill="#00C0F3"
            fillOpacity="0.1"
            r="27.5"
          />
          <path
            clipRule="evenodd"
            d="M17.4805 23.1239L27.3978 29.3222L37.3152 23.1239L27.3978 16.9255L17.4805 23.1239ZM39.7934 23.124V35.5207C39.7934 36.8843 38.6777 38 37.314 38H17.4793C16.1157 38 15 36.8843 15 35.5207V23.124C15 22.219 15.4835 21.438 16.2025 21.0041L27.3967 14L38.5909 21.0041C39.3099 21.438 39.7934 22.219 39.7934 23.124Z"
            fill="#00C0F3"
            fillRule="evenodd"
          />
        </svg>
        <Title className="w-full min-w-full text-paragraph my-auto text-white">{t("Subscribe")} !</Title>
        <div className="w-fit mt-2.5 text-base md:text-lg text-left text-white max-md:mr-1.5 max-md:ml-2">
          {t("Subscribe to our newsletter and get notifications to stay updated")}
        </div>
      </div>
      <form
        className="flex pl-6 mt-3 md:mt-5 max-w-full text-base bg-white border border-[#CED4DA] border-solid shadow-sm rounded-[10px] max-md:pl-5 max-md:mr-1.5 max-md:ml-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          {...register("email", {
            required: t("Email is required"),
            pattern: {
              value: emailRegExp,
              message: "Invalid email address",
            },
          })}
          aria-label={t("Enter email address")}
          className="w-full flex-auto bg-transparent border-none focus:outline-none focus:ring-0 text-[#8080806B] placeholder:text-[#8080806B]"
          placeholder="Enter email address"
          type="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
        />
        <button
          aria-label="Subscribe"
          className="flex justify-center items-center min-w-10 md:min-w-[131px] gap-2 py-2.5 font-medium text-white bg-[#6A1CF0] border border-solid border-[#6A1CF0] rounded-[8px]"
          type="submit"
        >
          <span className="hidden md:block">
            {t("Subscribe")}
          </span>
        </button>
      </form>
      {errors.email && (
        <div className="mt-2 text-red-500 text-sm">{errors.email.message}</div>
      )}
    </>
  );
};

export default Subscribe;
