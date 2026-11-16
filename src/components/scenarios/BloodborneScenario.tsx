import { gsap } from '../../lib/gsap';
import { Person, forearmPoint } from '../art/Person';
import { Stage, SceneRoot, useSceneAnimation } from '../art/Stage';
import { Table } from '../art/Table';

interface ScenarioProps {
  isResolved?: boolean;
}

const SCALE = 1.3;
const BASE_Y = 424;
const A_X = 250;
const B_X = 850;
const TABLE_TOP = 356;

// Punto de punción sobre la cara superior del antebrazo extendido ('reach')
const [fx, fy] = forearmPoint('reach', 0.45, 0);
const A_ARM = { x: A_X + fx * SCALE, y: BASE_Y + fy * SCALE - 12 };
const B_ARM = { x: B_X - fx * SCALE, y: BASE_Y + fy * SCALE - 12 };

// Gradilla de muestras en el centro de la mesa
const RACK_X = 550;
const RACK_TOP = 322;
const TUBE_A = { x: RACK_X - 40, y: 282 };
const TUBE_B = { x: RACK_X, y: 282 };
// La jeringa descansa de pie en la tercera ranura de la gradilla (punta de la aguja)
const REST = { x: RACK_X + 40, y: 350 };

const rel = (p: { x: number; y: number }, dx = 0, dy = 0) => ({ x: p.x - REST.x + dx, y: p.y - REST.y + dy });
/** Punto a `d` px antes de `p` en la dirección del ángulo `deg` (para acercar y luego pinchar). */
const back = (p: { x: number; y: number }, deg: number, d = 14) => {
  const r = (deg * Math.PI) / 180;
  return rel(p, -Math.cos(r) * d, -Math.sin(r) * d);
};

/** Jeringa horizontal; la punta de la aguja está en (0,0) apuntando a +x. */
function Syringe() {
  return (
    <g transform={`translate(${REST.x} ${REST.y})`}>
      <g id="syringe">
        <g id="syringe-tilt">
          {/* Aguja */}
          <line x1="-40" y1="0" x2="0" y2="0" stroke="#94A3B8" strokeWidth="2.4" strokeLinecap="round" />
          <rect x="-48" y="-5" width="10" height="10" rx="2" fill="#64748B" />
          {/* Cilindro */}
          <rect x="-140" y="-11" width="92" height="22" rx="5" fill="#FFFFFF" opacity="0.9" stroke="#94A3B8" strokeWidth="2" />
          <rect className="syr-blood" x="-136" y="-7" width="84" height="14" rx="3" fill="#DC2626" />
          {[-120, -104, -88, -72].map((x) => (
            <line key={x} x1={x} y1="-11" x2={x} y2="-4" stroke="#94A3B8" strokeWidth="1.5" />
          ))}
          {/* Émbolo */}
          <g>
            <rect x="-150" y="-15" width="10" height="30" rx="3" fill="#475569" />
            <rect x="-186" y="-3" width="36" height="6" rx="2" fill="#64748B" />
            <rect x="-192" y="-12" width="7" height="24" rx="2" fill="#334155" />
          </g>
          {/* Gota en la punta */}
          <circle className="syr-drop" cx="4" cy="0" r="3.5" fill="#DC2626" opacity="0" />
        </g>
      </g>
    </g>
  );
}

/** Tubo de ensayo con tapa; el líquido sube desde el fondo. */
const FILL_BOTTOM = RACK_TOP + 2;
const FILL_TOP = 292;
const EMPTY = { attr: { y: FILL_BOTTOM, height: 0 } };
const FULL = { attr: { y: FILL_TOP, height: FILL_BOTTOM - FILL_TOP } };

function Tube({ x, id }: { x: number; id: string }) {
  const top = 282;
  const h = 56;
  // Solo se ve la parte del tubo sobre la gradilla: el líquido sube desde ahí
  const fillBottom = RACK_TOP + 2;
  return (
    <g>
      <rect x={x - 8} y={top} width="16" height={h} rx="8" fill="#FFFFFF" opacity="0.7" stroke="#94A3B8" strokeWidth="2" />
      <rect
        id={id}
        x={x - 5}
        y={top + 10}
        width="10"
        height={fillBottom - top - 10}
        rx="3"
        fill="#DC2626"
      />
      <line x1={x - 3} y1={top + 6} x2={x - 3} y2={fillBottom - 4} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </g>
  );
}

