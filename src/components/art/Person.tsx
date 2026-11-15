export type HairStyle = 'short' | 'bob' | 'curly' | 'bun' | 'long';
export type ArmPose = 'down' | 'open' | 'wave' | 'belly' | 'run';
export type Expression = 'smile' | 'grin' | 'calm';

export interface PersonProps {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  skin?: string;
  hair?: string;
  shirt?: string;
  lower?: string;
  hairStyle?: HairStyle;
  pose?: ArmPose;
  pregnant?: boolean;
  skirt?: boolean;
  shorts?: boolean;
  stride?: boolean;
  expression?: Expression;
  look?: 'left' | 'right' | 'center';
}

const INK = '#1E293B';

function armPath(side: 1 | -1, pose: ArmPose) {
  if (pose === 'open') {
    return side === 1
      ? 'M 43 -276 C 72 -266 96 -246 108 -226'
      : 'M -43 -276 C -72 -266 -96 -246 -108 -226';
  }
  if (pose === 'wave') {
    return side === 1
      ? 'M 43 -276 C 62 -302 70 -336 66 -366'
      : 'M -43 -276 C -56 -240 -58 -192 -52 -150';
  }
  if (pose === 'belly') {
    return side === 1
      ? 'M 43 -276 C 66 -250 64 -208 52 -182'
      : 'M -43 -276 C -66 -250 -64 -208 -52 -182';
  }
  if (pose === 'run') {
    return side === 1
      ? 'M 43 -276 C 68 -266 82 -238 86 -214'
      : 'M -43 -276 C -66 -262 -80 -234 -86 -210';
  }
  return side === 1
    ? 'M 43 -276 C 56 -240 58 -192 52 -150'
    : 'M -43 -276 C -56 -240 -58 -192 -52 -150';
}

function handPoint(side: 1 | -1, pose: ArmPose): [number, number] {
  if (pose === 'open') return [side * 108, -226];
  if (pose === 'wave') return side === 1 ? [66, -366] : [-52, -150];
  if (pose === 'belly') return [side * 52, -182];
  if (pose === 'run') return [side * 86, side === 1 ? -214 : -210];
  return [side * 52, -150];
}

function Hair({
  style,
  color,
  front,
}: {
  style: HairStyle;
  color: string;
  front: boolean;
}) {
  if (front) {
    if (style === 'bob') {
      return (
        <path
          d="M -40 -370 C -26 -397 20 -401 40 -368 C 22 -381 4 -372 -2 -357 C -12 -370 -26 -378 -40 -370 Z"
          fill={color}
          stroke={INK}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );
    }
    if (style === 'long') {
      return (
        <path
          d="M -42 -362 C -24 -399 24 -399 42 -362 C 22 -377 10 -383 0 -362 C -10 -383 -22 -377 -42 -362 Z"
          fill={color}
          stroke={INK}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );
    }
    if (style === 'curly') {
      return (
        <path
          d="M -40 -370 C -30 -393 26 -396 40 -368 C 22 -376 4 -368 -2 -356 C -14 -368 -26 -376 -40 -370 Z"
          fill={color}
          stroke={INK}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );
    }
    return (
      <path
        d="M -41 -366 C -30 -401 30 -401 41 -366 C 18 -379 -18 -379 -41 -366 Z"
        fill={color}
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    );
  }

  if (style === 'bob') {
    return (
      <path
        d="M -48 -348 C -55 -411 55 -411 48 -348 L 48 -294 C 34 -319 30 -332 0 -332 C -30 -332 -34 -319 -48 -294 Z"
        fill={color}
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    );
  }
  if (style === 'long') {
    return (
      <path
        d="M -48 -348 C -55 -411 55 -411 48 -348 L 54 -246 C 34 -268 30 -300 0 -300 C -30 -300 -34 -268 -54 -246 Z"
        fill={color}
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    );
  }
  if (style === 'curly') {
    return (
      <g fill={color} stroke={INK} strokeWidth="2.2">
        <circle cx="-32" cy="-386" r="26" />
        <circle cx="0" cy="-401" r="28" />
        <circle cx="32" cy="-386" r="26" />
        <circle cx="-45" cy="-352" r="18" />
        <circle cx="45" cy="-352" r="18" />
      </g>
    );
  }
  if (style === 'bun') {
    return (
      <g fill={color} stroke={INK} strokeWidth="2.4">
        <circle cx="0" cy="-405" r="18" />
        <path
          d="M -44 -346 C -46 -406 46 -406 44 -346 C 34 -374 18 -385 0 -385 C -18 -385 -34 -374 -44 -346 Z"
          strokeLinejoin="round"
        />
      </g>
    );
  }
  return (
    <path
      d="M -44 -346 C -46 -406 46 -406 44 -346 C 34 -374 18 -385 0 -385 C -18 -385 -34 -374 -44 -346 Z"
      fill={color}
      stroke={INK}
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
  );
}

