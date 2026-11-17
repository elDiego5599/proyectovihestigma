import { useId, useRef, type ReactNode, type RefObject } from 'react';
import { gsap } from '../../lib/gsap';
import { Person } from '../art/Person';
import { SceneRoot, useSceneAnimation } from '../art/Stage';

const W = 600;
const H = 520;

/**
 * Lienzo de las ilustraciones. No dibuja fondo propio: el color lo pone el panel,
 * así la ilustración se funde con él sin bordes ni recortes.
 */
function Frame({ label, rootRef, children, defs, bottom = false }: {
  label: string;
  /** Pega el dibujo al borde inferior del panel: los cuerpos se cortan en el borde, no en el aire. */
  bottom?: boolean;
  rootRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  defs?: ReactNode;
}) {
  return (
    <SceneRoot rootRef={rootRef}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-full w-full select-none"
        style={{ overflow: 'visible' }}
        role="img"
        aria-label={label}
        preserveAspectRatio={bottom ? 'xMidYMax meet' : 'xMidYMid meet'}
      >
        {defs && <defs>{defs}</defs>}
        {children}
      </svg>
    </SceneRoot>
  );
}

/** Suelo que se extiende más allá del lienzo para cubrir todo el panel. */
function Ground({ y, fill, edge }: { y: number; fill: string; edge: string }) {
  return (
    <g>
      <rect x={-1200} y={y} width={3000} height={1000} fill={fill} />
      <rect x={-1200} y={y - 6} width={3000} height={8} fill={edge} />
    </g>
  );
}

const HEART = 'M 0 8 C -14 -2, -12 -16, 0 -8 C 12 -16, 14 -2, 0 8 Z';
const DROP = 'M 0 -9 C 4 -3, 7 1, 7 5 A 7 7 0 0 1 -7 5 C -7 1, -4 -3, 0 -9 Z';

function Label({ x, y, text, color = '#0F172A', size = 17, className }: {
  x: number;
  y: number;
  text: string;
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    <text className={className} x={x} y={y} textAnchor="middle" fontSize={size} fontWeight="800" fill={color} fontFamily="inherit">
      {text}
    </text>
  );
}

/* ------------------------------------------------------------------ */
/* Lazo rojo                                                           */
/* ------------------------------------------------------------------ */

// Línea central del lazo (caja local 200 × 320, cruce de las cintas en (100, 165)).
// La cinta de atrás sube desde la cola izquierda y forma el lado derecho del lazo;
// la de adelante baja por el lado izquierdo, cruza por encima y termina en la cola derecha.
const RIBBON_BACK = 'M 40 312 L 100 165 C 136 77, 152 30, 100 30';
const RIBBON_FRONT = 'M 100 30 C 48 30, 64 77, 100 165 L 160 312';
const RIBBON_W = 38;

function Ribbon({ id }: { id: string }) {
  return (
    <g>
      <defs>
        {/* Un único degradado en coordenadas del lazo: sin cortes donde se unen las cintas */}
        <linearGradient id={`${id}-fill`} gradientUnits="userSpaceOnUse" x1="40" y1="20" x2="160" y2="310">
          <stop offset="0" stopColor="#FB7185" />
          <stop offset="0.45" stopColor="#E11D48" />
          <stop offset="1" stopColor="#BE123C" />
        </linearGradient>
        {/* Las colas terminan con un corte recto */}
        <clipPath id={`${id}-cut`}>
          <rect x="-60" y="-40" width="320" height="332" />
        </clipPath>
        <mask id={`${id}-back-mask`} maskUnits="userSpaceOnUse" x="-60" y="-40" width="320" height="400">
          <path d={RIBBON_BACK} fill="none" stroke="#FFFFFF" strokeWidth={RIBBON_W} clipPath={`url(#${id}-cut)`} />
        </mask>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="-60" y="-40" width="320" height="400">
          <g clipPath={`url(#${id}-cut)`} fill="none" stroke="#FFFFFF" strokeWidth={RIBBON_W}>
            <path d={RIBBON_BACK} />
            <path d={RIBBON_FRONT} />
          </g>
        </mask>
      </defs>
      <g clipPath={`url(#${id}-cut)`} fill="none" strokeWidth={RIBBON_W} stroke={`url(#${id}-fill)`}>
        <path className="ribbon-back" d={RIBBON_BACK} pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
      </g>
      {/* Sombra de la cinta de adelante, solo sobre la de atrás */}
      <g mask={`url(#${id}-back-mask)`}>
        <path className="ribbon-front" d={RIBBON_FRONT} fill="none" stroke="#4C0519" strokeOpacity="0.3" strokeWidth={RIBBON_W + 8} transform="translate(4 3)" pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
      </g>
      <g clipPath={`url(#${id}-cut)`} fill="none" strokeWidth={RIBBON_W}>
        <path className="ribbon-front" d={RIBBON_FRONT} stroke={`url(#${id}-fill)`} pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
      </g>
      {/* Brillo que recorre la cinta */}
      <g mask={`url(#${id}-mask)`}>
        <rect className="ribbon-shine" x="-40" y="-60" width="34" height="440" fill="#FFFFFF" opacity="0.35" transform="rotate(20 100 150)" />
      </g>
    </g>
  );
}

