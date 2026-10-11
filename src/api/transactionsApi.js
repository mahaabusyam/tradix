import axiosClient from './axiosClient';

export const getTransactions = (signal) =>
  axiosClient.get('/transactions.json', { signal }).then((res) => res.data);

// ملفات JSON الثابتة لا تقبل الكتابة، فنحاكي الإنشاء محلياً مع تأخير بسيط.
// عند وجود API حقيقي نستبدل الجسم بـ:
// axiosClient.post('/transactions', payload).then((res) => res.data)
export const createTransaction = ({ symbol, name, type, quantity, price }) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `local-${Date.now()}`,
        symbol,
        name,
        type,
        quantity,
        price,
        date: new Date().toISOString(),
        status: 'completed',
      });
    }, 800);
  });