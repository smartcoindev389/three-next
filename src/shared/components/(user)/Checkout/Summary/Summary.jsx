import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";

import Price from "@/shared/components/(common)/Currency/Price";
import { REMOVE_COUPON_FROM_CART } from "@/lib/apollo/queryes/checkout";
import { useToast } from "@/shared/components/(common)/ui/use-toast";
import BaseButton from "@/shared/components/(main)/BaseButton/BaseButton";
import Title from "@/shared/components/(common)/Title/Title";
import { useCart } from "@/providers/CartProvider/useCart";

export default function Summary({ placeOrder, updateQuantity }) {
  const { t } = useTranslation();
  const [removeCouponFromCart, { loading }] = useMutation(
    REMOVE_COUPON_FROM_CART,
  );
  const { toast } = useToast();
  const { cart, fetchCart } = useCart();

  function calculatePrice() {
    return cart.items.reduce((total, item) => {
      return (
        total + item.product.price.regularPrice.amount.value * item.quantity
      );
    }, 0);
  }

  const getTaxAmount = () => {
    return cart?.prices?.applied_taxes.reduce(
      (sum, item) => sum + (item.amount.value || 0),
      0,
    );
  };

  const getPaymentFee = () => {
    return cart?.prices?.payment_fee?.reduce(
      (sum, item) => sum + (item.amount.value || 0),
      0,
    );
  };

  const getDeliveryAmount = () => {
    return cart?.shipping_addresses[0]?.selected_shipping_method?.amount?.value;
  };

  const handleRemoveDiscount = (couponCode) => {
    removeCouponFromCart({ variables: { cart_id: cart?.id } })
      .then(() => {
        toast({
          type: "success",
          description: `The coupon code ${couponCode} was removed.`,
        });
        void fetchCart();
      })
      .catch((err) => {
        toast({ type: "error", description: err.message });
      });
  };

  const renderDiscount = () => {
    const referralDiscount = cart?.prices?.referral_discount?.value;

    if (!referralDiscount) {
      return null;
    }

    return (
      <div className="flex justify-between items-center mt-2 text-base md:text-lg">
        <span>{t("Referral discount:")}</span>
        <span className="font-semibold">
          <Price amount={referralDiscount} />
        </span>
      </div>
    );
  };

  const renderReferralDiscount = () => {
    const discounts = cart?.prices?.discounts || [];
    const appliedCouponCode = cart?.applied_coupons?.[0]?.code;

    if (!appliedCouponCode) {
      return null;
    }

    return (
      <div className="flex justify-between items-center mt-2 text-base md:text-lg">
        <span className="font-normal">
          {t("Coupon:")} {appliedCouponCode}
        </span>
        <div className="flex items-center font-semibold">
          <span>
            <Price amount={discounts?.[0]?.amount?.value} />
          </span>
          <button
            className="ml-1 hover:underline"
            onClick={() => handleRemoveDiscount(appliedCouponCode)}
          >
            {t("Remove")}
          </button>
        </div>
      </div>
    );
  };

  const renderCartItem = (item, idx) => {
    return (
      <li key={idx} className={""}>
        <div className="flex items-center justify-between gap-3 mt-1">
          <span className="w-2/3 font-normal">{item.product.name}</span>
          <div className="border border-[#CACBCF] rounded-[8px] px-1 flex h-fit items-center justify-center">
            <button
              className="w-5 h-5 flex justify-center items-center"
              onClick={() => updateQuantity(item, item.quantity - 1)}
            >
              <svg
                fill="none"
                height="2"
                viewBox="0 0 11 2"
                width="11"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1H10"
                  stroke="#545454"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
            <input
              readOnly
              className="border-none font-medium p-0 text-blue text-center text-xl w-12 w-5"
              type="text"
              value={item.quantity}
            />
            <button
              className="w-5 h-5 flex justify-center items-center"
              onClick={() => updateQuantity(item, item.quantity + 1)}
            >
              <svg
                fill="none"
                height="13"
                viewBox="0 0 13 13"
                width="13"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.5 1V12"
                  stroke="#545454"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  d="M1 6.5H12"
                  stroke="#545454"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>

          <Price
            amount={
              item.product.price.regularPrice.amount.value * item.quantity
            }
            className="text-lg font-semibold text-[#727272]"
          />
        </div>
      </li>
    );
  };

  return (
    <section className="bg-white border border-[#CACBCF] rounded py-4 px-5 flex flex-col justify-between h-fit order-sum-box md:mt-5 text-[#727272] text-base md:text-lg font-normal">
      {cart && cart.items && (
        <>
          <Title>{t("Order Summary")}</Title>
          <div className="pt-2">
            <p className="text-[20px] text-[#545454] text-semiBold font-semibold mt-2">
              {t("Items")}
            </p>
            <ul>{cart.items.map(renderCartItem)}</ul>
          </div>
          <div className="flex flex-row justify-between items-end mt-1">
            <span className="">{t("Tax")}</span>
            <span className="font-semibold">
              {getTaxAmount() ? <Price amount={getTaxAmount()} /> : "-"}
            </span>
          </div>
          <div className="flex flex-row justify-between items-end mt-1">
            <span className=" ">{t("Delivery")}</span>
            <span className=" font-semibold">
              {getDeliveryAmount() ? (
                <Price amount={getDeliveryAmount()} />
              ) : (
                "-"
              )}
            </span>
          </div>
          <div className="flex flex-row justify-between items-end mt-1">
            <span className=" ">{t("Processing Fee")}</span>
            <span className="  font-semibold">
              {getPaymentFee() ? <Price amount={getPaymentFee()} /> : "-"}
            </span>
          </div>

          <div className="grid grid-cols text-semiBold border-y border-[#cacbcf] py-5 my-5 md:py-6 md:my-6">
            <div className="flex flex-row justify-between">
              <span className="">{t("Total")}</span>
              <span className="font-semibold">
                <Price amount={calculatePrice()} />
              </span>
            </div>
            <div>
              {renderDiscount()}
              {renderReferralDiscount()}
            </div>
          </div>
          <div className="flex justify-between">
            <p className={"text-[20px] text-[#545454] font-medium"}>
              {t("Order Total")}:
            </p>
            <p className="text-[20px] text-[#545454] font-semibold">
              <Price amount={cart.prices.grand_total.value} />
            </p>
          </div>
          <BaseButton className="mt-5" disabled={loading} onClick={placeOrder}>
            {loading ? t("Processing...") : t("Place Order")}
          </BaseButton>
        </>
      )}
    </section>
  );
}
