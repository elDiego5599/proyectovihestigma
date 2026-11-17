import { gsap } from '../../lib/gsap';
import { Person, forearmPoint } from '../art/Person';
import { Stage, SceneRoot, useSceneAnimation } from '../art/Stage';

interface ScenarioProps {
  isResolved?: boolean;
}

const SCALE = 1.3;
const BASE_Y = 424;
const CLIENT_X = 230;
const ARTIST_X = 742;
// Punto del antebrazo del cliente donde se hace el tatuaje
const [fx, fy] = forearmPoint('reach', 0.1, 0);
const SPOT = { x: CLIENT_X + fx * SCALE, y: BASE_Y + fy * SCALE - 6 };
// Lupa que muestra el tatuaje de cerca
const LENS = { x: 560, y: 132, r: 92 };
// Carrito con la bandeja de agujas
const CART = { x: 940, y: 372 };

const HEART = 'M 0 6 C -10 -2, -8 -12, 0 -7 C 8 -12, 10 -2, 0 6 Z';

/** Máquina de tatuar; la punta de la aguja está en (0,0) y el mango va hacia la mano del tatuador. */
function TattooMachine() {
  return (
    <g transform={`translate(${SPOT.x} ${SPOT.y})`}>
      <g id="machine">
        <g transform="rotate(78) scale(1.25)">
          <line x1="0" y1="0" x2="0" y2="-18" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
          <rect x="-6" y="-58" width="12" height="42" rx="5" fill="#475569" />
          <rect x="-6" y="-46" width="12" height="4" fill="#334155" />
          <rect x="-10" y="-88" width="20" height="32" rx="7" fill="#EC4899" />
          <rect x="-10" y="-76" width="20" height="5" fill="#BE185D" />
          <path d="M 0 -88 C 0 -108, 22 -112, 40 -100" stroke="#0F172A" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}

/** Lupa: el antebrazo de cerca, con la aguja dibujando el corazón y una gota de sangre. */
function Lens() {
  const clip = 'tattoo-lens-clip';
  return (
    <g>
      {/* Cono que une la lupa con el antebrazo */}
      <path
        d={`M ${LENS.x - LENS.r * 0.62} ${LENS.y + LENS.r * 0.78} L ${SPOT.x - 4} ${SPOT.y - 4} L ${LENS.x + LENS.r * 0.1} ${LENS.y + LENS.r}`}
        fill="#FFFFFF"
        opacity="0.16"
      />
      <circle cx={SPOT.x} cy={SPOT.y} r="16" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="4 4" />
      <defs>
        <clipPath id={clip}>
          <circle cx={LENS.x} cy={LENS.y} r={LENS.r} />
        </clipPath>
      </defs>
      <circle cx={LENS.x} cy={LENS.y} r={LENS.r + 8} fill="#0F172A" />
      <g clipPath={`url(#${clip})`}>
        <rect x={LENS.x - LENS.r} y={LENS.y - LENS.r} width={LENS.r * 2} height={LENS.r * 2} fill="#F5F3FF" />
        {/* Piel del antebrazo */}
        <rect x={LENS.x - LENS.r} y={LENS.y - 46} width={LENS.r * 2} height="104" fill="#E0AC84" />
        <rect x={LENS.x - LENS.r} y={LENS.y + 44} width={LENS.r * 2} height="14" fill="#BF8760" />
        {/* Corazón que se va dibujando */}
        <path
          id="lens-heart"
          d={HEART}
          transform={`translate(${LENS.x - 12} ${LENS.y + 6}) scale(4.2)`}
          fill="none"
          stroke="#1E1B4B"
          strokeWidth="0.75"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
        />
        {/* Aguja de cerca */}
        <g id="lens-needle" transform={`translate(${LENS.x + 22} ${LENS.y - 6})`}>
          <g transform="rotate(40)">
            <line x1="0" y1="0" x2="0" y2="-60" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
            <rect x="-11" y="-120" width="22" height="64" rx="8" fill="#475569" />
          </g>
          <circle id="lens-blood" cx="0" cy="4" r="7" fill="#DC2626" opacity="0" />
        </g>
      </g>
      <circle cx={LENS.x} cy={LENS.y} r={LENS.r} fill="none" stroke="#FFFFFF" strokeWidth="5" />
      <path d={`M ${LENS.x - 56} ${LENS.y - 52} A 78 78 0 0 1 ${LENS.x + 8} ${LENS.y - 78}`} stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="6" fill="none" strokeLinecap="round" />
      <g className="lens-tag" opacity="0">
        <rect x={LENS.x - 92} y={LENS.y + LENS.r + 16} width="184" height="34" rx="17" fill="#DC2626" />
        <text x={LENS.x} y={LENS.y + LENS.r + 38} textAnchor="middle" fontSize="15" fontWeight="800" fill="#FFFFFF" fontFamily="inherit">
          La aguja toca sangre
        </text>
      </g>
    </g>
  );
}

/** Apoyabrazos acolchado donde descansa el antebrazo del cliente. */
function Armrest() {
  return (
    <g>
      <rect x={SPOT.x - 6} y={SPOT.y + 34} width="12" height={480 - SPOT.y} fill="#334155" />
      <rect x={SPOT.x - 40} y={470} width="80" height="10" rx="4" fill="#1E293B" />
      <rect x={SPOT.x - 78} y={SPOT.y + 18} width="150" height="22" rx="11" fill="#111827" />
      <rect x={SPOT.x - 72} y={SPOT.y + 20} width="138" height="6" rx="3" fill="#374151" />
    </g>
  );
}

/** Carrito: un empaque nuevo y sellado junto a agujas ya usadas. */
function Cart() {
  return (
    <g transform={`translate(${CART.x} ${CART.y})`}>
      <rect x="-6" y="10" width="12" height="100" fill="#64748B" />
      <rect x="-80" y="-4" width="160" height="16" rx="6" fill="#CBD5E1" />
      <rect x="-80" y="-4" width="160" height="5" rx="2.5" fill="#F1F5F9" />
      {/* Tapitas de tinta */}
      {['#0F172A', '#EC4899', '#22D3EE'].map((c, i) => (
        <g key={c} transform={`translate(${-64 + i * 16} -8)`}>
          <rect x="-6" y="-6" width="12" height="10" rx="2" fill={c} />
        </g>
      ))}
      {/* Agujas usadas */}
      {[-6, 8].map((x, i) => (
        <g key={x} transform={`translate(${x} -6) rotate(${i ? 10 : -8})`}>
          <line x1="0" y1="0" x2="0" y2="-30" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
          <circle className="used-blood" cx="0" cy="-2" r="3.4" fill="#DC2626" />
        </g>
      ))}
      {/* Empaque estéril sellado */}
      <g transform="translate(46 -26)">
        <rect x="-28" y="0" width="56" height="22" rx="5" fill="#ECFDF5" stroke="#6EE7B7" strokeWidth="2" />
        <line x1="-18" y1="11" x2="12" y2="11" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="20" cy="11" r="5.5" fill="#10B981" />
        <path d="M 17.4 11 L 19.4 13 L 22.8 9.2" stroke="#FFFFFF" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </g>
      <g className="tray-tag tray-used" opacity="0">
        <rect x="-74" y="-92" width="104" height="30" rx="15" fill="#DC2626" />
        <text x="-22" y="-72" textAnchor="middle" fontSize="13" fontWeight="800" fill="#FFFFFF" fontFamily="inherit">Usadas</text>
      </g>
      <g className="tray-tag tray-new" opacity="0">
        <rect x="6" y="-64" width="84" height="30" rx="15" fill="#10B981" />
        <text x="48" y="-44" textAnchor="middle" fontSize="13" fontWeight="800" fill="#FFFFFF" fontFamily="inherit">Nueva</text>
      </g>
    </g>
  );
}

/** Lámina de diseños de tatuaje pegada en la pared. */
function Flash({ x, y, rot, children }: { x: number; y: number; rot: number; children: React.ReactNode }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x="-52" y="-62" width="104" height="124" rx="4" fill="#FEF9C3" />
      <circle cx="0" cy="-54" r="4" fill="#F43F5E" />
      {children}
    </g>
  );
}

