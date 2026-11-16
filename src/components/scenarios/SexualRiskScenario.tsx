import { gsap } from '../../lib/gsap';
import { Person } from '../art/Person';
import { Stage, SceneRoot, useSceneAnimation } from '../art/Stage';

interface ScenarioProps {
  isResolved?: boolean;
}

const SCALE = 1.18;
const BASE_Y = 448;
// Con el brazo en 'reach' (H = [160, -70]) las manos se encuentran justo en el centro.
const A_X = 362;
const B_X = 738;

function CondomPacket() {
  return (
    <g transform="translate(550 250)">
    <g id="packet">
      <g id="packet-body">
        {/* Escudo de protección detrás */}
        <circle className="shield-ring" r="58" fill="none" stroke="#10B981" strokeWidth="3" opacity="0" />
        <circle className="shield-ring" r="58" fill="none" stroke="#34D399" strokeWidth="3" opacity="0" />
        {/* Sobre con borde dentado */}
        <path
          d="M -38 -38 L -30 -42 L -22 -38 L -14 -42 L -6 -38 L 2 -42 L 10 -38 L 18 -42 L 26 -38 L 34 -42 L 42 -38 L 38 -30 L 42 -22 L 38 -14 L 42 -6 L 38 2 L 42 10 L 38 18 L 42 26 L 38 34 L 42 42 L 34 38 L 26 42 L 18 38 L 10 42 L 2 38 L -6 42 L -14 38 L -22 42 L -30 38 L -38 42 L -34 34 L -38 26 L -34 18 L -38 10 L -34 2 L -38 -6 L -34 -14 L -38 -22 L -34 -30 Z"
          fill="#2563EB"
        />
        <rect x="-28" y="-28" width="56" height="56" rx="8" fill="#3B82F6" />
        <circle r="17" fill="none" stroke="#BFDBFE" strokeWidth="5" />
        <circle r="8" fill="#60A5FA" />
        <path d="M -20 -22 L 4 -22" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
      </g>
    </g>
    </g>
  );
}

/** Partícula de virus estilizada, centrada en (0,0). */
function Virus({ className }: { className: string }) {
  return (
    <g className={className} opacity="0">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          <line x1="0" y1="-9" x2="0" y2="-14" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round" />
          <circle cy="-15" r="2.4" fill="#E11D48" />
        </g>
      ))}
      <circle r="10" fill="#F43F5E" />
      <circle r="4" cx="-3" cy="-3" fill="#FDA4AF" />
    </g>
  );
}

function Heart({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        className="love-heart"
        d="M 0 10 C -22 -6, -18 -26, -6 -26 C -2 -26, 0 -22, 0 -20 C 0 -22, 2 -26, 6 -26 C 18 -26, 22 -6, 0 10 Z"
        fill="#F43F5E"
      />
    </g>
  );
}

function Background() {
  return (
    <g>
      <defs>
        <linearGradient id="sex-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EDE9FE" />
          <stop offset="1" stopColor="#F5EEFF" />
        </linearGradient>
      </defs>
      <rect width="1100" height="480" fill="url(#sex-wall)" />
      {/* Ventana con cortinas y noche */}
      <g transform="translate(70 60)">
        <rect x="10" y="10" width="140" height="150" rx="8" fill="#312E81" />
        <circle cx="110" cy="56" r="15" fill="#FDE68A" />
        <circle cx="103" cy="51" r="15" fill="#312E81" />
        {[[40, 50], [60, 110], [120, 130], [34, 140]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" fill="#E0E7FF" />
        ))}
        <rect x="0" y="0" width="160" height="10" rx="4" fill="#A78BFA" />
        <path d="M 4 10 C 24 60, 14 120, 30 168 L 4 168 Z" fill="#C4B5FD" />
        <path d="M 156 10 C 136 60, 146 120, 130 168 L 156 168 Z" fill="#C4B5FD" />
      </g>
      {/* Guirnalda de luces sobre la cabecera */}
      <path d="M 300 40 C 440 90, 660 90, 800 40" fill="none" stroke="#A78BFA" strokeWidth="2" />
      {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85].map((t) => {
        const x = 300 + 500 * t;
        const y = 40 + 4 * 50 * t * (1 - t);
        return <circle key={t} className="fairy" cx={x} cy={y + 6} r="5" fill="#FDE68A" />;
      })}
      {/* Mesita de noche con lámpara */}
      <g transform="translate(965 300)">
        <rect x="-60" y="0" width="120" height="110" rx="10" fill="#C4B5FD" />
        <rect x="-50" y="18" width="100" height="36" rx="6" fill="#DDD6FE" />
        <circle cx="0" cy="36" r="4" fill="#7C3AED" />
        <rect x="-4" y="-50" width="8" height="50" fill="#7C3AED" />
        <ellipse cx="0" cy="-2" rx="22" ry="5" fill="#7C3AED" />
        <path d="M -30 -50 L 30 -50 L 20 -92 L -20 -92 Z" fill="#FDE68A" />
        <ellipse cx="0" cy="-120" rx="80" ry="70" fill="#FEF3C7" opacity="0.35" />
      </g>
      {/* Cama: cabecera, almohadas y colcha */}
      <g>
        <rect x="250" y="150" width="600" height="190" rx="36" fill="#8B5CF6" />
        <rect x="266" y="166" width="568" height="160" rx="26" fill="#A78BFA" />
        {[330, 430, 530, 630, 730].map((x) => (
          <line key={x} x1={x + 20} y1="180" x2={x + 20} y2="312" stroke="#8B5CF6" strokeWidth="3" opacity="0.5" />
        ))}
        <rect x="290" y="250" width="230" height="70" rx="30" fill="#FFFFFF" />
        <rect x="580" y="250" width="230" height="70" rx="30" fill="#FFFFFF" />
        <path d="M 310 270 Q 400 258 500 270" stroke="#E9D5FF" strokeWidth="3" fill="none" />
        <path d="M 600 270 Q 690 258 790 270" stroke="#E9D5FF" strokeWidth="3" fill="none" />
        <rect x="220" y="310" width="660" height="180" rx="24" fill="#F9A8D4" />
        <rect x="220" y="310" width="660" height="34" rx="16" fill="#FBCFE8" />
        <path d="M 260 380 Q 550 360 840 380" stroke="#F472B6" strokeWidth="3" fill="none" opacity="0.6" />
      </g>
    </g>
  );
}

