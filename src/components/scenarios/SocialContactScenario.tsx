import { gsap } from '../../lib/gsap';
import { Person } from '../art/Person';
import { Stage, SceneRoot, useSceneAnimation } from '../art/Stage';
import { Table } from '../art/Table';

interface ScenarioProps {
  isResolved?: boolean;
}

function Glass({ x, y, juice = '#FB923C' }: { x: number; y: number; juice?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="1" rx="16" ry="4" fill="#0F172A" opacity="0.12" />
      <path d="M -14 -46 L 14 -46 L 11 0 L -11 0 Z" fill="#FFFFFF" opacity="0.55" stroke="#94A3B8" strokeWidth="1.5" />
      <path d="M -12.5 -28 L 12.5 -28 L 11 0 L -11 0 Z" fill={juice} opacity="0.9" />
      <ellipse cx="0" cy="-28" rx="12.5" ry="2.5" fill={juice} />
      <line x1="-8" y1="-40" x2="-6" y2="-6" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      {/* Pajita */}
      <line x1="4" y1="-24" x2="12" y2="-60" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
    </g>
  );
}

function Plate() {
  return (
    <g transform="translate(550 378)">
      <ellipse cx="0" cy="4" rx="64" ry="13" fill="#0F172A" opacity="0.12" />
      <ellipse cx="0" cy="0" rx="62" ry="13" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
      <ellipse cx="0" cy="-1" rx="44" ry="8.5" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
      {/* Arepas / galletas y frutas */}
      <ellipse cx="-18" cy="-6" rx="17" ry="7" fill="#F5D08A" stroke="#D9A54C" strokeWidth="1.2" />
      <ellipse cx="6" cy="-9" rx="17" ry="7" fill="#F5D08A" stroke="#D9A54C" strokeWidth="1.2" />
      <circle cx="24" cy="-6" r="7" fill="#EF4444" />
      <circle cx="-34" cy="-3" r="6" fill="#22C55E" />
      <path d="M 24 -12 q 2 -4 5 -4" stroke="#15803D" strokeWidth="1.5" fill="none" />
    </g>
  );
}

function Cutlery({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} strokeLinecap="round">
      {/* Tenedor */}
      <line x1="0" y1="0" x2="10" y2="-22" stroke="#94A3B8" strokeWidth="3" />
      <path d="M 9 -21 l 2 -8 M 12 -20 l 3 -7 M 6 -22 l 1 -8" stroke="#94A3B8" strokeWidth="1.6" />
      {/* Cuchara */}
      <line x1="16" y1="2" x2="26" y2="-18" stroke="#94A3B8" strokeWidth="3" />
      <ellipse cx="28" cy="-23" rx="4" ry="6" transform="rotate(26 28 -23)" fill="#94A3B8" />
    </g>
  );
}

function Heart({ x, y, size = 1, className }: { x: number; y: number; size?: number; className?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <path
        className={className}
        d="M 0 6 C -14 -4, -12 -16, -4 -16 C -1 -16, 0 -13, 0 -12 C 0 -13, 1 -16, 4 -16 C 12 -16, 14 -4, 0 6 Z"
        fill="#F43F5E"
        opacity="0"
      />
    </g>
  );
}

