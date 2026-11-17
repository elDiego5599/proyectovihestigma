import { useEffect, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type Tone = 'rose' | 'sky' | 'violet' | 'emerald' | 'amber' | 'slate';

const TONES: Record<Tone, { tile: string; ink: string; soft: string }> = {
  rose: { tile: '#F43F5E', ink: '#9F1239', soft: '#FFF1F2' },
  sky: { tile: '#0EA5E9', ink: '#075985', soft: '#F0F9FF' },
  violet: { tile: '#8B5CF6', ink: '#5B21B6', soft: '#F5F3FF' },
  emerald: { tile: '#10B981', ink: '#065F46', soft: '#ECFDF5' },
  amber: { tile: '#F59E0B', ink: '#92400E', soft: '#FFFBEB' },
  slate: { tile: '#64748B', ink: '#334155', soft: '#F8FAFC' },
};

interface Item {
  title: string;
  text?: string;
}

interface Column {
  heading: string;
  tone: Tone;
  mark: 'check' | 'cross' | 'up' | 'down';
  items: Item[];
}

interface Slide {
  kicker: string;
  title: string;
  lead?: string;
  /** Tarjetas numeradas (una por idea). */
  cards?: (Item & { tone: Tone })[];
  /** Dos columnas que se comparan (sí / no, aumenta / reduce). */
  columns?: [Column, Column];
  note?: string;
  cover?: boolean;
}

const SLIDES: Slide[] = [
  {
    kicker: 'Estación 2',
    title: 'Transmisión y factores de riesgo del VIH',
    lead: 'Cómo se transmite, cómo no se transmite y qué aumenta o reduce el riesgo. Al final pondremos a prueba lo aprendido.',
    cover: true,
  },
  {
    kicker: 'Vías de transmisión',
    title: '¿Cómo se transmite el VIH?',
    lead: 'Solo existen tres vías. En todas, un líquido con el virus entra al cuerpo de otra persona.',
    cards: [
      { tone: 'rose', title: 'Sexual', text: 'Relaciones vaginales, anales u orales sin condón con una persona que tiene el virus.' },
      { tone: 'sky', title: 'Sanguínea', text: 'Compartir agujas o jeringas, transfusiones sin control y material sin esterilizar.' },
      { tone: 'violet', title: 'Maternoinfantil', text: 'De madre a hijo durante el embarazo, el parto o la lactancia, si no hay tratamiento.' },
    ],
  },
  {
    kicker: 'Líquidos del cuerpo',
    title: '¿Qué líquidos pueden transmitirlo?',
    columns: [
      {
        heading: 'Sí lo transmiten',
        tone: 'rose',
        mark: 'check',
        items: [
          { title: 'Sangre' },
          { title: 'Semen y líquido preseminal' },
          { title: 'Secreciones vaginales' },
          { title: 'Secreciones rectales' },
          { title: 'Leche materna' },
        ],
      },
      {
        heading: 'No lo transmiten',
        tone: 'emerald',
        mark: 'cross',
        items: [{ title: 'Saliva' }, { title: 'Sudor' }, { title: 'Lágrimas' }, { title: 'Orina' }],
      },
    ],
    note: 'Para que haya riesgo, el líquido debe entrar por una mucosa, una herida o directo a la sangre.',
  },
  {
    kicker: 'Situaciones de riesgo',
    title: '¿Cuándo hay riesgo?',
    cards: [
      { tone: 'rose', title: 'Sexo sin condón', text: 'Sobre todo con parejas cuyo estado de VIH no se conoce.' },
      { tone: 'sky', title: 'Compartir agujas', text: 'Jeringas, agujas o cualquier objeto que perfore la piel.' },
      { tone: 'violet', title: 'Tatuajes y piercings', text: 'Con equipo que no es nuevo o no está esterilizado.' },
      { tone: 'amber', title: 'Transfusiones sin control', text: 'Sangre que no fue analizada antes de usarse.' },
      { tone: 'emerald', title: 'Embarazo sin control', text: 'Sin prueba ni tratamiento, el bebé puede adquirir el virus.' },
    ],
  },
  {
    kicker: 'Lo que no transmite',
    title: 'En la vida diaria no hay riesgo',
    lead: 'El VIH no sobrevive fuera del cuerpo y no se transmite por el aire, el agua ni el contacto casual.',
    cards: [
      { tone: 'emerald', title: 'Abrazos y besos', text: 'Ni un beso en la mejilla ni uno en la boca.' },
      { tone: 'sky', title: 'Compartir vasos y comida', text: 'Tampoco cubiertos ni platos.' },
      { tone: 'violet', title: 'Baños y piscinas', text: 'El agua y los inodoros no lo transmiten.' },
      { tone: 'amber', title: 'Mosquitos', text: 'No inyectan sangre de otra persona.' },
      { tone: 'rose', title: 'Dar la mano', text: 'Ni estudiar, trabajar o jugar juntos.' },
      { tone: 'slate', title: 'Toser o estornudar', text: 'No viaja por el aire.' },
    ],
  },
  {
    kicker: 'Factores de riesgo',
    title: '¿Qué cambia la probabilidad?',
    columns: [
      {
        heading: 'La aumentan',
        tone: 'rose',
        mark: 'up',
        items: [
          { title: 'Carga viral alta', text: 'La persona no está en tratamiento.' },
          { title: 'Otras ITS', text: 'Las llagas e inflamación facilitan la entrada.' },
          { title: 'Heridas o sangrado', text: 'Dan una puerta directa a la sangre.' },
          { title: 'Varias parejas sin protección' },
          { title: 'No conocer tu estado', text: 'Nunca haberse hecho la prueba.' },
        ],
      },
      {
        heading: 'La reducen',
        tone: 'emerald',
        mark: 'down',
        items: [
          { title: 'Condón', text: 'Bien usado, en cada relación.' },
          { title: 'Tratamiento', text: 'Indetectable = intransmisible.' },
          { title: 'PrEP y PEP', text: 'Medicamentos antes o después de una exposición.' },
          { title: 'Hacerse la prueba', text: 'Es gratuita y confidencial.' },
          { title: 'Material nuevo y estéril' },
        ],
      },
    ],
  },
  {
    kicker: 'Actividad',
    title: '¿Mito o realidad?',
    lead: 'Verás 10 situaciones. Lee cada afirmación y decide si es un mito o una realidad. Después te explicamos por qué.',
    cover: true,
  },
];

const SLIDE_KEY = 'mito-realidad-diapositiva';

function loadSlide() {
  try {
    const n = Number(localStorage.getItem(SLIDE_KEY));
    return Number.isInteger(n) && n >= 0 && n < SLIDES.length ? n : 0;
  } catch {
    return 0;
  }
}

const spring = { type: 'spring', duration: 0.5, bounce: 0 } as const;

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const rise = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: spring },
};

