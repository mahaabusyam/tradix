import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getMarket } from '../../api/stocksApi';
import { getCache, setCache } from '../../utils/storage';

const CACHE_KEY = 'market';
const CACHE_TTL = 60 * 1000;

export const fetchMarket = createAsyncThunk(
  'market/fetch',
  async ({ force = false } = {}, { signal, rejectWithValue }) => {
    if (!force) {
      const cached = getCache(CACHE_KEY, CACHE_TTL);
      if (cached) return cached;
    }
    try {
      const data = await getMarket(signal);
      setCache(CACHE_KEY, data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const marketSlice = createSlice({
  name: 'market',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarket.pending, (state) => {
        if (state.items.length === 0) state.status = 'loading';
      })
      .addCase(fetchMarket.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchMarket.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const selectMarket = (state) => state.market;
export default marketSlice.reducer;