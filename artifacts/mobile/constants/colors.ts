const colors = {
  light: {
    text: '#E2E8F0',
    tint: '#00E5C3',

    background: '#070D1B',
    foreground: '#E2E8F0',

    card: '#0D1829',
    cardForeground: '#E2E8F0',

    primary: '#00E5C3',
    primaryForeground: '#070D1B',

    secondary: '#1A2540',
    secondaryForeground: '#E2E8F0',

    muted: '#1A2540',
    mutedForeground: '#64748B',

    accent: '#3B82F6',
    accentForeground: '#FFFFFF',

    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',

    border: '#1E2D45',
    input: '#1E2D45',

    good: '#22D3A5',
    moderate: '#F59E0B',
    unhealthy: '#F97316',
    veryUnhealthy: '#EF4444',
    hazardous: '#A855F7',

    warning: '#F59E0B',
    success: '#22D3A5',
  },

  radius: 12,
} as const;

export default colors;

export type AppColors = typeof colors.light & { radius: number };
