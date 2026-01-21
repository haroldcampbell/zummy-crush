export function pickWeightedChoice(items, rng = Math.random) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const normalized = items
    .map((item) => ({
      ...item,
      weight: Number(item?.weight ?? 0),
    }))
    .filter((item) => Number.isFinite(item.weight) && item.weight > 0);

  if (normalized.length === 0) return null;

  const total = normalized.reduce((sum, item) => sum + item.weight, 0);
  const roll = Math.max(0, Math.min(1, rng())) * total;
  let cursor = 0;
  for (const item of normalized) {
    cursor += item.weight;
    if (roll <= cursor) return item;
  }
  return normalized[normalized.length - 1];
}

export function formatLootLabel(id) {
  if (!id) return "Loot";
  const normalized = String(id).replace(/[-_]+/g, " ");
  return normalized.replace(/\b\w/g, (match) => match.toUpperCase());
}
