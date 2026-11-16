import type { ReactNode } from 'react';

export type HairStyle = 'short' | 'curly' | 'bun' | 'bob' | 'wavy';
export type Expression = 'calm' | 'alert' | 'relieved' | 'focused' | 'happy';
export type ArmPose = 'down' | 'reach' | 'hold' | 'cradle' | 'table';
export type Sleeves = 'short' | 'long';

type Pt = readonly [number, number];

/**
 * Geometría de cada pose para el brazo del lado +x (el que mira hacia delante).
 * S = hombro, E = codo, H = mano. El brazo del lado -x se obtiene reflejando x.
 */
const POSES: Record<ArmPose, { S: Pt; E: Pt; H: Pt }> = {
  down: { S: [58, -108], E: [76, -42], H: [80, 18] },
  reach: { S: [58, -108], E: [98, -58], H: [160, -70] },
  hold: { S: [58, -108], E: [100, -44], H: [64, -80] },
  cradle: { S: [58, -108], E: [80, -40], H: [6, -32] },
  table: { S: [58, -108], E: [82, -46], H: [40, -62] },
};

const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** Curva cuadrática que pasa por S (t=0), E (t=0.5) y H (t=1): el codo queda redondeado. */
function armCurve(S: Pt, E: Pt, H: Pt) {
  const C: Pt = [2 * E[0] - (S[0] + H[0]) / 2, 2 * E[1] - (S[1] + H[1]) / 2];
  const at = (t: number): Pt => {
    const u = 1 - t;
    return [u * u * S[0] + 2 * u * t * C[0] + t * t * H[0], u * u * S[1] + 2 * u * t * C[1] + t * t * H[1]];
  };
  const tangent = (t: number): Pt => {
    const dx = 2 * (1 - t) * (C[0] - S[0]) + 2 * t * (H[0] - C[0]);
    const dy = 2 * (1 - t) * (C[1] - S[1]) + 2 * t * (H[1] - C[1]);
    const len = Math.hypot(dx, dy) || 1;
    return [dx / len, dy / len];
  };
  return { at, tangent };
}

/** Contorno relleno de un tramo del brazo entre t0 y t1, con grosor decreciente hacia la muñeca. */
function tubePath(S: Pt, E: Pt, H: Pt, t0: number, t1: number, extra = 0) {
  const { at, tangent } = armCurve(S, E, H);
  const width = (t: number) => 29 - 8 * t + extra;
  const steps = 16;
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = t0 + ((t1 - t0) * i) / steps;
    const [x, y] = at(t);
    const [tx, ty] = tangent(t);
    const w = width(t) / 2;
    left.push(`${(x - ty * w).toFixed(1)} ${(y + tx * w).toFixed(1)}`);
    right.push(`${(x + ty * w).toFixed(1)} ${(y - tx * w).toFixed(1)}`);
  }
  return `M ${left.join(' L ')} L ${right.reverse().join(' L ')} Z`;
}

/** Punto sobre la cara exterior del antebrazo (lado +x, sin escala). Útil para colocar picaduras. */
export function forearmPoint(pose: ArmPose, t: number, outward = 10): Pt {
  const { S, E, H } = POSES[pose];
  const [x, y] = armCurve(S, E, H).at(0.5 + t / 2);
  return [x + outward, y];
}

export interface PersonProps {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  skinColor?: string;
  skinShadow?: string;
  shirtColor?: string;
  shirtShadow?: string;
  hairColor?: string;
  hairStyle?: HairStyle;
  expression?: Expression;
  /** [brazo trasero (-x), brazo delantero (+x)] */
  arms?: [ArmPose, ArmPose];
  sleeves?: Sleeves;
  /** Se dibuja en coordenadas locales sobre los brazos; con la pose 'hold' los dedos rodean x 34–72, y -91 a -67 (vasos, bebés, botellas…). */
  held?: ReactNode;
  /** Retraso del parpadeo, para que no parpadeen todos a la vez. */
  blinkDelay?: number;
  id?: string;
}

