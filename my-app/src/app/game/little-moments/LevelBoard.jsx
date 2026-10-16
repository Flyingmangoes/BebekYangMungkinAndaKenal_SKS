import { useRef, useState } from 'react';
import ObjectArt from './ObjectArt.jsx';
import Scene from './Scenes.jsx';
import { getSlot } from './puzzleLogic.js';

const DRAG_THRESHOLD = 6; // px before a press becomes a drag (below it, it's a tap)
const SPARKLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: 8 + ((i * 37) % 84),
  delay: (i % 6) * 0.18,
  size: 6 + (i % 3) * 3,
}));

export default function LevelBoard({
  level,
  placement,
  selectedId,
  satisfiedSlots,
  solved,
  showHints,
  onMove,
  onTap,
}) {
  const boardRef = useRef(null);
  const gesture = useRef(null);
  const suppressClick = useRef(false);
  const [drag, setDrag] = useState(null); // { id, dx, dy, overSlot }

  // Nearest slot centre to the pointer; null when released well outside the board.
  const slotAtPoint = (clientX, clientY) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const px = ((clientX - rect.left) / rect.width) * 100;
    const py = ((clientY - rect.top) / rect.height) * 100;
    if (px < -8 || px > 108 || py < -8 || py > 108) return null;
    let best = null;
    let bestDistance = Infinity;
    for (const slot of level.slots) {
      const cx = rect.left + (slot.x / 100) * rect.width;
      const cy = rect.top + (slot.y / 100) * rect.height;
      const d = Math.hypot(clientX - cx, clientY - cy);
      if (d < bestDistance) {
        bestDistance = d;
        best = slot;
      }
    }
    return best;
  };

  const handlePointerDown = (event, obj) => {
    if (solved) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    gesture.current = { id: obj.id, startX: event.clientX, startY: event.clientY, active: false };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event, obj) => {
    const g = gesture.current;
    if (!g || g.id !== obj.id) return;
    const dx = event.clientX - g.startX;
    const dy = event.clientY - g.startY;
    if (!g.active && Math.hypot(dx, dy) > DRAG_THRESHOLD) g.active = true;
    if (g.active) {
      setDrag({ id: obj.id, dx, dy, overSlot: slotAtPoint(event.clientX, event.clientY)?.id ?? null });
    }
  };

  const handlePointerUp = (event, obj) => {
    const g = gesture.current;
    gesture.current = null;
    if (!g || g.id !== obj.id || !g.active) return;
    suppressClick.current = true; // the click that follows a drag must not also "tap"
    setTimeout(() => {
      suppressClick.current = false;
    }, 0);
    const target = slotAtPoint(event.clientX, event.clientY);
    setDrag(null);
    if (target) onMove(obj.id, target.id);
  };

  const handlePointerCancel = () => {
    gesture.current = null;
    setDrag(null);
  };

  const handleClick = (obj) => {
    if (suppressClick.current) return;
    onTap(obj.id);
  };

  return (
    <div
      ref={boardRef}
      className={`lm-board${solved ? ' lm-board--solved' : ''}`}
      role="group"
      aria-label={`${level.title} puzzle board`}
    >
      <Scene name={level.scene} />

      {level.slots.map((slot) => (
        <div
          key={slot.id}
          className={`lm-slot${showHints ? ' lm-slot--hint' : ''}${drag?.overSlot === slot.id ? ' lm-slot--over' : ''}`}
          style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: `${slot.w}%`, height: `${slot.h}%` }}
          aria-hidden="true"
        >
          <span className="lm-slot__label">{slot.label}</span>
        </div>
      ))}

      {level.objects.map((obj, index) => {
        const slot = getSlot(level, placement[obj.id]);
        const isSelected = selectedId === obj.id;
        const isDragging = drag?.id === obj.id;
        const isPlaced = satisfiedSlots.has(slot.id);
        const dx = isDragging ? drag.dx : 0;
        const dy = isDragging ? drag.dy : 0;
        const className = [
          'lm-token',
          isSelected && 'lm-token--selected',
          isDragging && 'lm-token--dragging',
          isPlaced && 'lm-token--placed',
          solved && 'lm-token--locked',
        ]
          .filter(Boolean)
          .join(' ');
        const label = `${obj.label}. Now in: ${slot.label}.${isPlaced ? ' In the right place.' : ''}${
          isSelected ? ' Picked up. Choose another item to swap.' : ''
        }`;

        return (
          <button
            key={obj.id}
            type="button"
            className={className}
            style={{
              left: `${slot.x}%`,
              top: `${slot.y}%`,
              width: `${obj.w}%`,
              height: `${obj.h}%`,
              transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`,
              '--i': index,
            }}
            aria-label={label}
            aria-pressed={isSelected}
            onPointerDown={(e) => handlePointerDown(e, obj)}
            onPointerMove={(e) => handlePointerMove(e, obj)}
            onPointerUp={(e) => handlePointerUp(e, obj)}
            onPointerCancel={handlePointerCancel}
            onClick={() => handleClick(obj)}
          >
            <span className="lm-token__art">
              <ObjectArt art={obj.art} artProps={obj.artProps} />
            </span>
          </button>
        );
      })}

      {solved && (
        <div className="lm-sparkles" aria-hidden="true">
          {SPARKLES.map((s) => (
            <span
              key={s.id}
              className="lm-sparkle"
              style={{ left: `${s.left}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
