import { useState } from 'react';
import { Alert, Box, Snackbar } from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

import PageHeader from '../components/common/PageHeader';
import SettingsSection from '../components/settings/SettingsSection';
import ProfileForm from '../components/settings/ProfileForm';
import PreferencesForm from '../components/settings/PreferencesForm';
import NotificationsForm from '../components/settings/NotificationsForm';
import DangerZone from '../components/settings/DangerZone';

export default function Setting() {
  const [toast, setToast] = useState('');

  return (
    <>
      <PageHeader title="Setting" subtitle="Manage your profile and preferences" />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            alignItems: 'start',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(0, 1fr)' },
          }}
        >
          <SettingsSection
            index={0}
            Icon={PersonOutlineRoundedIcon}
            title="Profile"
            description="Your name appears in the header"
          >
            <ProfileForm onSaved={() => setToast('Profile saved')} />
          </SettingsSection>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <SettingsSection
              index={1}
              Icon={TuneRoundedIcon}
              title="Preferences"
              description="Customize how the dashboard behaves"
            >
              <PreferencesForm />
            </SettingsSection>

            <SettingsSection
              index={2}
              Icon={NotificationsNoneRoundedIcon}
              title="Notifications"
              description="Choose what you want to hear about"
            >
              <NotificationsForm />
            </SettingsSection>
          </Box>
        </Box>

        <SettingsSection
          index={3}
          danger
          Icon={DeleteOutlineRoundedIcon}
          title="Data & Storage"
          description="Manage the data saved in this browser"
        >
          <DangerZone onCacheCleared={() => setToast('Cache cleared')} />
        </SettingsSection>
      </Box>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setToast('')}>
          {toast}
        </Alert>
      </Snackbar>
    </>
  );
}