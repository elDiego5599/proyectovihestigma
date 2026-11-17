import { gsap } from '../../lib/gsap';
import { Person, type HairStyle } from '../art/Person';
import { Stage, SceneRoot, useSceneAnimation } from '../art/Stage';

interface ScenarioProps {
  isResolved?: boolean;
}

const SCALE = 0.98;
const BASE_Y = 470;
const HEAD_Y = BASE_Y - 250 * SCALE;

const PEOPLE: {
  x: number;
  label: string;
  shirt: string;
  shadow: string;
  skin: string;
  skinShadow: string;
  hair: string;
  style: HairStyle;
}[] = [
  { x: 150, label: 'Estudiante', shirt: '#3B82F6', shadow: '#1D4ED8', skin: '#F2C19E', skinShadow: '#D09772', hair: '#78350F', style: 'short' },
  { x: 350, label: 'Abuela', shirt: '#A855F7', shadow: '#7E22CE', skin: '#E0AC84', skinShadow: '#BF8760', hair: '#CBD5E1', style: 'bun' },
  { x: 550, label: 'Deportista', shirt: '#F43F5E', shadow: '#BE123C', skin: '#8D5524', skinShadow: '#6B3E18', hair: '#0F172A', style: 'curly' },
  { x: 750, label: 'Mamá', shirt: '#F59E0B', shadow: '#B45309', skin: '#C68642', skinShadow: '#A0692F', hair: '#1C1917', style: 'wavy' },
  { x: 950, label: 'Profesor', shirt: '#10B981', shadow: '#047857', skin: '#F2C19E', skinShadow: '#D09772', hair: '#475569', style: 'short' },
];

function Pill({ x, i, label }: { x: number; i: number; label: string }) {
  const w = label.length * 9.5 + 32;
  return (
    <g transform={`translate(${x} ${HEAD_Y - 54})`}>
      <g className={`who who-${i}`} opacity="0">
        <rect x={-w / 2} y="-18" width={w} height="36" rx="18" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
        <text y="6" textAnchor="middle" fontSize="16" fontWeight="800" fill="#334155" fontFamily="inherit">
          {label}
        </text>
      </g>
    </g>
  );
}

/** Escudo de cuidado que aparece sobre cada persona: todos pueden protegerse. */
function Shield({ x, i }: { x: number; i: number }) {
  return (
    <g transform={`translate(${x} ${HEAD_Y - 54})`}>
      <g className={`shield shield-${i}`} opacity="0">
        <path d="M 0 -22 L 19 -15 L 19 1 C 19 13, 10 20, 0 24 C -10 20, -19 13, -19 1 L -19 -15 Z" fill="#10B981" />
        <path d="M -8 1 L -2 7 L 9 -5" stroke="#FFFFFF" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
}

function Background() {
  return (
    <g>
      <rect width="1100" height="480" fill="#ECFEFF" />
      {/* Plaza: árboles y faroles */}
      {[90, 1010].map((x) => (
        <g key={x}>
          <rect x={x - 7} y="220" width="14" height="140" rx="5" fill="#A16207" />
          <circle cx={x} cy="200" r="52" fill="#86EFAC" />
          <circle cx={x - 30} cy="226" r="34" fill="#4ADE80" />
        </g>
      ))}
      <rect y="360" width="1100" height="120" fill="#E2E8F0" />
      <rect y="354" width="1100" height="10" fill="#F1F5F9" />
      {/* Cartel */}
      <g transform="translate(550 40)">
        <rect className="banner" x="-230" y="0" width="460" height="54" rx="27" fill="#0F172A" opacity="0" />
        <text className="banner" y="35" textAnchor="middle" fontSize="22" fontWeight="800" fill="#FFFFFF" fontFamily="inherit" opacity="0">
          El VIH no distingue a nadie
        </text>
      </g>
    </g>
  );
}

export function AnyoneScenario(_props: ScenarioProps) {
  const rootRef = useSceneAnimation(() => {
    PEOPLE.forEach((_, i) => {
      gsap.to(`#anyone-${i}`, { y: -3, duration: 1.5 + i * 0.25, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
    tl.set('.who, .shield', { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' })
      .set('.banner', { opacity: 0, y: -10 });

    // Cada persona dice quién es
    PEOPLE.forEach((_, i) => {
      tl.to(`.who-${i}`, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 0.3 + i * 0.35);
    });
    // El cartel: el VIH no distingue edad, género ni profesión
    tl.to('.banner', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 2.6);
    // Todos pueden cuidarse: aparece un escudo sobre cada uno
    PEOPLE.forEach((_, i) => {
      tl.to(`.who-${i}`, { opacity: 0, scale: 0.6, duration: 0.25 }, 3.6 + i * 0.2).to(
        `.shield-${i}`,
        { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)' },
        3.8 + i * 0.2,
      );
    });
    tl.to('.shield, .banner', { opacity: 0, duration: 0.5 }, 7.4);
  });

  return (
    <SceneRoot rootRef={rootRef}>
      <Stage
        label="Cinco personas distintas en una plaza: una estudiante, una abuela, un deportista, una mamá y un profesor. Aparece un cartel: el VIH no distingue a nadie, y sobre cada persona aparece un escudo de cuidado."
        background={<Background />}
      >
        {PEOPLE.map((p, i) => (
          <g key={p.x} id={`anyone-${i}`}>
            <Person
              x={p.x}
              y={BASE_Y}
              scale={SCALE}
              flip={i > 2}
              shirtColor={p.shirt}
              shirtShadow={p.shadow}
              skinColor={p.skin}
              skinShadow={p.skinShadow}
              hairColor={p.hair}
              hairStyle={p.style}
              expression="happy"
              blinkDelay={i * 0.7}
            />
          </g>
        ))}
        {PEOPLE.map((p, i) => (
          <g key={p.x}>
            <Pill x={p.x} i={i} label={p.label} />
            <Shield x={p.x} i={i} />
          </g>
        ))}
      </Stage>
    </SceneRoot>
  );
}
