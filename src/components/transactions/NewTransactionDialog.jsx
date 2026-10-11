import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert, Box, Button, ButtonBase, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, Grow, MenuItem, TextField, Typography,
} from '@mui/material';

import { fetchStocks, selectStocks } from '../../features/stocks/stocksSlice';
import { createTransaction } from '../../features/transactions/transactionsSlice';
import { colors } from '../../theme/theme';
import { EASE } from '../../theme/animations';
import { formatPrice } from '../../utils/format';
import useCountUp from '../../hooks/useCountUp';

const TYPES = ['buy', 'sell'];

// النموذج مكوّن مستقل داخل الـ Dialog: عند الإغلاق يُحذف من الشاشة فتُمسح حالته تلقائياً
function TransactionForm({ onClose, onCreated }) {
  const dispatch = useDispatch();
  const { items: stocks } = useSelector(selectStocks);

  const [symbol, setSymbol] = useState('');
  const [type, setType] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // نحتاج قائمة الأسهم (من الكاش غالباً)، ونلغي الطلب إن أُغلقت النافذة
  useEffect(() => {
    const request = dispatch(fetchStocks());
    return () => request.abort();
  }, [dispatch]);

  const stock = stocks.find((item) => item.symbol === symbol);
  const quantityNumber = Number(quantity);
  const quantityValid = Number.isInteger(quantityNumber) && quantityNumber >= 1;
  const total = stock && quantityValid ? stock.price * quantityNumber : 0;
  const animatedTotal = useCountUp(total, 500);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!stock || !quantityValid) return; // نوقف الإرسال ونعرض أخطاء الحقول

    setSubmitting(true);
    setSubmitError('');
    try {
      await dispatch(
        createTransaction({
          symbol: stock.symbol,
          name: stock.name,
          type,
          quantity: quantityNumber,
          price: stock.price,
        })
      ).unwrap(); // unwrap يحوّل الفشل إلى استثناء نلتقطه بـ catch
      onCreated();
      onClose();
    } catch (error) {
      setSubmitError(typeof error === 'string' ? error : 'Something went wrong');
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <DialogTitle sx={{ fontWeight: 600 }}>New Transaction</DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '8px !important' }}>
        <Box role="group" aria-label="Transaction type" sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          {TYPES.map((option) => {
            const selected = type === option;
            const color = option === 'buy' ? colors.success : colors.error;
            return (
              <ButtonBase
                key={option}
                aria-pressed={selected}
                onClick={() => setType(option)}
                sx={{
                  height: 44,
                  borderRadius: '10px',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  color: selected ? color : colors.textMuted,
                  border: `1px solid ${selected ? color : colors.border}`,
                  bgcolor: selected ? `${color}1f` : 'transparent',
                  boxShadow: selected ? `0 0 16px ${color}40` : 'none',
                  transition: `all 0.3s ${EASE}`,
                  '&:hover': { borderColor: color },
                }}
              >
                {option}
              </ButtonBase>
            );
          })}
        </Box>

        <TextField
          select
          label="Stock"
          value={symbol}
          onChange={(event) => setSymbol(event.target.value)}
          error={submitted && !stock}
          helperText={submitted && !stock ? 'Please choose a stock' : ' '}
          fullWidth
        >
          {stocks.map((item) => (
            <MenuItem key={item.id} value={item.symbol}>
              {item.symbol} · {item.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          error={submitted && !quantityValid}
          helperText={submitted && !quantityValid ? 'Enter a whole number, 1 or more' : ' '}
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
          fullWidth
        />

        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            bgcolor: 'rgba(189, 52, 254, 0.08)',
            border: '1px solid rgba(189, 52, 254, 0.2)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Market price
            </Typography>
            <Typography variant="body2">{stock ? formatPrice(stock.price) : '—'}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Estimated total
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>{formatPrice(animatedTotal)}</Typography>
          </Box>
        </Box>

        {submitError && <Alert severity="error">{submitError}</Alert>}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ color: colors.textMuted }}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {submitting ? 'Submitting' : 'Confirm'}
        </Button>
      </DialogActions>
    </Box>
  );
}

export default function NewTransactionDialog({ open, onClose, onCreated }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slots={{ transition: Grow }}
      slotProps={{
        backdrop: { sx: { backdropFilter: 'blur(4px)' } },
        paper: {
          sx: {
            borderRadius: '16px',
            backgroundImage: 'none',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(189, 52, 254, 0.15)',
          },
        },
      }}
    >
      <TransactionForm onClose={onClose} onCreated={onCreated} />
    </Dialog>
  );
}