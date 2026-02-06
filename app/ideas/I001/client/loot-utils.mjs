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

export function createLootSession() {
  return {
    session: [],
    match4DropCount: 0,
    match5BonusCount: 0,
    nextLootId: 1,
  };
}

function getLootTypes(config) {
  if (!config) return [];
  if (Array.isArray(config.types)) return config.types;
  if (Array.isArray(config.weights)) return config.weights;
  return [];
}

export function applyMatch4LootDrops(events, config, session, rng = Math.random) {
  if (!Array.isArray(events) || !config || !session) return [];
  const types = getLootTypes(config);
  if (types.length === 0) return [];

  const cap = Number(config.sessionCap ?? config.dropCap);
  const hasCap = Number.isFinite(cap) && cap > 0;
  const drops = [];

  for (const event of events) {
    if (!event || event.length !== 4) continue;
    if (hasCap && session.match4DropCount >= cap) break;
    const choice = pickWeightedChoice(types, rng);
    if (!choice) continue;
    session.match4DropCount += 1;
    const lootType = choice.id || choice.type || "loot";
    drops.push({ type: lootType, event });
  }

  return drops;
}
