import axiosClient from './axiosClient';

// تحاكي تغير الأسعار الحي (للتطوير فقط، تُحذف عند ربط API حقيقي)
const simulateLive = (stocks) => {
  if (!import.meta.env.DEV) return stocks;
  return stocks.map((stock) => ({
    ...stock,
    price: +(stock.price * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2),
    change: +(stock.change + (Math.random() - 0.5) * 0.3).toFixed(2),
  }));
};

export const getPortfolio = (signal) =>
  axiosClient
    .get('/portfolio.json', { signal })
    .then((res) => simulateLive(res.data));

export const getMarket = (signal) =>
  axiosClient.get('/market.json', { signal }).then((res) => res.data);

export const getInvestment = (range, signal) =>
  axiosClient.get('/investment.json', { signal }).then((res) => res.data[range]);
export const getStocks = (signal) =>
  axiosClient.get('/stocks.json', { signal }).then((res) => simulateLive(res.data));

export const getMarketStats = (signal) =>
  axiosClient.get('/market-stats.json', { signal }).then((res) => res.data);