export function SexualRiskScenario(_props: ScenarioProps) {
  const rootRef = useSceneAnimation(() => {
    gsap.to('#couple-a', { rotation: 1.2, svgOrigin: `${A_X} ${BASE_Y}`, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('#couple-b', { rotation: -1.2, svgOrigin: `${B_X} ${BASE_Y}`, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    gsap.to('.love-heart', {
      scale: 1.12,
      transformOrigin: '50% 60%',
      duration: 0.45,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.2,
    });

    gsap.to('.fairy', { opacity: 0.4, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.25 });

    gsap.to('#packet-body', { y: -6, rotation: 5, transformOrigin: '50% 50%', duration: 1.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.fromTo(
      '.shield-ring',
      { scale: 0.7, opacity: 0.9, transformOrigin: '50% 50%' },
      { scale: 1.5, opacity: 0, duration: 1.8, repeat: -1, ease: 'power1.out', stagger: 0.9 },
    );

    // Sin preservativo el virus pasa de una persona a otra; con preservativo, el escudo lo detiene.
    const START = { x: 420, y: 250 };
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
    tl.set('#packet', { scale: 0, opacity: 0, transformOrigin: '50% 50%' })
      .set('.virus-a, .virus-b', { x: START.x, y: START.y, opacity: 0, scale: 1, transformOrigin: '50% 50%' })
      .set('.hit-ring', { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' });

    // 1. Sin protección: llega a la otra persona
    tl.to('.virus-a', { opacity: 1, duration: 0.25, stagger: 0.35 }, 0.3)
      .to('.virus-a', { x: 690, y: 262, duration: 1.4, ease: 'sine.inOut', stagger: 0.35 }, 0.3)
      .to('.virus-a', { opacity: 0, scale: 0.5, duration: 0.25, stagger: 0.35 }, 1.6)
      .to('.hit-ring', { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }, 1.7)
      .to('.hit-ring', { opacity: 0, scale: 1.7, duration: 0.7, ease: 'power1.in' }, 2.4)

      // 2. Aparece el preservativo y bloquea el paso
      .to('#packet', { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' }, 3.3)
      .to('.virus-b', { opacity: 1, duration: 0.25, stagger: 0.35 }, 4.1)
      .to('.virus-b', { x: 492, y: 250, duration: 0.8, ease: 'power1.in', stagger: 0.35 }, 4.1)
      .to('.virus-b', { x: 470, scale: 0.2, opacity: 0, duration: 0.35, ease: 'power2.out', stagger: 0.35 }, 4.9)
      .to('#packet', { scale: 0, opacity: 0, duration: 0.4, ease: 'power2.in' }, 7);
  });

  return (
    <SceneRoot rootRef={rootRef}>
      <Stage
        label="Una pareja se toma de las manos. Sin preservativo, partículas de virus pasan de una persona a la otra; cuando aparece el preservativo, su escudo las detiene."
        background={<Background />}
      >
        <g id="couple-a">
          <Person
            x={A_X}
            y={BASE_Y}
            scale={SCALE}
            shirtColor="#E11D48"
            shirtShadow="#9F1239"
            skinColor="#F2C19E"
            skinShadow="#D09772"
            hairColor="#422006"
            hairStyle="wavy"
            expression="happy"
            arms={['down', 'reach']}
          />
        </g>
        <g id="couple-b">
          <Person
            x={B_X}
            y={BASE_Y}
            scale={SCALE}
            flip
            shirtColor="#4F46E5"
            shirtShadow="#3730A3"
            skinColor="#8D5524"
            skinShadow="#6B3E18"
            hairColor="#0F172A"
            hairStyle="short"
            expression="happy"
            arms={['down', 'reach']}
            blinkDelay={2.3}
          />
        </g>

        <Heart x={550} y={84} />
        <Heart x={500} y={112} s={0.55} />
        <Heart x={604} y={106} s={0.65} />

        {/* Impacto en la persona B */}
        <circle className="hit-ring" cx="690" cy="262" r="30" fill="none" stroke="#E11D48" strokeWidth="4" opacity="0" />
        {[0, 1, 2].map((i) => <Virus key={`a${i}`} className="virus-a" />)}
        {[0, 1, 2].map((i) => <Virus key={`b${i}`} className="virus-b" />)}

        <CondomPacket />
      </Stage>
    </SceneRoot>
  );
}
