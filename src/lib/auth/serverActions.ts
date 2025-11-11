"use server";

import * as process from "node:process";

import { DocumentNode, print } from "graphql/index";
import jwt from "jsonwebtoken";

import { REFRESH_CUSTOMER_TOKEN } from "@/lib/apollo/queryes/customer";
import { SSOLogin } from "@/lib/apollo/queryes/auth";

const url = process.env.NEXT_INTERNAL_BACKEND_URL + "/graphql";
const secret = process.env.AUTH_SSO_SERVER_SECRET_KEY || "";

const makeInternalGraphQLRequest = async (query: DocumentNode, variables = {}, token?: string) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) headers.authorization = `Bearer ${token}`;

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ query: print(query), variables }),
    });

    if (!response.ok) throw Error(`${response.status} ${response.statusText}`);

    const result = await response.json();

    if (result.errors) console.error(result.errors);

    return result;
  } catch (error) {
    console.error("GraphQL request failed:", error);

    return { data: null, errors: [error] };
  }
};

export const fetchRefreshedToken = async (prevToken: string): Promise<string | null> => {
  const { data, errors } = await makeInternalGraphQLRequest(REFRESH_CUSTOMER_TOKEN, {}, prevToken);

  return errors ? null : data?.refreshCustomerToken?.token;
};

export const fetchToken = async (variables: object): Promise<string | null> => {
  const token = jwt.sign(variables, secret, { expiresIn: "5m" });
  const { data, errors } = await makeInternalGraphQLRequest(SSOLogin, variables, token);

  return errors ? null : data?.ssosignin?.token;
};
