const PREFIX = 'tradix:'; // بادئة تمنع تعارض مفاتيحنا مع مواقع أخرى

export const loadFromStorage = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback; // JSON تالف أو التخزين غير متاح
  }
};

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // الذاكرة ممتلئة أو التصفح الخاص: نتجاهل ولا نكسر التطبيق
  }
};

// كاش مع تاريخ الحفظ لنعرف إن كانت البيانات ما زالت صالحة
export const setCache = (key, data) =>
  saveToStorage(`cache:${key}`, { data, savedAt: Date.now() });

export const getCache = (key, ttlMs) => {
  const entry = loadFromStorage(`cache:${key}`);
  if (!entry) return null;
  return Date.now() - entry.savedAt < ttlMs ? entry.data : null;
};
const removeByPrefix = (prefix) => {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    // التخزين غير متاح: نتجاهل
  }
};

// يمسح الكاش فقط ويترك تفضيلات المستخدم ومفضلاته
export const clearCache = () => removeByPrefix(`${PREFIX}cache:`);

// يمسح كل ما يخص التطبيق
export const clearAllData = () => removeByPrefix(PREFIX);