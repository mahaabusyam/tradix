import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getMarketStats, getStocks } from '../../api/stocksApi';
import { getCache, loadFromStorage, saveToStorage, setCache } from '../../utils/storage';

const CACHE_TTL = 60 * 1000;

export const fetchStocks = createAsyncThunk(
  'stocks/fetchStocks',
  async ({ force = false } = {}, { signal, rejectWithValue }) => {
    if (!force) {
      const cached = getCache('stocks', CACHE_TTL);
      if (cached) return cached;
    }
    try {
      const data = await getStocks(signal);
      setCache('stocks', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMarketStats = createAsyncThunk(
  'stocks/fetchMarketStats',
  async (_, { signal, rejectWithValue }) => {
    const cached = getCache('marketStats', CACHE_TTL);
    if (cached) return cached;
    try {
      const data = await getMarketStats(signal);
      setCache('marketStats', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const stocksSlice = createSlice({
  name: 'stocks',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    stats: null,
    statsStatus: 'idle',
    // المفضلة تبقى بعد تحديث الصفحة
    favorites: loadFromStorage('favorites', []),
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const index = state.favorites.indexOf(action.payload);
      if (index === -1) state.favorites.push(action.payload);
      else state.favorites.splice(index, 1);
      saveToStorage('favorites', [...state.favorites]);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        if (state.items.length === 0) state.status = 'loading';
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchMarketStats.pending, (state) => {
        if (!state.stats) state.statsStatus = 'loading';
      })
      .addCase(fetchMarketStats.fulfilled, (state, action) => {
        state.statsStatus = 'succeeded';
        state.stats = action.payload;
      })
      .addCase(fetchMarketStats.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.statsStatus = 'failed';
      });
  },
});

export const { toggleFavorite } = stocksSlice.actions;
export const selectStocks = (state) => state.stocks;
export default stocksSlice.reducer;