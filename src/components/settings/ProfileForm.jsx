import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Box, Button, TextField, Typography } from '@mui/material';

import { selectProfile, updateProfile } from '../../features/settings/settingsSlice';
import { colors } from '../../theme/theme';
import { EASE, glowPulse, pop, reduceMotion } from '../../theme/animations';
import { getInitials } from '../../utils/format';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfileForm({ onSaved }) {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [touched, setTouched] = useState({ name: false, email: false });

  // الأخطاء تُحسب من القيم مباشرة، بدون State إضافي
  const nameError = name.trim().length < 2 ? 'Name must be at least 2 characters' : '';
  const emailError = EMAIL_PATTERN.test(email.trim()) ? '' : 'Enter a valid email address';
  const isDirty = name.trim() !== profile.name || email.trim() !== profile.email;
  const canSave = isDirty && !nameError && !emailError;

  const initials = getInitials(name) || '?';
  const markTouched = (field) => setTouched((previous) => ({ ...previous, [field]: true }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSave) return;
    dispatch(updateProfile({ name: name.trim(), email: email.trim() }));
    onSaved();
  };

  const handleReset = () => {
    setName(profile.name);
    setEmail(profile.email);
    setTouched({ name: false, email: false });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
        {/* key={initials}: عند تغيّر الحروف يُعاد بناء العنصر فتعمل قفزة pop */}
        <Avatar
          key={initials}
          sx={{
            width: 72,
            height: 72,
            fontSize: 26,
            fontWeight: 700,
            color: '#fff',
            background: `linear-gradient(135deg, ${colors.primary}, #7c3aed)`,
            animation: `${pop} 0.45s ${EASE}, ${glowPulse} 3s ease-in-out infinite`,
            [reduceMotion]: { animation: 'none' },
          }}
        >
          {initials}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }} noWrap>
            {name.trim() || 'Your name'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {email.trim() || 'Your email'}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <TextField
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={() => markTouched('name')}
          error={touched.name && Boolean(nameError)}
          helperText={touched.name && nameError ? nameError : ' '}
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={() => markTouched('email')}
          error={touched.email && Boolean(emailError)}
          helperText={touched.email && emailError ? emailError : ' '}
          fullWidth
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
        <Button onClick={handleReset} disabled={!isDirty} sx={{ color: colors.textMuted }}>
          Reset
        </Button>
        <Button type="submit" variant="contained" disabled={!canSave}>
          Save changes
        </Button>
      </Box>
    </Box>
  );
}