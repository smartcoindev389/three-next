"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./style.module.scss";
import clsx from "clsx";
import Link from "next/link";
import { Paragraph } from "shared/components/(main)/Paragraph";
import { Blur } from "shared/components/(main)/blur";
import { Button } from "shared/components/(main)/button";
import { FC, useEffect, useState } from "react";
import { DecryptedText } from "shared/components/(main)/DecryptedText";
import { useReferralForm } from "providers/referral-form-provider";

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().min(1, "Email is required.").email("Email is invalid."),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[\d\s\+\-\(\)]+$/,
      "Phone number can only contain digits, spaces, +, -, ( ).",
    ),
  message: z.string().min(10, "Message must be at least 10 characters long."),
});

interface ModalProps {
  active: boolean;
}

export const Model: FC<ModalProps> = ({ active }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(contactFormSchema),
  });

  const [final, setFinal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { close } = useReferralForm();

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = async (data: Record<string, string>) => {
    try {
      setSubmitError(null);

      const submissionData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        businessName: "",
        location: "",
        existingWebsite: "",
        services: [],
        projectDescription: data.message,
        idealTimeline: "",
        approximateBudget: "",
        howDidYouHear: "",
        selectedAddOns: [],
        selectedHourlyPackage: null,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to send message");
      }

      setFinal(true);
      reset();
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Failed to send message. Please try again."
      );
    }
  };

  useEffect(() => {
    if (!active) return;

    const closeModal = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", closeModal);

    return () => {
      document.removeEventListener("keydown", closeModal);
    };
  }, [close, active]);

  if (!active || !mounted) {
    return null;
  }

  return (
    <div className={clsx(styles.modal, styles.activeModal)}>
      <button className={styles.close} onClick={close}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
        </svg>
      </button>
      <div className={clsx(styles.content)}>
        <h2>Let&apos;s get in touch with us</h2>
        <Paragraph
          isBig
          text="Email, call or complete the form to connect with us We'll get back to you within 24 hours."
        />
        <div className={styles.contacts}>
          <Link target="_blank" className={styles.link} href="tel:+19252551821">
            <span className={styles.title}>Phone</span>
            <span className={styles.text}>+1 (925) 255-1821</span>
          </Link>
          <Link
            target="_blank"
            className={styles.link}
            href="mailto:info@platformz.us"
          >
            <span className={styles.title}>Email</span>
            <span className={styles.text}>info@platformz.us</span>
          </Link>
          <Link
            target="_blank"
            className={styles.link}
            href="https://www.google.com/search?q=8549+Wilshire+Blvd+%7C+%233302%2C+Beverly+Hills%2C+CA+90211&oq=8549+Wilshire+Blvd+%7C+%233302%2C+Beverly+Hills%2C+CA+90211&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABjvBTIHCAIQABjvBTIHCAMQABjvBTIHCAQQABjvBTIHCAUQABjvBdIBBzM5OGowajeoAgCwAgA&sourceid=chrome&ie=UTF-8"
          >
            <span className={styles.title}>Office</span>
            <span className={styles.text}>
              8549 Wilshire Blvd | #3302, Beverly Hills, CA 90211
            </span>
          </Link>
        </div>
      </div>
      <Blur isBorder isAnimation className={styles.blur}>
        {final ? (
          <div className={styles.successMessage}>
            <h3>Thank you!</h3>
            <Paragraph
              isBig
              text="We've received your message and will get back to you within 24 hours."
            />
          </div>
        ) : (
          <>
            <h3>Lets Connect</h3>
            <Paragraph text="We'll get back to you within 24 hours." />
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.grid}>
                <div className={styles.field} suppressHydrationWarning>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Henry"
                    autoComplete="given-name"
                    {...register("firstName")}
                  />
                  <span
                    className={clsx(styles.errors, {
                      [styles.visible]: errors.firstName,
                    })}
                  >
                    <DecryptedText
                      trigger={Boolean(errors.firstName)}
                      text={
                        errors.firstName?.message || "First name is required."
                      }
                    />
                  </span>
                </div>

                <div className={styles.field} suppressHydrationWarning>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Franklin"
                    autoComplete="family-name"
                    {...register("lastName")}
                  />
                  <span
                    className={clsx(styles.errors, {
                      [styles.visible]: errors.lastName,
                    })}
                  >
                    <DecryptedText
                      trigger={Boolean(errors.lastName)}
                      text={
                        errors.lastName?.message || "Last name is required."
                      }
                    />
                  </span>
                </div>

                <div className={styles.field} suppressHydrationWarning>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="yourname@company.com"
                    autoComplete="email"
                    {...register("email")}
                  />
                  <span
                    className={clsx(styles.errors, {
                      [styles.visible]: errors.email,
                    })}
                  >
                    <DecryptedText
                      trigger={Boolean(errors.email)}
                      text={errors.email?.message || "Email is required."}
                    />
                  </span>
                </div>

                <div className={styles.field} suppressHydrationWarning>
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 444-0000"
                    autoComplete="tel"
                    {...register("phoneNumber")}
                  />
                  <span
                    className={clsx(styles.errors, {
                      [styles.visible]: errors.phoneNumber,
                    })}
                  >
                    <DecryptedText
                      trigger={Boolean(errors.phoneNumber)}
                      text={
                        errors.phoneNumber?.message ||
                        "Phone number is required"
                      }
                    />
                  </span>
                </div>

                <div className={clsx(styles.field, styles.full)} suppressHydrationWarning>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    placeholder="Type your message"
                    {...register("message")}
                  />
                  <span
                    className={clsx(styles.errors, {
                      [styles.visible]: errors.message,
                    })}
                  >
                    <DecryptedText
                      trigger={Boolean(errors.message)}
                      text={
                        errors.message?.message ||
                        "Message must be at least 10 characters long."
                      }
                    />
                  </span>
                </div>
              </div>

              <Button
                disabled={isSubmitting}
                type="submit"
                isBlueBtnFull
                isBlueBtn
                className={styles.submitButton}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
              {submitError && (
                <div className={clsx(styles.errors, styles.visible)} style={{ marginTop: "1rem", textAlign: "center" }}>
                  <DecryptedText
                    trigger={Boolean(submitError)}
                    text={submitError}
                  />
                </div>
              )}
            </form>
          </>
        )}
      </Blur>
    </div>
  );
};