function Mark({ kind, color }: { kind: Column['mark']; color: string }) {
  const paths: Record<Column['mark'], string> = {
    check: 'M5 12.5L9.5 17L19 7.5',
    cross: 'M7 7L17 17M17 7L7 17',
    up: 'M12 19V5M6 11L12 5L18 11',
    down: 'M12 5V19M6 13L12 19L18 13',
  };
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: color }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d={paths[kind]} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Arrow({ back }: { back?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={back ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M4 10H16M11 5L16 10L11 15" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Anillo de puntos que gira: adorno de las portadas. */
function Orbit() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="h-40 w-40 sm:h-52 sm:w-52"
      aria-hidden="true"
      animate={{ rotate: 360 }}
      transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
    >
      <circle cx="100" cy="100" r="46" fill="#0F172A" />
      <circle cx="100" cy="100" r="30" fill="#F43F5E" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const colors = ['#F43F5E', '#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B'];
        return (
          <motion.circle
            key={i}
            cx={100 + Math.cos(a) * 78}
            cy={100 + Math.sin(a) * 78}
            r="9"
            fill={colors[i % colors.length]}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.15, 1] }}
            transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
            style={{ transformOrigin: `${100 + Math.cos(a) * 78}px ${100 + Math.sin(a) * 78}px` }}
          />
        );
      })}
    </motion.svg>
  );
}

