import { createBrowserRouter } from 'react-router-dom';

import DashboardLayout from '../components/layout/DashboardLayout';
import Dashboard from '../pages/Dashboard';
import Market from '../pages/Market';
import Transaction from '../pages/Transaction';
import Setting from '../pages/Setting';
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />, // الإطار الثابت (Sidebar + Header)
    children: [
      { index: true, element: <Dashboard /> }, // الرابط "/"
      { path: 'market', element: <Market /> },
      { path: 'transaction', element: <Transaction /> },
      { path: 'setting', element: <Setting /> },
      { path: '*', element: <NotFound /> }, // أي رابط آخر
    ],
  },
]);