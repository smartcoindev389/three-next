import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { HttpLink, ApolloLink, Observable } from "@apollo/client";
// import { HttpLink } from "@apollo/client";

import revalidateAccessToken from "@/lib/auth/revalidateAccessToken";

// export const DISABLE_BACKEND = process.env.NEXT_PUBLIC_DISABLE_BACKEND === "true";
export const DISABLE_BACKEND = process.env.NEXT_PUBLIC_DISABLE_BACKEND === "true";

export const errorLink = onError(({ graphQLErrors, networkError, response }) => {
  if (graphQLErrors) {
    const err = graphQLErrors.reduce((r, i) => r.concat(i?.extensions?.category), []);
    const path = graphQLErrors.reduce((r, i) => r.concat(i?.path), []);

    if (path.includes("cart") && err.includes("graphql-no-such-entity")) {
      localStorage.removeItem("cart_id");
      window.location.reload();
    }

    if (graphQLErrors[0]?.message === "The current customer isn't authorized.") {
      // eslint-disable-next-line no-console
      console.error("The current customer isn't authorized.");
      localStorage.removeItem("token");
    }
  }
});

export const authLink = setContext(async (_, { headers }) => {
  //const token = await revalidateAccessToken();
  const getLanguage = () => window.localStorage.getItem("lang") ?? "en_US";
  let additionalHeaders = {
    Store: `${getLanguage()}`,
  };

  if (localStorage.getItem("currency") && localStorage.getItem("currency") !== "undefined") {
    additionalHeaders = {
      ...additionalHeaders,
      "Content-Currency": localStorage.getItem("currency"),
    };
  }

  if (DISABLE_BACKEND) {
    return {
      headers: {
        ...headers,
        ...additionalHeaders,
      },
    };
  }

  const token = await revalidateAccessToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      ...additionalHeaders,
    },
  };
});

// Fix URL construction to avoid double slashes
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
const uri = baseUrl.endsWith("/") 
  ? `${baseUrl}graphql` 
  : `${baseUrl}/graphql`;

//export const httpLink = new HttpLink({ uri });

const mockLink = new ApolloLink(() =>
  new Observable((observer) => {
    // Return empty data for any operation while backend is disabled
    observer.next({ data: {} });
    observer.complete();
  }),
);

export const httpLink = DISABLE_BACKEND ? mockLink : new HttpLink({ uri });