function SlideBody({ slide }: { slide: Slide }) {
  if (slide.cover) {
    return (
      <motion.div variants={list} initial="hidden" animate="show" className="flex flex-col items-center text-center">
        <motion.div variants={rise}>
          <Orbit />
        </motion.div>
        <motion.p variants={rise} className="mt-6 text-[13px] font-bold uppercase tracking-[0.1em] text-[#64748B]">
          {slide.kicker}
        </motion.p>
        <motion.h2
          variants={rise}
          className="mt-2 max-w-[760px] text-balance text-[34px] font-black leading-[1.04] tracking-[-0.035em] sm:text-[52px]"
        >
          {slide.title}
        </motion.h2>
        {slide.lead && (
          <motion.p variants={rise} className="mt-4 max-w-[580px] text-pretty text-[16px] font-medium leading-[1.5] text-[#475569] sm:text-[18px]">
            {slide.lead}
          </motion.p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div variants={list} initial="hidden" animate="show" className="w-full">
      <motion.p variants={rise} className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#64748B]">
        {slide.kicker}
      </motion.p>
      <motion.h2 variants={rise} className="mt-1.5 text-balance text-[28px] font-black leading-[1.08] tracking-[-0.03em] sm:text-[40px]">
        {slide.title}
      </motion.h2>
      {slide.lead && (
        <motion.p variants={rise} className="mt-3 max-w-[720px] text-pretty text-[15.5px] font-medium leading-[1.5] text-[#475569] sm:text-[17px]">
          {slide.lead}
        </motion.p>
      )}

      {slide.cards && (
        <div
          className={`mt-6 grid gap-3 sm:gap-4 ${
            slide.cards.length === 3 ? 'sm:grid-cols-3' : slide.cards.length === 5 ? 'sm:grid-cols-6' : 'sm:grid-cols-3'
          }`}
        >
          {slide.cards.map((card, i) => {
            const t = TONES[card.tone];
            const span = slide.cards!.length === 5 ? (i < 3 ? 'sm:col-span-2' : 'sm:col-span-3') : '';
            return (
              <motion.div
                key={card.title}
                variants={rise}
                className={`rounded-2xl p-5 ${span}`}
                style={{ background: t.soft }}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-[16px] font-black text-white"
                  style={{ background: t.tile }}
                >
                  {i + 1}
                </span>
                <h3 className="mt-3 text-[18px] font-extrabold tracking-[-0.02em]" style={{ color: t.ink }}>
                  {card.title}
                </h3>
                {card.text && <p className="mt-1 text-pretty text-[14.5px] font-medium leading-[1.45] text-[#334155]">{card.text}</p>}
              </motion.div>
            );
          })}
        </div>
      )}

      {slide.columns && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {slide.columns.map((col) => {
            const t = TONES[col.tone];
            return (
              <motion.div key={col.heading} variants={rise} className="rounded-2xl p-5 sm:p-6" style={{ background: t.soft }}>
                <h3 className="text-[19px] font-extrabold tracking-[-0.02em]" style={{ color: t.ink }}>
                  {col.heading}
                </h3>
                <motion.ul variants={list} className="mt-3 space-y-2.5">
                  {col.items.map((item) => (
                    <motion.li key={item.title} variants={rise} className="flex items-start gap-3">
                      <Mark kind={col.mark} color={t.tile} />
                      <p className="pt-0.5 text-[15.5px] font-bold leading-[1.35] text-[#0F172A]">
                        {item.title}
                        {item.text && <span className="font-medium text-[#475569]"> · {item.text}</span>}
                      </p>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            );
          })}
        </div>
      )}

      {slide.note && (
        <motion.p
          variants={rise}
          className="mt-4 rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFC] px-5 py-3.5 text-pretty text-[14.5px] font-semibold leading-[1.45] text-[#334155]"
        >
          {slide.note}
        </motion.p>
      )}
    </motion.div>
  );
}

function NavButton({ onClick, disabled, children, primary, label }: {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  primary?: boolean;
  label?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', duration: 0.2, bounce: 0 }}
      className={`flex h-[54px] items-center justify-center gap-2.5 rounded-2xl px-6 text-[15px] font-bold tracking-tight transition-colors disabled:pointer-events-none disabled:opacity-30 ${
        primary
          ? 'w-full bg-[#0F172A] text-white hover:bg-[#1E293B]'
          : 'border-2 border-[#E2E8F0] bg-white text-[#0F172A] hover:border-[#94A3B8]'
      }`}
    >
      {children}
    </motion.button>
  );
}

export function Presentation({ onStart }: { onStart: () => void }) {
  const [[index, direction], setPage] = useState<[number, number]>(() => [loadSlide(), 0]);
  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  useEffect(() => {
    try {
      localStorage.setItem(SLIDE_KEY, String(index));
    } catch {
      /* ignorar */
    }
  }, [index]);

  const go = (step: number) => {
    const next = index + step;
    if (next < 0 || next >= SLIDES.length) return;
    setPage([next, step]);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Enter' && isLast) onStart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#F0F4F8] text-[#0F172A]">
      <header className="relative flex h-16 shrink-0 items-center justify-between border-b border-[rgba(15,23,42,0.08)] bg-white px-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:px-12">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 sm:gap-1.5" aria-hidden="true">
            {SLIDES.map((s, i) => (
              <button
                key={s.title}
                type="button"
                tabIndex={-1}
                onClick={() => setPage([i, i > index ? 1 : -1])}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? 'w-5 bg-[#0F172A] sm:w-7' : i < index ? 'w-2 bg-[#94A3B8] sm:w-3.5' : 'w-2 bg-[#CBD5E1] sm:w-3.5'
                }`}
              />
            ))}
          </div>
          <span className="hidden text-[13px] font-bold tracking-tight text-[#475569] sm:inline">
            {index + 1} / {SLIDES.length}
          </span>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="whitespace-nowrap text-[17px] font-black tracking-[-0.035em] sm:text-[22px]">Estación 2</h1>
        </div>
        <button
          type="button"
          onClick={onStart}
          className="flex h-9 items-center rounded-xl border border-[rgba(15,23,42,0.14)] bg-white px-3 text-[12.5px] font-bold text-[#334155] transition-colors hover:border-[#0F172A] hover:text-[#0F172A] sm:px-3.5"
        >
          Ir a la actividad
        </button>
      </header>

      <main className="flex min-h-0 flex-1 flex-col items-center gap-4 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-10 sm:py-6">
        <div className="relative w-full max-w-[1100px] min-h-0 flex-1">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.section
              key={index}
              custom={direction}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 60 }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d * -60 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={spring}
              className={`absolute inset-0 flex overflow-y-auto rounded-3xl border border-[rgba(15,23,42,0.08)] bg-white p-6 shadow-[0_8px_40px_rgba(15,23,42,0.06)] sm:p-12 ${
                slide.cover ? 'items-center justify-center' : 'items-start'
              }`}
            >
              <div className="my-auto w-full">
                <SlideBody slide={slide} />
              </div>
            </motion.section>
          </AnimatePresence>
        </div>

        <div className="flex w-full max-w-[1100px] shrink-0 gap-3">
          <NavButton onClick={() => go(-1)} disabled={index === 0} label="Anterior">
            <Arrow back />
          </NavButton>
          <div className="flex-1">
            {isLast ? (
              <NavButton onClick={onStart} primary>
                <span className="flex w-full items-center justify-center gap-2.5">
                  Comenzar actividad <Arrow />
                </span>
              </NavButton>
            ) : (
              <NavButton onClick={() => go(1)} primary>
                <span className="flex w-full items-center justify-center gap-2.5">
                  Siguiente <Arrow />
                </span>
              </NavButton>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
