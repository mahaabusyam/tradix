import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/BroadcastOnPersonalOutlined';

import { selectProfile } from '../../features/settings/settingsSlice';
import { colors } from '../../theme/theme';
import { EASE, fadeInDown, reduceMotion } from '../../theme/animations';
import { getInitials } from '../../utils/format';

export default function Header({ onMenuClick }) {
  const { name } = useSelector(selectProfile);
  const initials = getInitials(name);

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        animation: `${fadeInDown} 0.7s ${EASE} 150ms both`,
        [reduceMotion]: { animation: 'none' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton
          aria-label="Open menu"
          edge="start"
          onClick={onMenuClick}
          sx={{
            display: { xs: 'inline-flex', md: 'none' },
            color: colors.textPrimary,
            transition: 'background-color 0.3s',
            '&:hover': { bgcolor: 'rgba(189, 52, 254, 0.14)' },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Welcome back!
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          {name}
        </Typography>
        <Avatar
          component={Link}
          to="/setting"
          aria-label="Open settings"
          sx={{
            width: 30,
            height: 30,
            fontSize: 12,
            fontWeight: 700,
            textDecoration: 'none',
            bgcolor: 'rgba(189, 52, 254, 0.18)',
            color: colors.primary,
            transition: `transform 0.3s ${EASE}, box-shadow 0.3s ${EASE}`,
            '&:hover': {
              transform: 'scale(1.12)',
              boxShadow: '0 0 14px rgba(189, 52, 254, 0.5)',
            },
          }}
        >
          {initials || <PersonOutlineIcon sx={{ fontSize: 16 }} />}
        </Avatar>
      </Box>
    </Box>
  );
}