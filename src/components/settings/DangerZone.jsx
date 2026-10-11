import { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grow,
} from '@mui/material';

import SettingRow from './SettingRow';
import { colors } from '../../theme/theme';
import { clearAllData, clearCache } from '../../utils/storage';

export default function DangerZone({ onCacheCleared }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleReset = () => {
    clearAllData();
    window.location.reload(); // نعيد التحميل ليبدأ التطبيق بالقيم الافتراضية
  };

  return (
    <>
      <SettingRow title="Clear cached data" description="Removes saved prices so fresh data loads next time">
        <Button
          variant="outlined"
          onClick={() => {
            clearCache();
            onCacheCleared();
          }}
          sx={{ color: colors.textPrimary, borderColor: colors.border }}
        >
          Clear cache
        </Button>
      </SettingRow>

      <SettingRow title="Reset all data" description="Deletes favorites, your transactions, and saved settings">
        <Button variant="outlined" color="error" onClick={() => setConfirmOpen(true)}>
          Reset
        </Button>
      </SettingRow>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        slots={{ transition: Grow }}
        slotProps={{
          backdrop: { sx: { backdropFilter: 'blur(4px)' } },
          paper: {
            sx: {
              borderRadius: '16px',
              backgroundImage: 'none',
              boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(239, 68, 68, 0.15)',
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Reset all data?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your favorites, the transactions you added, and your settings will be deleted from this
            browser. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ color: colors.textMuted }}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleReset}>
            Reset everything
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}