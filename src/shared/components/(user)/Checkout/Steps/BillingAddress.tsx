import { useState, useEffect, FC } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";

import { useToast } from "@/shared/components/(common)/ui/use-toast";
import { SET_BILLING_ADDRESSES } from "@/lib/apollo/queryes/checkout";
import { Checkbox } from "@/shared/components/(common)/ui/checkbox";
import AddressForm from "@/shared/components/(user)/Forms/AddressForm/AddressForm";
import { addressToFormAddress, customerAddressToFormAddress, renderAddress } from "@/shared/components/(user)/Checkout/common";
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
  [key: string]: any;
}

interface BillingAddressProps {
  isCustomer: boolean;
  addresses?: Address[];
  isEditable: boolean;
  changeEditable: () => void;
  onBillingAddressSubmit: (data: { cart?: Cart }) => Promise<void>;
  createCustomerAddress: (address: FormAddress, callback: (address: Address) => Promise<void>) => Promise<void>;
  updateCustomerAddress: (
    addressId: string,
    address: FormAddress,
    callback: (address: Address) => Promise<void>,
    isSameAsShipping?: boolean,
  ) => Promise<void>;
}

const BillingAddress: FC<BillingAddressProps> = ({
  isCustomer,
  addresses,
  isEditable,
  changeEditable,
  onBillingAddressSubmit,
  createCustomerAddress,
  updateCustomerAddress,
}) => {
  const { cart } = useCart();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isSameAsShipping, setIsSameAsShipping] = useState(true);
  const [setBillingAddressOnCart] = useMutation(SET_BILLING_ADDRESSES);
  const cartShippingAddress = cart?.shipping_addresses ? cart.shipping_addresses[0] : {};
  const currentAddress = cart?.billing_address ? cart?.billing_address : cartShippingAddress;

  const setAddressId = (id: string) => localStorage.setItem("CheckoutActiveBillingAddress", id);
  const onAddressSubmit = async (address: FormAddress, isFormDirty: boolean) => {
    setLoading(true);

    if (isCustomer && isFormDirty) {
      const addressId = localStorage.getItem("CheckoutActiveBillingAddress");

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
    localStorage.setItem("guestUserPostCode", address.postcode);

    try {
      const res = await setBillingAddressOnCart({
        variables: { cart_id: cart?.id, save_in_address_book: false, ...address },
      });

      await onBillingAddressSubmit(res?.data?.setBillingAddressOnCart || {});
    } catch (error: any) {
      toast({ type: "error", description: error?.message });
    }
  };

  const setCustomerAddressToCart = async (address: Address) => {
    setAddressId(address?.id.toString());

    await setAddressOnCart(customerAddressToFormAddress(address));
  };

  const setAddressAsShipping = async (): Promise<void> => {
    setLoading(true);

    try {
      const shippingAddress = addressToFormAddress(cartShippingAddress);

      if (isCustomer) {
        const shippingAddressId = localStorage.getItem("CheckoutActiveShippingAddress");

        if (shippingAddressId) {
          await updateCustomerAddress(shippingAddressId, shippingAddress, setCustomerAddressToCart, true);
        }
      } else {
        await setAddressOnCart(shippingAddress);
      }
    } catch (error: unknown) {
      toast({ type: "error", description: error });
    }

    setLoading(false);
  };

  useEffect(() => {
    setIsSameAsShipping(cart?.billing_address?.uid === cart?.shipping_addresses?.[0]?.uid);
  }, []);

  return (
    <div className="relative w-full h-fit rounded-[8px] border border-[#CACBCF] shadow py-4 px-5 mt-3.5">
      <Title>{t("Your Billing Address")}</Title>
      {isEditable ? (
        <>
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              checked={isSameAsShipping}
              id="shippingaddress"
              onCheckedChange={(value) => setIsSameAsShipping(value === true)}
            />
            <label className="text-base text-[#949390]" htmlFor="shippingaddress">
              {t("My billing address information is the same as my shipping information.")}
            </label>
          </div>
          {isSameAsShipping ? (
            <button
              className="bg-blue rounded-3xl text-white text-xl w-full max-w-[300px] py-2 round mt-6"
              onClick={setAddressAsShipping}
            >
              {loading ? t("Processing...") : t("Continue")}
            </button>
          ) : (
            <AddressForm
              addresses={addresses}
              handleChooseAddressForm={(address: { id: string }) => setAddressId(address?.id)}
              initAddress={currentAddress}
              loading={loading}
              onAddressSubmit={onAddressSubmit}
            />
          )}
        </>
      ) : (
        <>
          {cart?.billing_address && renderAddress(currentAddress)}
          <EditButton isEdit={!!cart?.billing_address?.city} onClick={changeEditable} />
        </>
      )}
    </div>
  );
};

export default BillingAddress;
