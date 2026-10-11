import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Paper, Skeleton, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

import { fetchInvestment, selectChart, setRange } from '../../features/chart/chartSlice';
import { colors } from '../../theme/theme';
import { EASE, fadeInUp, reduceMotion, revealRight } from '../../theme/animations';
import { formatPrice } from '../../utils/format';
import useCountUp from '../../hooks/useCountUp';
import RangeToggle from './RangeToggle';

const CHART_HEIGHT = 320;

export default function InvestmentChart() {
  const dispatch = useDispatch();
  const { range, byRange, status, error } = useSelector(selectChart);
  const data = byRange[range];
  const animatedTotal = useCountUp(data?.total ?? 0);

  // نجلب بيانات النطاق الحالي، ونلغي الطلب إن تغيّر النطاق قبل وصوله
  useEffect(() => {
    const request = dispatch(fetchInvestment(range));
    return () => request.abort();
  }, [dispatch, range]);

  // نحسب القيم مرة واحدة فقط عند تغيّر البيانات
  const chartData = useMemo(() => {
    if (!data) return null;
    const values = data.points.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.15 || 1; // مسافة تجعل الخط لا يلتصق بالحواف
    return {
      labels: data.points.map((point) => point.label),
      values,
      yMin: min - padding,
      yMax: max + padding,
    };
  }, [data]);

  const hasFailed = status === 'failed' && !data;

  return (
    <Paper
      sx={{
        p: 3,
        animation: `${fadeInUp} 0.7s ${EASE} 300ms backwards`,
        [reduceMotion]: { animation: 'none' },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography color="text.secondary">Total Investment</Typography>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            {formatPrice(animatedTotal)}
          </Typography>
        </Box>
        <RangeToggle value={range} onChange={(next) => dispatch(setRange(next))} />
      </Box>

      <Box sx={{ mt: 3 }}>
        {hasFailed && <Alert severity="error">{error}</Alert>}

        {!data && !hasFailed && (
          <Skeleton animation="wave" variant="rounded" height={CHART_HEIGHT} />
        )}

        {chartData && (
          // key={range} يعيد تشغيل أنيميشن الكشف عند كل تبديل نطاق
      <Box
            key={range}
            sx={{
              animation: `${revealRight} 1.2s ${EASE} backwards`,
              '& .MuiLineElement-root': { stroke: '#d86bff', strokeWidth: 2 },
              '& .MuiAreaElement-root': { fill: 'rgba(189, 52, 254, 0.12)' },
              '& .MuiChartsGrid-line': { stroke: 'rgba(255, 255, 255, 0.06)' },
              '& .MuiChartsAxis-left': { display: 'none' },
              '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': { display: 'none' },
              '& .MuiChartsAxis-tickLabel': { fill: colors.textPrimary, fontSize: 13 },
              // النقاط مخفية، وتظهر فقط النقطة التي نقف عليها
              '& .MuiMarkElement-root': {
                opacity: 0,
                fill: colors.primary,
                stroke: colors.primary,
                transition: 'opacity 0.2s',
              },
              '& .MuiMarkElement-highlighted': { opacity: 1 },
              [reduceMotion]: { animation: 'none' },
            }}
          >
            <LineChart
              height={CHART_HEIGHT}
              margin={{ top: 10, right: 10, bottom: 30, left: 10 }}
              xAxis={[{ scaleType: 'point', data: chartData.labels }]}
              yAxis={[{ min: chartData.yMin, max: chartData.yMax, position: 'none' }]}
              series={[
                {
                  data: chartData.values,
                  area: true,
                  curve: 'linear',
                  showMark: true,
                  valueFormatter: (value) => (value == null ? '' : formatPrice(value)),
                },
              ]}
              grid={{ horizontal: true }}
              axisHighlight={{ x: 'line' }}
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
}