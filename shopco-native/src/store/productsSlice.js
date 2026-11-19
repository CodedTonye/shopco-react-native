import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = 'https://dummyjson.com';

// Maps the design's "dress style" categories to real DummyJSON product categories
export const DRESS_STYLE_CATEGORY_MAP = {
  casual: 'tops',
  formal: 'mens-shirts',
  party: 'womens-dresses',
  gym: 'womens-shoes',
};

export const fetchHomeProducts = createAsyncThunk(
  'products/fetchHomeProducts',
  async () => {
    // Fetch 8 of each so "View All" can expand in place instead of navigating away
    const [arrivalsRes, sellingRes] = await Promise.all([
      fetch(`${API_BASE}/products?limit=8&skip=0&sortBy=id&order=desc`),
      fetch(`${API_BASE}/products?limit=8&skip=8&sortBy=rating&order=desc`),
    ]);
    const arrivals = await arrivalsRes.json();
    const selling = await sellingRes.json();
    return { newArrivals: arrivals.products, topSelling: selling.products };
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id) => {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  }
);

export const fetchRelatedProducts = createAsyncThunk(
  'products/fetchRelatedProducts',
  async ({ category, excludeId }) => {
    const res = await fetch(`${API_BASE}/products/category/${category}?limit=8`);
    const data = await res.json();
    return data.products.filter((p) => p.id !== Number(excludeId)).slice(0, 4);
  }
);

export const fetchCategoryProducts = createAsyncThunk(
  'products/fetchCategoryProducts',
  async ({ category, limit = 9, skip = 0, sortBy = 'id', order = 'asc' }) => {
    const url = category
      ? `${API_BASE}/products/category/${category}?limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}`
      : `${API_BASE}/products?limit=${limit}&skip=${skip}&sortBy=${sortBy}&order=${order}`;
    const res = await fetch(url);
    return res.json();
  }
);

export const fetchSearchProducts = createAsyncThunk(
  'products/fetchSearchProducts',
  async ({ q, limit = 12, skip = 0 }) => {
    const res = await fetch(
      `${API_BASE}/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
    );
    return res.json();
  }
);

// Lightweight lookup used for the navbar's live suggestions dropdown
export const fetchSearchSuggestions = createAsyncThunk(
  'products/fetchSearchSuggestions',
  async (q) => {
    if (!q?.trim()) return [];
    const res = await fetch(
      `${API_BASE}/products/search?q=${encodeURIComponent(q)}&limit=8&select=id,title,price,thumbnail`
    );
    const data = await res.json();
    return data.products;
  }
);

const initialState = {
  newArrivals: [],
  topSelling: [],
  homeStatus: 'idle',
  current: null,
  currentStatus: 'idle',
  related: [],
  category: { items: [], total: 0, status: 'idle' },
  search: { items: [], total: 0, status: 'idle', query: '' },
  suggestions: [],
  suggestionsStatus: 'idle',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeProducts.pending, (state) => {
        state.homeStatus = 'loading';
      })
      .addCase(fetchHomeProducts.fulfilled, (state, action) => {
        state.homeStatus = 'succeeded';
        state.newArrivals = action.payload.newArrivals;
        state.topSelling = action.payload.topSelling;
      })
      .addCase(fetchHomeProducts.rejected, (state) => {
        state.homeStatus = 'failed';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.currentStatus = 'loading';
        state.current = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentStatus = 'succeeded';
        state.current = action.payload;
      })
      .addCase(fetchProductById.rejected, (state) => {
        state.currentStatus = 'failed';
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.related = action.payload;
      })
      .addCase(fetchCategoryProducts.pending, (state) => {
        state.category.status = 'loading';
      })
      .addCase(fetchCategoryProducts.fulfilled, (state, action) => {
        state.category.status = 'succeeded';
        state.category.items = action.payload.products;
        state.category.total = action.payload.total;
      })
      .addCase(fetchCategoryProducts.rejected, (state) => {
        state.category.status = 'failed';
      })
      .addCase(fetchSearchProducts.pending, (state, action) => {
        state.search.status = 'loading';
        state.search.query = action.meta.arg.q;
      })
      .addCase(fetchSearchProducts.fulfilled, (state, action) => {
        state.search.status = 'succeeded';
        state.search.items = action.payload.products;
        state.search.total = action.payload.total;
      })
      .addCase(fetchSearchProducts.rejected, (state) => {
        state.search.status = 'failed';
      })
      .addCase(fetchSearchSuggestions.pending, (state) => {
        state.suggestionsStatus = 'loading';
      })
      .addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
        state.suggestionsStatus = 'succeeded';
        state.suggestions = action.payload;
      });
  },
});

export default productsSlice.reducer;
