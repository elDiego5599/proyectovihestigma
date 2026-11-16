export type TagTone = 'neutral' | 'emerald' | 'amber' | 'rose';

const TONES: Record<TagTone, { background: string; text: string; dot: string }> = {
  neutral: { background: '#0F172A', text: '#FFFFFF', dot: '#94A3B8' },
  emerald: { background: '#065F46', text: '#FFFFFF', dot: '#34D399' },
  amber: { background: '#78350F', text: '#FFFFFF', dot: '#FBBF24' },
  rose: { background: '#9F1239', text: '#FFFFFF', dot: '#FB7185' },
};

/**
 * Etiqueta explicativa que aparece sobre la escena después de responder.
 * Empieza oculta (clase `reveal`) y la anima `useReveal`.
 * Si se pasa `pointTo`, dibuja una línea fina hasta el detalle que explica.
 */
export function Tag({
  x,
  y,
  label,
  tone = 'neutral',
  pointTo,
}: {
  x: number;
  y: number;
  label: string;
  tone?: TagTone;
  pointTo?: [number, number];
}) {
  const palette = TONES[tone];
  const width = label.length * 7.4 + 44;
  const height = 32;

  return (
    <g className="reveal" opacity="0" style={{ pointerEvents: 'none' }}>
      {pointTo && (
        <>
          <line
            x1={x}
            y1={y + height / 2}
            x2={pointTo[0]}
            y2={pointTo[1]}
            stroke={palette.background}
            strokeWidth="1.5"
            strokeDasharray="3 4"
            opacity="0.7"
          />
          <circle cx={pointTo[0]} cy={pointTo[1]} r="4" fill={palette.background} />
        </>
      )}
      <g transform={`translate(${x - width / 2} ${y})`}>
        <rect width={width} height={height} rx={height / 2} fill={palette.background} />
        <circle cx="17" cy={height / 2} r="4" fill={palette.dot} />
        <text
          x="29"
          y="21"
          fontFamily="inherit"
          fontSize="13"
          fontWeight="650"
          letterSpacing="0.005em"
          fill={palette.text}
        >
          {label}
        </text>
      </g>
    </g>
  );
}
