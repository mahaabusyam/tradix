import { createAsyncThunk, createSelector, createSlice, current } from '@reduxjs/toolkit';
import * as transactionsApi from '../../api/transactionsApi';
import { getCache, loadFromStorage, saveToStorage, setCache } from '../../utils/storage';

const CACHE_TTL = 60 * 1000;

export const fetchTransactions = createAsyncThunk(
  'transactions/fetch',
  async ({ force = false } = {}, { signal, rejectWithValue }) => {
    if (!force) {
      const cached = getCache('transactions', CACHE_TTL);
      if (cached) return cached;
    }
    try {
      const data = await transactionsApi.getTransactions(signal);
      setCache('transactions', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (payload, { rejectWithValue }) => {
    try {
      return await transactionsApi.createTransaction(payload);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: [], // قادمة من الـ API
    created: loadFromStorage('createdTransactions', []), // أضافها المستخدم (محفوظة محلياً)
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        if (state.items.length === 0) state.status = 'loading';
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.created.unshift(action.payload);
        saveToStorage('createdTransactions', current(state).created);
      });
  },
});

export const selectTransactionsState = (state) => state.transactions;

// createSelector يحفظ النتيجة (memoization): لا يبني مصفوفة جديدة إلا إذا تغيّر أحد المدخلين
export const selectAllTransactions = createSelector(
  [(state) => state.transactions.created, (state) => state.transactions.items],
  (created, items) => [...created, ...items]
);

export default transactionsSlice.reducer;