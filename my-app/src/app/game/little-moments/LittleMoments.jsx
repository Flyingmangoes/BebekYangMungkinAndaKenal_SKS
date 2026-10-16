import { useState } from 'react';
import './littleMoments.css';
import LevelPlay from './LevelPlay.jsx';
import { LEVELS } from './levels.js';
import { pickRecommendedLevel } from './puzzleLogic.js';
import { useProgress } from './useProgress.js';

const ENERGY = [
  { id: 'low', label: 'Low' },
  { id: 'steady', label: 'Steady' },
  { id: 'high', label: 'Energized' },
];

const chip =
  'rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7BB5]/60';

/**
 * Props (all optional):
 *  - initialLevelId: start on a specific level
 *  - onLevelComplete(levelId): called when a level is solved
 *  - className: extra classes for the root element
 */
export default function LittleMoments({ initialLevelId, onLevelComplete, className = '' }) {
  const { progress, markCompleted, saveReflection, clearAll } = useProgress();
  const [levelId, setLevelId] = useState(
    LEVELS.some((l) => l.id === initialLevelId) ? initialLevelId : LEVELS[0].id,
  );
  const [energy, setEnergy] = useState(null); // only picks a suggestion; never stored
  const [confirmClear, setConfirmClear] = useState(false);

  const index = LEVELS.findIndex((l) => l.id === levelId);
  const level = LEVELS[index];
  const nextLevel = LEVELS[index + 1] ?? null;
  const recommendedId = energy ? pickRecommendedLevel(LEVELS, progress.completed, energy) : null;
  const doneCount = LEVELS.filter((l) => progress.completed[l.id]).length;

  const handleSolved = (id) => {
    if (!progress.completed[id]) onLevelComplete?.(id);
    markCompleted(id);
  };

  return (
    <section
      className={`lm-root mx-auto w-full max-w-5xl rounded-[2rem] bg-[#FBF4E6] p-4 text-[#3E3A36] sm:p-8 ${className}`}
      aria-labelledby="lm-title"
    >
      <div className="mb-5">
        <h1 id="lm-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Little Moments
        </h1>
        <p className="mt-1 text-[#524D48]">
          A cozy organizing puzzle. Tidy a small space, one gentle step at a time.
        </p>
      </div>

      <div className="mb-5 rounded-3xl bg-white/60 p-4 ring-1 ring-[#E8DCC4]">
        <div role="group" aria-labelledby="lm-energy-label" className="flex flex-wrap items-center gap-2">
          <span id="lm-energy-label" className="mr-1 text-sm font-semibold">
            How is your energy today? <span className="font-normal text-[#6A645D]">(optional)</span>
          </span>
          {ENERGY.map((e) => (
            <button
              key={e.id}
              type="button"
              aria-pressed={energy === e.id}
              onClick={() => setEnergy((cur) => (cur === e.id ? null : e.id))}
              className={`${chip} ${
                energy === e.id ? 'bg-[#55734F] text-white' : 'bg-white text-[#3E3A36] ring-1 ring-[#D9CDB4] hover:bg-[#F7F1E3]'
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>

        <nav aria-label="Levels" className="mt-4 grid gap-2 sm:grid-cols-3">
          {LEVELS.map((l, i) => {
            const active = l.id === levelId;
            return (
              <button
                key={l.id}
                type="button"
                aria-current={active ? 'true' : undefined}
                onClick={() => setLevelId(l.id)}
                className={`rounded-2xl px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7BB5]/60 ${
                  active ? 'bg-[#DCE6D6] ring-2 ring-[#55734F]' : 'bg-white ring-1 ring-[#E1D6BD] hover:bg-[#F7F1E3]'
                }`}
              >
                <span className="block text-xs font-medium text-[#5E6F58]">
                  Level {i + 1}
                  {progress.completed[l.id] ? ' · Done ✓' : ''}
                </span>
                <span className="block font-semibold">{l.shortTitle}</span>
                {recommendedId === l.id && (
                  <span className="mt-1 inline-block rounded-full bg-[#F4C9AE] px-2 py-0.5 text-xs font-semibold text-[#5A3520]">
                    Suggested for you
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <p className="mt-3 text-xs text-[#6A645D]">
          {doneCount} of {LEVELS.length} levels finished. The suggestion above follows simple built-in rules, not AI.
        </p>
      </div>

      <LevelPlay
        key={level.id}
        level={level}
        levelNumber={index + 1}
        totalLevels={LEVELS.length}
        nextLevel={nextLevel}
        savedReflection={progress.reflections[level.id]}
        onSolved={handleSolved}
        onSaveReflection={(r) => saveReflection(level.id, r)}
        onNext={() => setLevelId((nextLevel ?? LEVELS[0]).id)}
      />

      <footer className="mt-8 border-t border-[#E8DCC4] pt-4 text-sm text-[#524D48]">
        <p>
          Little Moments is a gentle game for taking a pause. It is not a diagnosis or a replacement for professional
          support. If you feel unsafe or in crisis, please reach out to a trusted person, a mental health professional, or
          your local emergency services.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="text-xs text-[#6A645D]">Progress and reflections are stored only in this browser.</span>
          {!confirmClear ? (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="rounded-full px-3 py-1 text-xs font-semibold text-[#3E3A36] underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7BB5]/60"
            >
              Clear saved data
            </button>
          ) : (
            <span className="flex items-center gap-2 text-xs">
              Clear all progress and reflections?
              <button
                type="button"
                onClick={() => {
                  clearAll();
                  setConfirmClear(false);
                }}
                className="rounded-full bg-[#55734F] px-3 py-1 font-semibold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7BB5]/60"
              >
                Yes, clear
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="rounded-full bg-white px-3 py-1 font-semibold ring-1 ring-[#D9CDB4] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7BB5]/60"
              >
                Keep
              </button>
            </span>
          )}
        </div>
      </footer>
    </section>
  );
}