export function Person({
  x,
  y,
  scale = 1,
  flip = false,
  skin = '#E8B48C',
  hair = '#1F2937',
  shirt = '#F97316',
  lower = '#1E293B',
  hairStyle = 'short',
  pose = 'down',
  pregnant = false,
  skirt = false,
  shorts = false,
  stride = false,
  expression = 'smile',
  look = 'center',
}: PersonProps) {
  const pupil = look === 'left' ? -2.4 : look === 'right' ? 2.4 : 0;
  const mouth =
    expression === 'calm'
      ? 'M -11 -325 Q 0 -321 11 -325'
      : 'M -12 -328 Q 0 -316 12 -328';

  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <ellipse cx="0" cy="2" rx="70" ry="12" fill="#0F172A" opacity="0.07" />

      {skirt ? (
        <g
          fill="none"
          stroke={skin}
          strokeWidth="23"
          strokeLinecap="round"
        >
          <path d="M -26 -104 C -28 -74 -28 -44 -28 -18" />
          <path d="M 26 -104 C 28 -74 28 -44 28 -18" />
        </g>
      ) : shorts ? (
        <g fill="none" stroke={skin} strokeWidth="23" strokeLinecap="round">
          {stride ? (
            <>
              <path d="M -26 -104 C -44 -78 -58 -48 -70 -18" />
              <path d="M 26 -104 C 42 -78 52 -50 60 -22" />
            </>
          ) : (
            <>
              <path d="M -26 -104 C -28 -74 -28 -44 -28 -18" />
              <path d="M 26 -104 C 28 -74 28 -44 28 -18" />
            </>
          )}
        </g>
      ) : stride ? (
        <g fill="none" stroke={lower} strokeWidth="24" strokeLinecap="round">
          <path d="M -26 -134 C -48 -104 -62 -66 -72 -18" />
          <path d="M 26 -134 C 48 -102 58 -70 64 -22" />
        </g>
      ) : (
        <g fill="none" stroke={lower} strokeWidth="24" strokeLinecap="round">
          <path d="M -26 -134 C -30 -96 -30 -54 -30 -18" />
          <path d="M 26 -134 C 30 -96 30 -54 30 -18" />
        </g>
      )}

      {stride ? (
        <g fill="#F8FAFC" stroke={INK} strokeWidth="2.4">
          <ellipse cx="-74" cy="-10" rx="23" ry="10" transform="rotate(-16 -74 -10)" />
          <ellipse cx="66" cy="-12" rx="23" ry="10" transform="rotate(14 66 -12)" />
        </g>
      ) : (
        <g fill="#F8FAFC" stroke={INK} strokeWidth="2.4">
          <rect x="-48" y="-18" width="38" height="18" rx="8" />
          <rect x="10" y="-18" width="38" height="18" rx="8" />
          <path d="M -46 -6 H -12 M 12 -6 H 46" stroke={lower} strokeWidth="3" strokeLinecap="round" />
        </g>
      )}

      <g fill="none" strokeLinecap="round">
        {([1, -1] as const).map((side) => (
          <g key={side}>
            <path d={armPath(side, pose)} stroke={INK} strokeWidth="24" />
            <path d={armPath(side, pose)} stroke={skin} strokeWidth="18" />
          </g>
        ))}
        {([1, -1] as const).map((side) => {
          const [handX, handY] = handPoint(side, pose);
          return (
            <circle
              key={side}
              cx={handX}
              cy={handY}
              r="10"
              fill={skin}
              stroke={INK}
              strokeWidth="2.2"
            />
          );
        })}
      </g>

      <rect
        x="-14"
        y="-326"
        width="28"
        height="38"
        rx="11"
        fill={skin}
        stroke={INK}
        strokeWidth="2.2"
      />

      {skirt ? (
        <path
          d="M -46 -142 L 46 -142 L 64 -58 C 28 -45 -28 -45 -64 -58 Z"
          fill={lower}
          stroke={INK}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      ) : null}

      <path
        d="M -45 -292 C -58 -262 -60 -200 -52 -132 L 52 -132 C 60 -200 58 -262 45 -292 C 30 -303 -30 -303 -45 -292 Z"
        fill={shirt}
        stroke={INK}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {pregnant ? (
        <g>
          <ellipse
            cx="0"
            cy="-174"
            rx="52"
            ry="60"
            fill={shirt}
            stroke={INK}
            strokeWidth="2.4"
          />
          <path
            d="M -30 -188 C -18 -206 8 -212 28 -198"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeOpacity="0.55"
            strokeLinecap="round"
          />
        </g>
      ) : null}

      {shorts ? (
        <path
          d="M -50 -140 L 50 -140 L 44 -74 L 8 -74 L 0 -112 L -8 -74 L -44 -74 Z"
          fill={lower}
          stroke={INK}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      ) : null}

      <g>
        <Hair style={hairStyle} color={hair} front={false} />
        <circle cx="-42" cy="-350" r="9" fill={skin} stroke={INK} strokeWidth="2.2" />
        <circle cx="42" cy="-350" r="9" fill={skin} stroke={INK} strokeWidth="2.2" />
        <circle cx="0" cy="-350" r="42" fill={skin} stroke={INK} strokeWidth="2.4" />
        <Hair style={hairStyle} color={hair} front />

        <path
          d="M -25 -371 Q -17 -378 -9 -372"
          fill="none"
          stroke={INK}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M 9 -372 Q 17 -378 25 -371"
          fill="none"
          stroke={INK}
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        <g>
          <circle cx="-17" cy="-351" r="5.6" fill="#FFFFFF" stroke={INK} strokeWidth="1.6" />
          <circle cx="17" cy="-351" r="5.6" fill="#FFFFFF" stroke={INK} strokeWidth="1.6" />
          <circle cx={-17 + pupil} cy="-351" r="2.9" fill={INK} />
          <circle cx={17 + pupil} cy="-351" r="2.9" fill={INK} />
        </g>

        <path
          d="M 0 -347 Q 5 -341 0 -338"
          fill="none"
          stroke={INK}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d={mouth}
          fill="none"
          stroke={INK}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <circle cx="-27" cy="-336" r="7" fill="#FB7185" opacity="0.18" />
        <circle cx="27" cy="-336" r="7" fill="#FB7185" opacity="0.18" />
      </g>
    </g>
  );
}
