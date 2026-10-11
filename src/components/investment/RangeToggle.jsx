import { Box, ButtonBase } from '@mui/material';
import { colors } from '../../theme/theme';
import { EASE, reduceMotion } from '../../theme/animations';

const RANGES = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
];

const BUTTON_WIDTH = 64;
const BUTTON_HEIGHT = 30;
const PADDING = 4;

export default function RangeToggle({ value, onChange }) {
  const activeIndex = RANGES.findIndex((range) => range.key === value);

  return (
    <Box
      role="group"
      aria-label="Chart range"
      sx={{
        position: 'relative',
        display: 'flex',
        p: `${PADDING}px`,
        borderRadius: '10px',
        bgcolor: 'rgba(255, 255, 255, 0.04)',
      }}
    >
      {/* الخلفية المنزلقة: نفس فكرة مربع الـ Sidebar */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: PADDING,
          left: PADDING,
          width: BUTTON_WIDTH,
          height: BUTTON_HEIGHT,
          borderRadius: '8px',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          transform: `translateX(${activeIndex * BUTTON_WIDTH}px)`,
          transition: `transform 0.45s ${EASE}`,
          [reduceMotion]: { transition: 'none' },
        }}
      />

      {RANGES.map(({ key, label }) => (
        <ButtonBase
          key={key}
          aria-pressed={value === key}
          onClick={() => onChange(key)}
          sx={{
            position: 'relative',
            zIndex: 1,
            width: BUTTON_WIDTH,
            height: BUTTON_HEIGHT,
            borderRadius: '8px',
            fontSize: 13,
            fontWeight: 500,
            color: value === key ? colors.textPrimary : colors.textMuted,
            transition: 'color 0.3s',
            '&:hover': { color: colors.textPrimary },
          }}
        >
          {label}
        </ButtonBase>
      ))}
    </Box>
  );
}