import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Button, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { fetchPortfolio, selectPortfolio } from '../../features/portfolio/portfolioSlice';
import { EASE, fadeInUp, reduceMotion } from '../../theme/animations';
import StockCard from './StockCard';
import StockCardSkeleton from './StockCardSkeleton';
import { selectRefreshMs } from '../../features/settings/settingsSlice';


const SKELETON_COUNT = 3;

export default function PortfolioSection() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(selectPortfolio);
  const refreshMs = useSelector(selectRefreshMs);

  useEffect(() => {
  let pending = dispatch(fetchPortfolio());

  // refreshMs = 0 يعني أن المستخدم أوقف التحديث الحي
  const intervalId =
    refreshMs > 0
      ? setInterval(() => {
          if (document.visibilityState !== 'visible') return;
          pending = dispatch(fetchPortfolio({ force: true }));
        }, refreshMs)
      : null;

  return () => {
    if (intervalId) clearInterval(intervalId);
    pending.abort();
  };
}, [dispatch, refreshMs]);
  
  const isLoading = status === 'loading' && items.length === 0;
  const hasFailed = status === 'failed' && items.length === 0;

  return (
    <Box component="section">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 500,
            animation: `${fadeInUp} 0.6s ${EASE} backwards`,
            [reduceMotion]: { animation: 'none' },
          }}
        >
          Your Stock Portfolio
        </Typography>
        <Button
          color="primary"
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
            <Button color="inherit" size="small" onClick={() => dispatch(fetchPortfolio({ force: true }))}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        }}
      >
        {isLoading &&
          Array.from({ length: SKELETON_COUNT }, (_, i) => <StockCardSkeleton key={i} />)}

        {items.map((stock, index) => (
          <StockCard key={stock.id} stock={stock} index={index} />
        ))}
      </Box>
    </Box>
  );
}