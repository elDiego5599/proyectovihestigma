/**
 * Mesa en primer plano vista de frente. Tapa los torsos por debajo de la superficie
 * para que los personajes queden "sentados" detrás y los objetos tengan dónde apoyarse.
 */
export function Table({
  top = 356,
  left = 170,
  right = 930,
  surface = '#D9A774',
  edge = '#B98252',
  cloth,
}: {
  top?: number;
  left?: number;
  right?: number;
  surface?: string;
  edge?: string;
  /** Si se pasa, dibuja un mantel que cae hasta el borde inferior. */
  cloth?: { color: string; shadow: string };
}) {
  const depth = 40;
  const inset = 34;
  return (
    <g>
      {/* Superficie en perspectiva */}
      <path
        d={`M ${left + inset} ${top} L ${right - inset} ${top} L ${right} ${top + depth} L ${left} ${top + depth} Z`}
        fill={surface}
      />
      {/* Brillo sutil */}
      <path
        d={`M ${left + inset + 20} ${top + 6} L ${right - inset - 20} ${top + 6}`}
        stroke="#FFFFFF"
        strokeOpacity="0.25"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {cloth ? (
        <>
          <rect x={left} y={top + depth} width={right - left} height={200} fill={cloth.color} />
          <path
            d={`M ${left} ${top + depth} L ${right} ${top + depth}`}
            stroke={cloth.shadow}
            strokeWidth="6"
          />
          {[0.2, 0.4, 0.6, 0.8].map((f) => (
            <line
              key={f}
              x1={left + (right - left) * f}
              y1={top + depth + 6}
              x2={left + (right - left) * f}
              y2={480}
              stroke={cloth.shadow}
              strokeOpacity="0.35"
              strokeWidth="2"
            />
          ))}
        </>
      ) : (
        <>
          <rect x={left} y={top + depth} width={right - left} height={18} rx="3" fill={edge} />
          <rect x={left + 40} y={top + depth + 18} width={22} height={200} fill={edge} />
          <rect x={right - 62} y={top + depth + 18} width={22} height={200} fill={edge} />
          <rect x={left} y={top + depth + 18} width={right - left} height={6} fill="#0F172A" opacity="0.12" />
        </>
      )}
    </g>
  );
}
