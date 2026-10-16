import { useEffect, useRef, useState } from 'react';
import CompletionPanel from './CompletionPanel.jsx';
import LevelBoard from './LevelBoard.jsx';
import { useLevelGame } from './useLevelGame.js';

const btn =
  'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7BB5]/60 disabled:cursor-not-allowed disabled:opacity-40';
const btnSecondary = `${btn} bg-white text-[#3E3A36] ring-1 ring-[#D9CDB4] hover:bg-[#F7F1E3]`;

export default function LevelPlay({
  level,
  levelNumber,
  totalLevels,
  nextLevel,
  savedReflection,
  onSolved,
  onSaveReflection,
  onNext,
}) {
  const game = useLevelGame(level);
  const [showHints, setShowHints] = useState(false);

  const onSolvedRef = useRef(onSolved);
  onSolvedRef.current = onSolved;
  useEffect(() => {
    if (game.solved) onSolvedRef.current?.(level.id);
  }, [game.solved, level.id]);

  const percent = Math.round((game.placedCount / game.total) * 100);

  return (
    <div onKeyDown={(e) => e.key === 'Escape' && game.clearSelection()}>
      <header className="mb-4">
        <p className="text-sm font-medium text-[#5E6F58]">
          Level {levelNumber} of {totalLevels}
        </p>
        <h2 className="text-2xl font-semibold text-[#3E3A36] sm:text-3xl">{level.title}</h2>
        <p className="mt-1 text-[#524D48]">{level.intro}</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <LevelBoard
            level={level}
            placement={game.placement}
            selectedId={game.selectedId}
            satisfiedSlots={game.satisfiedSlots}
            solved={game.solved}
            showHints={showHints}
            onMove={game.move}
            onTap={game.tap}
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" className={btnSecondary} onClick={game.undo} disabled={!game.canUndo}>
              Undo
            </button>
            <button type="button" className={btnSecondary} onClick={game.reset} disabled={game.moves === 0 && !game.solved}>
              Reset
            </button>
            <button
              type="button"
              className={`${btn} ${showHints ? 'bg-[#C9BEDD] text-[#2F2A3B]' : 'bg-white text-[#3E3A36] ring-1 ring-[#D9CDB4] hover:bg-[#F7F1E3]'}`}
              aria-pressed={showHints}
              onClick={() => setShowHints((v) => !v)}
            >
              {showHints ? 'Hide hints' : 'Show hints'}
            </button>
            <span className="ml-auto text-sm text-[#524D48]">Moves: {game.moves}</span>
          </div>

          <div className="mt-3" aria-hidden="true">
            <div className="h-2 overflow-hidden rounded-full bg-[#E9DFC9]">
              <div className="h-full rounded-full bg-[#8FAE86] transition-all duration-500" style={{ width: `${percent}%` }} />
            </div>
          </div>
          <p className="mt-1 text-sm text-[#524D48]">
            {game.placedCount} of {game.total} in place
          </p>
          <p className="sr-only" role="status" aria-live="polite">
            {game.solved ? `${level.completion.title}. ${game.notice}` : game.notice}
          </p>
        </div>

        <aside className="rounded-3xl bg-white/70 p-5 ring-1 ring-[#E8DCC4]" aria-label="How to play">
          <h3 className="text-base font-semibold text-[#3E3A36]">How to play</h3>
          <p className="mt-1 text-sm text-[#524D48]">
            Drag an item onto another spot to swap them. Or tap one item, then tap another. With a keyboard, press Enter on
            an item to pick it up, Tab to another item and press Enter to swap. Esc puts it back.
          </p>
          <h3 className="mt-4 text-base font-semibold text-[#3E3A36]">Make it feel right</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-[#3E3A36]">
            {level.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-[#6A645D]">There is no timer and no wrong way to take your time.</p>
        </aside>
      </div>

      {game.solved && (
        <div className="mt-6">
          <CompletionPanel
            level={level}
            nextLevel={nextLevel}
            saved={savedReflection}
            onSaveReflection={onSaveReflection}
            onNext={onNext}
          />
        </div>
      )}
    </div>
  );
}
