import { createTheme } from '@mui/material/styles';

// ألوان التصميم في مكان واحد، فإذا أردتِ تغيير لون تعدلينه هنا فقط
export const colors = {
  primary: '#bd34fe',
  bgMain: '#121214',
  bgCard: '#1e1e24',
  border: 'rgba(255, 255, 255, 0.06)',
  textPrimary: '#ffffff',
  textMuted: '#9e9eaf',
  success: '#22c55e',
  error: '#ef4444',
  bgSidebar: '#0f0f12',
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: colors.primary },
    success: { main: colors.success },
    error: { main: colors.error },
    background: {
      default: colors.bgMain,
      paper: colors.bgCard,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textMuted,
    },
    divider: colors.border,
  },

  typography: {
    fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },

  shape: { borderRadius: 12 },

  components: {
    // خلفية الصفحة مع التوهج البنفسجي الظاهر في التصميم
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.bgMain,
          backgroundImage:
            'radial-gradient(circle at 60% 0%, rgba(189, 52, 254, 0.15), transparent 45%)',
          backgroundAttachment: 'fixed',
        },
      },
    },

    // كل الكروت (Paper) تأخذ هذا الشكل تلقائياً
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // MUI يضيف تدرجاً في الوضع الداكن، نلغيه
          backgroundColor: colors.bgCard,
          border: `1px solid ${colors.border}`,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.35)',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          boxShadow: '0 0 20px rgba(189, 52, 254, 0.35)', // توهج خفيف
          '&:hover': { boxShadow: '0 0 28px rgba(189, 52, 254, 0.55)' },
        },
      },
    },
  },
});

export default theme;