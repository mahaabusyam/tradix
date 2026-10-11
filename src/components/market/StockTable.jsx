import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert, Box, Button, Paper, Skeleton, Table, TableBody,
  TableCell, TableHead, TableRow, Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { fetchMarket, selectMarket } from '../../features/market/marketSlice';
import { colors } from '../../theme/theme';
import { EASE, fadeInUp, reduceMotion } from '../../theme/animations';
import { formatChange, formatPrice } from '../../utils/format';

const COLUMNS = ['#', 'Name', 'Price', 'Status'];
const SKELETON_ROWS = 5;

// تنسيق الخلايا في مكان واحد حتى لا نكرره في كل خلية
const headCellSx = {
  color: colors.textMuted,
  fontSize: 12,
  fontWeight: 600,
  borderBottom: 'none',
  py: 1.5,
};
const bodyCellSx = { borderBottom: 'none', fontSize: 13, py: 2 };

export default function StockTable() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(selectMarket);

  useEffect(() => {
    const request = dispatch(fetchMarket());
    return () => request.abort(); // نلغي الطلب إن خرج المكون قبل وصوله
  }, [dispatch]);

  const isLoading = status === 'loading' && items.length === 0;
  const hasFailed = status === 'failed' && items.length === 0;

  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        animation: `${fadeInUp} 0.7s ${EASE} 400ms backwards`,
        [reduceMotion]: { animation: 'none' },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Stock Chart
        </Typography>
        <Button
          size="small"
          endIcon={<ArrowForwardIcon fontSize="small" />}
          sx={{
            color: 'primary.light',
            '& .MuiButton-endIcon': { transition: `transform 0.3s ${EASE}` },
            '&:hover .MuiButton-endIcon': { transform: 'translateX(5px)' },
          }}
        >
          View All
        </Button>
      </Box>

      {hasFailed && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => dispatch(fetchMarket({ force: true }))}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* overflowX يسمح بالتمرير الأفقي على الشاشات الضيقة بدل كسر التصميم */}
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small" aria-label="Stock chart">
          <TableHead>
            <TableRow>
              {COLUMNS.map((column) => (
                <TableCell key={column} sx={headCellSx}>
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading &&
              Array.from({ length: SKELETON_ROWS }, (_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {COLUMNS.map((column) => (
                    <TableCell key={column} sx={bodyCellSx}>
                      <Skeleton animation="wave" width={column === '#' ? 12 : 48} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {items.map((row, index) => (
              <TableRow
                key={row.id}
                sx={{
                  // كل صف يظهر متأخراً 90ms عن الذي قبله
                  animation: `${fadeInUp} 0.6s ${EASE} ${500 + index * 90}ms backwards`,
                  transition: 'background-color 0.3s',
                  '&:hover': { bgcolor: 'rgba(189, 52, 254, 0.08)' },
                  // حواف دائرية للصف عند تمرير الماوس
                  '& td:first-of-type': { borderRadius: '8px 0 0 8px' },
                  '& td:last-of-type': { borderRadius: '0 8px 8px 0' },
                  [reduceMotion]: { animation: 'none' },
                }}
              >
                <TableCell sx={bodyCellSx}>{index + 1}</TableCell>
                <TableCell sx={bodyCellSx}>{row.symbol}</TableCell>
                <TableCell sx={bodyCellSx}>{formatPrice(row.price)}</TableCell>
                <TableCell
                  sx={{ ...bodyCellSx, color: row.change >= 0 ? colors.success : colors.error }}
                >
                  {formatChange(row.change)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}