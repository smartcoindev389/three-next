import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors }) => {
  // todo: add logger
  if (graphQLErrors) console.error(graphQLErrors);
});

export default errorLink;
