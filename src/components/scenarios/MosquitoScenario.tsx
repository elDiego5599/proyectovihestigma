import { gsap } from '../../lib/gsap';
import { Person, forearmPoint } from '../art/Person';
import { Stage, SceneRoot, useSceneAnimation } from '../art/Stage';

interface ScenarioProps {
  isResolved?: boolean;
}

const SCALE = 1.18;
const BASE_Y = 448;
const A_X = 340;
const B_X = 760;

// Punto de picadura en la cara exterior del antebrazo que mira hacia el centro.
const [bx, by] = forearmPoint('down', 0.45, 9);
const BITE_A = { x: A_X + bx * SCALE, y: BASE_Y + by * SCALE };
const BITE_B = { x: B_X - bx * SCALE, y: BASE_Y + by * SCALE };

function Welt({ id, x, y }: { id: string; x: number; y: number }) {
  return (
    <g id={id} transform={`translate(${x} ${y})`}>
      <g className="welt-inner" opacity="0">
        <circle r="9" fill="#F87171" opacity="0.35" />
        <circle r="5.5" fill="#DC2626" />
        <circle cx="-1.5" cy="-1.5" r="1.6" fill="#FECACA" />
      </g>
      {/* Rayitas de picazón */}
      <g className="itch" opacity="0" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round">
        <line x1="-16" y1="-14" x2="-11" y2="-9" />
        <line x1="0" y1="-20" x2="0" y2="-13" />
        <line x1="16" y1="-14" x2="11" y2="-9" />
      </g>
    </g>
  );
}

/** Mosquito de perfil mirando a la derecha. La punta de la probóscide está en (0,0). */
function Mosquito() {
  return (
    <g id="mosq" opacity="0">
      <g id="mosq-dir">
        <g id="mosq-body" transform="scale(1.7)">
          {/* Patas */}
          <g fill="none" stroke="#334155" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M -20 -18 L -12 -8 L -4 1" />
            <path d="M -24 -18 L -27 -6 L -34 2" />
            <path d="M -27 -19 L -38 -8 L -48 0" />
          </g>
          {/* Abdomen */}
          <g transform="rotate(-10 -38 -24)">
            <ellipse cx="-40" cy="-24" rx="15" ry="5.5" fill="#1E293B" />
            <g stroke="#E2E8F0" strokeWidth="1.4" opacity="0.8">
              <line x1="-46" y1="-29" x2="-45" y2="-19" />
              <line x1="-39" y1="-29.5" x2="-38" y2="-18.5" />
              <line x1="-32" y1="-29" x2="-31" y2="-19" />
            </g>
          </g>
          {/* Tórax */}
          <ellipse cx="-22" cy="-23" rx="8" ry="6.5" fill="#0F172A" />
          {/* Cabeza, ojo y probóscide */}
          <circle cx="-12" cy="-19" r="4.6" fill="#0F172A" />
          <circle cx="-10.5" cy="-20" r="2.2" fill="#EF4444" />
          <line x1="-9" y1="-16" x2="0" y2="0" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
          {/* Antenas */}
          <path d="M -12 -23 Q -6 -32 -2 -34" fill="none" stroke="#334155" strokeWidth="1" />
          {/* Alas */}
          <g style={{ transformBox: 'fill-box' }}>
            <ellipse
              className="wing"
              cx="-32"
              cy="-35"
              rx="15"
              ry="5"
              transform="rotate(-18 -22 -28)"
              fill="#BAE6FD"
              stroke="#7DD3FC"
              strokeWidth="0.8"
              opacity="0.8"
            />
            <ellipse
              className="wing"
              cx="-30"
              cy="-33"
              rx="13"
              ry="4.2"
              transform="rotate(-34 -22 -28)"
              fill="#E0F2FE"
              stroke="#7DD3FC"
              strokeWidth="0.8"
              opacity="0.7"
            />
          </g>
        </g>
      </g>
    </g>
  );
}

function Background() {
  return (
    <g>
      <defs>
        <linearGradient id="mosq-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#DCE8FB" />
          <stop offset="0.7" stopColor="#FCE3D3" />
        </linearGradient>
      </defs>
      <rect width="1100" height="480" fill="url(#mosq-sky)" />
      {/* Sol de tarde */}
      <circle cx="900" cy="250" r="64" fill="#FDBA74" opacity="0.45" />
      <circle cx="900" cy="250" r="40" fill="#FDBA74" opacity="0.7" />
      {/* Colinas */}
      <path d="M 0 330 C 180 270, 360 300, 520 290 C 700 278, 860 250, 1100 300 L 1100 480 L 0 480 Z" fill="#CFE0C3" />
      <path d="M 0 380 C 200 340, 420 370, 600 352 C 780 334, 940 350, 1100 340 L 1100 480 L 0 480 Z" fill="#B3CFA2" />
      {/* Árboles laterales */}
      <g>
        <rect x="68" y="250" width="12" height="120" rx="4" fill="#8B6B4E" />
        <circle cx="74" cy="236" r="46" fill="#93BB80" />
        <circle cx="48" cy="262" r="30" fill="#86B074" />
        <rect x="1020" y="236" width="12" height="130" rx="4" fill="#8B6B4E" />
        <circle cx="1026" cy="222" r="52" fill="#93BB80" />
        <circle cx="1056" cy="252" r="32" fill="#86B074" />
      </g>
      {/* Arbustos */}
      <ellipse cx="180" cy="400" rx="70" ry="30" fill="#9CC58A" />
      <ellipse cx="930" cy="404" rx="80" ry="32" fill="#9CC58A" />
      {/* Charco (donde se crían los mosquitos) */}
      <ellipse cx="550" cy="452" rx="70" ry="10" fill="#93C5FD" opacity="0.55" />
    </g>
  );
}

