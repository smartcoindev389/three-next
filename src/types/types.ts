export interface Product {
  id: string;
  product: {
    name: string;
    image?: {
      url: string;
    };
    price: {
      regularPrice: {
        amount: {
          value: number;
        };
      };
    };
  };
  quantity: number;
}

export interface Region {
  region_id?: number;
  region: string;
  code: string;
}

export interface Country {
  id: number;
  full_name_english: string;
  available_regions: Region[];
  code: string;
}

export interface Address {
  id: number;
  customer_id: number;
  firstname: string;
  lastname: string;
  middlename?: string;
  prefix?: string;
  suffix?: string;
  company?: string;
  street: string[];
  city: string;
  postcode: string;
  country_code: string;
  country_id: number;
  telephone: string;
  fax?: string;
  default_billing: boolean;
  default_shipping: boolean;
  vat_id?: string;
  region: Region;
  region_id?: number;
  address_type?: string;
  country: Country;
}

interface Location {
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface Checkpoint {
  time: string;
  status: string;
  location: string;
  city: string;
  state: string;
  message: string;
  slug: string;
  subtag: string;
}

export interface ShipmentLog {
  orderId: string;
  transitTime: number | null;
  pickedUpDate: string | null;
  deliveredDate: string | null;
  status: string;
  origin: Location;
  destination: Location;
  checkpoints: Checkpoint[];
}

type OrderStatus = { id: number };

interface PaymentMethods {
  name: string;
}

export interface Order {
  number: number;
  order_number: string;
  order_date: string;
  billing_name?: string;
  billing_address: Address | string;
  grand_total: number;
  total: {
    grand_total: {
      value: number;
      currency: string;
    };
  };
  order_currency_code: string;
  payment_methods: PaymentMethods[];
  status: string;
  shipbob_shipment: {
    status?: OrderStatus;
  }[];
  stripe_payment: {
    icon: string;
    label: string;
  };
  aftership_shipment_time_line: ShipmentLog;
  increment_id: string;
  shipments: {
    number: number;
  }[];
}

interface SelectedOption {
  label: string;
  value: string;
}

export interface CustomAttribute {
  code: string;
  value?: string;
  label?: string;
  selected_options?: SelectedOption[];
}

export interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  middlename: string;
  email: string;
  gender: string;
  group_id: number;
  is_subscribed: boolean;
  created_at: string;
  date_of_birth: string | null;
  dob: string | null;
  custom_attributes: CustomAttribute[];
}
