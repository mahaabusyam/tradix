export const formatPrice = (value) =>
  `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// +2.37% للموجب، -0.44% للسالب
export const formatChange = (value) =>
  `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
// 48210000000000 يصبح 48.21T (مع $ إن طلبنا ذلك)
export const formatCompact = (value, { currency = false } = {}) => {
  const formatted = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
  return currency ? `$${formatted}` : formatted;
};
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
// "Harvey Specter" يصبح "HS"
export const getInitials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');