export function MosquitoScenario(_props: ScenarioProps) {
  const rootRef = useSceneAnimation(() => {
    gsap.to('.wing', {
      scaleY: 0.25,
      duration: 0.045,
      repeat: -1,
      yoyo: true,
      ease: 'none',
      transformOrigin: '100% 100%',
    });

    gsap.to('#person-left, #person-right', {
      y: -3,
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.6,
    });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });

    tl.set('#mosq', { x: -60, y: 110, opacity: 1 })
      .set('#mosq-dir', { scaleX: 1, svgOrigin: '0 0' })
      .set('.welt-inner, .itch', { opacity: 0, scale: 0.3, transformOrigin: '50% 50%' })

      // 1. Llega volando y se posa en el brazo de la persona A
      .to('#mosq', {
        duration: 2.6,
        ease: 'sine.inOut',
        motionPath: {
          path: [
            { x: -60, y: 110 },
            { x: 230, y: 60 },
            { x: 520, y: 170 },
            { x: 540, y: 330 },
            { x: BITE_A.x, y: BITE_A.y },
          ],
          curviness: 1.2,
        },
      })
      .to('#mosq-dir', { scaleX: -1, svgOrigin: '0 0', duration: 0.25, ease: 'power2.inOut' }, 1.7)

      // 2. Chupa: el cuerpo bombea
      .addLabel('biteA')
      .to('#mosq-body', { y: 2, duration: 0.16, repeat: 7, yoyo: true, ease: 'sine.inOut' }, 'biteA')

      // 3. Despega y queda la roncha roja
      .addLabel('leaveA')
      .to('#bite-a .welt-inner', { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2.5)' }, 'leaveA+=0.15')
      .to('#bite-a .itch', { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' }, 'leaveA+=0.45')
      .to('#bite-a .itch', { opacity: 0, duration: 0.4 }, 'leaveA+=1.3')
      .to('#mosq-dir', { scaleX: 1, svgOrigin: '0 0', duration: 0.25, ease: 'power2.inOut' }, 'leaveA')
      .to(
        '#mosq',
        {
          duration: 2.2,
          ease: 'sine.inOut',
          motionPath: {
            path: [
              { x: BITE_A.x, y: BITE_A.y },
              { x: 500, y: 300 },
              { x: 560, y: 190 },
              { x: 590, y: 330 },
              { x: BITE_B.x, y: BITE_B.y },
            ],
            curviness: 1.3,
          },
        },
        'leaveA',
      )

      // 4. Pica a la persona B
      .addLabel('biteB')
      .to('#mosq-body', { y: 2, duration: 0.16, repeat: 7, yoyo: true, ease: 'sine.inOut' }, 'biteB')
      .addLabel('leaveB')
      .to('#bite-b .welt-inner', { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2.5)' }, 'leaveB+=0.15')
      .to('#bite-b .itch', { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' }, 'leaveB+=0.45')
      .to('#bite-b .itch', { opacity: 0, duration: 0.4 }, 'leaveB+=1.3')

      // 5. Se va volando
      .to(
        '#mosq',
        {
          duration: 2,
          ease: 'power1.in',
          motionPath: {
            path: [
              { x: BITE_B.x, y: BITE_B.y },
              { x: 720, y: 330 },
              { x: 900, y: 160 },
              { x: 1340, y: 40 },
            ],
            curviness: 1.2,
          },
        },
        'leaveB',
      )
      // Las ronchas se desvanecen antes de repetir
      .to('.welt-inner', { opacity: 0, duration: 0.6 }, '+=1.2');
  });

  return (
    <SceneRoot rootRef={rootRef}>
      <Stage
        label="Un mosquito pica el brazo de una persona, le deja una roncha roja y luego pica a otra persona, a la que también le deja una roncha."
        background={<Background />}
      >
        <g id="person-left">
          <Person
            x={A_X}
            y={BASE_Y}
            scale={SCALE}
            sleeves="short"
            shirtColor="#2563EB"
            shirtShadow="#1E40AF"
            skinColor="#F2C19E"
            skinShadow="#D09772"
            hairColor="#1E293B"
            hairStyle="short"
            expression="calm"
          />
          <Welt id="bite-a" x={BITE_A.x - 4} y={BITE_A.y} />
        </g>

        <g id="person-right">
          <Person
            x={B_X}
            y={BASE_Y}
            scale={SCALE}
            sleeves="short"
            flip
            shirtColor="#DB2777"
            shirtShadow="#9D174D"
            skinColor="#7A4B31"
            skinShadow="#5E351E"
            hairColor="#0F172A"
            hairStyle="curly"
            expression="relieved"
            blinkDelay={1.7}
          />
          <Welt id="bite-b" x={BITE_B.x + 4} y={BITE_B.y} />
        </g>

        <Mosquito />
      </Stage>
    </SceneRoot>
  );
}
