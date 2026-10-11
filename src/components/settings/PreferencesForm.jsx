import { useDispatch, useSelector } from 'react-redux';
import { MenuItem, TextField } from '@mui/material';

import SettingRow from './SettingRow';
import { selectSettings, setRefreshSeconds } from '../../features/settings/settingsSlice';
import { selectChart, setRange } from '../../features/chart/chartSlice';

const REFRESH_OPTIONS = [
  { value: 0, label: 'Off' },
  { value: 15, label: 'Every 15 sec' },
  { value: 30, label: 'Every 30 sec' },
  { value: 60, label: 'Every minute' },
];

const RANGE_OPTIONS = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

export default function PreferencesForm() {
  const dispatch = useDispatch();
  const { refreshSeconds } = useSelector(selectSettings);
  const { range } = useSelector(selectChart);

  return (
    <>
      <SettingRow title="Live refresh" description="How often prices update while a page is open">
        <TextField
          select
          size="small"
          value={refreshSeconds}
          onChange={(event) => dispatch(setRefreshSeconds(Number(event.target.value)))}
          sx={{ minWidth: 150 }}
        >
          {REFRESH_OPTIONS.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
      </SettingRow>

      {/* نفس الـ state الذي تتحكم فيه أزرار Day/Week/Month في الداشبورد */}
      <SettingRow title="Default chart range" description="Used by the investment chart on the dashboard">
        <TextField
          select
          size="small"
          value={range}
          onChange={(event) => dispatch(setRange(event.target.value))}
          sx={{ minWidth: 150 }}
        >
          {RANGE_OPTIONS.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
      </SettingRow>
    </>
  );
}