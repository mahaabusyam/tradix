import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Button } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';

import PageHeader from '../components/common/PageHeader';
import MarketStatCard from '../components/market/MarketStatCard';
import StocksTable from '../components/market/StocksTable';
import {
  fetchMarketStats, fetchStocks, selectStocks, toggleFavorite,
} from '../features/stocks/stocksSlice';
import { formatCompact } from '../utils/format';
import FilterToolbar from '../components/common/FilterToolbar';
import { selectRefreshMs } from '../features/settings/settingsSlice';

const MARKET_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'gainers', label: 'Gainers' },
  { key: 'losers', label: 'Losers' },
  { key: 'favorites', label: 'Favorites' },
];

export default function Market() {
  const dispatch = useDispatch();
  const { items, status, error, stats, statsStatus, favorites } = useSelector(selectStocks);
  const refreshMs = useSelector(selectRefreshMs);

  // حالة الواجهة (بحث، فلتر، ترتيب) محلية لأنها لا تهم بقية الصفحات
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState({ key: 'marketCap', direction: 'desc' });

  useEffect(() => {
  let pending = dispatch(fetchStocks());
  const statsRequest = dispatch(fetchMarketStats());

  const intervalId =
    refreshMs > 0
      ? setInterval(() => {
          if (document.visibilityState !== 'visible') return;
          pending = dispatch(fetchStocks({ force: true }));
        }, refreshMs)
      : null;

  return () => {
    if (intervalId) clearInterval(intervalId);
    pending.abort();
    statsRequest.abort();
  };
}, [dispatch, refreshMs]);

  // أفضل وأسوأ سهم نحسبهما من البيانات بدل طلب إضافي
  const { topGainer, topLoser } = useMemo(() => {
    if (items.length === 0) return {};
    return {
      topGainer: items.reduce((best, stock) => (stock.change > best.change ? stock : best)),
      topLoser: items.reduce((worst, stock) => (stock.change < worst.change ? stock : worst)),
    };
  }, [items]);

  // الفلترة ثم الترتيب، وتُعاد فقط عند تغيّر أحد المدخلات
  const visibleRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = items.filter((stock) => {
      if (
        term &&
        !stock.symbol.toLowerCase().includes(term) &&
        !stock.name.toLowerCase().includes(term)
      ) {
        return false;
      }
      if (filter === 'gainers') return stock.change > 0;
      if (filter === 'losers') return stock.change < 0;
      if (filter === 'favorites') return favorites.includes(stock.id);
      return true;
    });

    const factor = sort.direction === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const first = a[sort.key];
      const second = b[sort.key];
      if (typeof first === 'string') return first.localeCompare(second) * factor;
      return (first - second) * factor;
    });
  }, [items, search, filter, favorites, sort]);

  const handleSort = (key) => {
    setSort((previous) =>
      previous.key === key
        ? { key, direction: previous.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: key === 'name' ? 'asc' : 'desc' }
    );
  };

  const isStatsLoading = statsStatus === 'idle' || statsStatus === 'loading';
  const isLoading = (status === 'idle' || status === 'loading') && items.length === 0;
  const hasFailed = status === 'failed' && items.length === 0;

  const emptyMessage =
    filter === 'favorites' && favorites.length === 0
      ? 'No favorites yet. Tap the star next to any stock to add it.'
      : 'No stocks match your search.';

  return (
    <>
      <PageHeader title="Market" subtitle="Live prices and market statistics" />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          }}
        >
          <MarketStatCard
            index={0}
            label="Market Cap"
            Icon={PublicIcon}
            loading={isStatsLoading}
            amount={stats?.marketCap.value}
            format={(value) => formatCompact(value, { currency: true })}
            change={stats?.marketCap.change}
          />
          <MarketStatCard
            index={1}
            label="24h Volume"
            Icon={BarChartRoundedIcon}
            loading={isStatsLoading}
            amount={stats?.volume.value}
            format={(value) => formatCompact(value, { currency: true })}
            change={stats?.volume.change}
          />
          <MarketStatCard
            index={2}
            label="Top Gainer"
            Icon={TrendingUpRoundedIcon}
            loading={isLoading}
            text={topGainer?.symbol}
            change={topGainer?.change}
          />
          <MarketStatCard
            index={3}
            label="Top Loser"
            Icon={TrendingDownRoundedIcon}
            loading={isLoading}
            text={topLoser?.symbol}
            change={topLoser?.change}
          />
        </Box>

        <FilterToolbar
  search={search}
  onSearch={setSearch}
  placeholder="Search by name or symbol"
  filters={MARKET_FILTERS}
  filter={filter}
  onFilter={setFilter}
/>

        {hasFailed && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => dispatch(fetchStocks({ force: true }))}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        <StocksTable
          rows={visibleRows}
          total={items.length}
          loading={isLoading}
          sort={sort}
          onSort={handleSort}
          favorites={favorites}
          onToggleFavorite={(id) => dispatch(toggleFavorite(id))}
          emptyMessage={emptyMessage}
        />
      </Box>
    </>
  );
}