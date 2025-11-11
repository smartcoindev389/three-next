import { gql } from "@apollo/client";

export const GEO_IP_REQUEST = gql`
  query GetIpInfo {
    getIpInfo {
      ip
      country
      store_code
    }
  }
`;
