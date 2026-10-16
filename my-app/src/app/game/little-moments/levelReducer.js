import {
  countSatisfied,
  getObject,
  isSolved,
  occupantOf,
  swapObjects,
  swapObjectsById,
} from './puzzleLogic.js';

// Pure reducer for one level. The level definition lives in state so actions stay small.
export function createInitialState(level, notice = '') {
  return {
    level,
    placement: { ...level.start },
    history: [],
    moves: 0,
    selectedId: null,
    lastMovedId: null,
    notice,
  };
}

function commit(state, nextPlacement, movedId, otherId) {
  const { level } = state;
  const moved = getObject(level, movedId);
  const other = otherId ? getObject(level, otherId) : null;
  const placed = countSatisfied(level, nextPlacement);
  const what = other ? `${moved.label} swapped with ${other.label}.` : `Moved ${moved.label}.`;
  return {
    ...state,
    placement: nextPlacement,
    history: [...state.history, state.placement],
    moves: state.moves + 1,
    selectedId: null,
    lastMovedId: movedId,
    notice: `${what} ${placed} of ${level.slots.length} in place.`,
  };
}

export function levelReducer(state, action) {
  const { level, placement } = state;
  const frozen = isSolved(level, placement);

  switch (action.type) {
    case 'move': {
      // Drag-and-drop: put an object into a slot, swapping with whoever is there.
      if (frozen) return state;
      const next = swapObjects(placement, action.objectId, action.slotId);
      if (next === placement) return { ...state, selectedId: null };
      return commit(state, next, action.objectId, occupantOf(placement, action.slotId));
    }
    case 'tap': {
      // Tap / keyboard: pick one object up, then pick another to swap.
      if (frozen) return state;
      if (state.selectedId === null) {
        const obj = getObject(level, action.objectId);
        return { ...state, selectedId: action.objectId, notice: `${obj.label} picked up. Choose another item to swap.` };
      }
      if (state.selectedId === action.objectId) {
        return { ...state, selectedId: null, notice: 'Put back. Nothing changed.' };
      }
      const next = swapObjectsById(placement, state.selectedId, action.objectId);
      if (next === placement) return { ...state, selectedId: null };
      return commit(state, next, state.selectedId, action.objectId);
    }
    case 'clearSelection':
      return state.selectedId === null ? state : { ...state, selectedId: null, notice: 'Selection cleared.' };
    case 'undo': {
      if (!state.history.length) return state;
      const history = state.history.slice(0, -1);
      return {
        ...state,
        placement: state.history[state.history.length - 1],
        history,
        moves: Math.max(0, state.moves - 1),
        selectedId: null,
        lastMovedId: null,
        notice: 'Last move undone.',
      };
    }
    case 'reset':
      return createInitialState(level, 'Level reset. Take your time.');
    default:
      return state;
  }
}
