import { gsap } from '../../lib/gsap';
import { Person } from '../art/Person';
import { Stage, SceneRoot, useSceneAnimation } from '../art/Stage';
import { Table } from '../art/Table';

interface ScenarioProps {
  isResolved?: boolean;
}

const SCALE = 1.3;
const BASE_Y = 424;
const CLIENT_X = 240;
const ARTIST_X = 672;
const TABLE_TOP = 356;
// Punto del antebrazo del cliente donde se hace el tatuaje
const SPOT = { x: 408, y: 336 };
// Bandeja con agujas sobre la mesa
const TRAY = { x: 820, y: 368 };

/** Máquina de tatuar; la punta de la aguja está en (0,0). */
function TattooMachine() {
  return (
    <g transform={`translate(${SPOT.x} ${SPOT.y})`}>
      <g id="machine">
        <g transform="rotate(68)">
          <line x1="0" y1="0" x2="0" y2="-22" stroke="#94A3B8" strokeWidth="2.4" strokeLinecap="round" />
          <rect x="-8" y="-62" width="16" height="42" rx="6" fill="#334155" />
          <rect x="-11" y="-92" width="22" height="34" rx="7" fill="#7C3AED" />
          <rect x="-11" y="-80" width="22" height="6" fill="#5B21B6" />
          <path d="M 0 -92 C 0 -110, 20 -112, 34 -104" stroke="#1E293B" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
        <circle id="ink-drop" cx="0" cy="2" r="3.5" fill="#DC2626" opacity="0" />
      </g>
    </g>
  );
}

/** Tatuaje (corazón) que se dibuja sobre el antebrazo. */
function Tattoo() {
  return (
    <path
      id="tattoo"
      transform={`translate(${SPOT.x - 6} ${SPOT.y - 4})`}
      d="M 0 6 C -10 -2, -8 -12, 0 -7 C 8 -12, 10 -2, 0 6 Z"
      fill="none"
      stroke="#1E293B"
      strokeWidth="2.2"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray="1"
      strokeDashoffset="1"
    />
  );
}

