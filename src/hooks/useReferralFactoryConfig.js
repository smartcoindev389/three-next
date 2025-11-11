import { useQuery } from "@apollo/client";

import { REFERRAL_FACTORY_CONFIG } from "@/lib/apollo/queryes/referral";

/**
 * Fetches and returns referral factory configuration status and data.
 * @example
 * useReferralFactoryConfig()
 * {
 *   ready: true,
 *   data: [...],
 *   error: null
 * }
 * @returns {Object} An object containing the status of the query (ready), the configuration data (data), and any error encountered (error).
 * @description
 *   - Automatically fetches data when the component mounts through useEffect.
 *   - Uses useLazyQuery to defer the execution of the GraphQL query until explicitly called.
 *   - Returns an empty array for data if fetching fails or no data is available.
 */
const useReferralFactoryConfig = () => {
  const { data, loading, error, refetch } = useQuery(REFERRAL_FACTORY_CONFIG);

  return {
    ready: !loading,
    data: data ? data["referralFactoryCustomerConfig"] : [],
    error,
    refetch,
  };
};

export default useReferralFactoryConfig;
