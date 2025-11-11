import { gql } from "@apollo/client";

export const AVAILABLE_STORES_REQUEST = gql`
  query AvailableStores {
    availableStores(useCurrentGroup: true) {
      store_name
      store_code
    }
  }
`;
