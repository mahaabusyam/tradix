import { Drawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { colors } from '../../theme/theme';
import { EASE } from '../../theme/animations';
import SidebarContent from './SidebarContent';

export default function MobileDrawer({ open, onClose }) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{ display: { xs: 'block', md: 'none' } }}
      slotProps={{
        backdrop: {
          sx: { backdropFilter: 'blur(4px)', bgcolor: 'rgba(0, 0, 0, 0.55)' },
        },
        paper: {
          sx: {
            width: 240,
            px: 2.5,
            py: 4,
            bgcolor: colors.bgSidebar,
            border: 'none',
            borderRight: `1px solid ${colors.border}`,
            boxShadow: '0 0 40px rgba(189, 52, 254, 0.15)',
          },
        },
      }}
    >
      <IconButton
        aria-label="Close menu"
        onClick={onClose}
        size="small"
        sx={{
          position: 'absolute',
          top: 14,
          right: 14,
          color: colors.textMuted,
          transition: `transform 0.4s ${EASE}, color 0.3s`,
          '&:hover': { color: colors.textPrimary, transform: 'rotate(90deg)' },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <SidebarContent onNavigate={onClose} baseDelay={200} />
    </Drawer>
  );
}