import { gsap } from '../../lib/gsap';
import { Person } from '../art/Person';
import { Stage, SceneRoot, useSceneAnimation } from '../art/Stage';

interface ScenarioProps {
  isResolved?: boolean;
}

const SCALE = 1.22;
const BASE_Y = 452;
const P_X = 300;
const BOTTLE = { x: P_X + 48 * SCALE, y: BASE_Y - 130 * SCALE };
const MOUTH = { x: P_X + 12 * SCALE, y: BASE_Y - 142 * SCALE };
const YEARS = [2026, 2031, 2036, 2041, 2046];

/** Frasco de tratamiento antirretroviral, en coordenadas locales de quien lo sostiene. */
function PillBottle() {
  return (
    <g transform="translate(48 -82)">
      <rect x="-18" y="-46" width="36" height="12" rx="3" fill="#047857" />
      <rect x="-16" y="-36" width="32" height="46" rx="6" fill="#FFFFFF" stroke="#A7F3D0" strokeWidth="2" />
      <rect x="-16" y="-24" width="32" height="18" fill="#10B981" />
      <path d="M -6 -15 L 6 -15 M 0 -21 L 0 -9" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Pill() {
  return (
    <g id="daily-pill" opacity="0">
      <rect x="-11" y="-5" width="22" height="10" rx="5" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" />
      <path d="M 0 -5 L 0 5 L 6 5 A 5 5 0 0 0 6 -5 Z" fill="#10B981" />
    </g>
  );
}

/** Calendario de pared: los años pasan. */
function Calendar() {
  return (
    <g transform="translate(560 70)">
      <rect x="0" y="0" width="170" height="160" rx="16" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
      <rect x="0" y="0" width="170" height="44" rx="16" fill="#3B82F6" />
      <rect x="0" y="28" width="170" height="16" fill="#3B82F6" />
      <circle cx="44" cy="6" r="6" fill="#1E3A8A" />
      <circle cx="126" cy="6" r="6" fill="#1E3A8A" />
      <text x="85" y="30" textAnchor="middle" fontSize="16" fontWeight="700" fill="#FFFFFF" fontFamily="inherit">
        Año
      </text>
      {YEARS.map((y, i) => (
        <text
          key={y}
          className={`year year-${i}`}
          x="85"
          y="112"
          textAnchor="middle"
          fontSize="44"
          fontWeight="800"
          fill="#1E293B"
          fontFamily="inherit"
          opacity={i === 0 ? 1 : 0}
        >
          {y}
        </text>
      ))}
      <text x="85" y="142" textAnchor="middle" fontSize="13" fontWeight="600" fill="#64748B" fontFamily="inherit">
        con tratamiento
      </text>
    </g>
  );
}

/** Medidor de defensas: se mantiene lleno y verde. */
function DefenseMeter() {
  return (
    <g transform="translate(800 92)">
      <rect x="0" y="0" width="230" height="116" rx="18" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
      <g transform="translate(36 40)">
        <path id="shield" d="M 0 -20 L 18 -13 L 18 2 C 18 14, 9 21, 0 25 C -9 21, -18 14, -18 2 L -18 -13 Z" fill="#10B981" />
        <path d="M -7 2 L -2 7 L 8 -4" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="66" y="38" fontSize="18" fontWeight="700" fill="#1E293B" fontFamily="inherit">
        Defensas
      </text>
      <text x="66" y="58" fontSize="13" fontWeight="600" fill="#059669" fontFamily="inherit">
        Estables
      </text>
      <rect x="20" y="78" width="190" height="16" rx="8" fill="#E2E8F0" />
      <rect id="defense-bar" x="20" y="78" width="178" height="16" rx="8" fill="#10B981" />
    </g>
  );
}

function Background() {
  return (
    <g>
      {/* Sala: pared cálida, zócalo y piso */}
      <rect width="1100" height="480" fill="#FEF7EC" />
      <rect y="330" width="1100" height="150" fill="#F3E3C8" />
      <rect y="318" width="1100" height="14" fill="#E9D3AE" />
      {/* Ventana */}
      <g transform="translate(60 56)">
        <rect width="170" height="180" rx="12" fill="#FFFFFF" />
        <rect x="12" y="12" width="146" height="156" rx="8" fill="#DBEAFE" />
        <circle cx="116" cy="54" r="20" fill="#FEF3C7" />
        <path d="M 12 136 C 50 116, 100 128, 158 112 L 158 168 L 12 168 Z" fill="#BBF7D0" />
        <rect x="83" y="12" width="4" height="156" fill="#FFFFFF" />
      </g>
      {/* Planta */}
      <g transform="translate(1040 330)">
        <rect x="-26" y="-46" width="52" height="50" rx="8" fill="#F59E0B" />
        <path d="M 0 -46 C -30 -80, -40 -120, -18 -150 C -4 -110, -2 -80, 0 -46 Z" fill="#22C55E" />
        <path d="M 0 -46 C 26 -90, 40 -110, 30 -150 C 12 -120, 4 -90, 0 -46 Z" fill="#16A34A" />
      </g>
      {/* Sofá */}
      <g transform="translate(560 280)">
        <rect x="0" y="0" width="300" height="70" rx="22" fill="#A5B4FC" />
        <rect x="-16" y="30" width="332" height="80" rx="22" fill="#818CF8" />
        <rect x="16" y="108" width="12" height="22" fill="#6366F1" />
        <rect x="272" y="108" width="12" height="22" fill="#6366F1" />
      </g>
    </g>
  );
}

export function HivAidsScenario(_props: ScenarioProps) {
  const rootRef = useSceneAnimation(() => {
    gsap.to('#hiv-person', { y: -3, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('#shield', { scale: 1.08, transformOrigin: '50% 50%', duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    const STEP = 1.8;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
    tl.set('.year', { opacity: 0, y: 0 }).set('.year-0', { opacity: 1 });

    YEARS.forEach((_, i) => {
      const t = i * STEP;
      // Toma su pastilla diaria
      tl.set('#daily-pill', { x: BOTTLE.x, y: BOTTLE.y, opacity: 0, scale: 1, transformOrigin: '50% 50%' }, t)
        .to('#daily-pill', { opacity: 1, duration: 0.15 }, t + 0.1)
        .to(
          '#daily-pill',
          {
            duration: 0.7,
            ease: 'sine.inOut',
            motionPath: {
              path: [
                { x: BOTTLE.x, y: BOTTLE.y },
                { x: (BOTTLE.x + MOUTH.x) / 2, y: MOUTH.y - 40 },
                { x: MOUTH.x, y: MOUTH.y },
              ],
              curviness: 1.4,
            },
          },
          t + 0.1,
        )
        .to('#daily-pill', { opacity: 0, scale: 0.4, duration: 0.2 }, t + 0.8)
        // Las defensas siguen arriba
        .fromTo('#defense-bar', { attr: { width: 168 } }, { attr: { width: 178 }, duration: 0.5, ease: 'power2.out' }, t + 0.9);

      // Pasan los años
      if (i < YEARS.length - 1) {
        tl.to(`.year-${i}`, { opacity: 0, y: -14, duration: 0.3 }, t + 1.4).fromTo(
          `.year-${i + 1}`,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.3 },
          t + 1.5,
        );
      }
    });
    tl.to({}, { duration: 1 });
  });

  return (
    <SceneRoot rootRef={rootRef}>
      <Stage
        label="Una persona con VIH toma su tratamiento cada día. Los años pasan en el calendario y su medidor de defensas se mantiene lleno y verde: no desarrolla SIDA."
        background={<Background />}
      >
        <Calendar />
        <DefenseMeter />
        <g id="hiv-person">
          <Person
            x={P_X}
            y={BASE_Y}
            scale={SCALE}
            shirtColor="#0D9488"
            shirtShadow="#0F766E"
            skinColor="#C68642"
            skinShadow="#A0692F"
            hairColor="#1C1917"
            hairStyle="wavy"
            expression="happy"
            arms={['down', 'hold']}
            held={<PillBottle />}
          />
        </g>
        <Pill />
      </Stage>
    </SceneRoot>
  );
}