/** Gradilla: la parte trasera va detrás de los tubos y el frente delante. */
function RackBack() {
  return <rect x={RACK_X - 72} y={RACK_TOP - 6} width="144" height="12" rx="4" fill="#64748B" />;
}
function RackFront() {
  return (
    <g>
      <rect x={RACK_X - 76} y={RACK_TOP + 4} width="152" height="34" rx="8" fill="#3B82F6" />
      <rect x={RACK_X - 76} y={RACK_TOP + 4} width="152" height="8" rx="4" fill="#60A5FA" />
      <ellipse cx={RACK_X} cy={RACK_TOP + 38} rx="80" ry="5" fill="#0F172A" opacity="0.12" />
    </g>
  );
}

function Background() {
  return (
    <g>
      <defs>
        <radialGradient id="blood-bulb" cx="0.5" cy="0.3" r="0.6">
          <stop offset="0" stopColor="#FEF3C7" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FEF3C7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1100" height="480" fill="#D7DEE8" />
      <rect y="300" width="1100" height="180" fill="#C5CEDB" />
      <ellipse cx="550" cy="200" rx="420" ry="260" fill="url(#blood-bulb)" />
      <line x1="550" y1="0" x2="550" y2="50" stroke="#475569" strokeWidth="2" />
      <circle cx="550" cy="60" r="11" fill="#FDE68A" />
      <path d="M 536 52 L 564 52 L 560 44 L 540 44 Z" fill="#334155" />
      <g transform="translate(860 60)">
        <rect width="170" height="150" rx="10" fill="#F1F5F9" />
        <rect x="10" y="10" width="150" height="130" rx="6" fill="#1E293B" />
        <circle cx="118" cy="46" r="15" fill="#E2E8F0" />
        <circle cx="111" cy="41" r="15" fill="#1E293B" />
        {[[40, 40], [70, 90], [30, 110], [130, 110]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="#E2E8F0" />
        ))}
        <line x1="85" y1="10" x2="85" y2="140" stroke="#F1F5F9" strokeWidth="6" />
      </g>
      <g transform="translate(70 140)">
        <rect x="0" y="0" width="190" height="8" rx="3" fill="#94A3B8" />
        <rect x="18" y="-46" width="28" height="46" rx="6" fill="#BFDBFE" />
        <rect x="58" y="-34" width="22" height="34" rx="5" fill="#FBCFE8" />
        <rect x="92" y="-56" width="30" height="56" rx="7" fill="#C7D2FE" />
        <rect x="134" y="-30" width="34" height="30" rx="6" fill="#FDE68A" />
      </g>
    </g>
  );
}

