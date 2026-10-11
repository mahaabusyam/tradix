import { useDispatch, useSelector } from 'react-redux';
import { Switch } from '@mui/material';

import SettingRow from './SettingRow';
import { selectSettings, toggleNotification } from '../../features/settings/settingsSlice';

const ITEMS = [
  { key: 'priceAlerts', title: 'Price alerts', description: 'When a favorite stock moves more than 5%' },
  { key: 'orderUpdates', title: 'Order updates', description: 'Status changes for your transactions' },
  { key: 'weeklyReport', title: 'Weekly report', description: 'A summary of your portfolio every Monday' },
];

export default function NotificationsForm() {
  const dispatch = useDispatch();
  const { notifications } = useSelector(selectSettings);

  return (
    <>
      {ITEMS.map(({ key, title, description }) => (
        <SettingRow key={key} title={title} description={description}>
          <Switch
            checked={notifications[key]}
            onChange={() => dispatch(toggleNotification(key))}
            slotProps={{ input: { 'aria-label': title } }}
          />
        </SettingRow>
      ))}
    </>
  );
}