import { gsap } from '../../lib/gsap';
import { Person } from '../art/Person';
import { Stage, SceneRoot, useSceneAnimation } from '../art/Stage';

interface ScenarioProps {
  isResolved?: boolean;
}

const A_X = 210;
const A_Y = 452;
const A_SCALE = 1.22;
// Lupa en coordenadas locales de Andrés
const LENS = { x: 92, y: -156 };
const LENS_W = { x: A_X + LENS.x * A_SCALE, y: A_Y + LENS.y * A_SCALE };

const P_SCALE = 1.08;
const P_Y = 456;
const PEOPLE = [
  { x: 560, shirt: '#F59E0B', shadow: '#B45309', skin: '#F2C19E', skinShadow: '#D09772', hair: '#78350F', style: 'bob' as const, delay: 0.6 },
  { x: 770, shirt: '#0EA5E9', shadow: '#0369A1', skin: '#8D5524', skinShadow: '#6B3E18', hair: '#0F172A', style: 'short' as const, delay: 1.9 },
  { x: 975, shirt: '#22C55E', shadow: '#15803D', skin: '#C68642', skinShadow: '#A0692F', hair: '#1C1917', style: 'curly' as const, delay: 1.1 },
];
const faceY = P_Y - 165 * P_SCALE;

/** Lupa que Andrés sostiene, en sus coordenadas locales. */
function Magnifier() {
  return (
    <g>
      <line x1="48" y1="-80" x2={LENS.x - 14} y2={LENS.y + 20} stroke="#334155" strokeWidth="9" strokeLinecap="round" />
      <circle cx={LENS.x} cy={LENS.y} r="24" fill="#E0F2FE" opacity="0.75" stroke="#334155" strokeWidth="6" />
      <path d={`M ${LENS.x - 12} ${LENS.y - 8} Q ${LENS.x - 8} ${LENS.y - 14} ${LENS.x} ${LENS.y - 15}`} stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Question({ x, i }: { x: number; i: number }) {
  return (
    <g transform={`translate(${x} ${faceY - 104})`}>
      <g className={`ask ask-${i}`} opacity="0">
        <circle r="24" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
        <path d="M -8 22 L 0 34 L 6 21 Z" fill="#FFFFFF" />
        <text y="10" textAnchor="middle" fontSize="30" fontWeight="900" fill="#64748B" fontFamily="inherit">?</text>
      </g>
    </g>
  );
}

/** Prueba rápida de VIH: lo único que permite saberlo. */
function TestKit() {
  return (
    <g transform="translate(400 96)">
      <g id="test-kit" opacity="0">
        <rect x="-62" y="-30" width="124" height="60" rx="14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
        <rect x="-44" y="-10" width="56" height="20" rx="6" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
        <line x1="-30" y1="-6" x2="-30" y2="6" stroke="#E11D48" strokeWidth="3" />
        <line x1="-6" y1="-6" x2="-6" y2="6" stroke="#E11D48" strokeWidth="3" />
        <circle cx="34" cy="0" r="9" fill="none" stroke="#94A3B8" strokeWidth="2" />
        <g transform="translate(58 -26)">
          <circle r="15" fill="#10B981" />
          <path d="M -6 0 L -1 5 L 7 -5" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </g>
  );
}

function Background() {
  return (
    <g>
      <rect width="1100" height="480" fill="#E0F2FE" />
      {/* Edificios de la calle */}
      {[
        [40, 120, 150, '#BFDBFE'],
        [300, 70, 170, '#C7D2FE'],
        [500, 140, 140, '#DBEAFE'],
        [680, 90, 160, '#BFDBFE'],
        [880, 60, 190, '#C7D2FE'],
      ].map(([x, y, w, c]) => (
        <g key={x as number}>
          <rect x={x as number} y={y as number} width={w as number} height={480} rx="10" fill={c as string} />
          {Array.from({ length: 6 }).map((_, r) =>
            [0, 1, 2].map((k) => (
              <rect
                key={`${r}-${k}`}
                x={(x as number) + 20 + k * (((w as number) - 40) / 3)}
                y={(y as number) + 24 + r * 46}
                width={((w as number) - 40) / 3 - 14}
                height="26"
                rx="4"
                fill="#FFFFFF"
                opacity="0.6"
              />
            )),
          )}
        </g>
      ))}
      {/* Acera */}
      <rect y="350" width="1100" height="130" fill="#CBD5E1" />
      <rect y="344" width="1100" height="10" fill="#E2E8F0" />
    </g>
  );
}

export function AppearanceScenario(_props: ScenarioProps) {
  const rootRef = useSceneAnimation(() => {
    PEOPLE.forEach((p, i) => {
      gsap.to(`#look-${i}`, { y: -3, duration: 1.6 + i * 0.3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
    tl.set('#beam', { attr: { x2: LENS_W.x, y2: LENS_W.y }, opacity: 0 })
      .set('.ask', { scale: 0, opacity: 0, transformOrigin: '50% 100%' })
      .set('#test-kit', { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' });

    // Andrés examina a cada persona con su lupa: por fuera no se nota nada
    PEOPLE.forEach((p, i) => {
      const t = 0.4 + i * 1.6;
      tl.to('#beam', { opacity: 1, duration: 0.25 }, t)
        .to('#beam', { attr: { x2: p.x, y2: faceY }, duration: 0.7, ease: 'power2.inOut' }, t)
        .to(`.ask-${i}`, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2.2)' }, t + 0.8)
        .to('#beam', { opacity: 0, duration: 0.25 }, t + 1.2);
    });

    // Solo una prueba de VIH permite saberlo
    tl.to('#test-kit', { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.8)' }, 5.4)
      .to('#test-kit', { scale: 1.06, duration: 0.5, repeat: 3, yoyo: true, ease: 'sine.inOut' }, 6)
      .to('.ask, #test-kit', { opacity: 0, duration: 0.5 }, 8.4);
  });

  return (
    <SceneRoot rootRef={rootRef}>
      <Stage
        label="Andrés mira con una lupa a tres personas en la calle; todas se ven sanas y sobre cada una aparece un signo de pregunta. Al final aparece una prueba de VIH, la única forma de saberlo."
        background={<Background />}
      >
        <Person
          x={A_X}
          y={A_Y}
          scale={A_SCALE}
          shirtColor="#6366F1"
          shirtShadow="#4338CA"
          skinColor="#E0AC84"
          skinShadow="#BF8760"
          hairColor="#1E293B"
          hairStyle="short"
          expression="focused"
          arms={['down', 'hold']}
          held={<Magnifier />}
        />

        {PEOPLE.map((p, i) => (
          <g key={p.x} id={`look-${i}`}>
            <Person
              x={p.x}
              y={P_Y}
              scale={P_SCALE}
              flip
              shirtColor={p.shirt}
              shirtShadow={p.shadow}
              skinColor={p.skin}
              skinShadow={p.skinShadow}
              hairColor={p.hair}
              hairStyle={p.style}
              expression="happy"
              blinkDelay={p.delay}
            />
          </g>
        ))}

        <line
          id="beam"
          x1={LENS_W.x}
          y1={LENS_W.y}
          x2={LENS_W.x}
          y2={LENS_W.y}
          stroke="#6366F1"
          strokeWidth="3"
          strokeDasharray="2 9"
          strokeLinecap="round"
          opacity="0"
        />
        {PEOPLE.map((p, i) => (
          <Question key={p.x} x={p.x} i={i} />
        ))}
        <TestKit />
      </Stage>
    </SceneRoot>
  );
}