/** Bandeja: un empaque nuevo y sellado junto a agujas ya usadas. */
function Tray() {
  return (
    <g transform={`translate(${TRAY.x} ${TRAY.y})`}>
      <rect x="-70" y="-10" width="140" height="18" rx="6" fill="#CBD5E1" />
      <rect x="-70" y="-10" width="140" height="5" rx="2.5" fill="#E2E8F0" />
      {/* Agujas usadas */}
      {[-48, -34].map((x, i) => (
        <g key={x} transform={`translate(${x} -12) rotate(${i ? 8 : -6})`}>
          <line x1="0" y1="0" x2="0" y2="-26" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
          <circle className="used-blood" cx="0" cy="-2" r="3" fill="#DC2626" />
        </g>
      ))}
      {/* Empaque estéril sellado */}
      <g transform="translate(26 -30)">
        <rect x="-26" y="0" width="52" height="22" rx="5" fill="#ECFDF5" stroke="#6EE7B7" strokeWidth="2" />
        <line x1="-16" y1="11" x2="12" y2="11" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="19" cy="11" r="5" fill="#10B981" />
        <path d="M 16.6 11 L 18.5 12.8 L 21.6 9.4" stroke="#FFFFFF" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

function Background() {
  return (
    <g>
      <rect width="1100" height="480" fill="#EDE9FE" />
      <rect y="300" width="1100" height="180" fill="#DDD6FE" />
      {/* Cuadros de diseños de tatuajes */}
      <g transform="translate(70 60)">
        <rect width="150" height="120" rx="10" fill="#FFFFFF" />
        <path d="M 75 88 C 40 62, 46 32, 75 46 C 104 32, 110 62, 75 88 Z" fill="#F472B6" />
        <path d="M 30 30 l 6 12 l 13 2 l -10 9 l 3 13 l -12 -7 l -12 7 l 3 -13 l -10 -9 l 13 -2 Z" fill="#FBBF24" transform="translate(-4 -6) scale(0.7)" />
      </g>
      <g transform="translate(880 50)">
        <rect width="160" height="140" rx="10" fill="#FFFFFF" />
        <circle cx="80" cy="62" r="30" fill="none" stroke="#7C3AED" strokeWidth="6" />
        <path d="M 80 32 L 80 92 M 50 62 L 110 62" stroke="#7C3AED" strokeWidth="4" strokeLinecap="round" />
        <path d="M 30 116 C 60 100, 100 130, 130 112" stroke="#0EA5E9" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
      {/* Lámpara */}
      <line x1="560" y1="0" x2="560" y2="60" stroke="#475569" strokeWidth="2" />
      <path d="M 530 74 L 590 74 L 576 56 L 544 56 Z" fill="#334155" />
      <ellipse cx="560" cy="76" rx="22" ry="5" fill="#FEF3C7" />
    </g>
  );
}

export function TattooScenario(_props: ScenarioProps) {
  const rootRef = useSceneAnimation(() => {

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
    tl.set('#tattoo', { attr: { 'stroke-dashoffset': 1 } })
      .set('#ink-drop', { opacity: 0 })
      .set('.tattoo-ring', { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' })
      // La máquina vibra mientras dibuja el corazón
      .to('#machine', { x: 1.6, duration: 0.05, repeat: 50, yoyo: true, ease: 'none' }, 0.4)
      .to('#tattoo', { attr: { 'stroke-dashoffset': 0 }, duration: 2.6, ease: 'none' }, 0.4)
      // La aguja entra en contacto con la sangre
      .to('#ink-drop', { opacity: 1, duration: 0.25 }, 1.8)
      .to('.tattoo-ring', { opacity: 0.9, scale: 1, duration: 0.5, ease: 'power2.out', stagger: 0.35 }, 3.1)
      .to('.tattoo-ring', { opacity: 0, scale: 1.6, duration: 0.7, ease: 'power1.in', stagger: 0.35 }, 3.7)
      // Las agujas usadas también llevan sangre
      .fromTo('.used-blood', { scale: 1, transformOrigin: '50% 50%' }, { scale: 1.5, duration: 0.4, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 3.4)
      .to('#ink-drop', { opacity: 0, duration: 0.3 }, 5.2)
      .to('#tattoo', { attr: { 'stroke-dashoffset': 1 }, duration: 0.5 }, 5.4);
  });

  return (
    <SceneRoot rootRef={rootRef}>
      <Stage
        label="En un estudio de tatuajes, el tatuador dibuja un corazón en el brazo de un cliente. En la bandeja hay agujas usadas con sangre y un empaque estéril sellado."
        background={<Background />}
      >
        <Person
          x={CLIENT_X}
          y={BASE_Y}
          scale={SCALE}
          shirtColor="#F97316"
          shirtShadow="#C2410C"
          skinColor="#E0AC84"
          skinShadow="#BF8760"
          hairColor="#3F2A1D"
          hairStyle="curly"
          expression="calm"
          sleeves="short"
          arms={['table', 'reach']}
        />

        <Tattoo />
        <g transform={`translate(${SPOT.x} ${SPOT.y})`}>
          <circle className="tattoo-ring" r="24" fill="none" stroke="#DC2626" strokeWidth="3" opacity="0" />
          <circle className="tattoo-ring" r="24" fill="none" stroke="#F87171" strokeWidth="3" opacity="0" />
        </g>
        <TattooMachine />
        {/* El tatuador va delante de la máquina: su mano la sujeta */}
        <g id="tattoo-artist">
          <Person
            x={ARTIST_X}
            y={BASE_Y}
            scale={SCALE}
            flip
            shirtColor="#1E293B"
            shirtShadow="#0F172A"
            skinColor="#A86B45"
            skinShadow="#87512F"
            hairColor="#0F172A"
            hairStyle="bun"
            expression="focused"
            sleeves="long"
            arms={['table', 'reach']}
            blinkDelay={1.2}
          />
        </g>
        <Table top={TABLE_TOP} left={110} right={990} surface="#E2E8F0" edge="#94A3B8" />
        <Tray />
      </Stage>
    </SceneRoot>
  );
}
