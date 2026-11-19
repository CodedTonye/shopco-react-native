import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // { cartId, id, title, price, thumbnail, size, color, qty }
  promoApplied: false,
  discountRate: 0.2,
};

function makeCartId(id, size, color) {
  return `${id}-${size}-${color}`;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, title, price, thumbnail, size, color, qty } = action.payload;
      const cartId = makeCartId(id, size, color);
      const existing = state.items.find((i) => i.cartId === cartId);
      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({ cartId, id, title, price, thumbnail, size, color, qty });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.cartId !== action.payload);
    },
    incrementQty: (state, action) => {
      const item = state.items.find((i) => i.cartId === action.payload);
      if (item) item.qty += 1;
    },
    decrementQty: (state, action) => {
      const item = state.items.find((i) => i.cartId === action.payload);
      if (item && item.qty > 1) item.qty -= 1;
    },
    applyPromo: (state) => {
      state.promoApplied = true;
    },
    clearCart: (state) => {
      state.items = [];
      state.promoApplied = false;
    },
  },
});

export const { addToCart, removeFromCart, incrementQty, decrementQty, applyPromo, clearCart } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.qty, 0);
export const selectSubtotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
export const selectDiscount = (state) =>
  state.cart.promoApplied ? selectSubtotal(state) * state.cart.discountRate : 0;
export const selectDeliveryFee = (state) => (state.cart.items.length > 0 ? 15 : 0);
export const selectTotal = (state) =>
  selectSubtotal(state) - selectDiscount(state) + selectDeliveryFee(state);

export default cartSlice.reducer;
