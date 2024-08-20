// CartContext.js
import React, { createContext, useReducer, useContext } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItemIndex = state.cart.findIndex(
        (item) => item.id === action.product.id
      );

      if (existingItemIndex !== -1) {
        // If item already exists in cart, update quantity
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += action.product.quantity;
        return { ...state, cart: updatedCart };
      } else {
        // If item is not in cart, add it
        return {
          ...state,
          cart: [
            ...state.cart,
            { ...action.product, quantity: action.product.quantity },
          ],
        };
      }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.id),
      };

    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      };

    case "ADD_ORDER":
      return {
        ...state,
        orders: [...state.orders, action.order],
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { cart: [], orders: [] });

  return (
    <CartContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;
