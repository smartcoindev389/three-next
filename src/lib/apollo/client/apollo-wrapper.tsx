"use client";

import { makeVar } from "@apollo/client";
import { ApolloNextAppProvider } from "@apollo/experimental-nextjs-app-support";
import { FC, PropsWithChildren } from "react";

import { makeClient } from "./client";

export const isAuthorizedVar = makeVar<null | boolean>(null);

const ApolloWrapper: FC<PropsWithChildren> = ({ children }) => {
  console.log("ApolloWrapper: Initializing Apollo Client");
  
  return (
    <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
  );
};

export default ApolloWrapper;
