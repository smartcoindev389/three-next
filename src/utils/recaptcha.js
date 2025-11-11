import { useMutation } from "@apollo/client";

import { VERIFY_RECAPTCHA } from "@/lib/apollo/queryes/others";

export function useVerifyRecaptcha() {
  const [VerifyRecaptcha, { loading, error }] = useMutation(VERIFY_RECAPTCHA, {
    errorPolicy: 'all',
    onError: (error) => {
      console.error("Apollo Client error:", error);
    },
  });

  async function verifyRecaptcha(recaptchaToken) {
    if (!recaptchaToken) {
      console.error("reCAPTCHA token is missing!");
      return false;
    }

    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.error("reCAPTCHA verification is only available in browser environment");
      return false;
    }

    try {
      const response = await VerifyRecaptcha({
        variables: {
          token: recaptchaToken,
        },
      });

      if (response.errors) {
        console.error("GraphQL errors:", response.errors);
        return false;
      }

      return response.data?.verifyRecaptcha?.success || false;
    } catch (error) {
      console.error("reCAPTCHA verification failed:", error);
      return false;
    }
  }

  return { verifyRecaptcha, loading, error };
}
