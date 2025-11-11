import { ApolloLink, HttpLink } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/experimental-nextjs-app-support";

import authLink from "./authLink";
import errorLink from "./errorLink";

//todo: change to NEXT_INTERNAL_BACKEND_URL when it works
const httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_BACKEND_URL + "/graphql" });

const makeServerClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([errorLink, authLink, httpLink]),
  });
};

export default makeServerClient;
