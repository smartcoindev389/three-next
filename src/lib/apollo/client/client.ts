import { ApolloLink } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/experimental-nextjs-app-support";

import { authLink, errorLink, httpLink } from "./apollo-link";

export const makeClient = () => {
  console.log("Creating Apollo Client with URI:", process.env.NEXT_PUBLIC_BACKEND_URL + "/graphql");
  
  return new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {},
        },
        Mutation: {
          fields: {},
        },
      },
    }),
    connectToDevTools: process.env.NODE_ENV !== "production",
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
};

export const client = makeClient();
