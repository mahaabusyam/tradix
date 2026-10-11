import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getInvestment } from '../../api/stocksApi';
import { getCache, loadFromStorage, saveToStorage, setCache } from '../../utils/storage';

const CACHE_TTL = 60 * 1000;

export const fetchInvestment = createAsyncThunk(
  'chart/fetchInvestment',
  async (range, { signal, rejectWithValue }) => {
    const cacheKey = `investment:${range}`;
    const cached = getCache(cacheKey, CACHE_TTL);
    if (cached) return { range, data: cached };
    try {
      const data = await getInvestment(range, signal);
      setCache(cacheKey, data);
      return { range, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chartSlice = createSlice({
  name: 'chart',
  initialState: {
    // تفضيل المستخدم: يبقى محفوظاً بعد إعادة تحميل الصفحة
    range: loadFromStorage('chartRange', 'month'),
    byRange: {}, // { day: {...}, week: {...}, month: {...} }
    status: 'idle',
    error: null,
  },
  reducers: {
    setRange: (state, action) => {
      state.range = action.payload;
      saveToStorage('chartRange', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestment.pending, (state, action) => {
        // نعرض التحميل فقط إن لم تكن بيانات هذا النطاق موجودة
        if (!state.byRange[action.meta.arg]) state.status = 'loading';
      })
      .addCase(fetchInvestment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.byRange[action.payload.range] = action.payload.data;
        state.error = null;
      })
      .addCase(fetchInvestment.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setRange } = chartSlice.actions;
export const selectChart = (state) => state.chart;
export default chartSlice.reducer;