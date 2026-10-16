// Pure puzzle rules. No React, no DOM. Placement shape: { [objectId]: slotId }.

export const getSlot = (level, slotId) => level.slots.find((s) => s.id === slotId) ?? null;
export const getObject = (level, objectId) => level.objects.find((o) => o.id === objectId) ?? null;

export function occupantOf(placement, slotId) {
  return Object.keys(placement).find((objectId) => placement[objectId] === slotId) ?? null;
}

export function isSlotSatisfied(level, placement, slotId) {
  const slot = getSlot(level, slotId);
  const occupant = occupantOf(placement, slotId);
  return Boolean(slot && occupant && slot.accepts.includes(occupant));
}

export function getSatisfiedSlotIds(level, placement) {
  return new Set(level.slots.filter((s) => isSlotSatisfied(level, placement, s.id)).map((s) => s.id));
}

export const countSatisfied = (level, placement) => getSatisfiedSlotIds(level, placement).size;

// Deterministic win condition: every slot holds an object it accepts.
export function isSolved(level, placement) {
  return level.slots.every((s) => isSlotSatisfied(level, placement, s.id));
}

// Move an object into a slot; the slot's current occupant takes the object's old slot.
// Returns the same reference when nothing changes.
export function swapObjects(placement, objectId, targetSlotId) {
  const from = placement[objectId];
  if (from === undefined || from === targetSlotId) return placement;
  const occupant = occupantOf(placement, targetSlotId);
  const next = { ...placement, [objectId]: targetSlotId };
  if (occupant) next[occupant] = from;
  return next;
}

export function swapObjectsById(placement, aId, bId) {
  if (aId === bId || placement[bId] === undefined) return placement;
  return swapObjects(placement, aId, placement[bId]);
}

// Rule-based suggestion (not AI): prefer the level that fits the chosen energy,
// unless it is already completed; otherwise the first unfinished level.
export function pickRecommendedLevel(levels, completed, energy) {
  const preferred = levels.find((l) => l.energyFit === energy);
  if (preferred && !completed[preferred.id]) return preferred.id;
  const firstOpen = levels.find((l) => !completed[l.id]);
  return (firstOpen ?? preferred ?? levels[0]).id;
}

// Returns a list of human-readable problems; empty means the level definition is valid.
export function validateLevelDefinition(level) {
  const problems = [];
  const slotIds = level.slots.map((s) => s.id);
  const objectIds = level.objects.map((o) => o.id);

  if (new Set(slotIds).size !== slotIds.length) problems.push('duplicate slot ids');
  if (new Set(objectIds).size !== objectIds.length) problems.push('duplicate object ids');
  if (slotIds.length !== objectIds.length) problems.push('slot count must equal object count');

  for (const s of level.slots) {
    if (!s.accepts.length) problems.push(`slot ${s.id} accepts nothing`);
    for (const id of s.accepts) if (!objectIds.includes(id)) problems.push(`slot ${s.id} accepts unknown object ${id}`);
  }

  const startKeys = Object.keys(level.start);
  if (startKeys.length !== objectIds.length || !objectIds.every((id) => startKeys.includes(id))) {
    problems.push('start must place every object exactly once');
  }
  const startSlots = Object.values(level.start);
  if (new Set(startSlots).size !== startSlots.length) problems.push('start places two objects in one slot');
  if (!startSlots.every((id) => slotIds.includes(id))) problems.push('start uses an unknown slot');

  if (!findSolution(level)) problems.push('no valid solution exists');
  if (isSolved(level, level.start)) problems.push('level starts already solved');
  return problems;
}

// Backtracking matching of objects to accepting slots. Returns a placement or null.
export function findSolution(level) {
  const used = new Set();
  const result = {};
  const place = (i) => {
    if (i === level.slots.length) return true;
    const slot = level.slots[i];
    for (const objectId of slot.accepts) {
      if (used.has(objectId)) continue;
      used.add(objectId);
      result[objectId] = slot.id;
      if (place(i + 1)) return true;
      used.delete(objectId);
      delete result[objectId];
    }
    return false;
  };
  return place(0) ? { ...result } : null;
}
