export function shouldTriggerFirstMatch5Reward({
  events = [],
  alreadyTriggered = false,
  lastTriggeredAt = -Infinity,
  now = 0,
  cooldownMs = 0,
} = {}) {
  if (alreadyTriggered) return false;
  const hasMatch5 = Array.isArray(events) && events.some((event) => event.length === 5);
  if (!hasMatch5) return false;
  const cooldown = Number.isFinite(cooldownMs) ? cooldownMs : 0;
  return now - lastTriggeredAt >= cooldown;
}

export function shouldTriggerFirstPowerUpReward({
  events = [],
  alreadyTriggered = false,
  lastTriggeredAt = -Infinity,
  now = 0,
  cooldownMs = 0,
  allowRepeat = false,
} = {}) {
  if (alreadyTriggered && !allowRepeat) return false;
  const hasPowerUp =
    Array.isArray(events) &&
    events.some((event) => event.length === 4 || event.length === 5);
  if (!hasPowerUp) return false;
  const cooldown = Number.isFinite(cooldownMs) ? cooldownMs : 0;
  return now - lastTriggeredAt >= cooldown;
}
