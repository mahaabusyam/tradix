import { Box, Paper, Skeleton, Typography } from '@mui/material';

import { colors } from '../../theme/theme';
import { EASE, fadeInUp, reduceMotion } from '../../theme/animations';
import { formatChange } from '../../utils/format';
import useCountUp from '../../hooks/useCountUp';

// amount + format: رقم يعدّ تصاعدياً. text: نص جاهز (مثل رمز السهم)
export default function MarketStatCard({ label, Icon, index, amount, format, text, change, loading }) {
  const animatedAmount = useCountUp(amount ?? 0);
  const value = text ?? (amount != null ? format(animatedAmount) : '—');

  return (
    <Paper
      sx={{
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        animation: `${fadeInUp} 0.7s ${EASE} ${index * 100}ms backwards`,
        transition: `transform 0.35s ${EASE}, box-shadow 0.35s ${EASE}, border-color 0.35s ${EASE}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: 'rgba(189, 52, 254, 0.45)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5), 0 0 24px rgba(189, 52, 254, 0.18)',
          '& .stat-icon': { transform: 'rotate(-8deg) scale(1.1)' },
        },
        [reduceMotion]: { animation: 'none', transition: 'none' },
      }}
    >
      <Box
        className="stat-icon"
        sx={{
          width: 46,
          height: 46,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '12px',
          color: colors.primary,
          background:
            'linear-gradient(135deg, rgba(189, 52, 254, 0.28), rgba(189, 52, 254, 0.06))',
          transition: `transform 0.4s ${EASE}`,
        }}
      >
        <Icon />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        {loading ? (
          <Skeleton animation="wave" width={90} height={32} />
        ) : (
          <Typography variant="h6" sx={{ fontWeight: 600 }} noWrap>
            {value}
          </Typography>
        )}
        {!loading && change != null && (
          <Typography
            variant="caption"
            sx={{ color: change >= 0 ? colors.success : colors.error }}
          >
            {formatChange(change)}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}