import ReactGA from "react-ga4";
import GoogleTagManager from "react-gtm-module";

export const initializeGA = () => {
  ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_TRACKING_ID);
  GoogleTagManager.initialize({
    gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
  });
};

export const sendGAEvent = (name, params) => {
  ReactGA.event(name, {
    portal: "Customer",
    ...params,
  });
};

/**
 * Converts a shopping cart object into a structured format with currency, value, and items
 * @example
 * transformCart(cart)
 * { currency: 'USD', value: 100, items: [ { item_name: 'Product A', item_id: '123', price: 50, quantity: 2 } ] }
 * @param {Object} cart - The shopping cart object containing prices and items.
 * @returns {Object} Returns a structured object with currency, total value, and an array of item objects.
 * @description
 *   - The function assumes the cart object is structured with prices and grand_total fields.
 *   - The items array in cart is expected to include product details such as name, id, and price.
 *   - The function safely accesses nested cart object properties using optional chaining.
 */
export const getCartGAData = (cart) => {
  return {
    currency: cart?.prices?.grand_total?.currency,
    value: cart?.prices?.grand_total?.value,
    items: cart?.items?.map((item) => {
      return {
        item_name: item?.product?.name,
        item_id: item?.product?.id,
        price: item?.product?.price?.regularPrice?.amount?.value,
        quantity: item.quantity,
      };
    }),
  };
};
