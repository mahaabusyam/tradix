import { Box, Chip, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { colors } from '../../theme/theme';
import { EASE, fadeInUp, reduceMotion } from '../../theme/animations';

// filters: [{ key, label }]، action: عنصر اختياري يظهر بعد الفلاتر
export default function FilterToolbar({
  search, onSearch, placeholder, filters, filter, onFilter, action,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        animation: `${fadeInUp} 0.6s ${EASE} 350ms backwards`,
        [reduceMotion]: { animation: 'none' },
      }}
    >
      <TextField
        value={search}
        onChange={(event) => onSearch(event.target.value)}
        placeholder={placeholder}
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          width: { xs: '100%', sm: 300 },
          '& .MuiOutlinedInput-root': {
            bgcolor: colors.bgCard,
            borderRadius: '10px',
            transition: `box-shadow 0.3s ${EASE}`,
            '& fieldset': { borderColor: colors.border },
            '&:hover fieldset': { borderColor: 'rgba(189, 52, 254, 0.4)' },
            '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(189, 52, 254, 0.18)' },
          },
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Box role="group" aria-label="Filter" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {filters.map(({ key, label }) => {
            const selected = filter === key;
            return (
              <Chip
                key={key}
                label={label}
                clickable
                onClick={() => onFilter(key)}
                aria-pressed={selected}
                sx={{
                  fontWeight: 600,
                  color: selected ? '#fff' : colors.textMuted,
                  bgcolor: selected ? colors.primary : 'rgba(255, 255, 255, 0.05)',
                  boxShadow: selected ? '0 0 18px rgba(189, 52, 254, 0.4)' : 'none',
                  transition: `all 0.3s ${EASE}`,
                  '&:hover': {
                    bgcolor: selected ? colors.primary : 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                  },
                }}
              />
            );
          })}
        </Box>
        {action}
      </Box>
    </Box>
  );
}