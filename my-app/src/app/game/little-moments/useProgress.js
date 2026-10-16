import { useCallback, useEffect, useState } from 'react';

// Everything stays on this device. Nothing is sent anywhere.
export const STORAGE_KEY = 'littleMoments.progress.v1';
const EMPTY = { completed: {}, reflections: {} };

function load() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    const completed = {};
    const reflections = {};
    for (const [id, value] of Object.entries(parsed?.completed ?? {})) if (value === true) completed[id] = true;
    for (const [id, r] of Object.entries(parsed?.reflections ?? {})) {
      if (r && typeof r === 'object') {
        reflections[id] = {
          feeling: typeof r.feeling === 'string' ? r.feeling.slice(0, 40) : null,
          note: typeof r.note === 'string' ? r.note.slice(0, 140) : '',
        };
      }
    }
    return { completed, reflections };
  } catch {
    return EMPTY;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(load);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      /* storage unavailable (private mode, quota): the game still works in memory */
    }
  }, [progress]);

  const markCompleted = useCallback((levelId) => {
    setProgress((p) => (p.completed[levelId] ? p : { ...p, completed: { ...p.completed, [levelId]: true } }));
  }, []);

  const saveReflection = useCallback((levelId, { feeling, note }) => {
    setProgress((p) => ({
      ...p,
      reflections: { ...p.reflections, [levelId]: { feeling: feeling ?? null, note: (note ?? '').slice(0, 140) } },
    }));
  }, []);

  const clearAll = useCallback(() => setProgress(EMPTY), []);

  return { progress, markCompleted, saveReflection, clearAll };
}
