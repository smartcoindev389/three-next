import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import { FC, useState } from "react";

import { useToast } from "@/shared/components/(common)/ui/use-toast";
import { SET_SHIPPING_ADDRESSES } from "@/lib/apollo/queryes/checkout";
import AddressForm from "@/shared/components/(user)/Forms/AddressForm/AddressForm";
import { renderAddress, customerAddressToFormAddress } from "@/shared/components/(user)/Checkout/common";
import EditButton from "@/shared/components/(user)/Checkout/EditButton";
import Title from "@/shared/components/(common)/Title/Title";
import { useCart } from "@/providers/CartProvider/useCart";
import { Address } from "@/types/types";
import { Cart } from "@/providers/CartProvider/types";

interface FormAddress {
  firstname: string;
  lastname: string;
  street0: string;
  street1?: string;
  country: string;
  country_code: string;
  region: string;
  region_id: number;
  city: string;
  postcode: string;
  telephone: string;
}

interface ShippingAddressProps {
  isCustomer: boolean;
  addresses?: Address[];
  isEditable: boolean;
  changeEditable: () => void;
  onShippingAddressSubmit: (data: { cart?: Cart }) => Promise<void>;
  createCustomerAddress: (address: FormAddress, callback: (address: Address) => Promise<void>) => Promise<void>;
  updateCustomerAddress: (
    addressId: string,
    address: FormAddress,
    callback: (address: Address) => Promise<void>,
  ) => Promise<void>;
}

const ShippingAddress: FC<ShippingAddressProps> = ({
  isCustomer,
  addresses,
  isEditable,
  changeEditable,
  onShippingAddressSubmit,
  createCustomerAddress,
  updateCustomerAddress,
}) => {
  const { cart } = useCart();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [setShippingAddressesOnCart] = useMutation(SET_SHIPPING_ADDRESSES);

  const setAddressId = (id: string) => localStorage.setItem("CheckoutActiveShippingAddress", id);
  const onAddressSubmit = async (address: FormAddress, isFormDirty: boolean) => {
    setLoading(true);

    if (isCustomer && isFormDirty) {
      const addressId = localStorage.getItem("CheckoutActiveShippingAddress");

      if (addressId) {
        await updateCustomerAddress(addressId, address, setCustomerAddressToCart);
      } else {
        await createCustomerAddress(address, setCustomerAddressToCart);
      }
    } else {
      await setAddressOnCart(address);
    }

    setLoading(false);
  };

  const setAddressOnCart = async (address: FormAddress) => {
    try {
      const res = await setShippingAddressesOnCart({
        variables: { cart_id: cart?.id, save_in_address_book: false, ...address },
      });

      await onShippingAddressSubmit(res?.data?.setShippingAddressesOnCart || {});
    } catch (error: any) {
      toast({ type: "error", description: error?.message });
    }
  };

  const setCustomerAddressToCart = async (address: Address) => {
    if (address?.id) setAddressId(address.id.toString());

    await setAddressOnCart(customerAddressToFormAddress(address));
  };

  return (
    <div className="relative w-full h-fit rounded-[8px] border border-[#CACBCF] shadow py-4 px-5 mt-3.5">
      <Title>{t("Your Shipping Address")}</Title>
      {isEditable ? (
        <AddressForm
          addresses={addresses}
          handleChooseAddressForm={(address: { id: string }) => setAddressId(address?.id)}
          initAddress={cart?.shipping_addresses?.[0] || {}}
          loading={loading}
          onAddressSubmit={onAddressSubmit}
        />
      ) : (
        <>
          <div>{renderAddress(cart?.shipping_addresses?.[0] || {})}</div>
          <EditButton isEdit={!!cart?.shipping_addresses?.length} onClick={changeEditable} />
        </>
      )}
    </div>
  );
};

export default ShippingAddress;
