import { useLazyQuery, useMutation } from "@apollo/client";
import { useCallback } from "react";

import {
  TWILIO_LOGIN,
  TWILIO_SEND,
  TWILIO_UPDATE_CONTACT,
  TWILIO_VERIFY,
} from "@/lib/apollo/queryes/auth";

enum Channel {
  sms = "sms",
  email = "email",
}

interface TwilioLoginResponse {
  access_token: string;
  is_email_verified: boolean;
  is_otp_verified: boolean;
  two_factor_authentication: boolean;
  contact: string;
}

export const getTwilioError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;

  console.error(error);

  return "Please try again later";
};

const throwOtpError = (message: string) => {
  throw `Error OTP. ${message}`;
};

const checkRequiredFields = (contact: string, code: string) => {
  if (!contact) throwOtpError(`"contact" was not provided`);
  if (!code) throwOtpError(`"code" was not provided`);
};

const useTwilio = () => {
  const [sendTwilio, { loading: sending }] = useLazyQuery(TWILIO_SEND);
  const [verifyTwilio, { loading: verifying }] = useLazyQuery(TWILIO_VERIFY);
  const [login] = useMutation<{ twiliologin: TwilioLoginResponse }>(
    TWILIO_LOGIN,
  );
  const [updateContact] = useMutation<{
    twiliocontactupdate: { status: boolean };
  }>(TWILIO_UPDATE_CONTACT);

  const send = useCallback(
    async (contact: string, channel: Channel) => {
      if (!contact) throwOtpError(`"contact" was not provided`);

      const { errors } = await sendTwilio({
        variables: { contact, channel },
        fetchPolicy: "no-cache",
      });

      if (errors?.length) throw `Error sending OTP. ${errors[0].message}`;
    },
    [sendTwilio],
  );

  const verify = useCallback(
    async (contact: string, code: string) => {
      checkRequiredFields(contact, code);

      const { errors } = await verifyTwilio({
        variables: { contact, code },
        fetchPolicy: "no-cache",
      });

      if (errors?.length) throw `Error verifying OTP. ${errors[0].message}`;
    },
    [verifyTwilio],
  );

  const loginWithTwilio = async (
    contact: string,
    code: string,
    channel: Channel,
  ): Promise<TwilioLoginResponse | undefined> => {
    checkRequiredFields(contact, code);

    try {
      const { data } = await login({ variables: { contact, code, channel } });

      return data?.twiliologin;
    } catch (error: unknown) {
      throw `Error verifying OTP. ${getTwilioError(error)}`;
    }
  };

  const updateContactWithTwilio = async (
    contact: string,
    code: string,
    channel: Channel,
  ): Promise<boolean> => {
    checkRequiredFields(contact, code);

    try {
      const { data } = await updateContact({
        variables: { contact, code, channel },
      });

      return data?.twiliocontactupdate.status ?? false;
    } catch (error: unknown) {
      throw `Error updating contact with OTP. ${getTwilioError(error)}`;
    }
  };

  const sendSms = (contact: string) => send(contact, Channel.sms);
  const sendEmail = (contact: string) => send(contact, Channel.email);

  const loginWithSms = async (contact: string, code: string) =>
    loginWithTwilio(contact, code, Channel.sms);
  const loginWithEmail = async (contact: string, code: string) =>
    loginWithTwilio(contact, code, Channel.email);

  const updateEmail = async (contact: string, code: string) =>
    updateContactWithTwilio(contact, code, Channel.email);
  const updatePhone = async (contact: string, code: string) =>
    updateContactWithTwilio(contact, code, Channel.sms);

  return {
    sendSms,
    sendEmail,
    sending,
    verifyCode: verify,
    verifying,
    loginWithSms,
    loginWithEmail,
    updatePhone,
    updateEmail,
  };
};

export default useTwilio;
