import { FC, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { StripeElements, PaymentMethod } from "@stripe/stripe-js";
import { useStripe } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

import { CHECKOUT_SET_PAYMENT_METHOD_IN_CART, SET_PAYMENT_METHOD_AND_PLACE_ORDER } from "@/lib/apollo/queryes/checkout";
import { getCartGAData, sendGAEvent } from "@/utils/google-analytics";
import { GET_STRIPE_CONFIGURATION } from "@/lib/apollo/queryes/payment/stripe";
import * as fbq from "@/utils/facebook-pixel";
import { useCart } from "@/providers/CartProvider/useCart";
import { CART_ID_LS_KEY } from "@/providers/CartProvider/constants";
import { Cart } from "@/providers/CartProvider/types";

const formOptions = {
  layout: "tabs",
  fields: {
    billingDetails: {
      name: "never",
      email: "never",
      phone: "never",
      address: "never",
    },
  },
  wallets: {
    applePay: "auto",
    googlePay: "auto",
  },
};

interface CheckoutFormProps {
  selectedMethod: string;
  paymentId: string;
  setOrderProcessing: (value: boolean) => void;
  orderProcessing: boolean;
}

const localStorageKeys = [
  CART_ID_LS_KEY,
  "checkoutBillingAddress",
  "guestName",
  "checkoutShipAddress",
  "CheckoutActiveShippingAddress",
  "CheckoutActiveBillingAddress",
];

const sendAnalyticsData = (cart?: Cart) => {
  if (!cart) return;

  const cartTotal = cart?.prices?.grand_total?.value || 0;
  const currency = cart?.prices?.grand_total?.currency || "USD";
  const contentIds = cart?.items?.map((item) => item.product.sku) || [];
  const contents =
    cart?.items?.map((item) => ({
      id: item.product.sku,
      quantity: item.quantity,
      price: item?.product.price.regularPrice.amount.value || 0,
    })) || [];
  const numItems = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  sendGAEvent("purchase", getCartGAData(cart));
  fbq.purchase({
    value: cartTotal,
    currency: currency,
    content_ids: contentIds,
    contents: contents,
    num_items: numItems,
    content_type: "product",
  });
};

const CheckoutForm: FC<CheckoutFormProps> = ({ selectedMethod, paymentId, setOrderProcessing, orderProcessing }) => {
  const { cart, fetchCart } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [setPaymentMethodCart] = useMutation(CHECKOUT_SET_PAYMENT_METHOD_IN_CART);
  const [setPaymentAndPlaceOrder] = useMutation(SET_PAYMENT_METHOD_AND_PLACE_ORDER);
  const [elements, setElements] = useState<StripeElements | null>(null);
  const { data } = useQuery(GET_STRIPE_CONFIGURATION);
  const moduleConfiguration = data?.getStripeConfiguration;
  const stripe = useStripe();

  const calculateStripeAmount = () => cart && Math.round(cart?.prices.grand_total.value * 100);

  const createPaymentMethod = async () => {
    if (!cart) return console.error("Cart was not initialized");
    if (!stripe) return console.error("Stripe was not initialized");

    try {
      if (selectedMethod === "add-new-card" && elements) {
        await elements.submit();

        const result = await stripe.createPaymentMethod({
          elements: elements,
          params: {
            billing_details: {
              name: cart.billing_address?.firstname + " " + cart.billing_address?.lastname,
              email: cart.email,
              phone: cart.billing_address?.telephone,
              address: {
                line1: cart.billing_address?.street?.[0],
                line2: cart.billing_address?.street?.[1] ?? "",
                city: cart.billing_address?.city,
                state: cart.billing_address?.region?.code,
                country: cart.billing_address?.country?.code,
                postal_code: cart.billing_address?.postcode,
              },
            },
          },
        });

        if (result.error) throw result.error;

        if (result.paymentMethod) {
          setPaymentMethod(result.paymentMethod);
          await placeOrder(result.paymentMethod);
        }
      } else if (selectedMethod) {
        await placeOrder();
      }
    } catch (error: any) {
      setLoading(false);
      setOrderProcessing(false);
      console.error(error);
      toast.error(`Payment Method Error: ${error.message}`);
    }
  };

  const placeOrder = async (payment?: PaymentMethod) => {
    if (!payment?.id && !paymentId) throw new Error("Please Enter Card details");

    const variables = { cart_id: cart?.id, payment_id: payment?.id ?? paymentId };
    const res = await setPaymentAndPlaceOrder({ variables });

    if (res?.errors) throw res?.errors[0];

    removeLocalStorageData();
    sendAnalyticsData(cart);
    router.push(`/thanks/${res?.data?.setPaymentMethodAndPlaceOrder?.order.order_id}`);
  };

  const removeLocalStorageData = () => localStorageKeys.forEach((key) => localStorage.removeItem(key));

  const handleSetPaymentMethod = async () => {
    try {
      const res = await setPaymentMethodCart({ variables: { cartId: cart?.id, payment_id: "" } });

      if (res?.errors) console.error({ description: res?.errors });

      setPaymentMethod(res?.data?.setPaymentMethodOnCart?.cart?.selected_payment_method?.code);

      await fetchCart();
    } catch (error: unknown) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (moduleConfiguration && stripe) {
      const options = {
        amount: calculateStripeAmount(),
        currency: cart?.prices.grand_total.currency,
        ...JSON.parse(moduleConfiguration.elementsOptions),
      };
      const response = stripe.elements(options);

      setElements(response);
    }
  }, [moduleConfiguration, stripe]);

  useEffect(() => {
    if (elements) {
      // @ts-expect-error "payment"
      const paymentElement = elements.create("payment", formOptions);

      paymentElement.mount("#payment-element");
    }
  }, [elements]);

  useEffect(() => {
    if (!paymentMethod) void handleSetPaymentMethod();
  }, [loading]);

  useEffect(() => {
    if (orderProcessing) void createPaymentMethod();
  }, [orderProcessing]);

  return <div id="payment-element" />;
};

export default CheckoutForm;
