import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://dummyjson.com';
const STORAGE_KEY = 'shopco_auth';

// On mobile, storage is async, so the saved session is loaded once at app start
// with this thunk (see App.js) instead of being read synchronously.
export const hydrateAuth = createAsyncThunk('auth/hydrateAuth', async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
});

// DummyJSON's /users/add simulates creating a user but doesn't persist it,
// so a new account can't be used to sign in afterwards.
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({ firstName, lastName, email, username, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/users/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, username, password }),
      });
      if (!res.ok) throw new Error('Could not create account');
      return res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, expiresInMins: 60 }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Invalid username or password');
      }
      const data = await res.json();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
});

const initialState = {
  user: null,
  hydrated: false,
  status: 'idle',
  error: null,
  signupStatus: 'idle',
  signupResult: null,
  signupError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearSignupResult: (state) => {
      state.signupStatus = 'idle';
      state.signupResult = null;
      state.signupError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.hydrated = true;
      })
      .addCase(hydrateAuth.rejected, (state) => {
        state.hydrated = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(signupUser.pending, (state) => {
        state.signupStatus = 'loading';
        state.signupError = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.signupStatus = 'succeeded';
        state.signupResult = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.signupStatus = 'failed';
        state.signupError = action.payload || 'Signup failed';
      });
  },
});

export const { clearSignupResult } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.user;
export default authSlice.reducer;
