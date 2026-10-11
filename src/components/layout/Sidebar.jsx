import { Box } from '@mui/material';
import { colors } from '../../theme/theme';
import { EASE, reduceMotion, slideInLeft } from '../../theme/animations';
import SidebarContent from './SidebarContent';

export default function Sidebar() {
  return (
    <Box
      component="aside"
      sx={{
        width: 220,
        flexShrink: 0,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        px: 2.5,
        py: 4,
        bgcolor: colors.bgSidebar,
        borderRight: `1px solid ${colors.border}`,
        position: 'relative',
        zIndex: 2,
        animation: `${slideInLeft} 0.8s ${EASE} both`,
        [reduceMotion]: { animation: 'none' },
      }}
    >
      <SidebarContent />
    </Box>
  );
}