function Arm({
  side,
  pose,
  skin,
  skinShadow,
  shirt,
  shirtShadow,
  sleeves,
}: {
  side: 1 | -1;
  pose: ArmPose;
  skin: string;
  skinShadow: string;
  shirt: string;
  shirtShadow: string;
  sleeves: Sleeves;
}) {
  const p = POSES[pose];
  const m = (pt: Pt): Pt => [pt[0] * side, pt[1]];
  const S = m(p.S);
  const E = m(p.E);
  const H = m(p.H);
  const curve = armCurve(S, E, H);
  const sleeveEnd = sleeves === 'short' ? 0.3 : 0.9;
  const [hx, hy] = curve.at(sleeveEnd);
  const [tx, ty] = curve.tangent(sleeveEnd);
  const hemW = (29 - 8 * sleeveEnd + 3) / 2;

  return (
    <g>
      {/* Piel del brazo completo */}
      <path d={tubePath(S, E, H, 0, 1)} fill={skin} />
      {/* Manga: hombro redondeado del mismo color de la camiseta */}
      <circle cx={S[0]} cy={S[1]} r="16" fill={shirt} />
      <path
        d={tubePath(S, E, H, 0, sleeveEnd, 3)}
        fill={shirt}
      />
      {/* Dobladillo */}
      <line
        x1={hx - ty * hemW}
        y1={hy + tx * hemW}
        x2={hx + ty * hemW}
        y2={hy - tx * hemW}
        stroke={shirtShadow}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      {/* Mano */}
      <ellipse cx={H[0]} cy={H[1]} rx="12" ry="13" fill={skin} />
      <ellipse cx={H[0] - 4 * side} cy={H[1] + 3} rx="5" ry="6" fill={skinShadow} opacity="0.3" />
    </g>
  );
}

/** Dedos que rodean el objeto por delante: la palma queda al costado (en H) y el pulgar encima. */
function Fist({ side, skin, skinShadow }: { side: 1 | -1; skin: string; skinShadow: string }) {
  const [hx, hy] = POSES.hold.H;
  const x0 = (hx - 30) * side;
  const x1 = (hx + 8) * side;
  const left = Math.min(x0, x1);
  const w = Math.abs(x1 - x0);
  return (
    <g>
      <rect x={left} y={hy - 11} width={w} height="24" rx="11" fill={skin} />
      {[-1, 5].map((dy) => (
        <path
          key={dy}
          d={`M ${x0 + 5 * side} ${hy + dy} Q ${(hx - 14) * side} ${hy + dy + 2.5} ${(hx - 2) * side} ${hy + dy}`}
          stroke={skinShadow}
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
      ))}
      {/* Pulgar */}
      <ellipse cx={(hx - 20) * side} cy={hy - 10} rx="8" ry="5" fill={skin} stroke={skinShadow} strokeWidth="1.2" strokeOpacity="0.5" />
    </g>
  );
}

