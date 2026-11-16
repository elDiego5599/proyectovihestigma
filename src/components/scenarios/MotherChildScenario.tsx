import { gsap } from '../../lib/gsap';
import { Person } from '../art/Person';
import { Stage, SceneRoot, useSceneAnimation } from '../art/Stage';

interface ScenarioProps {
  isResolved?: boolean;
}

const SCALE = 1.22;
const BASE_Y = 452;
const MOM_X = 400;
const DOC_X = 790;

/** Bebé envuelto en su mantita, en coordenadas locales de la madre (entre torso y brazos). */
function Baby() {
  return (
    <g id="baby">
      {/* Escudo de protección alrededor del bebé */}
      <circle className="baby-shield" cx="-6" cy="-52" r="62" fill="#34D399" opacity="0" />
      <circle className="baby-ring" cx="-6" cy="-52" r="62" fill="none" stroke="#10B981" strokeWidth="3" opacity="0" />
      <ellipse cx="4" cy="-42" rx="58" ry="30" fill="#FDE68A" />
      <path d="M -40 -50 C -10 -30, 20 -30, 50 -46" fill="none" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
      {/* Cabeza */}
      <circle cx="-38" cy="-62" r="22" fill="#E8B48F" />
      <path d="M -56 -70 C -50 -88, -26 -90, -18 -74 C -28 -80, -40 -80, -56 -70 Z" fill="#3F2A1D" />
      <path className="baby-eyes" d="M -46 -60 q 3 3 6 0 M -34 -60 q 3 3 6 0" stroke="#3F2A1D" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="-48" cy="-52" r="3.5" fill="#F9A8D4" opacity="0.7" />
      <circle cx="-26" cy="-52" r="3.5" fill="#F9A8D4" opacity="0.7" />
      <path d="M -40 -50 q 3 2 6 0" stroke="#9A3412" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </g>
  );
}

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

function Pill({ id }: { id: string }) {
  return (
    <g id={id} opacity="0">
      <rect x="-12" y="-5.5" width="24" height="11" rx="5.5" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" />
      <path d="M 0 -5.5 L 0 5.5 L 6.5 5.5 A 5.5 5.5 0 0 0 6.5 -5.5 Z" fill="#10B981" />
    </g>
  );
}

function Background() {
  return (
    <g>
      {/* Consultorio: pared clara, zócalo y piso */}
      <rect width="1100" height="480" fill="#EAF5F1" />
      <rect y="330" width="1100" height="150" fill="#D5EBE2" />
      <rect y="318" width="1100" height="14" fill="#BFDDCF" />
      {/* Ventana con persiana */}
      <g transform="translate(70 60)">
        <rect width="190" height="170" rx="12" fill="#FFFFFF" />
        <rect x="12" y="12" width="166" height="146" rx="8" fill="#DBEAFE" />
        <circle cx="136" cy="54" r="20" fill="#FEF3C7" />
        <path d="M 12 130 C 60 110, 110 124, 178 106 L 178 158 L 12 158 Z" fill="#BBF7D0" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x="12" y={12 + i * 14} width="166" height="9" fill="#F8FAFC" opacity="0.9" />
        ))}
      </g>
      {/* Repisa con frascos de farmacia */}
      <g transform="translate(470 150)">
        <rect x="0" y="0" width="200" height="8" rx="3" fill="#94A3B8" />
        <rect x="16" y="-44" width="30" height="44" rx="6" fill="#FFFFFF" stroke="#A7F3D0" strokeWidth="2" />
        <rect x="16" y="-28" width="30" height="12" fill="#10B981" />
        <rect x="60" y="-32" width="26" height="32" rx="5" fill="#FFFFFF" stroke="#BFDBFE" strokeWidth="2" />
        <rect x="60" y="-20" width="26" height="9" fill="#3B82F6" />
        <rect x="100" y="-50" width="34" height="50" rx="7" fill="#FFFFFF" stroke="#A7F3D0" strokeWidth="2" />
        <rect x="100" y="-32" width="34" height="14" fill="#10B981" />
        <path d="M 156 -36 h 12 v -12 h 12 v 12 h 12 v 12 h -12 v 12 h -12 v -12 h -12 Z" fill="#10B981" />
      </g>
      {/* Camilla al fondo */}
      <g transform="translate(900 250)">
        <rect x="-110" y="0" width="230" height="22" rx="10" fill="#FFFFFF" />
        <rect x="-110" y="-30" width="70" height="34" rx="12" fill="#E2E8F0" />
        <rect x="-100" y="22" width="10" height="90" fill="#94A3B8" />
        <rect x="100" y="22" width="10" height="90" fill="#94A3B8" />
        <rect x="-100" y="70" width="210" height="6" rx="3" fill="#CBD5E1" />
      </g>
    </g>
  );
}

