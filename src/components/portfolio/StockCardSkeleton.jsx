import { Box, Paper, Skeleton } from '@mui/material';

export default function StockCardSkeleton() {
  return (
    <Paper sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Skeleton animation="wave" width={60} />
          <Skeleton animation="wave" width={110} height={36} />
        </Box>
        <Box>
          <Skeleton animation="wave" width={50} />
          <Skeleton animation="wave" width={44} />
        </Box>
      </Box>
      <Skeleton animation="wave" variant="rounded" height={90} sx={{ mt: 2 }} />
    </Paper>
  );
}