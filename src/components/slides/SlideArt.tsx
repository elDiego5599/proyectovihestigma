import { useId, useRef, type ReactNode, type RefObject } from 'react';
import { gsap } from '../../lib/gsap';
import { Person } from '../art/Person';
import { SceneRoot, useSceneAnimation } from '../art/Stage';

const W = 600;
const H = 520;

/** Lienzo de las ilustraciones de las diapositivas: casi cuadrado, esquinas redondeadas. */
function Frame({ label, rootRef, children, defs }: {
  label: string;
  rootRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  defs?: ReactNode;
}) {
  const clip = `slide-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <SceneRoot rootRef={rootRef}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full select-none" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
        <defs>
          <clipPath id={clip}>
            <rect width={W} height={H} rx="28" />
          </clipPath>
          {defs}
        </defs>
        <g clipPath={`url(#${clip})`}>{children}</g>
      </svg>
    </SceneRoot>
  );
}

const HEART = 'M 0 8 C -14 -2, -12 -16, 0 -8 C 12 -16, 14 -2, 0 8 Z';
const DROP = 'M 0 -9 C 4 -3, 7 1, 7 5 A 7 7 0 0 1 -7 5 C -7 1, -4 -3, 0 -9 Z';

function Pill({ x, y, text, fill, color = '#FFFFFF', className, size = 16 }: {
  x: number;
  y: number;
  text: string;
  fill: string;
  color?: string;
  className?: string;
  size?: number;
}) {
  const w = text.length * size * 0.6 + size * 2;
  const h = size * 2.3;
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={className}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={fill} />
        <text y={size * 0.36} textAnchor="middle" fontSize={size} fontWeight="800" fill={color} fontFamily="inherit">
          {text}
        </text>
      </g>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Lazo rojo                                                           */
/* ------------------------------------------------------------------ */

function Ribbon({ gradId }: { gradId: string }) {
  // Coordenadas locales: el cruce de las cintas está en (100, 140)
  return (
    <g>
      <path
        className="ribbon-a"
        d="M 52 246 L 100 140 C 124 96 142 62 122 36 C 110 19 90 19 78 36"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="30"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset="0"
      />
      {/* Sombra donde una cinta pasa sobre la otra */}
      <path
        className="ribbon-b"
        d="M 78 36 C 58 62 76 96 100 140 L 148 246"
        fill="none"
        stroke="#7F1D1D"
        strokeOpacity="0.28"
        strokeWidth="34"
        transform="translate(3 2)"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset="0"
      />
      <path
        className="ribbon-b"
        d="M 78 36 C 58 62 76 96 100 140 L 148 246"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="30"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset="0"
      />
      {/* Brillo */}
      <path
        className="ribbon-shine"
        d="M 63 236 L 104 146"
        stroke="#FFFFFF"
        strokeOpacity="0.35"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </g>
  );
}

export function RibbonArt({ quiz = false }: { quiz?: boolean }) {
  const gradId = `ribbon-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const rootRef = useSceneAnimation(() => {
    gsap.set('.ribbon-a, .ribbon-b', { attr: { 'stroke-dashoffset': 1 } });
    gsap.set('.ribbon-shine', { opacity: 0 });
    const intro = gsap.timeline({ delay: 0.25 });
    intro
      .to('.ribbon-a', { attr: { 'stroke-dashoffset': 0 }, duration: 1.1, ease: 'power2.inOut' })
      .to('.ribbon-b', { attr: { 'stroke-dashoffset': 0 }, duration: 0.8, ease: 'power2.out' }, '-=0.15')
      .to('.ribbon-shine', { opacity: 1, duration: 0.4 })
      .fromTo('.ribbon', { scale: 0.96 }, { scale: 1, duration: 0.6, ease: 'back.out(3)', transformOrigin: '50% 50%' }, '<');

    gsap.to('.ribbon-float', { y: -10, rotation: 3, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut', svgOrigin: '300 270' });
    gsap.fromTo(
      '.halo',
      { scale: 0.7, opacity: 0.55, transformOrigin: '50% 50%' },
      { scale: 1.5, opacity: 0, duration: 3.6, repeat: -1, stagger: 1.2, ease: 'sine.out' },
    );
    gsap.utils.toArray<SVGGElement>('.float-heart').forEach((el, i) => {
      gsap.fromTo(
        el,
        { y: 0, opacity: 0, scale: 0.6 },
        {
          keyframes: [
            { opacity: 1, scale: 1, duration: 0.6 },
            { y: -300, x: i % 2 ? 24 : -24, opacity: 0, duration: 4.2, ease: 'sine.in' },
          ],
          repeat: -1,
          delay: i * 0.9,
          transformOrigin: '50% 50%',
        },
      );
    });
    if (quiz) {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4, delay: 1.6 });
      tl.set('.quiz-pill', { scale: 0, opacity: 0, transformOrigin: '50% 50%' })
        .to('.quiz-m', { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2.4)' })
        .to('.quiz-r', { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2.4)' }, '+=0.5')
        .to('.quiz-m', { y: -8, duration: 0.35, yoyo: true, repeat: 3, ease: 'sine.inOut' }, '+=0.3')
        .to('.quiz-r', { y: -8, duration: 0.35, yoyo: true, repeat: 3, ease: 'sine.inOut' })
        .to('.quiz-pill', { scale: 0.6, opacity: 0, duration: 0.3 }, '+=0.6');
      gsap.to('.qmark', { y: -12, duration: 1.4, repeat: -1, yoyo: true, stagger: 0.4, ease: 'sine.inOut' });
    }
  });

  return (
    <Frame
      label={quiz ? 'Lazo rojo con las palabras Mito y Realidad a cada lado.' : 'Lazo rojo, símbolo de la lucha contra el VIH, dibujándose y flotando.'}
      rootRef={rootRef}
      defs={
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FB7185" />
          <stop offset="0.55" stopColor="#E11D48" />
          <stop offset="1" stopColor="#BE123C" />
        </linearGradient>
      }
    >
      <rect width={W} height={H} fill="#FFF1F2" />
      <circle cx="520" cy="70" r="120" fill="#FFE4E6" />
      <circle cx="70" cy="470" r="140" fill="#FFE4E6" />
      <g transform="translate(300 270)">
        {[0, 1, 2].map((i) => (
          <circle key={i} className="halo" r="150" fill="none" stroke="#FDA4AF" strokeWidth="3" />
        ))}
        <circle r="150" fill="#FFFFFF" opacity="0.7" />
      </g>
      {[150, 230, 380, 450, 190, 410].map((x, i) => (
        <g key={i} transform={`translate(${x} ${470 - (i % 3) * 20}) scale(${1 + (i % 2) * 0.5})`}>
          <path className="float-heart" d={HEART} fill={i % 2 ? '#FB7185' : '#FDA4AF'} opacity="0" />
        </g>
      ))}
      <g className="ribbon-float">
        <g className="ribbon" transform="translate(300 270) scale(1.45) translate(-100 -132)">
          <Ribbon gradId={gradId} />
        </g>
      </g>
      {quiz && (
        <>
          <text className="qmark" x="90" y="120" fontSize="64" fontWeight="900" fill="#FDA4AF" fontFamily="inherit">?</text>
          <text className="qmark" x="490" y="470" fontSize="52" fontWeight="900" fill="#FDA4AF" fontFamily="inherit">?</text>
          <text className="qmark" x="500" y="150" fontSize="40" fontWeight="900" fill="#FECDD3" fontFamily="inherit">?</text>
          <Pill x={140} y={360} text="MITO" fill="#0F172A" className="quiz-pill quiz-m" size={22} />
          <Pill x={455} y={210} text="REALIDAD" fill="#10B981" className="quiz-pill quiz-r" size={22} />
        </>
      )}
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Vías de transmisión                                                 */
/* ------------------------------------------------------------------ */

const ROUTES = [
  { y: 100, color: '#F43F5E', soft: '#FFE4E6', label: 'Sexual' },
  { y: 250, color: '#0EA5E9', soft: '#E0F2FE', label: 'Sanguínea' },
  { y: 400, color: '#8B5CF6', soft: '#EDE9FE', label: 'Maternoinfantil' },
];
const BADGE_X = 100;
const CHEST = { x: 440, y: 484 };

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
  return (
    <g>
      <path d="M -6 -22 C -6 -32, 6 -32, 6 -22 Z" fill="#FBBF24" />
      <rect x="-12" y="-22" width="24" height="7" rx="3" fill={color} />
      <rect x="-12" y="-15" width="24" height="36" rx="9" fill="#FFFFFF" stroke={color} strokeWidth="3" />
      <rect x="-9" y="2" width="18" height="16" rx="6" fill="#F5F5F4" />
      {[-6, 0, 6].map((y) => (
        <line key={y} x1="4" y1={y} x2="9" y2={y} stroke={color} strokeWidth="2" strokeLinecap="round" />
      ))}
    </g>
  );
}

export function RoutesArt() {
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const drops = useRef<(SVGGElement | null)[]>([]);
  const rootRef = useSceneAnimation(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
    tl.set('.route-line', { attr: { 'stroke-dashoffset': 1 }, opacity: 1 }, 0).set('.route-drop', { opacity: 0 }, 0);
    ROUTES.forEach((_, i) => {
      const t = 0.3 + i * 2.1;
      const path = paths.current[i];
      const drop = drops.current[i];
      tl.to(`.badge-${i}`, { scale: 1.14, duration: 0.22, yoyo: true, repeat: 1, ease: 'sine.inOut', transformOrigin: '50% 50%' }, t)
        .to(`.route-line-${i}`, { attr: { 'stroke-dashoffset': 0 }, duration: 0.8, ease: 'power1.inOut' }, t);
      if (path && drop) {
        tl.set(drop, { opacity: 1 }, t + 0.5).to(
          drop,
          { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, duration: 1, ease: 'power1.inOut' },
          t + 0.5,
        );
        tl.to(drop, { opacity: 0, duration: 0.15 }, t + 1.5);
      }
      tl.fromTo(`.ring-${i}`, { scale: 0.3, opacity: 0.9 }, { scale: 1.6, opacity: 0, duration: 0.8, ease: 'power2.out', transformOrigin: '50% 50%' }, t + 1.45);
    });
    tl.to('.route-line', { opacity: 0, duration: 0.5 }, 7.2);
  });

  return (
    <Frame label="Tres vías llegan al cuerpo de una persona: sexual, sanguínea y maternoinfantil." rootRef={rootRef}>
      <rect width={W} height={H} fill="#F8FAFC" />
      <circle cx="470" cy="190" r="170" fill="#EEF2FF" />
      <Person
        x={455}
        y={590}
        scale={1.2}
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
          <path
            d={`M ${BADGE_X + 48} ${r.y} C ${290} ${r.y}, ${300} ${CHEST.y - 30 + i * 12}, ${CHEST.x} ${CHEST.y}`}
            fill="none"
            stroke={r.color}
            strokeOpacity="0.25"
            strokeWidth="4"
            strokeDasharray="2 10"
            strokeLinecap="round"
          />
          <path
            ref={(el) => {
              paths.current[i] = el;
            }}
            className={`route-line route-line-${i}`}
            d={`M ${BADGE_X + 48} ${r.y} C ${290} ${r.y}, ${300} ${CHEST.y - 30 + i * 12}, ${CHEST.x} ${CHEST.y}`}
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
            <path d={DROP} transform="scale(1.4)" fill={r.color} stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
          <g transform={`translate(${BADGE_X} ${r.y})`}>
            <g className={`badge-${i}`}>
              <circle r="46" fill="#FFFFFF" stroke={r.color} strokeWidth="4" />
              <circle r="36" fill={r.soft} />
              <RouteIcon i={i} color={r.color} />
            </g>
            <text y="70" textAnchor="middle" fontSize="16" fontWeight="800" fill="#0F172A" fontFamily="inherit">
              {r.label}
            </text>
          </g>
        </g>
      ))}
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Líquidos                                                            */
/* ------------------------------------------------------------------ */

const TUBES = [
  { label: 'Sangre', color: '#DC2626' },
  { label: 'Semen', color: '#FB7185' },
  { label: 'Vaginal', color: '#F43F5E' },
  { label: 'Rectal', color: '#E11D48' },
  { label: 'Leche', color: '#FDA4AF' },
];

export function FluidsArt() {
  const rootRef = useSceneAnimation(() => {
    gsap.utils.toArray<SVGCircleElement>('.bubble').forEach((el, i) => {
      gsap.fromTo(el, { y: 0, opacity: 0 }, { y: -54, opacity: 0.9, duration: 1.6, repeat: -1, delay: (i % 5) * 0.37 + Math.floor(i / 5) * 0.8, ease: 'sine.in' });
    });
    gsap.fromTo('.liquid', { scaleY: 0.85, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 1.2, repeat: -1, yoyo: true, stagger: 0.2, ease: 'sine.inOut' });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
    tl.set('.fluid-tag', { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' })
      .set('.sweat, .tear', { opacity: 0, y: 0 })
      .to('.sweat', { opacity: 1, duration: 0.3 }, 0.3)
      .to('.tag-sweat', { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)' }, 0.3)
      .to('.sweat', { y: 70, duration: 1.2, ease: 'power1.in' }, 0.7)
      .to('.sweat', { opacity: 0, duration: 0.3 }, 1.6)
      .to('.tear', { opacity: 1, duration: 0.3 }, 1.6)
      .to('.tag-tear', { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)' }, 1.6)
      .to('.tear', { y: 60, duration: 1.1, ease: 'power1.in' }, 2)
      .to('.tear', { opacity: 0, duration: 0.3 }, 2.8)
      .to('.tag-saliva', { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)' }, 3)
      .to('.fluid-tag', { opacity: 0, duration: 0.3 }, 4.8);
  });

  return (
    <Frame label="A la izquierda, tubos con sangre, semen, secreciones y leche materna, que sí transmiten. A la derecha, una persona con sudor y lágrimas, que no transmiten." rootRef={rootRef}>
      <rect width={W} height={H} fill="#FFF1F2" />
      <path d="M 300 0 C 320 130, 280 260, 300 520 L 600 520 L 600 0 Z" fill="#ECFDF5" />
      <Pill x={150} y={56} text="Sí lo transmiten" fill="#F43F5E" />
      <Pill x={452} y={56} text="No lo transmiten" fill="#10B981" />

      {/* Repisa con tubos de ensayo */}
      <rect x="0" y="420" width="300" height="100" fill="#FECDD3" />
      <rect x="0" y="414" width="300" height="10" fill="#FDA4AF" />
      <rect x="22" y="250" width="256" height="10" rx="5" fill="#9F1239" opacity="0.8" />
      {TUBES.map((t, i) => {
        const x = 50 + i * 50;
        return (
          <g key={t.label}>
            <rect x={x - 14} y="226" width="28" height="172" rx="14" fill="#FFFFFF" stroke="#FBCFE8" strokeWidth="2" />
            <rect className="liquid" x={x - 10} y={300 + (i % 3) * 14} width="20" height={94 - (i % 3) * 14} rx="10" fill={t.color} />
            {[0, 1].map((k) => (
              <circle key={k} className="bubble" cx={x - 3 + k * 6} cy="386" r={2.4 - k * 0.6} fill="#FFFFFF" opacity="0" />
            ))}
            <text x={x} y="450" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#9F1239" fontFamily="inherit">
              {t.label}
            </text>
          </g>
        );
      })}
      <rect x="18" y="392" width="264" height="22" rx="7" fill="#9F1239" />
      <rect x="18" y="392" width="264" height="6" rx="3" fill="#BE123C" />

      {/* Persona con sudor y lágrimas */}
      <Person
        x={452}
        y={590}
        scale={1.2}
        shirtColor="#10B981"
        shirtShadow="#047857"
        skinColor="#C68642"
        skinShadow="#A0692F"
        hairColor="#1C1917"
        hairStyle="bob"
        expression="relieved"
      />
      <g transform="translate(408 352)">
        <path className="sweat" d={DROP} transform="scale(1.3)" fill="#7DD3FC" stroke="#FFFFFF" strokeWidth="1.2" opacity="0" />
      </g>
      <g transform="translate(476 396)">
        <path className="tear" d={DROP} fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.2" opacity="0" />
      </g>
      <Pill x={372} y={262} text="Sudor" fill="#FFFFFF" color="#047857" className="fluid-tag tag-sweat" size={14} />
      <Pill x={540} y={262} text="Lágrimas" fill="#FFFFFF" color="#047857" className="fluid-tag tag-tear" size={14} />
      <Pill x={456} y={206} text="Saliva" fill="#FFFFFF" color="#047857" className="fluid-tag tag-saliva" size={14} />
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Situaciones de riesgo                                               */
/* ------------------------------------------------------------------ */

const RISKS = ['Agujas compartidas', 'Sexo sin condón', 'Tatuajes sin esterilizar', 'Transfusión sin control'];

function Syringe() {
  return (
    <g>
      <rect x="-56" y="-11" width="7" height="22" rx="2" fill="#475569" />
      <rect x="-50" y="-3.5" width="18" height="7" fill="#64748B" />
      <rect x="-34" y="-11" width="62" height="22" rx="5" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
      <rect x="-6" y="-7" width="30" height="14" rx="2" fill="#DC2626" />
      <line x1="28" y1="0" x2="56" y2="0" stroke="#64748B" strokeWidth="2.6" strokeLinecap="round" />
      <circle className="needle-blood" cx="58" cy="2" r="3.6" fill="#DC2626" />
    </g>
  );
}

export function RiskArt() {
  const rootRef = useSceneAnimation(() => {
    gsap.to('.syringe-pass', { x: 16, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.fromTo('.risk-halo', { scale: 0.6, opacity: 0.6, transformOrigin: '50% 50%' }, { scale: 1.7, opacity: 0, duration: 1.8, repeat: -1, stagger: 0.6, ease: 'sine.out' });
    gsap.fromTo('.syringe-ring', { scale: 0.5, opacity: 0.8, transformOrigin: '50% 50%' }, { scale: 1.4, opacity: 0, duration: 1.2, repeat: -1, ease: 'power1.out' });
    gsap.to('.needle-blood', { scale: 1.4, duration: 0.6, repeat: -1, yoyo: true, transformOrigin: '50% 50%' });
    gsap.to('.warn', { rotation: 4, duration: 0.18, repeat: -1, yoyo: true, repeatDelay: 1.6, ease: 'sine.inOut', svgOrigin: '300 110' });

    const tl = gsap.timeline({ repeat: -1 });
    tl.set('.risk-chip', { opacity: 0, y: 10 });
    RISKS.forEach((_, i) => {
      tl.to(`.risk-chip-${i}`, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, i * 1.8)
        .to(`.risk-chip-${i}`, { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in' }, i * 1.8 + 1.5);
    });
  });

  return (
    <Frame label="Dos personas se pasan una jeringa usada. Arriba, una señal de advertencia con situaciones de riesgo." rootRef={rootRef}>
      <rect width={W} height={H} fill="#FFF7ED" />
      <rect y="380" width={W} height="140" fill="#FFEDD5" />
      <rect y="374" width={W} height="8" fill="#FED7AA" />
      <g transform="translate(300 110)">
        {[0, 1, 2].map((i) => (
          <circle key={i} className="risk-halo" r="70" fill="none" stroke="#FDBA74" strokeWidth="3" />
        ))}
        <circle r="66" fill="#FFFFFF" />
      </g>
      <g className="warn">
        <path d="M 300 66 L 346 144 L 254 144 Z" fill="#F43F5E" stroke="#F43F5E" strokeWidth="14" strokeLinejoin="round" />
        <rect x="294" y="88" width="12" height="34" rx="6" fill="#FFFFFF" />
        <circle cx="300" cy="134" r="6.5" fill="#FFFFFF" />
      </g>
      {RISKS.map((r, i) => (
        <Pill key={r} x={300} y={222} text={r} fill="#0F172A" className={`risk-chip risk-chip-${i}`} size={16} />
      ))}

      <g transform="translate(300 476)">
        <circle className="syringe-ring" r="60" fill="none" stroke="#F43F5E" strokeWidth="4" />
        <g className="syringe-pass">
          <Syringe />
        </g>
      </g>
      <Person
        x={104}
        y={565}
        scale={1.1}
        shirtColor="#0EA5E9"
        shirtShadow="#0369A1"
        skinColor="#F2C19E"
        skinShadow="#D09772"
        hairColor="#78350F"
        hairStyle="short"
        expression="alert"
        arms={['down', 'reach']}
      />
      <Person
        x={496}
        y={565}
        scale={1.1}
        flip
        shirtColor="#F59E0B"
        shirtShadow="#B45309"
        skinColor="#8D5524"
        skinShadow="#6B3E18"
        hairColor="#0F172A"
        hairStyle="bun"
        expression="alert"
        arms={['down', 'reach']}
        blinkDelay={1.4}
      />
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Lo que no transmite                                                 */
/* ------------------------------------------------------------------ */

const SAFE = ['Abrazos', 'Dar la mano', 'Compartir vasos', 'Mosquitos', 'Piscinas'];

export function SafeArt() {
  const flight = useRef<SVGPathElement | null>(null);
  const rootRef = useSceneAnimation(() => {
    gsap.to('.shake', { y: -5, duration: 0.18, repeat: -1, yoyo: true, repeatDelay: 0.04, ease: 'sine.inOut' });
    gsap.to('.cloud', { x: 40, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 1.5 });
    gsap.to('.wing', { scaleY: 0.3, duration: 0.05, repeat: -1, yoyo: true, transformOrigin: '50% 100%' });
    if (flight.current) {
      gsap.to('.mosquito', {
        motionPath: { path: flight.current, align: flight.current, alignOrigin: [0.5, 0.5], autoRotate: false },
        duration: 7,
        repeat: -1,
        ease: 'none',
      });
    }
    gsap.utils.toArray<SVGPathElement>('.safe-heart').forEach((el, i) => {
      gsap.fromTo(
        el,
        { y: 0, x: 0, opacity: 0, scale: 0.4 },
        {
          keyframes: [
            { opacity: 1, scale: 1, duration: 0.4 },
            { y: -150, x: (i % 2 ? 1 : -1) * (14 + i * 6), opacity: 0, duration: 2.2, ease: 'sine.in' },
          ],
          repeat: -1,
          delay: i * 0.55,
          transformOrigin: '50% 50%',
        },
      );
    });
    gsap.fromTo('.safe-badge', { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.6, ease: 'back.out(2.2)', delay: 0.3 });
    const tl = gsap.timeline({ repeat: -1 });
    tl.set('.safe-chip', { opacity: 0, y: 10 });
    SAFE.forEach((_, i) => {
      tl.to(`.safe-chip-${i}`, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, i * 1.6)
        .to(`.safe-chip-${i}`, { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in' }, i * 1.6 + 1.3);
    });
  });

  return (
    <Frame label="Dos amigos se dan la mano en un parque mientras salen corazones; un mosquito vuela alrededor. Nada de esto transmite el VIH." rootRef={rootRef}>
      <rect width={W} height={H} fill="#F0FDF4" />
      <circle cx="510" cy="96" r="40" fill="#FDE68A" />
      <g className="cloud" fill="#FFFFFF">
        <ellipse cx="110" cy="80" rx="46" ry="18" />
        <ellipse cx="140" cy="68" rx="30" ry="18" />
      </g>
      <g className="cloud" fill="#FFFFFF">
        <ellipse cx="400" cy="150" rx="36" ry="14" />
        <ellipse cx="424" cy="140" rx="22" ry="14" />
      </g>
      <rect y="400" width={W} height="120" fill="#BBF7D0" />
      <rect y="394" width={W} height="10" fill="#86EFAC" />

      <g className="safe-badge" transform="translate(300 62)">
        <rect x="-86" y="-24" width="172" height="48" rx="24" fill="#10B981" />
        <circle cx="-58" r="13" fill="#FFFFFF" />
        <path d="M -64 0 L -59.5 4.5 L -52 -4" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x="12" y="7" textAnchor="middle" fontSize="19" fontWeight="800" fill="#FFFFFF" fontFamily="inherit">Sin riesgo</text>
      </g>
      {SAFE.map((s, i) => (
        <Pill key={s} x={300} y={132} text={s} fill="#FFFFFF" color="#065F46" className={`safe-chip safe-chip-${i}`} size={16} />
      ))}

      <path ref={flight} d="M 160 230 C 220 170, 380 300, 440 230 C 500 160, 380 160, 300 240 C 220 320, 100 290, 160 230 Z" fill="none" stroke="none" />
      <g className="mosquito">
        <ellipse className="wing" cx="-4" cy="-8" rx="6" ry="11" fill="#E0F2FE" opacity="0.9" />
        <ellipse className="wing" cx="5" cy="-8" rx="6" ry="11" fill="#E0F2FE" opacity="0.9" />
        <ellipse cx="0" cy="0" rx="13" ry="5" fill="#334155" />
        <circle cx="13" cy="-1" r="4.5" fill="#1E293B" />
        <line x1="17" y1="0" x2="27" y2="4" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
        {[-6, 0, 6].map((x) => (
          <line key={x} x1={x} y1="4" x2={x - 3} y2="12" stroke="#1E293B" strokeWidth="1.2" />
        ))}
      </g>

      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${300 + (i - 2) * 6} 452)`}>
          <path className="safe-heart" d={HEART} transform={`scale(${1.1 + (i % 2) * 0.4})`} fill={i % 2 ? '#F43F5E' : '#FB7185'} opacity="0" />
        </g>
      ))}
      <g className="shake">
        <Person
          x={122}
          y={565}
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
          y={565}
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
      </g>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/* Factores de riesgo                                                  */