function Background() {
  return (
    <g>
      <rect width="1100" height="480" fill="#FDF3E4" />
      <rect y="300" width="1100" height="180" fill="#F4E1C6" />
      <line x1="0" y1="300" x2="1100" y2="300" stroke="#E7CBA4" strokeWidth="6" />
      {/* Ventana */}
      <g transform="translate(140 70)">
        <rect width="190" height="170" rx="10" fill="#FFFFFF" />
        <rect x="10" y="10" width="170" height="150" rx="6" fill="#BFDBFE" />
        <circle cx="140" cy="48" r="20" fill="#FDE68A" />
        <path d="M 10 130 C 50 104, 90 120, 120 110 C 150 100, 170 112, 180 108 L 180 160 L 10 160 Z" fill="#A7C796" />
        <line x1="95" y1="10" x2="95" y2="160" stroke="#FFFFFF" strokeWidth="6" />
        <line x1="10" y1="85" x2="180" y2="85" stroke="#FFFFFF" strokeWidth="6" />
      </g>
      {/* Cuadro */}
      <g transform="translate(800 80)">
        <rect width="120" height="90" rx="6" fill="#FFFFFF" stroke="#E7CBA4" strokeWidth="5" />
        <circle cx="42" cy="44" r="18" fill="#FDBA74" />
        <circle cx="72" cy="52" r="22" fill="#93C5FD" opacity="0.85" />
      </g>
      {/* Lámpara colgante */}
      <line x1="550" y1="0" x2="550" y2="54" stroke="#475569" strokeWidth="2" />
      <path d="M 518 82 L 582 82 L 566 54 L 534 54 Z" fill="#334155" />
      <ellipse cx="550" cy="84" rx="12" ry="5" fill="#FDE68A" />
      {/* Planta */}
      <g transform="translate(1000 300)">
        <path d="M -24 0 L 24 0 L 18 46 L -18 46 Z" fill="#C2410C" />
        <path d="M 0 0 C -30 -30, -40 -70, -20 -90 C -10 -60, 0 -30, 0 0 Z" fill="#65A30D" />
        <path d="M 0 0 C 26 -26, 46 -60, 30 -88 C 16 -60, 6 -30, 0 0 Z" fill="#84CC16" />
        <path d="M 0 0 C -6 -40, 0 -80, 8 -104 C 14 -70, 8 -36, 0 0 Z" fill="#4D7C0F" />
      </g>
    </g>
  );
}

export function SocialContactScenario(_props: ScenarioProps) {
  const rootRef = useSceneAnimation(() => {
    // Se ríen e inclinan el uno hacia el otro
    gsap.to('#friend-a', { rotation: 1.6, transformOrigin: '50% 100%', duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('#friend-b', { rotation: -1.6, transformOrigin: '50% 100%', duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.3 });

    // Corazones que flotan entre los amigos
    gsap.fromTo(
      '.heart',
      { opacity: 0, y: 0, scale: 0.6, transformOrigin: '50% 50%' },
      { opacity: 1, y: -40, scale: 1, duration: 1.4, stagger: { each: 0.7, repeat: -1 }, ease: 'sine.out', yoyo: false },
    );
    gsap.to('.heart', { opacity: 0, duration: 0.5, delay: 1, stagger: { each: 0.7, repeat: -1, repeatDelay: 0.9 } });
  });

  return (
    <SceneRoot rootRef={rootRef}>
      <Stage
        label="Dos amigos comparten una mesa con un plato de comida y vasos de jugo, se ríen y brindan."
        background={<Background />}
      >
        <g id="friend-a">
          <Person
            x={320}
            y={424}
            scale={1.3}
            shirtColor="#EA580C"
            shirtShadow="#C2410C"
            skinColor="#F2C19E"
            skinShadow="#D09772"
            hairColor="#1E293B"
            hairStyle="bun"
            expression="happy"
            arms={['table', 'hold']}
            held={<Glass x={46} y={-58} juice="#A855F7" />}
          />
        </g>

        <g id="friend-b">
          <Person
            x={780}
            y={424}
            scale={1.3}
            flip
            shirtColor="#2563EB"
            shirtShadow="#1D4ED8"
            skinColor="#6F4229"
            skinShadow="#54301B"
            hairColor="#0F172A"
            hairStyle="bob"
            expression="happy"
            arms={['table', 'hold']}
            held={<Glass x={46} y={-58} juice="#FACC15" />}
            blinkDelay={2.1}
          />
        </g>

        <Table top={356} cloth={{ color: '#F8FAFC', shadow: '#E2E8F0' }} surface="#FFFFFF" />
        {/* Cuadros del mantel */}
        <g opacity="0.18" fill="#EF4444">
          {Array.from({ length: 9 }).map((_, i) => (
            <rect key={i} x={190 + i * 84} y={396} width={42} height={84} />
          ))}
        </g>

        <Plate />
        <Cutlery x={455} y={386} />
        <Glass x={410} y={380} juice="#FB923C" />
        <Cutlery x={612} y={386} />

        <Heart x={530} y={210} className="heart" />
        <Heart x={565} y={235} size={0.8} className="heart" />
        <Heart x={548} y={190} size={0.6} className="heart" />
      </Stage>
    </SceneRoot>
  );
}
