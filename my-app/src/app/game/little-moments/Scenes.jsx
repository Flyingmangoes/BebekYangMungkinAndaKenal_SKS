// Background scenes drawn in a 400x300 viewBox (matches the 4:3 board).

function SceneDesk() {
  return (
    <>
      <rect width="400" height="300" fill="#F6EBD6" />
      <circle cx="262" cy="52" r="26" fill="#F9DCC4" opacity=".75" />
      <rect y="180" width="400" height="120" fill="#E6C8A3" />
      <rect y="180" width="400" height="6" fill="#D9B88F" />
      <rect x="34" y="116" width="176" height="8" rx="3" fill="#C9A27E" />
      <rect x="50" y="124" width="6" height="14" fill="#B58E6B" />
      <rect x="188" y="124" width="6" height="14" fill="#B58E6B" />
      <rect x="304" y="126" width="64" height="7" rx="3" fill="#C9A27E" />
      <rect x="206" y="178" width="182" height="40" rx="14" fill="#D8E0D0" stroke="#B7C7AE" strokeWidth="2" />
      <rect x="58" y="158" width="124" height="84" rx="14" fill="#F0D9B8" />
    </>
  );
}

function SceneCorner() {
  return (
    <>
      <rect width="400" height="300" fill="#E8E1F2" />
      <rect y="250" width="400" height="50" fill="#E7D3C0" />
      <ellipse cx="152" cy="262" rx="112" ry="20" fill="#CDBDE0" />
      <rect x="40" y="126" width="80" height="8" rx="3" fill="#C9A27E" />
      <rect x="168" y="28" width="64" height="88" rx="10" fill="#F3EEF8" stroke="#CFC4E0" strokeWidth="2" />
      <rect x="296" y="38" width="48" height="8" rx="4" fill="#C9A27E" />
      <rect x="268" y="203" width="104" height="10" rx="4" fill="#C9A27E" />
      <rect x="280" y="213" width="6" height="40" fill="#B58E6B" />
      <rect x="354" y="213" width="6" height="40" fill="#B58E6B" />
      <rect x="98" y="214" width="108" height="34" rx="17" fill="#F4C9AE" />
    </>
  );
}

function SceneFocus() {
  return (
    <>
      <rect width="400" height="300" fill="#E7EEF3" />
      <rect x="36" y="30" width="260" height="126" rx="16" fill="#D9E4EC" stroke="#C0D1DE" strokeWidth="2" />
      {[
        [80, '1'],
        [168, '2'],
        [256, '3'],
      ].map(([cx, n]) => (
        <g key={n}>
          <circle cx={cx} cy="142" r="8" fill="#fff" opacity=".9" />
          <text x={cx} y="146" textAnchor="middle" fontSize="11" fontWeight="700" fill="#5D6B7A" fontFamily="inherit">{n}</text>
        </g>
      ))}
      <rect x="314" y="40" width="60" height="100" rx="14" fill="#D6DCEA" stroke="#B9C3DA" strokeWidth="2" strokeDasharray="5 4" />
      <text x="344" y="156" textAnchor="middle" fontSize="11" fontWeight="600" fill="#5D6B7A" fontFamily="inherit">phone away</text>
      <rect y="176" width="400" height="124" fill="#E3C9A8" />
      <rect y="176" width="400" height="6" fill="#D6B891" />
      <rect x="60" y="180" width="120" height="76" rx="12" fill="#EBD3B2" />
      <rect x="190" y="202" width="84" height="32" rx="12" fill="#D8E0D0" stroke="#B7C7AE" strokeWidth="2" />
    </>
  );
}

const SCENES = { desk: SceneDesk, corner: SceneCorner, focus: SceneFocus };

export default function Scene({ name }) {
  const Component = SCENES[name] ?? SceneDesk;
  return (
    <svg className="lm-scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <Component />
    </svg>
  );
}
