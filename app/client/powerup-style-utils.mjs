export function resolvePowerUpStyle(baseStyle, tierStyle) {
  if (!baseStyle) return null;
  if (!tierStyle) {
    return {
      ...baseStyle,
      badge: { ...(baseStyle.badge || {}) },
    };
  }
  return {
    ...baseStyle,
    ...tierStyle,
    badge: {
      ...(baseStyle.badge || {}),
      ...(tierStyle.badge || {}),
    },
  };
}
