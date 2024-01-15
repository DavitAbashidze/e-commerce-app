import {
  ADD_TO_CART,
  CLEAR_CART,
  COUNT_CART_TOTALS,
  REMOVE_CART_ITEM,
  TOGGLE_CART_ITEM_AMOUNT,
} from "../actions";

const cart_reducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      const { id } = action.payload;
      const tempItem = state.cart.find((i) => i.id === id);
      if (tempItem) {
        return state;
      } else {
        return { ...state, cart: [...state.cart, action.payload] };
      }
    }
    case REMOVE_CART_ITEM: {
      const tempCart = state.cart.filter((item) => item.id !== action.payload);
      return { ...state, cart: tempCart };
    }
    case CLEAR_CART: {
      return { ...state, cart: [] };
    }
    case TOGGLE_CART_ITEM_AMOUNT: {
      const { id, value } = action.payload;
      const tempCart = state.cart.map((item) => {
        if (item.id === id) {
          if (value === "inc") {
            let newAmount = item.quantity + 1;
            if (newAmount > item.stock) {
              newAmount = item.stock;
            }
            return { ...item, quantity: newAmount };
          }
          if (value === "dec") {
            let newAmount = item.quantity - 1;
            if (newAmount < 1) {
              newAmount = 1;
            }
            return { ...item, quantity: newAmount };
          }
        }
        return item;
      });
      return { ...state, cart: tempCart };
    }
    case COUNT_CART_TOTALS: {
      const { total_items, total_amount } = state.cart.reduce(
        (total, cartItem) => {
          const { quantity, price } = cartItem;

          total.total_items += quantity;
          total.total_amount += price * quantity;

          return total;
        },
        { total_items: 0, total_amount: 0 }
      );
      return { ...state, total_items, total_amount };
    }
    default:
      throw new Error(`No Matching "${action.type}" - action type`);
  }
};

export default cart_reducer;
