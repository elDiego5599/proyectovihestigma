/** Sobre de condón con borde dentado, centrado en (0,0) y de unos 84 de lado. Es el mismo dibujo en toda la app. */
export function Condom() {
  return (
    <g>
      <path
        d="M -38 -38 L -30 -42 L -22 -38 L -14 -42 L -6 -38 L 2 -42 L 10 -38 L 18 -42 L 26 -38 L 34 -42 L 42 -38 L 38 -30 L 42 -22 L 38 -14 L 42 -6 L 38 2 L 42 10 L 38 18 L 42 26 L 38 34 L 42 42 L 34 38 L 26 42 L 18 38 L 10 42 L 2 38 L -6 42 L -14 38 L -22 42 L -30 38 L -38 42 L -34 34 L -38 26 L -34 18 L -38 10 L -34 2 L -38 -6 L -34 -14 L -38 -22 L -34 -30 Z"
        fill="#2563EB"
      />
      <rect x="-28" y="-28" width="56" height="56" rx="8" fill="#3B82F6" />
      <circle r="17" fill="none" stroke="#BFDBFE" strokeWidth="5" />
      <circle r="8" fill="#60A5FA" />
      <path d="M -20 -22 L 4 -22" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}
