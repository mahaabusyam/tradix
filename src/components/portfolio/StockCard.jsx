import { Box, Paper, Typography } from '@mui/material';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

import { colors } from '../../theme/theme';
import { EASE, fadeInUp, reduceMotion, revealRight } from '../../theme/animations';
import { formatChange, formatPrice } from '../../utils/format';
import useCountUp from '../../hooks/useCountUp';

export default function StockCard({ stock, index }) {
  const { name, symbol, price, change, history } = stock;
  const animatedPrice = useCountUp(price);
  const changeColor = change >= 0 ? colors.success : colors.error;

  return (
    <Paper
      sx={{
        p: 2.5,
        pb: 1.5,
        overflow: 'hidden',
        cursor: 'pointer',
        // backwards وليس both: حتى لا تثبّت الحركة قيمة transform وتلغي تأثير hover
        animation: `${fadeInUp} 0.7s ${EASE} ${index * 120}ms backwards`,
        transition: `transform 0.35s ${EASE}, box-shadow 0.35s ${EASE}, border-color 0.35s ${EASE}`,
        '&:hover': {
          transform: 'translateY(-6px)',
          borderColor: 'rgba(189, 52, 254, 0.45)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5), 0 0 24px rgba(189, 52, 254, 0.18)',
        },
        [reduceMotion]: { animation: 'none', transition: 'none' },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {name}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {formatPrice(animatedPrice)}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {symbol}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: changeColor, transition: 'color 0.4s' }}
          >
            {formatChange(change)}
          </Typography>
        </Box>
      </Box>

      {/* الرسم يظهر تدريجياً من اليسار لليمين */}
      <Box
        sx={{
          mt: 1,
          animation: `${revealRight} 1.4s ${EASE} ${400 + index * 120}ms backwards`,
          '& .MuiLineElement-root': { stroke: colors.primary, strokeWidth: 1.5 },
          '& .MuiAreaElement-root': { fill: 'rgba(189, 52, 254, 0.14)' },
          [reduceMotion]: { animation: 'none' },
        }}
      >
        <SparkLineChart data={history} height={90} area curve="linear" showHighlight />
      </Box>
    </Paper>
  );
}