export function BloodborneScenario(_props: ScenarioProps) {
  const rootRef = useSceneAnimation(() => {

    // Ángulos de la aguja: 90 = hacia abajo, 125 = abajo-izquierda (A), 55 = abajo-derecha (B)
    const T = '#syringe-tilt';
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
    tl.set('#syringe', { x: 0, y: 0 })
      .set(T, { rotation: 90, svgOrigin: '0 0' })
      .set('.syr-blood', { scaleX: 0, svgOrigin: '-52 0' })
      .set('.syr-drop', { opacity: 0 })
      .set('#tube-a, #tube-b', EMPTY)
      .set('.risk-ring', { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' })

      // 1. Se le saca sangre a la primera persona
      .to('#syringe', { y: -50, duration: 0.5, ease: 'power2.out' }, 0.3)
      .to('#syringe', { ...back(A_ARM, 125), duration: 1, ease: 'power2.inOut' }, 0.8)
      .to(T, { rotation: 125, svgOrigin: '0 0', duration: 1, ease: 'power2.inOut' }, 0.8)
      .to('#syringe', { ...rel(A_ARM), duration: 0.3, ease: 'power1.out' }, 1.9)
      .to('.syr-blood', { scaleX: 1, duration: 1.1, ease: 'sine.inOut' }, 2.2)
      .to('#syringe', { ...back(A_ARM, 125), duration: 0.3 }, 3.4)

      // 2. Se deposita en su tubo de muestra
      .to('#syringe', { ...rel(TUBE_A, 0, -20), duration: 0.9, ease: 'power2.inOut' }, 3.7)
      .to(T, { rotation: 90, svgOrigin: '0 0', duration: 0.9, ease: 'power2.inOut' }, 3.7)
      .to('#syringe', { ...rel(TUBE_A, 0, 24), duration: 0.35, ease: 'power1.out' }, 4.6)
      .to('.syr-blood', { scaleX: 0.06, duration: 0.9, ease: 'sine.inOut' }, 5)
      .to('#tube-a', { ...FULL, duration: 0.9, ease: 'sine.inOut' }, 5)
      .to('#syringe', { ...rel(TUBE_A, 0, -20), duration: 0.35 }, 6)
      // La aguja queda manchada con la sangre de la primera persona
      .to('.syr-drop', { opacity: 1, duration: 0.2 }, 6.2)

      // 3. Con la misma aguja sin esterilizar, se le saca sangre a la segunda persona
      .to('#syringe', { ...back(B_ARM, 55), duration: 1.1, ease: 'power2.inOut' }, 6.4)
      .to(T, { rotation: 55, svgOrigin: '0 0', duration: 1.1, ease: 'power2.inOut' }, 6.4)
      .to('#syringe', { ...rel(B_ARM), duration: 0.3, ease: 'power1.out' }, 7.6)
      .to('.syr-drop', { opacity: 0, duration: 0.2 }, 7.6)
      .to('.risk-ring', { opacity: 0.9, scale: 1, duration: 0.5, ease: 'power2.out', stagger: 0.35 }, 7.7)
      .to('.risk-ring', { opacity: 0, scale: 1.6, duration: 0.7, ease: 'power1.in', stagger: 0.35 }, 8.3)
      .to('.syr-blood', { scaleX: 1, duration: 1.1, ease: 'sine.inOut' }, 7.9)
      .to('#syringe', { ...back(B_ARM, 55), duration: 0.3 }, 9.2)

      // 4. Se deposita en el segundo tubo y la jeringa vuelve a la gradilla
      .to('#syringe', { ...rel(TUBE_B, 0, -20), duration: 0.9, ease: 'power2.inOut' }, 9.5)
      .to(T, { rotation: 90, svgOrigin: '0 0', duration: 0.9, ease: 'power2.inOut' }, 9.5)
      .to('#syringe', { ...rel(TUBE_B, 0, 24), duration: 0.35, ease: 'power1.out' }, 10.4)
      .to('.syr-blood', { scaleX: 0, duration: 0.9, ease: 'sine.inOut' }, 10.8)
      .to('#tube-b', { ...FULL, duration: 0.9, ease: 'sine.inOut' }, 10.8)
      .to('#syringe', { ...rel(TUBE_B, 0, -20), duration: 0.35 }, 11.8)
      .to('#syringe', { x: 0, y: -50, duration: 0.6, ease: 'power2.inOut' }, 12.15)
      .to('#syringe', { x: 0, y: 0, duration: 0.4, ease: 'power1.out' }, 12.75)
      .to('#tube-a, #tube-b', { ...EMPTY, duration: 0.6 }, 13.4);
  });

  return (
    <SceneRoot rootRef={rootRef}>
      <Stage
        label="Con una jeringa se le saca sangre a una persona para una muestra; luego, sin esterilizar, la misma aguja se usa para sacarle sangre a otra persona."
        background={<Background />}
      >
        <g id="needle-a">
          <Person
            x={A_X}
            y={BASE_Y}
            scale={SCALE}
            shirtColor="#7C3AED"
            shirtShadow="#5B21B6"
            skinColor="#F2C19E"
            skinShadow="#D09772"
            hairColor="#3F2A1D"
            hairStyle="wavy"
            expression="focused"
            sleeves="short"
            arms={['table', 'reach']}
          />
        </g>
        <g id="needle-b">
          <Person
            x={B_X}
            y={BASE_Y}
            scale={SCALE}
            flip
            shirtColor="#0D9488"
            shirtShadow="#0F766E"
            skinColor="#A86B45"
            skinShadow="#87512F"
            hairColor="#0F172A"
            hairStyle="short"
            expression="alert"
            sleeves="short"
            arms={['table', 'reach']}
            blinkDelay={1.4}
          />
        </g>

        <Table top={TABLE_TOP} left={110} right={990} surface="#E2E8F0" edge="#94A3B8" />
        <RackBack />
        <Tube x={TUBE_A.x} id="tube-a" />
        <Tube x={TUBE_B.x} id="tube-b" />

        <g transform={`translate(${B_ARM.x} ${B_ARM.y})`}>
          <circle className="risk-ring" r="26" fill="none" stroke="#DC2626" strokeWidth="3" opacity="0" />
          <circle className="risk-ring" r="26" fill="none" stroke="#F87171" strokeWidth="3" opacity="0" />
        </g>

        <Syringe />
        <RackFront />
      </Stage>
    </SceneRoot>
  );
}
