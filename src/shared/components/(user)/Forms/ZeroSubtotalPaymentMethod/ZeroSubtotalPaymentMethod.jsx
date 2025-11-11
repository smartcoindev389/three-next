import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { changeRequestLoading } from "@/lib/redux/slices/checkout";
import { SET_FREE_PAYMENT_METHOD_AND_PLACE_ORDER } from "@/lib/apollo/queryes/checkout";
import { getCartGAData, sendGAEvent } from "@/utils/google-analytics";
import { useCart } from "@/providers/CartProvider/useCart";

export default function ZeroSubtotalPaymentMethod({ setOrderProcessing, orderProcessing }) {
  const { cart, fetchCart } = useCart();
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const [setFreeMethodAndPlaceOrder] = useMutation(SET_FREE_PAYMENT_METHOD_AND_PLACE_ORDER);

  useEffect(() => {
    if (orderProcessing) {
      dispatch(changeRequestLoading(true));
      setFreeMethodAndPlaceOrder({
        variables: { cart_id: cart?.id },
        update: (cache, { data }) => {
          _removeLocalStorageData();
          sendGAEvent("purchase", getCartGAData(cart));
          fetchCart().then(() => {
            router.push(`/thanks/${data?.setPaymentMethodAndPlaceOrder?.order?.order_id}`);
          });
        },
        onError: (error) => {
          console.error(error);
          dispatch(changeRequestLoading(false));
          setOrderProcessing(false);
        },
      });
    }
  }, [orderProcessing]);

  const _removeLocalStorageData = () => {
    localStorage.removeItem("checkoutBillingAddress");
    localStorage.removeItem("guestName");
    localStorage.removeItem("checkoutShipAddress");
    localStorage.removeItem("CheckoutActiveShippingAddress");
    localStorage.removeItem("CheckoutActiveBillingAddress");
  };

  return <p className="text-sm text-gray-600 mt-2">{t("Free order - no payment required. Just place your order.")}</p>;
}
