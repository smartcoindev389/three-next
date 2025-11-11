import { setContext } from "@apollo/client/link/context";

// todo: get from cookie
export const getLanguage = () => "en_US";
const authLink = setContext(async (_, { headers }) => {
  const defaultHeaders = {
    Store: `referral_${getLanguage()}`,
  };

  return {
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };
});

export default authLink;
