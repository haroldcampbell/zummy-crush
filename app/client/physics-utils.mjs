export function computeTapScale(now, tapStart, durationMs, scaleDown) {
  if (!tapStart || durationMs <= 0) return 1;
  const elapsed = now - tapStart;
  if (elapsed >= durationMs) return 1;
  const progress = Math.min(Math.max(elapsed / durationMs, 0), 1);
  return 1 - scaleDown * (1 - progress);
}

export function decayBoost(boost, dtMs, decayMs) {
  if (boost <= 0 || decayMs <= 0) return 0;
  const next = boost - dtMs / decayMs;
  return Math.max(next, 0);
}

export function computeRepulsionOffsets(tiles, positions, tileSize, physics, boosts) {
  const offsets = new Map();
  for (const tile of tiles) {
    offsets.set(tile, { x: 0, y: 0 });
  }

  if (!physics.enabled) return offsets;

  const effectiveRadius = tileSize + physics.repulsionRadius;
  const maxOffset = Math.max(physics.repulsionStrength, 0);

  for (let i = 0; i < tiles.length; i += 1) {
    for (let j = i + 1; j < tiles.length; j += 1) {
      const tileA = tiles[i];
      const tileB = tiles[j];
      const posA = positions.get(tileA);
      const posB = positions.get(tileB);
      if (!posA || !posB) continue;
      const dx = posA.x - posB.x;
      const dy = posA.y - posB.y;
      const dist = Math.hypot(dx, dy);
      if (dist === 0) continue;
      const overlap = effectiveRadius - dist;
      if (overlap <= 0) continue;

      const boostA = boosts.get(tileA) || 0;
      const boostB = boosts.get(tileB) || 0;
      const strengthA = physics.repulsionStrength * (1 + boostA);
      const strengthB = physics.repulsionStrength * (1 + boostB);
      const strength = (strengthA + strengthB) * 0.5;
      const push = (overlap / effectiveRadius) * strength;
      const nx = dx / dist;
      const ny = dy / dist;

      const offsetA = offsets.get(tileA);
      const offsetB = offsets.get(tileB);
      offsetA.x += nx * push;
      offsetA.y += ny * push;
      offsetB.x -= nx * push;
      offsetB.y -= ny * push;
    }
  }

  for (const [tile, offset] of offsets.entries()) {
    const magnitude = Math.hypot(offset.x, offset.y);
    if (magnitude > maxOffset && magnitude > 0) {
      const scale = maxOffset / magnitude;
      offset.x *= scale;
      offset.y *= scale;
    }
    offsets.set(tile, offset);
  }

  return offsets;
}