export function MotherChildScenario(_props: ScenarioProps) {
  const rootRef = useSceneAnimation(() => {
    // La madre arrulla al bebé
    gsap.to('#mother', { rotation: 1.8, svgOrigin: `${MOM_X} ${BASE_Y}`, duration: 1.9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('#doctor', { y: -3, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
    tl.set('#pill-1, #pill-2', { opacity: 0, x: DOC_X - 48 * SCALE, y: BASE_Y - 128 * SCALE })
      .set('.baby-shield', { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' })
      .set('.baby-ring', { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' });

    // Las pastillas del tratamiento viajan del frasco hacia la madre y el bebé
    ['#pill-1', '#pill-2'].forEach((pill, i) => {
      tl.to(pill, { opacity: 1, duration: 0.2 }, 0.4 + i * 0.7).to(
        pill,
        {
          duration: 1.6,
          ease: 'sine.inOut',
          motionPath: {
            path: [
              { x: DOC_X - 48 * SCALE, y: BASE_Y - 128 * SCALE },
              { x: 640, y: 170 },
              { x: MOM_X + 10, y: BASE_Y - 90 * SCALE },
            ],
            curviness: 1.4,
          },
        },
        0.4 + i * 0.7,
      )
        .to(pill, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%', duration: 0.3 }, 1.8 + i * 0.7)
        .set(pill, { scale: 1 });
    });

    // El tratamiento protege al bebé
    tl.to('.baby-shield', { opacity: 0.22, scale: 1, duration: 0.6, ease: 'power2.out' }, 2.6)
      .to('.baby-ring', { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, 2.6)
      .to('.baby-ring', { scale: 1.12, duration: 0.5, repeat: 3, yoyo: true, ease: 'sine.inOut' }, 3.2)
      .to('.baby-shield, .baby-ring', { opacity: 0, duration: 0.6 }, 5.6);
  });

  return (
    <SceneRoot rootRef={rootRef}>
      <Stage
        label="Una madre arrulla a su bebé; una profesional de salud le da tratamiento antirretroviral y un escudo verde protege al bebé."
        background={<Background />}
      >
        <g id="mother">
          <Person
            x={MOM_X}
            y={BASE_Y}
            scale={SCALE}
            shirtColor="#DB2777"
            shirtShadow="#9D174D"
            skinColor="#C68642"
            skinShadow="#A0692F"
            hairColor="#1C1917"
            hairStyle="bun"
            expression="happy"
            arms={['cradle', 'cradle']}
            held={<Baby />}
          />
        </g>

        <g id="doctor">
          <Person
            x={DOC_X}
            y={BASE_Y}
            scale={SCALE}
            flip
            shirtColor="#F8FAFC"
            shirtShadow="#CBD5E1"
            skinColor="#F2C19E"
            skinShadow="#D09772"
            hairColor="#78350F"
            hairStyle="bob"
            expression="calm"
            arms={['down', 'hold']}
            held={<PillBottle />}
            blinkDelay={1.8}
          />
          {/* Estetoscopio */}
          <path
            d={`M ${DOC_X - 30 * SCALE} ${BASE_Y - 126 * SCALE} C ${DOC_X - 26 * SCALE} ${BASE_Y - 70 * SCALE}, ${DOC_X + 26 * SCALE} ${BASE_Y - 70 * SCALE}, ${DOC_X + 30 * SCALE} ${BASE_Y - 126 * SCALE}`}
            fill="none"
            stroke="#0F766E"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx={DOC_X} cy={BASE_Y - 80 * SCALE} r="9" fill="#0F766E" />
          <circle cx={DOC_X} cy={BASE_Y - 80 * SCALE} r="4.5" fill="#99F6E4" />
        </g>

        <Pill id="pill-1" />
        <Pill id="pill-2" />
      </Stage>
    </SceneRoot>
  );
}
