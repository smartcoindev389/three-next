import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";

import { BRAND_NAME } from "@/constants/main";
import { Address, Customer } from "@/types/types";

interface ParsedProductName {
  brand: string;
  productName: string;
  category?: string;
}
export const parseProductName = (
  productName: string,
  brand = BRAND_NAME,
): ParsedProductName => {
  const normalizedProductName = productName.startsWith(brand)
    ? productName.slice(brand.length)
    : productName;
  const [name, category] = normalizedProductName.split("-");

  return {
    brand,
    productName: name.trim(),
    category: category?.trim(),
  };
};

export const getFormValues = (
  form: HTMLFormElement,
): Record<string, FormDataEntryValue> => {
  const entries = new FormData(form).entries();

  return Object.fromEntries(entries);
};

export const getFormattedDate = (
  value: string,
  dateFormat = "MM/dd/yyyy HH:mm",
  locale = enUS,
) => {
  if (!value) return "";

  return format(parseISO(value), dateFormat, { locale });
};

type AddressType = Omit<
  Address,
  "region" | "country" | "firstname" | "lastname" | "customer_id"
> & {
  country: string;
  region: string;
};

export const getAddressData = (values: Address): AddressType => {
  return {
    country_id: 0,
    city: values?.city,
    country: values?.country_code,
    country_code: values?.country_code,
    postcode: values?.postcode,
    region: values?.region?.region,
    region_id: values?.region_id,
    street: values?.street,
    id: values?.id,
    default_shipping: values?.default_shipping,
    default_billing: values?.default_billing,
    telephone: values?.telephone,
  };
};

export const addAddress = (
  addressValues: AddressType,
  values: Customer,
): Partial<Address> => {
  return {
    region: {
      region: addressValues?.region,
      region_id: addressValues?.region_id,
    },
    country_code: addressValues?.country,
    street: addressValues?.street,
    city: addressValues?.city,
    address_type: addressValues?.address_type,
    postcode: addressValues?.postcode,
    firstname: values?.firstname,
    lastname: values?.lastname,
    default_billing: true,
    telephone: addressValues?.telephone,
  };
};
