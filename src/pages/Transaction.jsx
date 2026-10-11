import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Button, Snackbar } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import SellRoundedIcon from '@mui/icons-material/SellRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';

import PageHeader from '../components/common/PageHeader';
import FilterToolbar from '../components/common/FilterToolbar';
import MarketStatCard from '../components/market/MarketStatCard';
import TransactionsTable from '../components/transactions/TransactionsTable';
import NewTransactionDialog from '../components/transactions/NewTransactionDialog';
import {
  fetchTransactions, selectAllTransactions, selectTransactionsState,
} from '../features/transactions/transactionsSlice';
import { formatPrice } from '../utils/format';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'buy', label: 'Buy' },
  { key: 'sell', label: 'Sell' },
  { key: 'pending', label: 'Pending' },
];

export default function Transaction() {
  const dispatch = useDispatch();
  const { status, error } = useSelector(selectTransactionsState);
  const allTransactions = useSelector(selectAllTransactions);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState({ key: 'date', direction: 'desc' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    const request = dispatch(fetchTransactions());
    return () => request.abort();
  }, [dispatch]);

  // الملخص يعتمد فقط على العمليات المكتملة
  const summary = useMemo(() => {
    const sumOf = (type) =>
      allTransactions
        .filter((item) => item.status === 'completed' && item.type === type)
        .reduce((total, item) => total + item.quantity * item.price, 0);
    const bought = sumOf('buy');
    const sold = sumOf('sell');
    return { bought, sold, net: bought - sold, count: allTransactions.length };
  }, [allTransactions]);

  const visibleRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = allTransactions
      .map((item) => ({ ...item, total: item.quantity * item.price }))
      .filter((item) => {
        if (
          term &&
          !item.symbol.toLowerCase().includes(term) &&
          !item.name.toLowerCase().includes(term)
        ) {
          return false;
        }
        if (filter === 'buy' || filter === 'sell') return item.type === filter;
        if (filter === 'pending') return item.status === 'pending';
        return true;
      });

    const factor = sort.direction === 'asc' ? 1 : -1;
    return filtered.sort((a, b) => {
      const first = a[sort.key];
      const second = b[sort.key];
      if (typeof first === 'string') return first.localeCompare(second) * factor;
      return (first - second) * factor;
    });
  }, [allTransactions, search, filter, sort]);

  // عند تغيير البحث أو الفلتر نرجع للصفحة الأولى
  const handleSearch = (value) => {
    setSearch(value);
    setPage(0);
  };
  const handleFilter = (value) => {
    setFilter(value);
    setPage(0);
  };
  const handleSort = (key) => {
    setSort((previous) =>
      previous.key === key
        ? { key, direction: previous.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'desc' }
    );
  };

  const isLoading = (status === 'idle' || status === 'loading') && allTransactions.length === 0;
  const hasFailed = status === 'failed' && allTransactions.length === 0;

  return (
    <>
      <PageHeader
        title="Transaction"
        subtitle="Your trading history"
        action={
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => setDialogOpen(true)}
          >
            New Transaction
          </Button>
        }
      />

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
            label="Total Bought"
            Icon={AddShoppingCartRoundedIcon}
            loading={isLoading}
            amount={summary.bought}
            format={formatPrice}
          />
          <MarketStatCard
            index={1}
            label="Total Sold"
            Icon={SellRoundedIcon}
            loading={isLoading}
            amount={summary.sold}
            format={formatPrice}
          />
          <MarketStatCard
            index={2}
            label="Net Position"
            Icon={AccountBalanceWalletRoundedIcon}
            loading={isLoading}
            amount={summary.net}
            format={formatPrice}
          />
          <MarketStatCard
            index={3}
            label="Transactions"
            Icon={ReceiptLongRoundedIcon}
            loading={isLoading}
            amount={summary.count}
            format={(value) => String(Math.round(value))}
          />
        </Box>

        <FilterToolbar
          search={search}
          onSearch={handleSearch}
          placeholder="Search by name or symbol"
          filters={FILTERS}
          filter={filter}
          onFilter={handleFilter}
        />

        {hasFailed && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => dispatch(fetchTransactions({ force: true }))}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        <TransactionsTable
          rows={visibleRows}
          total={allTransactions.length}
          loading={isLoading}
          sort={sort}
          onSort={handleSort}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={(value) => {
            setRowsPerPage(value);
            setPage(0);
          }}
          emptyMessage="No transactions match your search."
        />
      </Box>

      <NewTransactionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={() => {
          setToastOpen(true);
          setPage(0);
          setSort({ key: 'date', direction: 'desc' }); // لتظهر العملية الجديدة في الأعلى
        }}
      />

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setToastOpen(false)}>
          Transaction added
        </Alert>
      </Snackbar>
    </>
  );
}