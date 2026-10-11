import { createSlice, current } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage } from '../../utils/storage';

const DEFAULTS = {
  profile: { name: 'Harvey Specter', email: 'harvey@tradix.com' },
  refreshSeconds: 15, // 0 يعني إيقاف التحديث الحي
  notifications: { priceAlerts: true, orderUpdates: true, weeklyReport: false },
};

// ندمج المحفوظ مع الافتراضي، فلا ينكسر التطبيق إن أضفنا خيارات جديدة لاحقاً
const loadInitialState = () => {
  const saved = loadFromStorage('settings', {});
  return {
    ...DEFAULTS,
    ...saved,
    profile: { ...DEFAULTS.profile, ...saved.profile },
    notifications: { ...DEFAULTS.notifications, ...saved.notifications },
  };
};

const persist = (state) => saveToStorage('settings', current(state));

const settingsSlice = createSlice({
  name: 'settings',
  initialState: loadInitialState(),
  reducers: {
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
      persist(state);
    },
    setRefreshSeconds: (state, action) => {
      state.refreshSeconds = action.payload;
      persist(state);
    },
    toggleNotification: (state, action) => {
      state.notifications[action.payload] = !state.notifications[action.payload];
      persist(state);
    },
  },
});

export const { updateProfile, setRefreshSeconds, toggleNotification } = settingsSlice.actions;

export const selectSettings = (state) => state.settings;
export const selectProfile = (state) => state.settings.profile;
export const selectRefreshMs = (state) => state.settings.refreshSeconds * 1000;

export default settingsSlice.reducer;