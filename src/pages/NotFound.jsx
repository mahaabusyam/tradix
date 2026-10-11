import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { colors } from '../theme/theme';
import { EASE, fadeInUp, reduceMotion } from '../theme/animations';

export default function NotFound() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 10,
        animation: `${fadeInUp} 0.7s ${EASE} backwards`,
        [reduceMotion]: { animation: 'none' },
      }}
    >
      <Typography sx={{ fontSize: 96, fontWeight: 700, lineHeight: 1, color: colors.primary }}>
        404
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Page not found
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
        The page you are looking for does not exist.
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Back to Dashboard
      </Button>
    </Box>
  );
}