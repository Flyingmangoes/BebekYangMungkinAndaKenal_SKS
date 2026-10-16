import { useMemo, useReducer } from 'react';
import { createInitialState, levelReducer } from './levelReducer.js';
import { getSatisfiedSlotIds, isSolved } from './puzzleLogic.js';

// Render <LevelPlay key={level.id}> so this state resets whenever the level changes.
export function useLevelGame(level) {
  const [state, dispatch] = useReducer(levelReducer, level, createInitialState);

  const solved = useMemo(() => isSolved(level, state.placement), [level, state.placement]);
  const satisfiedSlots = useMemo(() => getSatisfiedSlotIds(level, state.placement), [level, state.placement]);

  const actions = useMemo(
    () => ({
      move: (objectId, slotId) => dispatch({ type: 'move', objectId, slotId }),
      tap: (objectId) => dispatch({ type: 'tap', objectId }),
      clearSelection: () => dispatch({ type: 'clearSelection' }),
      undo: () => dispatch({ type: 'undo' }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    [],
  );

  return {
    placement: state.placement,
    selectedId: state.selectedId,
    moves: state.moves,
    notice: state.notice,
    canUndo: state.history.length > 0,
    solved,
    satisfiedSlots,
    placedCount: satisfiedSlots.size,
    total: level.slots.length,
    ...actions,
  };
}
