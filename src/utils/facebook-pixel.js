export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export const pageview = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
};

// https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking
export const event = (name, options = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", name, options);
  }
};

export const viewContent = (contentData) => {
  event("ViewContent", contentData);
};

export const addToCart = (productData) => {
  event("AddToCart", productData);
};

export const initiateCheckout = (checkoutData) => {
  event("InitiateCheckout", checkoutData);
};

export const purchase = (purchaseData) => {
  event("Purchase", purchaseData);
};

export const completeRegistration = (userData) => {
  event("CompleteRegistration", userData);
};
