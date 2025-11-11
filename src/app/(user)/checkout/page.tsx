"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import * as fbq from "@/utils/facebook-pixel";
import { fetchCountries } from "@/lib/redux/slices/checkout";
import { GET_CUSTOMER_DATA } from "@/lib/apollo/queryes/customer";
import CheckoutSummary from "@/shared/components/(user)/Checkout/Summary/CheckoutSummary";
import AuthForm from "@/shared/components/(user)/Forms/AuthForm";
import Loader from "@/shared/components/(common)/Loader/Loader";
import { isShippingAddressSet, isBillingAddressSet, isShippingMethodSet } from "@/shared/components/(user)/Checkout/common";
import Title from "@/shared/components/(common)/Title/Title";
import CheckoutSteps from "@/shared/components/(user)/Checkout/Steps/CheckoutSteps";
import Benefits from "@/shared/components/(user)/Checkout/Summary/Benefits";
import Coupon from "@/shared/components/(user)/Checkout/Summary/Coupon";
import { useCart } from "@/providers/CartProvider/useCart";
import { Address, Customer } from "@/types/types";
import { Cart, ShippingAddress } from "@/providers/CartProvider/types";
import { getCustomerCustomAttribute } from "@/utils/utils-old";

const getCheckoutData = (cart: Cart) => {
  const cartTotal = cart.prices?.grand_total?.value || 0;
  const currency = cart.prices?.grand_total?.currency || "USD";
  const contentIds = cart.items?.map((item) => item.product.sku) || [];
  const numItems = cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const contents =
    cart.items?.map((item) => ({
      id: item.product.sku,
      quantity: item.quantity,
      price: item.product.price.regularPrice.amount.value,
    })) || [];

  return {
    content_ids: contentIds,
    contents: contents,
    currency: currency,
    value: cartTotal,
    num_items: numItems,
  };
};

interface CustomerResponse {
  customer: Customer & { addresses: Address[] };
}

const CheckoutPage = () => {
  const [selectedMethod, setSelectedMethod] = useState("add-new-card");
  const { cart, fetchCart, initialLoading: initialCartLoading } = useCart();
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();

  const token = typeof window === "undefined" ? null : localStorage.getItem("token");
  const { data: customerData, refetch: refetchCustomer } = useQuery<CustomerResponse>(GET_CUSTOMER_DATA, {
    skip: !token,
  });

  const [guestName, setGuestName] = useState(typeof window !== "undefined" ? localStorage.getItem("guestName") : "");
  const [isAuthed, setIsAuthed] = useState(!!token || (!!guestName && !!localStorage.getItem("guestEmail")));

  const [loading, setLoading] = useState(false);
  const [defaultCard, setDefaultCard] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [orderProcessing, setOrderProcessing] = useState(false);

  const getCustomerAddressId = (address?: ShippingAddress) => {
    const customerAddresses = customerData?.customer.addresses || [];

    if (customerAddresses.length < 1 || !address) return;

    return (
      customerAddresses.find(
        ({ city, country_code, firstname, lastname, postcode, region, street, telephone }: Address) => {
          return (
            city === address.city &&
            country_code === address.country.code &&
            firstname === address.firstname &&
            lastname === address.lastname &&
            postcode === address.postcode &&
            region.region === address.region.code &&
            region.region_id === address.region.region_id &&
            street[0] === address.street[0] &&
            street[1] === address.street[1] &&
            telephone === address.telephone
          );
        },
      )?.id || null
    );
  };

  const onGuestAuth = async (email?: string, name?: string) => {
    localStorage.setItem("guestEmail", email || "");
    localStorage.setItem("guestName", name || "");
    setGuestName(name || "");
    await fetchCart();
    setIsAuthed(true);
  };

  const validateOrder = () => {
    if (!isShippingAddressSet(cart)) return t("Please add shipping address");

    if (!isBillingAddressSet(cart)) return t("Please add billing address");

    if (!isShippingMethodSet(cart)) return t("Please select the shipping method");

    if (!selectedMethod) return t("Select the payment method and fill the information");

    return null;
  };

  const placeOrder = () => {
    const error = validateOrder();

    if (error) return toast.error(error);

    const paymentValue = getCustomerCustomAttribute(customerData?.customer, "default_payment") || "";
    const checkoutShippingAddress = getCustomerAddressId(cart?.shipping_addresses?.[0]);
    const checkoutBillingAddress = getCustomerAddressId(cart?.billing_address);

    if (checkoutShippingAddress) localStorage.setItem("CheckoutActiveShippingAddress", String(checkoutShippingAddress));
    if (checkoutBillingAddress) localStorage.setItem("CheckoutActiveBillingAddress", String(checkoutBillingAddress));

    setDefaultCard(paymentValue);
    setPaymentId(paymentValue);
    setOrderProcessing(true);
  };

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchCountries());
  }, []);

  useEffect(() => {
    if (cart?.items?.length) fbq.initiateCheckout(getCheckoutData(cart));
  }, [cart?.items]);

  useEffect(() => {
    if (!initialCartLoading && !cart?.items.length) router.push("/shopping-cart");
  }, [initialCartLoading, !cart?.items.length]);

  if (initialCartLoading || !cart?.items.length) return <Loader className="h-[100vh]" />;

  return (
    <div className="container m-auto">
      {orderProcessing && (
        <div className="bg-opacity-50 bg-white fixed flex h-screen items-center justify-center left-0 top-0 w-full z-[9999999990]">
          <Loader className="!bg-transparent" />
        </div>
      )}
      <div className="mt-24 !px-0 maximum-column max-w-[1000px] mx-auto">
        <div className="justify-center items-center md:pb-3">
          <Title className="text-darkslategray-300 md:text-center">
            {isAuthed && !token ? t("Guest Checkout") : t("Checkout")}
          </Title>
        </div>
        <div className="flex flex-col xl:flex-row md:sm:flex-row justify-between gap-3.5 md:gap-6">
          <section className="w-full xl:w-[600px] rounded checkout-right-side mt-5">
            {isAuthed ? (
              <CheckoutSteps
                customer={customerData?.customer}
                defaultCard={defaultCard}
                guestName={guestName || ""}
                orderProcessing={orderProcessing}
                paymentId={paymentId}
                refetchCustomer={refetchCustomer}
                selectedMethod={selectedMethod}
                setOrderProcessing={setOrderProcessing}
                setPaymentId={setPaymentId}
                setSelectedMethod={setSelectedMethod}
                onEditGuest={() => setIsAuthed(false)}
              />
            ) : (
              <AuthForm cartId={cart.id} loading={loading} setLoading={setLoading} onGuestAuth={onGuestAuth} />
            )}
          </section>
          <div className="w-full xl:w-[378px]">
            <CheckoutSummary loading={orderProcessing} placeOrder={placeOrder} />
            {isAuthed && <Coupon />}
            <Benefits />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
