import { Box, Paper, Typography } from '@mui/material';
import { colors } from '../../theme/theme';
import { EASE, fadeInUp, reduceMotion } from '../../theme/animations';

export default function SettingsSection({ Icon, title, description, index = 0, danger = false, children }) {
  const accent = danger ? colors.error : colors.primary;

  return (
    <Paper
      sx={{
        p: 3,
        borderColor: danger ? 'rgba(239, 68, 68, 0.3)' : undefined,
        animation: `${fadeInUp} 0.7s ${EASE} ${200 + index * 120}ms backwards`,
        transition: 'border-color 0.35s',
        '&:hover': { borderColor: danger ? 'rgba(239, 68, 68, 0.55)' : 'rgba(189, 52, 254, 0.35)' },
        [reduceMotion]: { animation: 'none' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '10px',
            color: accent,
            bgcolor: `${accent}1f`,
          }}
        >
          <Icon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Box>

      {/* غلاف بسيط ليكون كل SettingRow أخاً للآخر (يحتاجه خط الفصل بين الصفوف) */}
      <Box>{children}</Box>
    </Paper>
  );
}