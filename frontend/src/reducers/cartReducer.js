import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [] , shippingInfo : {}}, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;
      // as we are using the initail state in reducer we have to add cartItems in inital state of store
      const isItemExist = state.cartItems.find(
        (cartItem) => cartItem.product === item.product
      ); // if product is already in cart
      if (isItemExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((cartItem) => {
            if (cartItem.product === item.product) return item;
            return cartItem;
          }),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }

    case REMOVE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (cartItem) => cartItem.product !== action.payload
        ),
      };

    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };
    default:
      return state;
  }
};
