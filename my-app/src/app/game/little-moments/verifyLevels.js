// Node check for the puzzle rules (no browser needed).
// Run from the project root: node src/features/little-moments/verifyLevels.js
// (needs "type": "module" in package.json, which Vite projects normally have)
import { LEVELS } from './levels.js';
import { createInitialState, levelReducer } from './levelReducer.js';
import {
  findSolution,
  isSolved,
  pickRecommendedLevel,
  swapObjects,
  validateLevelDefinition,
} from './puzzleLogic.js';

let failures = 0;
const check = (name, ok) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  if (!ok) failures += 1;
};

for (const level of LEVELS) {
  const problems = validateLevelDefinition(level);
  check(`${level.id}: definition valid${problems.length ? ' (' + problems.join('; ') + ')' : ''}`, problems.length === 0);

  // Solve by dragging objects into their accepting slots, using only reducer actions.
  let state = createInitialState(level);
  check(`${level.id}: starts unsolved`, !isSolved(level, state.placement));
  const target = findSolution(level);
  let guard = 0;
  while (!isSolved(level, state.placement) && guard++ < 50) {
    const wrong = level.slots.find((s) => !s.accepts.includes(Object.keys(state.placement).find((o) => state.placement[o] === s.id)));
    const fixing = Object.keys(target).find((o) => target[o] === wrong.id);
    state = levelReducer(state, { type: 'move', objectId: fixing, slotId: wrong.id });
  }
  check(`${level.id}: solvable in ${state.moves} moves (<= ${level.objects.length})`, isSolved(level, state.placement) && state.moves <= level.objects.length);

  const frozen = levelReducer(state, { type: 'move', objectId: level.objects[0].id, slotId: level.slots[1].id });
  check(`${level.id}: board locks once solved`, frozen.placement === state.placement);

  let undone = state;
  while (undone.history.length) undone = levelReducer(undone, { type: 'undo' });
  check(`${level.id}: undo returns to start`, JSON.stringify(undone.placement) === JSON.stringify(level.start) && undone.moves === 0);

  const reset = levelReducer(state, { type: 'reset' });
  check(`${level.id}: reset restores start`, JSON.stringify(reset.placement) === JSON.stringify(level.start) && reset.moves === 0);

  // Tap-to-swap flow
  const [a, b] = level.objects.map((o) => o.id);
  let tapped = createInitialState(level);
  tapped = levelReducer(tapped, { type: 'tap', objectId: a });
  check(`${level.id}: tap selects`, tapped.selectedId === a);
  tapped = levelReducer(tapped, { type: 'tap', objectId: b });
  check(
    `${level.id}: second tap swaps`,
    tapped.placement[a] === level.start[b] && tapped.placement[b] === level.start[a] && tapped.selectedId === null,
  );
}

check('swapObjects same slot is a no-op', (() => {
  const p = { ...LEVELS[0].start };
  return swapObjects(p, 'plant', p.plant) === p;
})());

const none = {};
check('recommendation: low energy -> calm corner', pickRecommendedLevel(LEVELS, none, 'low') === 'calm-corner');
check('recommendation: completed preferred -> first unfinished', pickRecommendedLevel(LEVELS, { 'calm-corner': true }, 'low') === 'study-desk');

console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
