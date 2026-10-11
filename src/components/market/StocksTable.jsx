import {
  Box, IconButton, Paper, Skeleton, Table, TableBody, TableCell,
  TableHead, TableRow, TableSortLabel, Typography,
} from '@mui/material';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { lineClasses } from '@mui/x-charts/LineChart';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';

import { colors } from '../../theme/theme';
import { EASE, fadeInUp, pop, reduceMotion } from '../../theme/animations';
import { formatChange, formatCompact, formatPrice } from '../../utils/format';

// أعمدة تختفي على الشاشات الصغيرة حتى لا يزدحم الجدول
const HIDE_MD = { display: { xs: 'none', md: 'table-cell' } };
const HIDE_LG = { display: { xs: 'none', lg: 'table-cell' } };

const COLUMNS = [
  { key: 'favorite', label: '' },
  { key: 'rank', label: '#' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'change', label: 'Change', sortable: true },
  { key: 'volume', label: 'Volume', sortable: true, sx: HIDE_MD },
  { key: 'marketCap', label: 'Market Cap', sortable: true, sx: HIDE_LG },
  { key: 'trend', label: 'Trend', sx: HIDE_MD },
];

const SKELETON_ROWS = 8;

const headCellSx = {
  color: colors.textMuted,
  fontSize: 12,
  fontWeight: 600,
  borderBottom: `1px solid ${colors.border}`,
  py: 1.5,
};
const bodyCellSx = { borderBottom: 'none', fontSize: 13, py: 1.5 };

export default function StocksTable({
  rows, total, loading, sort, onSort, favorites, onToggleFavorite, emptyMessage,
}) {
  return (
    <Paper
      sx={{
        p: 3,
        animation: `${fadeInUp} 0.7s ${EASE} 450ms backwards`,
        [reduceMotion]: { animation: 'none' },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          All Stocks
        </Typography>
        {!loading && (
          <Typography variant="caption" color="text.secondary">
            Showing {rows.length} of {total}
          </Typography>
        )}
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small" aria-label="Stocks">
          <TableHead>
            <TableRow>
              {COLUMNS.map((column) => {
                const isSorted = sort.key === column.key;
                return (
                  <TableCell
                    key={column.key}
                    sortDirection={isSorted ? sort.direction : false}
                    sx={{ ...headCellSx, ...column.sx }}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={isSorted}
                        direction={isSorted ? sort.direction : 'asc'}
                        onClick={() => onSort(column.key)}
                        sx={{
                          color: colors.textMuted,
                          '&:hover': { color: colors.textPrimary },
                          '&.Mui-active': {
                            color: colors.textPrimary,
                            '& .MuiTableSortLabel-icon': { color: colors.primary },
                          },
                        }}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading &&
              Array.from({ length: SKELETON_ROWS }, (_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {COLUMNS.map((column) => (
                    <TableCell key={column.key} sx={{ ...bodyCellSx, ...column.sx }}>
                      <Skeleton animation="wave" width={column.key === 'name' ? 90 : 44} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={COLUMNS.length} sx={{ borderBottom: 'none', py: 6 }}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      color: colors.textMuted,
                      animation: `${fadeInUp} 0.5s ${EASE} backwards`,
                    }}
                  >
                    <SearchOffRoundedIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2">{emptyMessage}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              rows.map((row, index) => {
                const isFavorite = favorites.includes(row.id);
                const trendColor = row.change >= 0 ? colors.success : colors.error;
                return (
                  <TableRow
                    key={row.id}
                    sx={{
                      animation: `${fadeInUp} 0.5s ${EASE} ${index * 50}ms backwards`,
                      transition: 'background-color 0.3s',
                      '&:hover': { bgcolor: 'rgba(189, 52, 254, 0.08)' },
                      '& td:first-of-type': { borderRadius: '8px 0 0 8px' },
                      '& td:last-of-type': { borderRadius: '0 8px 8px 0' },
                      [reduceMotion]: { animation: 'none' },
                    }}
                  >
                    <TableCell sx={{ ...bodyCellSx, width: 48 }}>
                      <IconButton
                        size="small"
                        aria-label={
                          isFavorite
                            ? `Remove ${row.symbol} from favorites`
                            : `Add ${row.symbol} to favorites`
                        }
                        onClick={() => onToggleFavorite(row.id)}
                        sx={{
                          color: isFavorite ? colors.primary : colors.textMuted,
                          transition: 'color 0.3s',
                          animation: isFavorite ? `${pop} 0.45s ${EASE}` : 'none',
                          '&:hover': { color: colors.primary },
                          [reduceMotion]: { animation: 'none' },
                        }}
                      >
                        {isFavorite ? (
                          <StarRoundedIcon fontSize="small" />
                        ) : (
                          <StarBorderRoundedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, color: colors.textMuted }}>{index + 1}</TableCell>

                    <TableCell sx={bodyCellSx}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            display: 'grid',
                            placeItems: 'center',
                            borderRadius: '10px',
                            fontSize: 13,
                            fontWeight: 700,
                            color: colors.primary,
                            bgcolor: 'rgba(189, 52, 254, 0.12)',
                          }}
                        >
                          {row.symbol[0]}
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{row.symbol}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {row.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell sx={bodyCellSx}>{formatPrice(row.price)}</TableCell>

                    <TableCell sx={{ ...bodyCellSx, color: trendColor, fontWeight: 600 }}>
                      {formatChange(row.change)}
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, ...HIDE_MD }}>{formatCompact(row.volume)}</TableCell>

                    <TableCell sx={{ ...bodyCellSx, ...HIDE_LG }}>
                      {formatCompact(row.marketCap, { currency: true })}
                    </TableCell>

                    <TableCell sx={{ ...bodyCellSx, ...HIDE_MD }}>
                      <Box
                        sx={{
                          width: 110,
                          [`& .${lineClasses.line}`]: { stroke: trendColor, strokeWidth: 1.5 },
                        }}
                      >
                        <SparkLineChart data={row.history} width={110} height={36} curve="linear" />
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}