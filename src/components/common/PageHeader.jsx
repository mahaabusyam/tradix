import { Box, Typography } from '@mui/material';
import { EASE, fadeInUp, reduceMotion } from '../../theme/animations';

// action: عنصر اختياري يظهر على اليمين (زر مثلاً)
export default function PageHeader({ title, subtitle, action }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexWrap: 'wrap',
        gap: 2,
        mb: 4,
        animation: `${fadeInUp} 0.6s ${EASE} backwards`,
        [reduceMotion]: { animation: 'none' },
      }}
    >
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}