function Background() {
  return (
    <g>
      {/* Pared oscura del estudio */}
      <rect width="1100" height="480" fill="#1E1B4B" />
      <rect width="1100" height="480" fill="url(#tattoo-wall)" />
      {/* Piso de cuadros blanco y negro */}
      <rect y="398" width="1100" height="82" fill="url(#tattoo-floor)" />
      <rect y="394" width="1100" height="6" fill="#0F0D2E" />

      {/* Letrero de neón */}
      <g className="neon" transform="translate(110 92)">
        <rect x="-86" y="-38" width="172" height="76" rx="14" fill="none" stroke="#F472B6" strokeWidth="4" opacity="0.4" filter="url(#tattoo-glow)" />
        <rect x="-86" y="-38" width="172" height="76" rx="14" fill="none" stroke="#F9A8D4" strokeWidth="2.5" />
        <text y="12" textAnchor="middle" fontSize="34" fontWeight="900" fill="none" stroke="#F472B6" strokeWidth="5" opacity="0.5" filter="url(#tattoo-glow)" fontFamily="inherit" letterSpacing="2">
          TATTOO
        </text>
        <text y="12" textAnchor="middle" fontSize="34" fontWeight="900" fill="#FDF2F8" stroke="#F9A8D4" strokeWidth="1" fontFamily="inherit" letterSpacing="2">
          TATTOO
        </text>
      </g>

      {/* Láminas de diseños */}
      <Flash x={860} y={110} rot={-4}>
        <path d={HEART} transform="translate(0 -6) scale(3.2)" fill="#F43F5E" stroke="#0F172A" strokeWidth="0.6" />
        <rect x="-38" y="16" width="76" height="16" rx="3" fill="#FDE68A" stroke="#0F172A" strokeWidth="1.5" />
        <text y="28" textAnchor="middle" fontSize="10" fontWeight="900" fill="#0F172A" fontFamily="inherit">MAMÁ</text>
      </Flash>
      <Flash x={986} y={128} rot={5}>
        <path d="M 0 -32 L 0 26 M -18 -16 L 18 -16 M -28 10 C -24 30, 24 30, 28 10" stroke="#0F172A" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="0" cy="-36" r="7" fill="none" stroke="#0F172A" strokeWidth="4" />
      </Flash>
      <Flash x={290} y={70} rot={3}>
        <circle cx="0" cy="-4" r="20" fill="#F43F5E" stroke="#0F172A" strokeWidth="2" />
        <path d="M -8 -6 C -4 -14, 6 -12, 6 -4 C 6 4, -6 4, -6 -2" stroke="#0F172A" strokeWidth="2" fill="none" />
        <path d="M 0 16 L 0 40 M 0 28 C -12 22, -18 30, -14 34" stroke="#16A34A" strokeWidth="4" fill="none" strokeLinecap="round" />
      </Flash>
      <Flash x={400} y={58} rot={-6}>
        <path d="M 0 -30 L 8 -8 L 30 -8 L 12 6 L 20 28 L 0 14 L -20 28 L -12 6 L -30 -8 L -8 -8 Z" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
      </Flash>

      {/* Lámpara de trabajo */}
      <path d="M 1100 20 L 1040 20 L 1000 240" stroke="#475569" strokeWidth="5" fill="none" />
    </g>
  );
}

