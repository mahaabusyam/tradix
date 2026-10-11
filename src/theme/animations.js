import { keyframes } from '@mui/material/styles';

// منحنى حركة ناعم (يبدأ بسرعة وينتهي ببطء) يعطي إحساساً احترافياً
export const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

// لمن يفعّل "تقليل الحركة" في نظامه، نلغي الأنيميشن احتراماً له
export const reduceMotion = '@media (prefers-reduced-motion: reduce)';

export const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const fadeInDown = keyframes`
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-28px); }
  to   { opacity: 1; transform: translateX(0); }
`;

// نبض توهج للعنصر النشط
export const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 14px rgba(189, 52, 254, 0.35); }
  50%      { box-shadow: 0 0 28px rgba(189, 52, 254, 0.7); }
`;

// حركة بطيئة للتوهج في الخلفية
export const floatGlow = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50%      { transform: translate3d(-50px, 40px, 0) scale(1.12); }
`;

// لمعان متحرك على الشعار
export const shimmer = keyframes`
  from { background-position: 0% 50%; }
  to   { background-position: 200% 50%; }
`;
// كشف الرسم من اليسار لليمين
export const revealRight = keyframes`
  from { clip-path: inset(0 100% 0 0); }
  to   { clip-path: inset(0 0 0 0); }
`;
// قفزة صغيرة لأيقونة النجمة عند التفعيل
export const pop = keyframes`
  0%   { transform: scale(1); }
  40%  { transform: scale(1.35) rotate(-12deg); }
  100% { transform: scale(1); }
`;