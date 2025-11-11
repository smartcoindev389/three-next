import { useState, useEffect, FC } from "react";
import { useMutation } from "@apollo/client";

import ShippingAddress from "./ShippingAddress";
import BillingAddress from "./BillingAddress";
import Shipping from "./Shipping";
import Payment from "./Payment";

import { useToast } from "@/shared/components/(common)/ui/use-toast";
import { ADD_CUSTOMER_ADDRESS, UPDATE_CUSTOMER_ADDRESS } from "@/lib/apollo/queryes/customer";
import { isShippingAddressSet, isBillingAddressSet, isShippingMethodSet } from "@/shared/components/(user)/Checkout/common";
import { LIST_PAYMENT_METHODS } from "@/lib/apollo/queryes/payment/stripe";
import { useCart } from "@/providers/CartProvider/useCart";
import ContactInfo from "@/shared/components/(user)/Checkout/Steps/ContactInfo";
import { Customer, Address } from "@/types/types";
import { Cart, ShippingMethod } from "@/providers/CartProvider/types";

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
  street?: string[];
  [key: string]: any;
}

interface CheckoutStepsProps {
  customer?: Customer & { addresses: Address[] };
  guestName?: string;
  selectedMethod: string;
  setSelectedMethod: (method: string) => void;
  defaultCard: string;
  paymentId: string;
  setPaymentId: (id: string) => void;
  refetchCustomer: () => Promise<unknown>;
  setOrderProcessing: (processing: boolean) => void;
  orderProcessing: boolean;
  onEditGuest: () => void;
}
interface EditableState {
  shippingAddress: boolean;
  billingAddress: boolean;
  shippingMethod: boolean;
  paymentMethod: boolean;
}

