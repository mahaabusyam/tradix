import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, Fade } from '@mui/material';

import Sidebar from './Sidebar';
import MobileDrawer from './MobileDrawer';
import Header from './Header';
import { floatGlow, reduceMotion } from '../../theme/animations';

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  // عند الانتقال لصفحة جديدة نعود لأعلى الصفحة
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: -220,
          right: '12%',
          width: 640,
          height: 640,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(189, 52, 254, 0.2), transparent 65%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          animation: `${floatGlow} 14s ease-in-out infinite`,
          [reduceMotion]: { animation: 'none' },
        }}
      />

      <Sidebar />
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box
        component="main"
        sx={{ flex: 1, minWidth: 0, px: { xs: 2, md: 5 }, py: 4, position: 'relative', zIndex: 1 }}
      >
        <Header onMenuClick={() => setMobileOpen(true)} />

        {/* key={pathname}: عند تغيّر الرابط تُبنى الصفحة من جديد فتعمل أنيميشنها كاملاً */}
        <Fade in key={pathname} timeout={600}>
          <Box sx={{ mt: 5 }}>
            <Outlet />
          </Box>
        </Fade>
      </Box>
    </Box>
  );
}