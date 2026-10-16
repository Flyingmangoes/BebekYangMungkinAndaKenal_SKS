// Original, lightweight SVG illustrations for every puzzle object.
const common = { width: '100%', height: '100%', 'aria-hidden': true, focusable: 'false' };

function Book({ color = '#A9BFA0', dark = '#7F9A76' }) {
  return (
    <svg viewBox="0 0 64 72" {...common}>
      <rect x="10" y="4" width="44" height="64" rx="5" fill={color} />
      <rect x="10" y="4" width="10" height="64" rx="4" fill={dark} />
      <rect x="26" y="16" width="22" height="4" rx="2" fill="#fff" opacity=".75" />
      <rect x="26" y="26" width="15" height="4" rx="2" fill="#fff" opacity=".5" />
      <rect x="12" y="64" width="40" height="3" rx="1.5" fill="#000" opacity=".08" />
    </svg>
  );
}

function Pen({ color = '#F0B896' }) {
  return (
    <svg viewBox="0 0 72 24" {...common}>
      <rect x="6" y="8" width="48" height="8" rx="4" fill={color} />
      <rect x="40" y="8" width="8" height="8" fill="#fff" opacity=".45" />
      <polygon points="54,8 68,12 54,16" fill="#E9DCC6" />
      <polygon points="64,11 68,12 64,13" fill="#5B5550" />
      <rect x="10" y="10" width="26" height="2" rx="1" fill="#fff" opacity=".5" />
    </svg>
  );
}

function Notebook() {
  return (
    <svg viewBox="0 0 104 72" {...common}>
      <rect x="6" y="4" width="94" height="64" rx="8" fill="#9DB4C9" />
      <rect x="6" y="4" width="14" height="64" rx="6" fill="#7F9AB2" />
      {[14, 26, 38, 50].map((cy) => (
        <circle key={cy} cx="13" cy={cy} r="3" fill="#FBF4E6" />
      ))}
      <rect x="34" y="16" width="52" height="30" rx="5" fill="#FBF4E6" opacity=".9" />
      <rect x="40" y="24" width="34" height="4" rx="2" fill="#9DB4C9" />
      <rect x="40" y="34" width="24" height="4" rx="2" fill="#C9BEDD" />
    </svg>
  );
}

function Plant() {
  return (
    <svg viewBox="0 0 64 90" {...common}>
      <ellipse cx="32" cy="32" rx="9" ry="24" fill="#8FAE86" />
      <ellipse cx="19" cy="40" rx="8" ry="18" fill="#A9C79E" transform="rotate(-32 19 40)" />
      <ellipse cx="45" cy="40" rx="8" ry="18" fill="#A9C79E" transform="rotate(32 45 40)" />
      <polygon points="17,60 47,60 43,86 21,86" fill="#E9A98A" />
      <rect x="14" y="55" width="36" height="8" rx="3" fill="#D98F6C" />
    </svg>
  );
}

function Journal() {
  return (
    <svg viewBox="0 0 88 48" {...common}>
      <rect x="4" y="6" width="80" height="36" rx="7" fill="#C9BEDD" />
      <rect x="58" y="6" width="9" height="36" fill="#B4A5CF" />
      <rect x="14" y="16" width="30" height="4" rx="2" fill="#fff" opacity=".75" />
      <rect x="14" y="25" width="20" height="4" rx="2" fill="#fff" opacity=".5" />
    </svg>
  );
}

function Mug() {
  return (
    <svg viewBox="0 0 48 42" {...common}>
      <path d="M14 3c-3 3 3 4 0 7M22 3c-3 3 3 4 0 7" stroke="#B9AFA5" fill="none" strokeWidth="2" strokeLinecap="round" opacity=".8" />
      <path d="M34 17h3a6 6 0 0 1 0 13h-3" fill="none" stroke="#F4C9AE" strokeWidth="5" strokeLinecap="round" />
      <rect x="6" y="12" width="30" height="27" rx="8" fill="#F4C9AE" />
      <rect x="11" y="18" width="20" height="4" rx="2" fill="#fff" opacity=".55" />
    </svg>
  );
}

function Headphones() {
  return (
    <svg viewBox="0 0 64 66" {...common}>
      <path d="M12 40V32a20 20 0 0 1 40 0v8" fill="none" stroke="#6F8499" strokeWidth="6" strokeLinecap="round" />
      <rect x="6" y="38" width="15" height="22" rx="6" fill="#9DB4C9" />
      <rect x="43" y="38" width="15" height="22" rx="6" fill="#9DB4C9" />
      <rect x="9" y="43" width="4" height="12" rx="2" fill="#fff" opacity=".5" />
    </svg>
  );
}

function RelaxCard() {
  return (
    <svg viewBox="0 0 56 60" {...common}>
      <rect x="4" y="4" width="48" height="52" rx="8" fill="#FFF8EC" stroke="#E6D3B3" strokeWidth="2" />
      <circle cx="28" cy="22" r="9" fill="#A9BFA0" />
      <path d="M22 22c3-5 9-5 12 0" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
      <text x="28" y="45" textAnchor="middle" fontSize="8" fontWeight="700" fill="#5E7D58" fontFamily="inherit">breathe</text>
    </svg>
  );
}

function TaskCard({ color = '#F4C9AE', lines = [] }) {
  return (
    <svg viewBox="0 0 60 84" {...common}>
      <rect x="2" y="2" width="56" height="80" rx="8" fill={color} />
      <circle cx="30" cy="16" r="6" fill="#fff" opacity=".7" />
      {lines.map((line, i) => (
        <text key={line} x="30" y={44 + i * 14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#3E3A36" fontFamily="inherit">
          {line}
        </text>
      ))}
    </svg>
  );
}

function Phone() {
  return (
    <svg viewBox="0 0 44 72" {...common}>
      <rect x="4" y="2" width="36" height="68" rx="8" fill="#5D6B7A" />
      <rect x="8" y="9" width="28" height="50" rx="4" fill="#DDE6EE" />
      <circle cx="22" cy="65" r="2.5" fill="#DDE6EE" />
      <circle cx="22" cy="30" r="7" fill="#C9BEDD" />
    </svg>
  );
}

const ART = {
  book: Book,
  pen: Pen,
  notebook: Notebook,
  plant: Plant,
  journal: Journal,
  mug: Mug,
  headphones: Headphones,
  card: RelaxCard,
  task: TaskCard,
  phone: Phone,
};

export default function ObjectArt({ art, artProps = {} }) {
  const Component = ART[art];
  return Component ? <Component {...artProps} /> : null;
}