/* ------------------------------------------------------------------ */

const C = { x: 340, y: 290 };
const R = 160;

function arc(a0: number, a1: number) {
  const p = (a: number) => [C.x + R * Math.cos((a * Math.PI) / 180), C.y + R * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

const UP = ['Otras ITS', 'Heridas', 'Sin tratamiento'];
const DOWN = ['Condón', 'Tratamiento', 'PrEP'];

export function FactorsArt() {
  const rootRef = useSceneAnimation(() => {
    const tl = gsap.timeline({ repeat: -1 });
    tl.set('.chip-up, .chip-down', { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' })
      .set('.level-high, .level-low, .face-low', { opacity: 0 })
      .set('.face-high', { opacity: 0 })
      .set('.face-mid', { opacity: 1 })
      .set('.needle', { rotation: 0, svgOrigin: `${C.x} ${C.y}` })
      .to('.chip-up', { opacity: 1, scale: 1, duration: 0.4, stagger: 0.3, ease: 'back.out(2.2)' }, 0.4)
      .to('.needle', { rotation: 68, duration: 1.4, ease: 'elastic.out(1, 0.5)', svgOrigin: `${C.x} ${C.y}` }, 1)
      .to('.level-high', { opacity: 1, duration: 0.3 }, 1.2)
      .to('.face-mid', { opacity: 0, duration: 0.3 }, 1.2)
      .to('.face-high', { opacity: 1, duration: 0.3 }, 1.2)
      .to('.chip-up, .level-high', { opacity: 0, duration: 0.3 }, 3.6)
      .to('.chip-down', { opacity: 1, scale: 1, duration: 0.4, stagger: 0.3, ease: 'back.out(2.2)' }, 3.9)
      .to('.needle', { rotation: -68, duration: 1.6, ease: 'elastic.out(1, 0.55)', svgOrigin: `${C.x} ${C.y}` }, 4.5)
      .to('.level-low', { opacity: 1, duration: 0.3 }, 4.8)
      .to('.face-high', { opacity: 0, duration: 0.3 }, 4.8)
      .to('.face-low', { opacity: 1, duration: 0.3 }, 4.8)
      .to('.chip-down, .level-low', { opacity: 0, duration: 0.3 }, 7.4)
      .to('.needle', { rotation: 0, duration: 0.8, ease: 'power2.inOut', svgOrigin: `${C.x} ${C.y}` }, 7.5)
      .to('.face-low', { opacity: 0, duration: 0.3 }, 7.5)
      .to('.face-mid', { opacity: 1, duration: 0.3 }, 7.5)
      .to({}, { duration: 0.4 });
  });

  const person = (expression: 'calm' | 'alert' | 'happy', cls: string) => (
    <g className={cls}>
      <Person
        x={84}
        y={612}
        scale={0.95}
        shirtColor="#0EA5E9"
        shirtShadow="#0369A1"
        skinColor="#E0AC84"
        skinShadow="#BF8760"
        hairColor="#3F2A1D"
        hairStyle="curly"
        expression={expression}
      />
    </g>
  );

  return (
    <Frame label="Un medidor de riesgo: la aguja sube con otras ITS, heridas o falta de tratamiento, y baja con condón, tratamiento y PrEP." rootRef={rootRef}>
      <rect width={W} height={H} fill="#F8FAFC" />
      <circle cx={C.x} cy={C.y} r="232" fill="#EEF2FF" />
      <path d={arc(180, 240)} stroke="#10B981" strokeWidth="36" fill="none" />
      <path d={arc(240, 300)} stroke="#F59E0B" strokeWidth="36" fill="none" />
      <path d={arc(300, 360)} stroke="#F43F5E" strokeWidth="36" fill="none" />
      {[200, 220, 260, 280, 320, 340].map((a) => (
        <circle key={a} cx={C.x + (R - 34) * Math.cos((a * Math.PI) / 180)} cy={C.y + (R - 34) * Math.sin((a * Math.PI) / 180)} r="3" fill="#CBD5E1" />
      ))}
      <text x={C.x - R} y={C.y + 36} textAnchor="middle" fontSize="15" fontWeight="800" fill="#047857" fontFamily="inherit">Bajo</text>
      <text x={C.x + R} y={C.y + 36} textAnchor="middle" fontSize="15" fontWeight="800" fill="#BE123C" fontFamily="inherit">Alto</text>
      <g className="needle">
        <path d={`M ${C.x - 9} ${C.y} L ${C.x} ${C.y - R + 22} L ${C.x + 9} ${C.y} Z`} fill="#0F172A" />
      </g>
      <circle cx={C.x} cy={C.y} r="18" fill="#0F172A" />
      <circle cx={C.x} cy={C.y} r="7" fill="#FFFFFF" />
      <text className="level-high" x={C.x} y={C.y + 50} textAnchor="middle" fontSize="20" fontWeight="900" fill="#BE123C" fontFamily="inherit">Más riesgo</text>
      <text className="level-low" x={C.x} y={C.y + 50} textAnchor="middle" fontSize="20" fontWeight="900" fill="#047857" fontFamily="inherit">Menos riesgo</text>

      {UP.map((t, i) => (
        <Pill key={t} x={C.x + (i - 1) * 152} y={420} text={`↑ ${t}`} fill="#F43F5E" className="chip-up" size={15} />
      ))}
      {DOWN.map((t, i) => (
        <Pill key={t} x={C.x + (i - 1) * 152} y={420} text={`↓ ${t}`} fill="#10B981" className="chip-down" size={15} />
      ))}

      {person('calm', 'face-mid')}
      {person('alert', 'face-high')}
      {person('happy', 'face-low')}
    </Frame>
  );
}
