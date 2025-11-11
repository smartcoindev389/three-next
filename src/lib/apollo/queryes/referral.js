import { gql } from "@apollo/client";

export const REFERRAL_FACTORY_CONFIG = gql`
  query ReferralFactoryCustomerConfig {
    referralFactoryCustomerConfig {
      is_active
      code
    }
  }
`;

export const GET_REFERRAL = gql`
  query GetReferral($type: Int) {
    referralFactoryStatistics(type: $type) {
      paid
      clicks
      complete
      conversion_rate
    }
  }
`;

export const UPDATE_REFERRAL_CODE = gql`
  mutation UpdateReferralCode($code: String!, $type: String) {
    referralFactoryUpdateCode(referral_code: $code, referral_type: $type) {
      code
      is_active
      product_sku
    }
  }
`;

export const REFERRAL_REWARD_SUM = gql`
  query ReferralFactoryRewardSum($type: Int) {
    referralFactoryRewardSum(type: $type) {
      value
    }
  }
`;

export const REFERRAL_STATISTIC = gql`
  query ReferralFactoryStatistics($type: Int) {
    referralFactoryStatistics(type: $type) {
      clicks
      complete
      conversion_rate
      paid
      earned
    }
  }
`;

export const GET_REFERRAL_DEVICE_STATISTICS = gql`
  query GetReferralDeviceStatistics {
    referralFactoryStatisticsDevices {
      items {
        title
        percent
      }
    }
  }
`;

export const GET_REFERRAL_LINKS_STATISTICS = gql`
  query GetReferralLinksStatistics {
    referralFactoryStatisticsLinks {
      items {
        title
        percent
      }
    }
  }
`;

export const GET_REFERRAL_LIST = gql`
  query GetReferralList($page: Int!, $page_size: Int) {
    referralFactoryReferralsStatistics(page: $page, page_size: $page_size) {
      last_page
      page
      count
      items {
        customer_name
        created_at
        updated_at
        referral_host
        is_complete
        purchase_amount
        ip_address
      }
    }
  }
`;