export function TattooScenario(_props: ScenarioProps) {
  const rootRef = useSceneAnimation(() => {
    gsap.to('.neon', { opacity: 0.55, duration: 0.08, repeat: -1, yoyo: true, repeatDelay: 2.4, ease: 'none' });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
    tl.set('#tattoo, #lens-heart', { attr: { 'stroke-dashoffset': 1 } })
      .set('#lens-blood', { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' })
      .set('.lens-tag, .tray-tag', { opacity: 0, y: 8 })
      // La máquina vibra mientras dibuja el corazón, en el brazo y en la lupa
      .to('#machine', { x: 1.4, duration: 0.05, repeat: 60, yoyo: true, ease: 'none' }, 0.4)
      .to('#lens-needle', { y: 3, duration: 0.05, repeat: 60, yoyo: true, ease: 'none' }, 0.4)
      .to('#tattoo, #lens-heart', { attr: { 'stroke-dashoffset': 0 }, duration: 3, ease: 'none' }, 0.4)
      // La aguja entra en contacto con la sangre
      .to('#lens-blood', { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2.4)' }, 1.8)
      .to('.lens-tag', { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 2)
      // En la bandeja: las agujas usadas llevan sangre; la nueva viene sellada
      .to('.tray-used', { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 3.6)
      .fromTo('.used-blood', { scale: 1, transformOrigin: '50% 50%' }, { scale: 1.6, duration: 0.35, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 3.6)
      .to('.tray-new', { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 4.4)
      .to('.lens-tag, .tray-tag, #lens-blood', { opacity: 0, duration: 0.4 }, 6.6)
      .to('#tattoo, #lens-heart', { attr: { 'stroke-dashoffset': 1 }, duration: 0.5 }, 6.8);
  });

  return (
    <SceneRoot rootRef={rootRef}>
      <Stage
        label="En un estudio de tatuajes, el tatuador dibuja un corazón en el antebrazo de un cliente. Una lupa muestra que la aguja toca sangre. En el carrito hay agujas usadas con sangre y una aguja nueva en empaque sellado."
        background={<Background />}
        defs={
          <>
            <pattern id="tattoo-floor" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="#F8FAFC" />
              <rect width="20" height="20" fill="#1E293B" />
              <rect x="20" y="20" width="20" height="20" fill="#1E293B" />
            </pattern>
            <pattern id="tattoo-wall" width="60" height="30" patternUnits="userSpaceOnUse">
              <path d="M 0 30 L 60 30 M 30 0 L 30 15 M 0 15 L 60 15 M 0 0 L 0 15" stroke="#312E81" strokeWidth="2" fill="none" />
            </pattern>
            <filter id="tattoo-glow" x="-30%" y="-60%" width="160%" height="220%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </>
        }
      >
        <Armrest />
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
          arms={['down', 'reach']}
        />
        <path
          id="tattoo"
          transform={`translate(${SPOT.x} ${SPOT.y + 2}) scale(0.9)`}
          d={HEART}
          fill="none"
          stroke="#1E1B4B"
          strokeWidth="2.4"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
        />
        <TattooMachine />
        <Person
          x={ARTIST_X}
          y={BASE_Y}
          scale={SCALE}
          flip
          shirtColor="#0F172A"
          shirtShadow="#020617"
          skinColor="#A86B45"
          skinShadow="#87512F"
          hairColor="#020617"
          hairStyle="bun"
          expression="focused"
          sleeves="short"
          arms={['down', 'reach']}
          blinkDelay={1.2}
        />
        <Cart />
        <Lens />
      </Stage>
    </SceneRoot>
  );
}
