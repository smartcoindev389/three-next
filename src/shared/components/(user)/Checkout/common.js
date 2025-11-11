// checkout utils

export const getTabClasses = (isEditable) => {
  let classes =
    "relative w-full h-fit rounded-[8px] border border-[#CACBCF] shadow py-4 px-5 mt-3.5 flex justify-between ";

  return (classes += isEditable ? "flex-col" : "flex-row");
};

export const renderAddress = (address) => {
  if (Object.keys(address).length === 0) return;

  return (
    <>
      <div className="text-[#545454] text-[20px] font-medium">
        {address?.firstname} {address?.lastname}
      </div>
      <div className="text-[#545454] text-[16px] font-normal">
        {address?.street?.join(", ")}, {address?.city}, {address?.postcode}
      </div>
      <div className="text-[#545454] text-[16px] font-medium">
        {address?.telephone}
      </div>
    </>
  );
};

export const addressToFormAddress = (address) => {
  return {
    ...address,
    country: address?.country?.code || "",
    country_code: address?.country?.code || "",
    region: address?.region?.region_id > 0 ? "" : address?.region?.label || "",
    region_id: address?.region?.region_id || 0,
    street0: address?.street?.[0] || "",
    street1: address?.street?.[1] || "",
  };
};

export const customerAddressToFormAddress = (address) => {
  return {
    ...address,
    country: address?.country_code || "",
    country_code: address?.country_code || "",
    region: address?.region?.region_id > 0 ? "" : address?.region?.region || "",
    region_id: address?.region?.region_id || 0,
    street0: address?.street?.[0] || "",
    street1: address?.street?.[1] || "",
  };
};

// checkout cart validation

export const isShippingAddressSet = (cart) => {
  return (
    cart?.shipping_addresses?.length > 0 &&
    cart?.shipping_addresses?.[0]?.postcode
  );
};

export const isBillingAddressSet = (cart) => {
  return cart?.billing_address && cart?.billing_address?.postcode;
};

export const isShippingMethodSet = (cart) => {
  return (
    cart?.shipping_addresses?.length > 0 &&
    cart?.shipping_addresses?.[0]?.selected_shipping_method?.method_code
  );
};
