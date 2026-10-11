import { Link, useLocation } from 'react-router-dom';
import { Box, ButtonBase, Typography } from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import PersonOutlineIcon from '@mui/icons-material/BroadcastOnPersonalOutlined';

import { colors } from '../../theme/theme';
import { EASE, reduceMotion, fadeInUp, glowPulse, shimmer } from '../../theme/animations';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', path: '/', Icon: DashboardRoundedIcon },
  { key: 'market', label: 'Market', path: '/market', Icon: ShowChartIcon },
  { key: 'transaction', label: 'Transaction', path: '/transaction', Icon: SwapVertIcon },
  { key: 'setting', label: 'Setting', path: '/setting', Icon: PersonOutlineIcon },
];

const ITEM_HEIGHT = 44;
const ITEM_GAP = 8;

// onNavigate: دالة اختيارية تُستدعى عند الضغط (نستخدمها لإغلاق الـ Drawer)
export default function SidebarContent({ onNavigate, baseDelay = 300 }) {
  const { pathname } = useLocation();

  // الصفحة الرئيسية "/" تطابق فقط نفسها، والباقي يطابق بداية الرابط
  const activeIndex = NAV_ITEMS.findIndex(({ path }) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path)
  );

  return (
    <>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          letterSpacing: '-0.5px',
          background: `linear-gradient(90deg, ${colors.primary}, #eab4ff, ${colors.primary})`,
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: `${shimmer} 6s linear infinite`,
          [reduceMotion]: { animation: 'none' },
        }}
      >
        Tradix
      </Typography>

      <Box
        component="nav"
        sx={{
          position: 'relative',
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: `${ITEM_GAP}px`,
        }}
      >
        {/* المربع المنزلق: يختفي في صفحة 404 لأنها ليست ضمن القائمة */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: ITEM_HEIGHT,
            borderRadius: 1,
            background: `linear-gradient(90deg, ${colors.primary}, #d86bff)`,
            opacity: activeIndex === -1 ? 0 : 1,
            transform: `translateY(${Math.max(activeIndex, 0) * (ITEM_HEIGHT + ITEM_GAP)}px)`,
            transition: `transform 0.5s ${EASE}, opacity 0.3s`,
            animation: `${glowPulse} 3s ease-in-out infinite`,
            [reduceMotion]: { transition: 'none', animation: 'none' },
          }}
        />

        {NAV_ITEMS.map(({ key, label, path, Icon }, index) => {
          const isActive = index === activeIndex;
          return (
            <ButtonBase
              key={key}
              component={Link}
              to={path}
              onClick={onNavigate}
              sx={{
                position: 'relative',
                zIndex: 1,
                height: ITEM_HEIGHT,
                px: 1.75,
                gap: 1.5,
                justifyContent: 'flex-start',
                borderRadius: 1,
                fontSize: 14,
                fontWeight: 500,
                color: isActive ? colors.bgMain : colors.textMuted,
                transition: `color 0.3s ${EASE}`,
                animation: `${fadeInUp} 0.6s ${EASE} ${baseDelay + index * 100}ms both`,
                '& .nav-icon': { transition: `transform 0.3s ${EASE}` },
                '&:hover': {
                  color: isActive ? colors.bgMain : colors.textPrimary,
                  '& .nav-icon': { transform: 'translateX(3px) scale(1.1)' },
                },
                [reduceMotion]: { animation: 'none', transition: 'none' },
              }}
            >
              <Icon className="nav-icon" fontSize="small" />
              {label}
            </ButtonBase>
          );
        })}
      </Box>
    </>
  );
}