const CheckoutSteps: FC<CheckoutStepsProps> = ({
  customer,
  guestName,
  selectedMethod,
  setSelectedMethod,
  defaultCard,
  paymentId,
  setPaymentId,
  refetchCustomer,
  setOrderProcessing,
  orderProcessing,
  onEditGuest,
}) => {
  const { cart, fetchCart } = useCart();
  const { toast } = useToast();
  const [isEditable, setIsEditable] = useState<EditableState>({
    shippingAddress: false,
    billingAddress: false,
    shippingMethod: false,
    paymentMethod: false,
  });
  const [availableShippingMethods, setAvailableShippingMethods] = useState<ShippingMethod[]>([]);
  const [addCustomerAddress] = useMutation(ADD_CUSTOMER_ADDRESS);
  const [editCustomerAddress] = useMutation(UPDATE_CUSTOMER_ADDRESS);
  const [listStripePaymentMethods, { data: paymentsData }] = useMutation(LIST_PAYMENT_METHODS);

  const changeEditable = (values: Partial<EditableState> = {}) => setIsEditable({ ...isEditable, ...values });

  const createCustomerAddress = async (
    address: FormAddress,
    default_shipping: boolean,
    default_billing: boolean,
    callback?: (address: Address) => Promise<void>,
  ): Promise<void> => {
    try {
      const res = await addCustomerAddress({
        variables: {
          region: {
            region: address?.region,
            region_id: address?.region_id,
          },
          country_code: address?.country,
          street: address?.street,
          telephone: address?.telephone,
          postcode: address?.postcode,
          city: address?.city,
          firstname: address?.firstname,
          lastname: address?.lastname,
          default_shipping: default_shipping,
          default_billing: default_billing,
        },
      });

      if (callback) await callback(res?.data?.createCustomerAddress || {});

      await refetchCustomer();
    } catch (error: any) {
      toast({ type: "error", description: error.message });
    }
  };

  const updateCustomerAddress = async (
    addressId: string,
    address: FormAddress,
    default_shipping: boolean,
    default_billing: boolean,
    callback?: (address: Address) => Promise<void>,
  ): Promise<void> => {
    try {
      const res = await editCustomerAddress({
        variables: {
          id: addressId,
          country_code: address.country,
          street: address.street,
          telephone: address.telephone,
          postcode: address.postcode,
          city: address.city,
          region: {
            region: address.region,
            region_id: address.region_id,
          },
          firstname: address.firstname,
          lastname: address.lastname,
          default_shipping: address.default_shipping || default_shipping,
          default_billing: address.default_billing || default_billing,
        },
      });

      if (callback) await callback(res?.data?.updateCustomerAddress || {});

      await refetchCustomer();
    } catch (error: any) {
      toast({ type: "error", description: error.message });
    }
  };

  const onShippingAddressSubmit = async (data: { cart?: Cart }): Promise<void> => {
    console.warn(data?.cart?.shipping_addresses);
    setAvailableShippingMethods(data?.cart?.shipping_addresses[0]?.available_shipping_methods || []);

    await fetchCart();

    let newEditable: Partial<EditableState> = { shippingAddress: false };

    if (!isBillingAddressSet(cart)) newEditable = { ...newEditable, billingAddress: true };

    changeEditable(newEditable);
  };

  const onBillingAddressSubmit = async (): Promise<void> => {
    await fetchCart();

    let newEditable: Partial<EditableState> = { billingAddress: false };

    if (!isShippingMethodSet(cart)) newEditable = { ...newEditable, shippingMethod: true };

    changeEditable(newEditable);
  };

  const onSetShippingMethod = async (): Promise<void> => {
    await fetchCart();

    changeEditable({ shippingMethod: false, paymentMethod: true });
  };

  useEffect(() => {
    setAvailableShippingMethods(cart?.shipping_addresses?.[0]?.available_shipping_methods || []);
  }, [cart?.shipping_addresses]);

  useEffect(() => {
    if (!isShippingAddressSet(cart)) {
      changeEditable({ shippingAddress: true });
    } else if (!isBillingAddressSet(cart)) {
      changeEditable({ billingAddress: true });
    } else if (!isShippingMethodSet(cart)) {
      changeEditable({ shippingMethod: true });
    } else {
      changeEditable({ paymentMethod: true });
    }

    if (customer) void listStripePaymentMethods();
  }, [customer]);

  return (
    <>
      <ContactInfo
        customer={customer}
        email={cart?.email || ""}
        guestName={guestName || ""}
        onEditGuest={onEditGuest}
      />

      <ShippingAddress
        addresses={customer?.addresses || []}
        changeEditable={() => changeEditable({ shippingAddress: true })}
        createCustomerAddress={(address, callback) => createCustomerAddress(address, true, false, callback)}
        isCustomer={!!customer}
        isEditable={isEditable.shippingAddress}
        updateCustomerAddress={(addressId, address, callback) =>
          updateCustomerAddress(addressId, address, true, false, callback)
        }
        onShippingAddressSubmit={onShippingAddressSubmit}
      />

      <BillingAddress
        addresses={customer?.addresses || []}
        changeEditable={() => changeEditable({ billingAddress: true })}
        createCustomerAddress={(address, callback) => createCustomerAddress(address, false, true, callback)}
        isCustomer={!!customer}
        isEditable={isEditable.billingAddress}
        updateCustomerAddress={(addressId, address, callback, default_shipping = false) =>
          updateCustomerAddress(addressId, address, default_shipping, true, callback)
        }
        onBillingAddressSubmit={onBillingAddressSubmit}
      />

      <Shipping
        availableShippingMethods={availableShippingMethods}
        isEditable={isEditable.shippingMethod}
        toggleEditable={() => changeEditable({ shippingMethod: true })}
        onSetShippingMethod={onSetShippingMethod}
      />

      <Payment
        defaultCard={defaultCard}
        isEditable={isEditable.paymentMethod}
        orderProcessing={orderProcessing}
        paymentId={paymentId}
        savedMethods={paymentsData?.listStripePaymentMethods || []}
        selectedMethod={selectedMethod}
        setOrderProcessing={setOrderProcessing}
        setPaymentId={setPaymentId}
        setSelectedMethod={setSelectedMethod}
        toggleEditable={() => changeEditable({ paymentMethod: true })}
      />
    </>
  );
};

export default CheckoutSteps;
