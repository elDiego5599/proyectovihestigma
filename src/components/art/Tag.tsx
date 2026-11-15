export type TagTone = 'coral' | 'cobalt' | 'emerald' | 'amber';

const TONES: Record<TagTone, { background: string; stroke: string; text: string }> = {
  coral: { background: '#FFF1F2', stroke: '#F43F5E', text: '#BE123C' },
  cobalt: { background: '#EFF6FF', stroke: '#2563EB', text: '#1D4ED8' },
  emerald: { background: '#ECFDF5', stroke: '#10B981', text: '#047857' },
  amber: { background: '#FFFBEB', stroke: '#F59E0B', text: '#B45309' },
};

export function Tag({
  x,
  y,
  label,
  tone = 'coral',
}: {
  x: number;
  y: number;
  label: string;
  tone?: TagTone;
}) {
  const palette = TONES[tone];
  const width = Math.max(96, label.length * 8.1 + 34);

  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        x={-width / 2}
        y="0"
        width={width}
        height="31"
        rx="15.5"
        fill={palette.background}
        stroke={palette.stroke}
        strokeWidth="1.6"
      />
      <text
        x="0"
        y="20.5"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="13"
        fontWeight="600"
        fill={palette.text}
      >
        {label}
      </text>
    </g>
  );
}