export function Person({
  x,
  y,
  scale = 1,
  flip = false,
  skinColor = '#E8B48C',
  skinShadow = '#CC8E67',
  shirtColor = '#3B82F6',
  shirtShadow = '#1D4ED8',
  hairColor = '#1E293B',
  hairStyle = 'short',
  expression = 'calm',
  arms = ['down', 'down'],
  sleeves = 'long',
  held,
  blinkDelay = 0,
  id,
}: PersonProps) {
  const grips = arms.includes('hold');
  const armProps = { skin: skinColor, skinShadow, shirt: shirtColor, shirtShadow, sleeves };

  return (
    <g id={id} transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      {/* Cabello posterior */}
      {hairStyle === 'bun' && <circle cx="0" cy="-215" r="28" fill={hairColor} />}
      {hairStyle === 'curly' && (
        <g fill={hairColor}>
          <circle cx="-42" cy="-188" r="26" />
          <circle cx="42" cy="-188" r="26" />
          <circle cx="0" cy="-210" r="30" />
          <circle cx="-32" cy="-156" r="22" />
          <circle cx="32" cy="-156" r="22" />
        </g>
      )}
      {hairStyle === 'bob' && (
        <path
          d="M -34 -90 C -42 -95, -54 -115, -55 -168 C -56 -232, 56 -232, 55 -168 C 54 -115, 42 -95, 34 -90 Z"
          fill={hairColor}
        />
      )}
      {hairStyle === 'wavy' && (
        <path
          d="M -30 -76 C -40 -84, -62 -110, -54 -170 C -52 -232, 52 -232, 54 -170 C 62 -110, 40 -84, 30 -76 Z"
          fill={hairColor}
        />
      )}
      <ellipse cx="0" cy="-168" rx="48" ry="50" fill={hairColor} />

      {/* Torso */}
      <path
        d="M -62 40 L -66 -78 C -66 -108, -48 -124, -18 -128 L 18 -128 C 48 -124, 66 -108, 66 -78 L 62 40 Z"
        fill={shirtColor}
      />
      <path
        d="M -62 40 L -66 -78 C -66 -100, -56 -114, -40 -120 C -46 -80, -46 -20, -42 40 Z"
        fill={shirtShadow}
        opacity="0.35"
      />
      {/* Cuello de la camiseta */}
      <path d="M -26 -126 C -18 -104, 18 -104, 26 -126 Z" fill={shirtShadow} opacity="0.45" />

      {/* Cuello */}
      <rect x="-16" y="-142" width="32" height="34" rx="14" fill={skinColor} />
      <path d="M -16 -134 Q 0 -120 16 -134 L 16 -122 Q 0 -110 -16 -122 Z" fill={skinShadow} opacity="0.7" />

      {!grips && held}
      <Arm side={-1} pose={arms[0]} {...armProps} />
      <Arm side={1} pose={arms[1]} {...armProps} />

      {/* Al sujetar, el objeto va sobre el antebrazo y el puño lo envuelve por delante */}
      {grips && held}
      {arms[1] === 'hold' && <Fist side={1} skin={skinColor} skinShadow={skinShadow} />}
      {arms[0] === 'hold' && <Fist side={-1} skin={skinColor} skinShadow={skinShadow} />}

      {/* Orejas */}
      <circle cx="-43" cy="-165" r="10" fill={skinColor} />
      <circle cx="-43" cy="-165" r="5.5" fill={skinShadow} opacity="0.6" />
      <circle cx="43" cy="-165" r="10" fill={skinColor} />
      <circle cx="43" cy="-165" r="5.5" fill={skinShadow} opacity="0.6" />

      {/* Rostro */}
      <rect x="-42" y="-212" width="84" height="96" rx="42" fill={skinColor} />
      <circle cx="-26" cy="-154" r="9" fill="#F43F5E" opacity="0.14" />
      <circle cx="26" cy="-154" r="9" fill="#F43F5E" opacity="0.14" />

      {/* Cabello frontal */}
      {hairStyle === 'short' && (
        <path d="M -44 -178 C -40 -232, 40 -232, 44 -178 C 28 -196, -16 -198, -44 -178 Z" fill={hairColor} />
      )}
      {hairStyle === 'curly' && (
        <path
          d="M -44 -176 C -38 -232, 38 -232, 44 -176 C 30 -188, 14 -196, 0 -188 C -14 -196, -30 -188, -44 -176 Z"
          fill={hairColor}
        />
      )}
      {hairStyle === 'bun' && (
        <path d="M -44 -180 C -38 -234, 38 -234, 44 -180 C 24 -198, -24 -198, -44 -180 Z" fill={hairColor} />
      )}
      {(hairStyle === 'bob' || hairStyle === 'wavy') && (
        <path
          d="M -44 -174 C -38 -232, 38 -232, 44 -174 C 32 -190, 16 -196, -2 -188 C -20 -196, -34 -190, -44 -174 Z"
          fill={hairColor}
        />
      )}

      {/* Nariz */}
      <path
        d="M 0 -166 C 1 -156, 3 -152, 6 -152"
        fill="none"
        stroke={skinShadow}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Cejas */}
      <g fill="none" stroke={hairColor} strokeWidth="3.2" strokeLinecap="round">
        <path
          d={
            expression === 'alert'
              ? 'M -27 -182 L -13 -188'
              : expression === 'focused'
                ? 'M -27 -183 L -13 -181'
                : 'M -26 -183 Q -19 -188 -13 -183'
          }
        />
        <path
          d={
            expression === 'alert'
              ? 'M 13 -188 L 27 -182'
              : expression === 'focused'
                ? 'M 13 -181 L 27 -183'
                : 'M 13 -183 Q 19 -188 26 -183'
          }
        />
      </g>

      {/* Ojos (parpadean con CSS) */}
      <g className="person-eyes" style={{ animationDelay: `${blinkDelay}s` }}>
        {expression === 'happy' ? (
          <g fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round">
            <path d="M -24 -167 Q -19 -173 -14 -167" />
            <path d="M 14 -167 Q 19 -173 24 -167" />
          </g>
        ) : (
          <>
            <circle cx="-19" cy="-168" r="4.4" fill="#0F172A" />
            <circle cx="-17.5" cy="-170.5" r="1.4" fill="#FFFFFF" />
            <circle cx="19" cy="-168" r="4.4" fill="#0F172A" />
            <circle cx="20.5" cy="-170.5" r="1.4" fill="#FFFFFF" />
          </>
        )}
      </g>

      {/* Boca */}
      {expression === 'alert' ? (
        <ellipse cx="0" cy="-143" rx="6" ry="4.5" fill="#7C2D12" opacity="0.8" />
      ) : expression === 'happy' ? (
        <path d="M -13 -147 Q 0 -128 13 -147 Z" fill="#7C2D12" opacity="0.85" />
      ) : expression === 'relieved' ? (
        <path d="M -12 -145 Q 0 -134 12 -145" fill="none" stroke="#994D28" strokeWidth="3" strokeLinecap="round" />
      ) : expression === 'focused' ? (
        <path d="M -9 -144 L 9 -144" fill="none" stroke="#994D28" strokeWidth="2.8" strokeLinecap="round" />
      ) : (
        <path d="M -11 -145 Q 0 -138 11 -145" fill="none" stroke="#994D28" strokeWidth="3" strokeLinecap="round" />
      )}
    </g>
  );
}
