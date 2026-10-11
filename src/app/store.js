import { configureStore } from '@reduxjs/toolkit';
import portfolioReducer from '../features/portfolio/portfolioSlice';
import marketReducer from '../features/market/marketSlice';
import chartReducer from '../features/chart/chartSlice';
import stocksReducer from '../features/stocks/stocksSlice';
import transactionsReducer from '../features/transactions/transactionsSlice';
import settingsReducer from '../features/settings/settingsSlice';

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
    market: marketReducer,
    chart: chartReducer,
    stocks: stocksReducer,
    transactions: transactionsReducer,
    settings: settingsReducer,
  },
});