import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  priceMin: 0,
  priceMax: 100000, // 100000 = no upper limit
  colors: [],
  sizes: [],
  sortBy: 'id',
  order: 'asc',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setPriceRange: (state, action) => {
      state.priceMin = action.payload.min;
      state.priceMax = action.payload.max;
    },
    toggleColor: (state, action) => {
      const c = action.payload;
      state.colors = state.colors.includes(c)
        ? state.colors.filter((x) => x !== c)
        : [...state.colors, c];
    },
    toggleSize: (state, action) => {
      const s = action.payload;
      state.sizes = state.sizes.includes(s)
        ? state.sizes.filter((x) => x !== s)
        : [...state.sizes, s];
    },
    setSort: (state, action) => {
      const map = {
        'Most Popular': { sortBy: 'rating', order: 'desc' },
        'Price: Low to High': { sortBy: 'price', order: 'asc' },
        'Price: High to Low': { sortBy: 'price', order: 'desc' },
        Newest: { sortBy: 'id', order: 'desc' },
      };
      const found = map[action.payload] || { sortBy: 'id', order: 'asc' };
      state.sortBy = found.sortBy;
      state.order = found.order;
    },
    resetFilters: () => initialState,
  },
});

export const { setPriceRange, toggleColor, toggleSize, setSort, resetFilters } =
  filtersSlice.actions;

export default filtersSlice.reducer;
