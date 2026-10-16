import { useEffect, useRef, useState } from 'react';

const FEELINGS = ['A little lighter', 'About the same', 'Not sure yet'];

const btn =
  'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8C7BB5]/60';

export default function CompletionPanel({ level, nextLevel, saved, onSaveReflection, onNext }) {
  const headingRef = useRef(null);
  const [feeling, setFeeling] = useState(saved?.feeling ?? null);
  const [note, setNote] = useState(saved?.note ?? '');
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: false });
  }, []);

  const canSave = feeling !== null || note.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    onSaveReflection({ feeling, note: note.trim() });
    setJustSaved(true);
  };

  return (
    <section
      className="lm-complete-in rounded-3xl bg-white/80 p-5 shadow-[0_8px_30px_rgba(62,58,54,0.08)] ring-1 ring-[#CFDCC8] sm:p-6"
      aria-labelledby="lm-complete-title"
    >
      <h2
        id="lm-complete-title"
        ref={headingRef}
        tabIndex={-1}
        className="text-xl font-semibold text-[#3E3A36] focus:outline-none"
      >
        {level.completion.title}
      </h2>
      <p className="mt-1 text-[#524D48]">{level.completion.message}</p>

      <p className="mt-4 rounded-2xl bg-[#F4EEE0] px-4 py-3 text-sm text-[#3E3A36]">{level.tip}</p>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-[#3E3A36]">
          {level.reflectionPrompt} <span className="font-normal text-[#6A645D]">(optional)</span>
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {FEELINGS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={feeling === f}
              onClick={() => {
                setFeeling((cur) => (cur === f ? null : f));
                setJustSaved(false);
              }}
              className={`${btn} ${
                feeling === f ? 'bg-[#55734F] text-white' : 'bg-white text-[#3E3A36] ring-1 ring-[#D9CDB4] hover:bg-[#F7F1E3]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>



      </fieldset>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onNext} className={`${btn} bg-[#1764de] text-white hover:bg-[#1e5abb]`}>
          {nextLevel ? `Next: ${nextLevel.title}` : 'Start again from the first level'}
        </button>
      </div>
    </section>
  );
}
