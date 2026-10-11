import { Box } from '@mui/material';
import PortfolioSection from '../components/portfolio/PortfolioSection';
import InvestmentChart from '../components/investment/InvestmentChart';
import StockTable from '../components/market/StockTable';

export default function Dashboard() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <PortfolioSection />

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          // minmax(0, ...) يمنع الرسم من توسيع العمود أكثر من حصته
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(0, 1fr)' },
        }}
      >
        <InvestmentChart />
        <StockTable />
      </Box>
    </Box>
  );
}