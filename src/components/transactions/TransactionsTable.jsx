import {
  Box, Chip, Paper, Skeleton, Table, TableBody, TableCell, TableHead,
  TablePagination, TableRow, TableSortLabel, Typography,
} from '@mui/material';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';

import { colors } from '../../theme/theme';
import { EASE, fadeInUp, reduceMotion } from '../../theme/animations';
import { formatDate, formatPrice, formatTime } from '../../utils/format';

const HIDE_SM = { display: { xs: 'none', sm: 'table-cell' } };
const HIDE_MD = { display: { xs: 'none', md: 'table-cell' } };

const COLUMNS = [
  { key: 'asset', label: 'Asset' },
  { key: 'type', label: 'Type' },
  { key: 'quantity', label: 'Qty', sx: HIDE_SM },
  { key: 'price', label: 'Price', sx: HIDE_MD },
  { key: 'total', label: 'Total', sortable: true },
  { key: 'date', label: 'Date', sortable: true, sx: HIDE_SM },
  { key: 'status', label: 'Status' },
];

const STATUS_COLORS = {
  completed: colors.success,
  pending: '#f59e0b',
  failed: colors.error,
};

const SKELETON_ROWS = 8;

const headCellSx = {
  color: colors.textMuted,
  fontSize: 12,
  fontWeight: 600,
  borderBottom: `1px solid ${colors.border}`,
  py: 1.5,
};
const bodyCellSx = { borderBottom: 'none', fontSize: 13, py: 1.5 };

// لون + شفافية: "#22c55e" مع "1f" في آخره يعطي نفس اللون بخلفية شفافة
function ColoredChip({ label, color }) {
  return (
    <Chip
      size="small"
      label={label}
      sx={{
        fontWeight: 600,
        textTransform: 'capitalize',
        color,
        bgcolor: `${color}1f`,
        border: `1px solid ${color}40`,
      }}
    />
  );
}

export default function TransactionsTable({
  rows, total, loading, sort, onSort, page, rowsPerPage,
  onPageChange, onRowsPerPageChange, emptyMessage,
}) {
  const pageRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
          Transaction History
        </Typography>
        {!loading && (
          <Typography variant="caption" color="text.secondary">
            {rows.length} of {total}
          </Typography>
        )}
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small" aria-label="Transaction history">
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
                      <Skeleton animation="wave" width={column.key === 'asset' ? 90 : 48} />
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
                    <ReceiptLongRoundedIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="body2">{emptyMessage}</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              pageRows.map((row, index) => (
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

                  <TableCell sx={bodyCellSx}>
                    <ColoredChip
                      label={row.type}
                      color={row.type === 'buy' ? colors.success : colors.error}
                    />
                  </TableCell>

                  <TableCell sx={{ ...bodyCellSx, ...HIDE_SM }}>{row.quantity}</TableCell>
                  <TableCell sx={{ ...bodyCellSx, ...HIDE_MD }}>{formatPrice(row.price)}</TableCell>
                  <TableCell sx={{ ...bodyCellSx, fontWeight: 600 }}>{formatPrice(row.total)}</TableCell>

                  <TableCell sx={{ ...bodyCellSx, ...HIDE_SM }}>
                    <Typography sx={{ fontSize: 13 }}>{formatDate(row.date)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatTime(row.date)}
                    </Typography>
                  </TableCell>

                  <TableCell sx={bodyCellSx}>
                    <ColoredChip label={row.status} color={STATUS_COLORS[row.status]} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>

      {!loading && rows.length > 0 && (
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[8, 16]}
          onPageChange={(_, nextPage) => onPageChange(nextPage)}
          onRowsPerPageChange={(event) => onRowsPerPageChange(Number(event.target.value))}
          sx={{
            color: colors.textMuted,
            borderTop: `1px solid ${colors.border}`,
            mt: 1,
            '& .MuiTablePagination-selectIcon': { color: colors.textMuted },
            '& .MuiIconButton-root.Mui-disabled': { opacity: 0.3 },
          }}
        />
      )}
    </Paper>
  );
}