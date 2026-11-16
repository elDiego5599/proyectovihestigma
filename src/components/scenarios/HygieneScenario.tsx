import { gsap } from '../../lib/gsap';
import { Person } from '../art/Person';
import { Stage, SceneRoot, useSceneAnimation } from '../art/Stage';
import { Table } from '../art/Table';

interface ScenarioProps {
  isResolved?: boolean;
}

const SCALE = 1.25;
const A_X = 320;
const A_Y = 448;
const B_X = 800;
const B_Y = 424;
const SINK_X = 760;
const COUNTER_TOP = 356;

/** Botella de agua deportiva, en coordenadas locales de quien la sostiene. */
function WaterBottle() {
  return (
    <g transform="translate(48 -84)">
      <rect x="-7" y="-58" width="14" height="10" rx="3" fill="#0F172A" />
      <rect x="-14" y="-48" width="28" height="56" rx="9" fill="#38BDF8" opacity="0.85" />
      <rect x="-14" y="-30" width="28" height="14" fill="#0284C7" />
      <line x1="-7" y1="-42" x2="-7" y2="2" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

function Sink() {
  return (
    <g>
      {/* Lavamanos empotrado */}
      <ellipse cx={SINK_X} cy={COUNTER_TOP + 20} rx="74" ry="14" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
      <ellipse cx={SINK_X} cy={COUNTER_TOP + 22} rx="60" ry="9" fill="#E2E8F0" />
      <ellipse className="sink-water" cx={SINK_X} cy={COUNTER_TOP + 22} rx="40" ry="5" fill="#7DD3FC" opacity="0.7" />
      {/* Grifo */}
      <path
        d={`M ${SINK_X + 56} ${COUNTER_TOP + 14} L ${SINK_X + 56} ${COUNTER_TOP - 40} Q ${SINK_X + 56} ${COUNTER_TOP - 56}, ${SINK_X + 40} ${COUNTER_TOP - 56} L ${SINK_X + 14} ${COUNTER_TOP - 56}`}
        fill="none"
        stroke="#94A3B8"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <rect x={SINK_X + 44} y={COUNTER_TOP - 10} width="24" height="10" rx="4" fill="#64748B" />
      {/* Chorro de agua */}
      <rect
        className="water-stream"
        x={SINK_X + 8}
        y={COUNTER_TOP - 52}
        width="9"
        height="68"
        rx="4.5"
        fill="#38BDF8"
        opacity="0.75"
      />
      {[0, 1, 2].map((i) => (
        <circle key={i} className="splash" cx={SINK_X + 12} cy={COUNTER_TOP + 18} r="3" fill="#7DD3FC" opacity="0" />
      ))}
      {/* Jabón */}
      <g transform={`translate(${SINK_X - 110} ${COUNTER_TOP + 14})`}>
        <rect x="-12" y="-34" width="24" height="34" rx="6" fill="#F9A8D4" />
        <rect x="-4" y="-44" width="8" height="10" fill="#475569" />
        <rect x="-4" y="-46" width="16" height="4" rx="2" fill="#475569" />
      </g>
    </g>
  );
}

function Background() {
  const tiles = [];
  for (let x = 0; x < 1100; x += 55) {
    tiles.push(<line key={`v${x}`} x1={x} y1="0" x2={x} y2="480" stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />);
  }
  for (let y = 0; y < 480; y += 55) {
    tiles.push(<line key={`h${y}`} x1="0" y1={y} x2="1100" y2={y} stroke="#FFFFFF" strokeWidth="2" opacity="0.7" />);
  }
  return (
    <g>
      <rect width="1100" height="480" fill="#DDF1F7" />
      {tiles}
      <rect y="330" width="1100" height="150" fill="#C7E6EF" />
      {/* Espejo sobre el lavamanos */}
      <g transform={`translate(${SINK_X} 140)`}>
        <rect x="-100" y="-80" width="200" height="150" rx="24" fill="#E0F2FE" stroke="#FFFFFF" strokeWidth="8" />
        <path d="M -60 -50 L -20 -70 M -64 -20 L 10 -60" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
      </g>
      {/* Puerta del baño con pictograma */}
      <g transform="translate(70 70)">
        <rect width="150" height="300" rx="10" fill="#7DD3FC" />
        <rect x="10" y="10" width="130" height="290" rx="6" fill="#BAE6FD" />
        <circle cx="120" cy="160" r="7" fill="#0369A1" />
        <g transform="translate(75 70)" fill="#0369A1">
          <circle cx="-20" cy="-14" r="7" />
          <rect x="-28" y="-4" width="16" height="30" rx="5" />
          <circle cx="20" cy="-14" r="7" />
          <path d="M 20 -4 L 32 26 L 8 26 Z" />
        </g>
      </g>
      {/* Toalla colgada */}
      <g transform="translate(1010 150)">
        <rect x="-36" y="-6" width="72" height="8" rx="4" fill="#94A3B8" />
        <rect x="-28" y="0" width="56" height="110" rx="8" fill="#FBBF24" />
        <rect x="-28" y="80" width="56" height="8" fill="#F59E0B" />
      </g>
    </g>
  );
}

export function HygieneScenario(_props: ScenarioProps) {
  const rootRef = useSceneAnimation(() => {
    // La persona que hizo ejercicio respira agitada y bebe agua
    gsap.to('#runner', { y: -4, duration: 0.7, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.fromTo(
      '.sweat-drop',
      { y: 0, opacity: 0 },
      { keyframes: [{ opacity: 1, duration: 0.2 }, { y: 26, opacity: 0, duration: 1, ease: 'power1.in' }], repeat: -1, stagger: 0.45 },
    );

    // Quien se lava las manos frota y el agua corre
    gsap.to('#washer', { y: -2, duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.water-stream', { opacity: 0.45, duration: 0.18, repeat: -1, yoyo: true, ease: 'none' });
    gsap.to('.sink-water', { attr: { rx: 48 }, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.utils.toArray<SVGCircleElement>('.splash').forEach((drop, i) => {
      gsap.fromTo(
        drop,
        { x: 0, y: 0, opacity: 0.9 },
        { x: (i - 1) * 18, y: -14, opacity: 0, duration: 0.6, repeat: -1, delay: i * 0.2, ease: 'power1.out' },
      );
    });
  });

  return (
    <SceneRoot rootRef={rootRef}>
      <Stage
        label="En un baño público, una persona sudada después de hacer ejercicio bebe agua mientras otra se lava las manos en el lavamanos."
        background={<Background />}
      >
        <g id="runner">
          <Person
            x={A_X}
            y={A_Y}
            scale={SCALE}
            shirtColor="#0284C7"
            shirtShadow="#0369A1"
            skinColor="#E0AC84"
            skinShadow="#BF8760"
            hairColor="#1E293B"
            hairStyle="short"
            expression="relieved"
            sleeves="short"
            arms={['down', 'hold']}
            held={<WaterBottle />}
          />
          {/* Banda deportiva y gotas de sudor */}
          <g transform={`translate(${A_X} ${A_Y}) scale(${SCALE})`}>
            <circle className="sweat-drop" cx="-46" cy="-196" r="4" fill="#38BDF8" />
            <circle className="sweat-drop" cx="48" cy="-206" r="3.5" fill="#38BDF8" />
            <circle className="sweat-drop" cx="-40" cy="-226" r="3" fill="#38BDF8" />
          </g>
        </g>

        <g id="washer">
          <Person
            x={B_X}
            y={B_Y}
            scale={SCALE}
            flip
            shirtColor="#16A34A"
            shirtShadow="#15803D"
            skinColor="#8D5524"
            skinShadow="#6B3E18"
            hairColor="#0F172A"
            hairStyle="curly"
            expression="calm"
            arms={['table', 'table']}
            blinkDelay={1.6}
          />
        </g>

        <Table top={COUNTER_TOP} left={600} right={1000} surface="#F1F5F9" cloth={{ color: '#FFFFFF', shadow: '#CBD5E1' }} />
        <Sink />
      </Stage>
    </SceneRoot>
  );
}
