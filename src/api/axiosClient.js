import axios from 'axios';

const axiosClient = axios.create({
  // الآن نقرأ من /mock، وعند وجود API حقيقي نضع VITE_API_URL في ملف .env
  baseURL: import.meta.env.VITE_API_URL || `${import.meta.env.BASE_URL}mock`,
  timeout: 10000,
});

// تأخير مصطنع في وضع التطوير فقط، لنرى حالات التحميل والأنيميشن
if (import.meta.env.DEV) {
  axiosClient.interceptors.response.use(async (response) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return response;
  });
}

// توحيد شكل الأخطاء في مكان واحد
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);
    const message = error.response?.data?.message || error.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;