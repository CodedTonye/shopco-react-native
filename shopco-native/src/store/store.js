import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice.js';
import cartReducer from './cartSlice.js';
import filtersReducer from './filtersSlice.js';
import authReducer from './authSlice.js';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    filters: filtersReducer,
    auth: authReducer,
  },
});
