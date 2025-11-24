export const theme = {
  // Ocean Professional palette
  primary: '#2563EB',
  secondary: '#F59E0B',
  success: '#F59E0B',
  error: '#EF4444',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
  shadow: 'rgba(17, 24, 39, 0.12)',
  focus: '#2563EB',
  border: '#e5e7eb',
}

export const elevation = {
  sm: { x: 0, y: 2, blur: 6, spread: 0, color: theme.shadow },
  md: { x: 0, y: 6, blur: 20, spread: 0, color: theme.shadow },
}

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
}

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
}

// PUBLIC_INTERFACE
export function applyFocusStyle(isFocused) {
  /** Provide a simple style object for focus rings */
  return isFocused
    ? [{ type: 'border', width: 2, color: theme.focus }, { type: 'filler' }]
    : []
}
