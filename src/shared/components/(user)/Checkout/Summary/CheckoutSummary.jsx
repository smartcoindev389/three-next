import { useMutation } from "@apollo/client";
import debounce from "lodash-es/debounce";

import Summary from "./Summary";

import { REMOVE_ITEM_FROM_CART, UPDATE_CART_ITEMS } from "@/lib/apollo/queryes/shoppingCart";
import { useCart } from "@/providers/CartProvider/useCart";

const CheckoutSummary = ({ loading, placeOrder }) => {
  const { cart, fetchCart } = useCart();
  const [removeItemFromCart] = useMutation(REMOVE_ITEM_FROM_CART);
  const [updateCartItems] = useMutation(UPDATE_CART_ITEMS);

  const removeItem = (cart_item_id) => {
    removeItemFromCart({
      variables: { cart_id: cart?.id, cart_item_id: cart_item_id },
      update: () => fetchCart(),
    });
  };

  const updateQuantity = debounce((cart_item, value) => {
    if (value !== 0 && !value) return;

    let cartQuantity = parseFloat(value);

    if (cartQuantity === 0) {
      removeItem(cart_item.id);
    } else {
      updateCartItems({
        variables: { cart_id: cart?.id, cart_item_id: cart_item.id, quantity: cartQuantity },
        update: () => fetchCart(),
      });
    }
  }, 500);

  return <Summary cart={cart} loading={loading} placeOrder={placeOrder} updateQuantity={updateQuantity} />;
};

export default CheckoutSummary;
