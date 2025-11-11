import { ApolloQueryResult } from "@apollo/client";

interface Amount {
  currency: string;
  value: number;
}

interface Discount {
  amount: {
    value: number;
  };
  applied_to: string[];
  label: string;
}

interface Tax {
  label: string;
  amount: Amount;
}

interface Country {
  code: string;
  label: string;
}

interface Region {
  code: string;
  label: string;
  region_id: number;
}

interface PageInfo {
  page_size: number;
  current_page: number;
  total_pages: number;
}

interface PaymentMethod {
  code: string;
  title: string;
}

interface Coupon {
  code: string;
}

interface BaseCartItem {
  id: string;
  quantity: number;
}

interface ProductSummary {
  stock_status: string;
  name: string;
  sku: string;
}

interface ProductFull extends ProductSummary {
  id: string;
  image: Image;
  price: {
    regularPrice: {
      amount: Amount;
    };
  };
}

interface CartItem extends BaseCartItem {
  product: ProductFull;
  mp_pre_order_message: string | null;
}

interface CartItemV2 extends BaseCartItem {
  uid: string;
  product: ProductSummary;
  prices: {
    price: {
      value: number;
    };
    total_item_discount: {
      value: number;
    };
    discounts: Discount[];
  };
}

interface CartPrices {
  grand_total: Amount;
  referral_discount?: {
    value: number;
  };
  payment_fee?: {
    amount: {
      value: number;
    };
  }[];
  applied_taxes?: Tax[];
  discounts?: Discount[];
}

interface Address {
  uid: string;
  firstname: string;
  lastname: string;
  street: string[];
  postcode: string;
  city: string;
  country: Country;
  region: Region;
  telephone: string;
}

export interface ShippingMethod {
  amount: Amount;
  available: boolean;
  carrier_code: string;
  carrier_title: string;
  error_message: string | null;
  method_code: string;
  method_title: string;
  price_excl_tax: Amount;
  price_incl_tax: Amount;
}

export interface ShippingAddress extends Address {
  available_shipping_methods: ShippingMethod[];
  selected_shipping_method: ShippingMethod | null;
}

interface Image {
  disabled: boolean;
  label: string;
  position: number;
  url: string;
}

interface CartItemsV2 {
  total_count: number;
  items: CartItemV2[];
  page_info: PageInfo;
}

export interface Cart {
  id: string;
  total_quantity: number;
  mp_pre_order_notice: string | null;
  items: CartItem[];
  prices: CartPrices;
  email: string;
  billing_address: ShippingAddress;
  shipping_addresses: ShippingAddress[];
  itemsV2: CartItemsV2;
  available_payment_methods: PaymentMethod[];
  selected_payment_method: PaymentMethod | null;
  applied_coupons: Coupon[];
}

export interface CartResult {
  cart: Cart;
}

export interface CartContextType {
  cart?: Cart;
  loading: boolean;
  initialLoading: boolean;
  initCart: () => Promise<void>;
  fetchCart: (cartId?: string) => Promise<ApolloQueryResult<CartResult>>;
}