function useRibbonIntro() {
  return () => {
    gsap.set('.ribbon-back, .ribbon-front', { attr: { 'stroke-dashoffset': 1 } });
    gsap.set('.ribbon-shine', { x: -120 });
    const intro = gsap.timeline({ delay: 0.3 });
    intro
      .to('.ribbon-back', { attr: { 'stroke-dashoffset': 0 }, duration: 1, ease: 'power2.inOut' })
      .to('.ribbon-front', { attr: { 'stroke-dashoffset': 0 }, duration: 1, ease: 'power2.inOut' }, '-=0.1')
      .fromTo('.ribbon-glow', { scale: 0.6, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }, '-=0.6');
    gsap.fromTo('.ribbon-shine', { x: -120 }, { x: 320, duration: 1.4, ease: 'power2.inOut', repeat: -1, repeatDelay: 2.6, delay: 2.4 });
    gsap.to('.ribbon-float', { y: -8, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.4 });
  };
}

export function RibbonArt({ quiz = false }: { quiz?: boolean }) {
  const id = `ribbon-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const intro = useRibbonIntro();
  const rootRef = useSceneAnimation(() => {
    intro();
    if (quiz) {
      // Las dos respuestas posibles se van turnando: hay que decidir
      gsap.set('.answer', { opacity: 0, y: 14 });
      gsap.to('.answer', { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out', delay: 1.6 });
      const tl = gsap.timeline({ repeat: -1, delay: 2.4 });
      tl.to('.answer-m', { scale: 1.08, duration: 0.4, ease: 'power2.out', transformOrigin: '50% 50%' })
        .to('.answer-r', { opacity: 0.45, duration: 0.4 }, '<')
        .to('.answer-m', { scale: 1, duration: 0.4, ease: 'power2.inOut' }, '+=0.9')
        .to('.answer-r', { opacity: 1, scale: 1.08, duration: 0.4, ease: 'power2.out', transformOrigin: '50% 50%' }, '<')
        .to('.answer-m', { opacity: 0.45, duration: 0.4 }, '<')
        .to('.answer-r', { scale: 1, duration: 0.4, ease: 'power2.inOut' }, '+=0.9')
        .to('.answer-m', { opacity: 1, duration: 0.4 }, '<');
    }
  });

  const cy = quiz ? 214 : 262;
  const s = quiz ? 1.05 : 1.4;

  return (
    <Frame
      label={quiz ? 'Lazo rojo y las dos respuestas posibles: mito o realidad.' : 'Lazo rojo, símbolo de la respuesta al VIH, dibujándose.'}
      rootRef={rootRef}
      defs={
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      }
    >
      <circle className="ribbon-glow" cx="300" cy={cy} r={quiz ? 170 : 230} fill={`url(#${id}-glow)`} />
      <g className="ribbon-float">
        <g transform={`translate(300 ${cy}) scale(${s}) translate(-100 -160)`}>
          <Ribbon id={id} />
        </g>
      </g>
      {quiz && (
        <g>
          <g className="answer answer-m" transform="translate(196 448)">
            <rect x="-92" y="-32" width="184" height="64" rx="20" fill="#0F172A" />
            <Label x={0} y={9} text="MITO" color="#FFFFFF" size={24} />
          </g>
          <g className="answer answer-r" transform="translate(404 448)">
            <rect x="-92" y="-32" width="184" height="64" rx="20" fill="#10B981" />
            <Label x={0} y={9} text="REALIDAD" color="#FFFFFF" size={24} />
          </g>
        </g>
      )}
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Vías de transmisión                                                 */
/* ------------------------------------------------------------------ */

const ROUTES = [
  { y: 110, color: '#F43F5E', soft: '#FFE4E6', label: 'Sexual' },
  { y: 260, color: '#0EA5E9', soft: '#E0F2FE', label: 'Sanguínea' },
  { y: 410, color: '#8B5CF6', soft: '#EDE9FE', label: 'De madre a hijo' },
];
const BADGE_X = 110;
const CHEST = { x: 470, y: 486 };

function RouteIcon({ i, color }: { i: number; color: string }) {
  if (i === 0) return <path d={HEART} transform="scale(2.3) translate(0 1)" fill={color} />;
  if (i === 1)
    return (
      <g transform="rotate(-40)">
        <line x1="0" y1="-34" x2="0" y2="-26" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
        <rect x="-9" y="-38" width="18" height="5" rx="2" fill="#64748B" />
        <rect x="-9" y="-26" width="18" height="40" rx="4" fill="#FFFFFF" stroke={color} strokeWidth="3" />
        <rect x="-6" y="-6" width="12" height="17" rx="2" fill="#DC2626" />
        <line x1="0" y1="14" x2="0" y2="32" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    );
  // Madre embarazada con el bebé dentro de la barriga
  return (
    <g transform="translate(-4 2)">
      <circle cx="-4" cy="-24" r="9" fill={color} />
      <path d="M -14 -12 C -16 2, -16 16, -12 30 L 4 30 C 6 22, 22 18, 21 4 C 20 -8, 6 -13, -14 -12 Z" fill={color} />
      <circle cx="9" cy="5" r="9" fill="#FFFFFF" />
      <circle cx="11" cy="2" r="3.4" fill={color} />
      <path d="M 6 6 C 6 11, 12 12, 14 8" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function RoutesArt() {
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const drops = useRef<(SVGGElement | null)[]>([]);
  const rootRef = useSceneAnimation(() => {
    // Cada vía, una tras otra: se ilumina, la gota viaja por el camino y llega al cuerpo
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
    tl.set('.route-line', { attr: { 'stroke-dashoffset': 1 }, opacity: 1 }, 0)
      .set('.route-drop', { opacity: 0 }, 0)
      .set('.badge', { opacity: 0.45 }, 0);
    ROUTES.forEach((_, i) => {
      const t = 0.4 + i * 2.2;
      const path = paths.current[i];
      const drop = drops.current[i];
      tl.to(`.badge-${i}`, { opacity: 1, duration: 0.3 }, t)
        .fromTo(`.badge-${i}`, { scale: 1 }, { scale: 1.12, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut', transformOrigin: '50% 50%' }, t)
        .to(`.route-line-${i}`, { attr: { 'stroke-dashoffset': 0 }, duration: 0.9, ease: 'power1.inOut' }, t + 0.1);
      if (path && drop) {
        tl.set(drop, { opacity: 1 }, t + 0.4).to(
          drop,
          { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, duration: 1.1, ease: 'power1.inOut' },
          t + 0.4,
        );
        tl.to(drop, { opacity: 0, duration: 0.15 }, t + 1.5);
      }
      tl.fromTo(`.ring-${i}`, { scale: 0.3, opacity: 0.9 }, { scale: 1.6, opacity: 0, duration: 0.8, ease: 'power2.out', transformOrigin: '50% 50%' }, t + 1.5);
    });
    tl.to('.route-line', { opacity: 0, duration: 0.5 }, 7.6);
  });

  const d = (i: number, y: number) => `M ${BADGE_X + 52} ${y} C ${300} ${y}, ${320} ${CHEST.y - 40 + i * 16}, ${CHEST.x} ${CHEST.y}`;

  return (
    <Frame bottom label="El virus llega al cuerpo de una persona por tres caminos: la vía sexual, la sanguínea y de madre a hijo." rootRef={rootRef}>
      <Person
        x={470}
        y={580}
        scale={1.15}
        flip
        shirtColor="#6366F1"
        shirtShadow="#4338CA"
        skinColor="#E0AC84"
        skinShadow="#BF8760"
        hairColor="#3F2A1D"
        hairStyle="short"
        expression="calm"
      />
      {ROUTES.map((r, i) => (
        <g key={r.label}>
          <path d={d(i, r.y)} fill="none" stroke={r.color} strokeOpacity="0.22" strokeWidth="4" strokeDasharray="2 10" strokeLinecap="round" />
          <path
            ref={(el) => {
              paths.current[i] = el;
            }}
            className={`route-line route-line-${i}`}
            d={d(i, r.y)}
            fill="none"
            stroke={r.color}
            strokeWidth="5"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="1"
          />
          <circle className={`ring-${i}`} cx={CHEST.x} cy={CHEST.y} r="30" fill="none" stroke={r.color} strokeWidth="4" opacity="0" />
          <g
            ref={(el) => {
              drops.current[i] = el;
            }}
            className="route-drop"
            opacity="0"
          >
            <circle r="17" fill={r.color} opacity="0.25" />
            <g transform="scale(1.15)">
              <VirusShape color={r.color} />
            </g>
          </g>
          <g transform={`translate(${BADGE_X} ${r.y})`}>
            <g className={`badge badge-${i}`}>
              <circle r="50" fill="#FFFFFF" stroke={r.color} strokeWidth="4" />
              <circle r="40" fill={r.soft} />
              <RouteIcon i={i} color={r.color} />
            </g>
            <Label x={0} y={78} text={r.label} size={18} />
          </g>
        </g>
      ))}
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Líquidos                                                            */
/* ------------------------------------------------------------------ */

const YES = [
  { label: 'Sangre', color: '#DC2626' },
  { label: 'Semen', color: '#F43F5E' },
  { label: 'Fluido vaginal', color: '#E11D48' },
  { label: 'Leche materna', color: '#FB7185' },
];
const NO = ['Saliva', 'Sudor', 'Lágrimas', 'Orina'];
const COL = (i: number) => 96 + i * 136;

/** Partícula de virus: círculo con espículas. */
function Virus() {
  return <VirusShape color="#FFFFFF" />;
}

function VirusShape({ color }: { color: string }) {
  return (
    <g>
      {Array.from({ length: 8 }, (_, k) => {
        const a = (k * Math.PI) / 4;
        return (
          <g key={k}>
            <line x1={Math.cos(a) * 6} y1={Math.sin(a) * 6} x2={Math.cos(a) * 10} y2={Math.sin(a) * 10} stroke={color} strokeWidth="2" />
            <circle cx={Math.cos(a) * 11} cy={Math.sin(a) * 11} r="2" fill={color} />
          </g>
        );
      })}
      <circle r="7" fill={color} />
    </g>
  );
}

export function FluidsArt() {
  const rootRef = useSceneAnimation(() => {
    gsap.set('.yes-drop, .no-drop', { opacity: 0, y: -24 });
    gsap.set('.yes-head, .no-head', { opacity: 0 });
    const intro = gsap.timeline({ delay: 0.3 });
    intro
      .to('.yes-head', { opacity: 1, duration: 0.4 })
      .to('.yes-drop', { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'bounce.out' }, '-=0.1')
      .to('.no-head', { opacity: 1, duration: 0.4 }, '+=0.3')
      .to('.no-drop', { opacity: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'bounce.out' }, '-=0.1');
    // Los líquidos que sí transmiten llevan el virus dentro
    gsap.to('.virus', { rotation: 360, duration: 6, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
    gsap.fromTo('.virus', { scale: 0.85 }, { scale: 1.1, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.2, transformOrigin: '50% 50%' });
  });

  return (
    <Frame label="Arriba, gotas de sangre, semen, fluido vaginal y leche materna con el virus dentro: sí lo transmiten. Abajo, gotas de saliva, sudor, lágrimas y orina sin virus: no lo transmiten." rootRef={rootRef}>
      <rect x={-1200} y="268" width="3000" height="1000" fill="#ECFDF5" />
      <g className="yes-head">
        <circle cx="72" cy="52" r="15" fill="#E11D48" />
        <path d="M 65 52.5 L 70 57.5 L 79 47.5" stroke="#FFFFFF" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="96" y="59" fontSize="21" fontWeight="900" fill="#9F1239" fontFamily="inherit">Sí lo transmiten</text>
      </g>
      {YES.map((f, i) => (
        <g key={f.label} transform={`translate(${COL(i)} 150)`}>
          <g className="yes-drop">
            <path d={DROP} transform="scale(4.6)" fill={f.color} />
            <path d="M -14 -10 C -18 0, -18 8, -12 16" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="5" fill="none" strokeLinecap="round" />
            <g transform="translate(2 22)">
              <g className="virus">
                <Virus />
              </g>
            </g>
            <Label x={0} y={92} text={f.label} color="#881337" size={16} />
          </g>
        </g>
      ))}

      <g className="no-head">
        <circle cx="72" cy="316" r="15" fill="#059669" />
        <path d="M 66 310 L 78 322 M 78 310 L 66 322" stroke="#FFFFFF" strokeWidth="3.4" strokeLinecap="round" />
        <text x="96" y="323" fontSize="21" fontWeight="900" fill="#065F46" fontFamily="inherit">No lo transmiten</text>
      </g>
      {NO.map((label, i) => (
        <g key={label} transform={`translate(${COL(i)} 408)`}>
          <g className="no-drop">
            <path d={DROP} transform="scale(4.6)" fill="#7DD3FC" />
            <path d="M -14 -10 C -18 0, -18 8, -12 16" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="5" fill="none" strokeLinecap="round" />
            <Label x={0} y={92} text={label} color="#065F46" size={16} />
          </g>
        </g>
      ))}
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Situaciones de riesgo                                               */
/* ------------------------------------------------------------------ */

function Syringe() {
  return (
    <g>
      <rect x="-70" y="-15" width="9" height="30" rx="3" fill="#475569" />
      <rect x="-62" y="-5" width="22" height="10" fill="#64748B" />
      <rect x="-42" y="-16" width="80" height="32" rx="7" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="3" />
      <rect className="syringe-blood" x="-4" y="-10" width="38" height="20" rx="3" fill="#DC2626" />
      {[-24, -10, 4, 18].map((x) => (
        <line key={x} x1={x} y1="-16" x2={x} y2="-8" stroke="#94A3B8" strokeWidth="2" />
      ))}
      <rect x="38" y="-6" width="10" height="12" rx="2" fill="#94A3B8" />
      <line x1="48" y1="0" x2="86" y2="0" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
      <circle cx="88" cy="3" r="4.5" fill="#DC2626" />
    </g>
  );
}

function CondomPack() {
  return (
    <g>
      <rect x="-46" y="-46" width="92" height="92" rx="10" fill="#A78BFA" stroke="#7C3AED" strokeWidth="4" strokeDasharray="6 4" />
      <circle r="26" fill="none" stroke="#EDE9FE" strokeWidth="7" />
      {/* Prohibido: sin condón */}
      <circle r="60" fill="none" stroke="#F43F5E" strokeWidth="9" />
      <line x1="-42" y1="-42" x2="42" y2="42" stroke="#F43F5E" strokeWidth="9" strokeLinecap="round" />
    </g>
  );
}

function TattooPen() {
  return (
    <g transform="rotate(35)">
      <rect x="-14" y="-70" width="28" height="56" rx="8" fill="#334155" />
      <rect x="-10" y="-62" width="20" height="10" rx="3" fill="#64748B" />
      <rect x="-11" y="-14" width="22" height="46" rx="6" fill="#94A3B8" />
      <path d="M -9 32 L 9 32 L 3 50 L -3 50 Z" fill="#64748B" />
      <line x1="0" y1="50" x2="0" y2="64" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
      <path d={DROP} transform="translate(0 76) scale(1.2)" fill="#DC2626" />
    </g>
  );
}

const RISKS = [
  { y: 92, label: 'Sin condón', Icon: CondomPack },
  { y: 260, label: 'Agujas usadas', Icon: () => <g transform="rotate(-35) scale(0.9)"><Syringe /></g> },
  { y: 428, label: 'Tatuajes', Icon: TattooPen },
];

export function RiskArt() {
  const rootRef = useSceneAnimation(() => {
    // Una situación a la vez: se destaca y de ella sale el virus
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3 });
    tl.set('.risk-item', { opacity: 0.35, scale: 0.92, transformOrigin: '50% 50%' })
      .set('.risk-virus', { opacity: 0, x: 0, y: 0, scale: 0.4, rotation: 0, transformOrigin: '50% 50%' })
      .set('.risk-ring', { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' });
    RISKS.forEach((_, i) => {
      const t = 0.3 + i * 2.2;
      tl.to(`.risk-item-${i}`, { opacity: 1, scale: 1.05, duration: 0.45, ease: 'back.out(2)' }, t)
        .fromTo(`.risk-ring-${i}`, { opacity: 0.8, scale: 0.6 }, { opacity: 0, scale: 1.4, duration: 1, ease: 'power2.out' }, t + 0.2)
        .to(`.risk-virus-${i}`, { opacity: 1, scale: 1, x: 290, y: -40, duration: 0.9, ease: 'power2.out' }, t + 0.35)
        .to(`.risk-virus-${i}`, { rotation: 90, duration: 1.2, ease: 'none' }, t + 0.35)
        .to(`.risk-virus-${i}`, { opacity: 0, duration: 0.3 }, t + 1.7)
        .to(`.risk-item-${i}`, { opacity: 0.35, scale: 0.92, duration: 0.4 }, t + 1.9);
    });
    tl.to('.risk-item', { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 }, 7)
      .to({}, { duration: 1.6 })
      .to('.risk-item', { opacity: 0.35, scale: 0.92, duration: 0.4 });
  });

  return (
    <Frame label="Tres situaciones de riesgo se destacan una a una y de cada una sale un virus: sexo sin condón, agujas usadas y tatuajes sin esterilizar." rootRef={rootRef}>
      {RISKS.map(({ y, label, Icon }, i) => (
        <g key={label} transform={`translate(170 ${y})`}>
          <circle className={`risk-ring risk-ring-${i}`} r="80" fill="none" stroke="#F43F5E" strokeWidth="5" opacity="0" />
          <g className={`risk-item risk-item-${i}`}>
            <circle r="74" fill="#FFFFFF" />
            <g transform="scale(0.85)">
              <Icon />
            </g>
          </g>
          <g transform="translate(70 -10)">
            <g className={`risk-virus risk-virus-${i}`} opacity="0">
              <g transform="scale(1.9)">
                <VirusShape color="#E11D48" />
              </g>
            </g>
          </g>
          <text x="120" y="10" fontSize="30" fontWeight="900" fill="#7C2D12" fontFamily="inherit" letterSpacing="-0.5">
            {label}
          </text>
        </g>
      ))}
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Lo que no transmite                                                 */
/* ------------------------------------------------------------------ */

export function SafeArt() {
  const rootRef = useSceneAnimation(() => {
    gsap.fromTo('.safe-badge', { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.6, ease: 'back.out(2.2)', delay: 0.4 });
    // Corazones que salen de las manos unidas
    gsap.utils.toArray<SVGPathElement>('.safe-heart').forEach((el, i) => {
      gsap.fromTo(
        el,
        { y: 0, x: 0, opacity: 0, scale: 0.4 },
        {
          keyframes: [
            { opacity: 1, scale: 1, duration: 0.4 },
            { y: -160, x: (i % 2 ? 1 : -1) * (12 + i * 5), opacity: 0, duration: 2.4, ease: 'sine.in' },
          ],
          repeat: -1,
          delay: 0.8 + i * 0.6,
          transformOrigin: '50% 50%',
        },
      );
    });
  });

  return (
    <Frame label="Dos amigos se dan la mano y salen corazones. Arriba dice: sin riesgo." rootRef={rootRef}>
      <Ground y={440} fill="#BBF7D0" edge="#86EFAC" />
      <g className="safe-badge" transform="translate(300 110)">
        <rect x="-118" y="-32" width="236" height="64" rx="32" fill="#10B981" />
        <circle cx="-80" r="17" fill="#FFFFFF" />
        <path d="M -88 0 L -82 6 L -72 -5" stroke="#10B981" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Label x={18} y={9} text="Sin riesgo" color="#FFFFFF" size={26} />
      </g>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${300 + (i - 2) * 6} 390)`}>
          <path className="safe-heart" d={HEART} transform={`scale(${1.2 + (i % 2) * 0.4})`} fill={i % 2 ? '#F43F5E' : '#FB7185'} opacity="0" />
        </g>
      ))}
      <Person
        x={122}
        y={470}
        scale={1.1}
        shirtColor="#8B5CF6"
        shirtShadow="#6D28D9"
        skinColor="#F2C19E"
        skinShadow="#D09772"
        hairColor="#B45309"
        hairStyle="wavy"
        expression="happy"
        arms={['down', 'reach']}
      />
      <Person
        x={478}
        y={470}
        scale={1.1}
        flip
        shirtColor="#F43F5E"
        shirtShadow="#BE123C"
        skinColor="#8D5524"
        skinShadow="#6B3E18"
        hairColor="#0F172A"
        hairStyle="curly"
        expression="happy"
        arms={['down', 'reach']}
        blinkDelay={0.9}
      />
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Factores de riesgo                                                  */
/* ------------------------------------------------------------------ */

const C = { x: 300, y: 300 };
const R = 170;

function arc(a0: number, a1: number) {
  const p = (a: number) => [C.x + R * Math.cos((a * Math.PI) / 180), C.y + R * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

const UP = ['Otras ITS', 'Heridas', 'Sin prueba'];
const DOWN = ['Condón', 'Tratamiento', 'Prueba'];

function Chip({ x, text, fill, className }: { x: number; text: string; fill: string; className: string }) {
  const w = text.length * 10 + 40;
  return (
    <g transform={`translate(${x} 430)`}>
      <g className={className}>
        <rect x={-w / 2} y="-21" width={w} height="42" rx="21" fill={fill} />
        <Label x={0} y={6} text={text} color="#FFFFFF" size={17} />
      </g>
    </g>
  );
}

export function FactorsArt() {
  const rootRef = useSceneAnimation(() => {
    const o = { svgOrigin: `${C.x} ${C.y}` };
    const tl = gsap.timeline({ repeat: -1 });
    tl.set('.chip-up, .chip-down', { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' })
      .set('.level-high, .level-low', { opacity: 0 })
      .set('.needle', { rotation: 0, ...o })
      .to('.chip-up', { opacity: 1, scale: 1, duration: 0.4, stagger: 0.3, ease: 'back.out(2.2)' }, 0.4)
      .to('.needle', { rotation: 62, duration: 1.4, ease: 'elastic.out(1, 0.5)', ...o }, 1.3)
      .to('.level-high', { opacity: 1, duration: 0.3 }, 1.5)
      .to('.chip-up, .level-high', { opacity: 0, duration: 0.3 }, 4)
      .to('.chip-down', { opacity: 1, scale: 1, duration: 0.4, stagger: 0.3, ease: 'back.out(2.2)' }, 4.3)
      .to('.needle', { rotation: -62, duration: 1.6, ease: 'elastic.out(1, 0.55)', ...o }, 5.2)
      .to('.level-low', { opacity: 1, duration: 0.3 }, 5.4)
      .to('.chip-down, .level-low', { opacity: 0, duration: 0.3 }, 8)
      .to('.needle', { rotation: 0, duration: 0.8, ease: 'power2.inOut', ...o }, 8.1)
      .to({}, { duration: 0.5 });
  });

  return (
    <Frame label="Un medidor de riesgo: la aguja sube con otras ITS, heridas o no hacerse la prueba, y baja con condón, tratamiento y la prueba." rootRef={rootRef}>
      <path d={arc(180, 240)} stroke="#10B981" strokeWidth="40" fill="none" />
      <path d={arc(240, 300)} stroke="#F59E0B" strokeWidth="40" fill="none" />
      <path d={arc(300, 360)} stroke="#F43F5E" strokeWidth="40" fill="none" />
      <Label x={C.x - R} y={C.y + 40} text="Bajo" color="#047857" size={17} />
      <Label x={C.x + R} y={C.y + 40} text="Alto" color="#BE123C" size={17} />
      <g className="needle">
        <path d={`M ${C.x - 10} ${C.y} L ${C.x} ${C.y - R + 26} L ${C.x + 10} ${C.y} Z`} fill="#0F172A" />
      </g>
      <circle cx={C.x} cy={C.y} r="20" fill="#0F172A" />
      <circle cx={C.x} cy={C.y} r="7" fill="#FFFFFF" />
      <Label className="level-high" x={C.x} y={C.y + 62} text="Más riesgo" color="#BE123C" size={24} />
      <Label className="level-low" x={C.x} y={C.y + 62} text="Menos riesgo" color="#047857" size={24} />

      {UP.map((t, i) => (
        <Chip key={t} x={C.x + (i - 1) * 168} text={`↑ ${t}`} fill="#F43F5E" className="chip-up" />
      ))}
      {DOWN.map((t, i) => (
        <Chip key={t} x={C.x + (i - 1) * 168} text={`↓ ${t}`} fill="#10B981" className="chip-down" />
      ))}
    </Frame>
  );
}
