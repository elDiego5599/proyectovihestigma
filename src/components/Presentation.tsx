import { useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FactorsArt, FluidsArt, RibbonArt, RiskArt, RoutesArt, SafeArt } from './slides/SlideArt';

const QuizArt = () => <RibbonArt quiz />;

type Tone = 'rose' | 'sky' | 'violet' | 'emerald' | 'amber';

const TONES: Record<Tone, string> = {
  rose: '#F43F5E',
  sky: '#0EA5E9',
  violet: '#8B5CF6',
  emerald: '#10B981',
  amber: '#F59E0B',
};

type MarkKind = 'check' | 'cross' | 'up' | 'down' | 'dot';

interface Column {
  heading: string;
  tone: Tone;
  mark: MarkKind;
  items: string[];
}

interface Slide {
  title: string;
  lead?: string;
  /** Lista corta de ideas, sin cajas. */
  items?: { text: string; tone: Tone }[];
  /** Dos listas que se comparan (sí / no, aumenta / reduce). */
  columns?: [Column, Column];
  cover?: boolean;
  /** Composición: texto a la izquierda, a la derecha, arriba, o portada centrada. */
  layout: 'split' | 'flip' | 'stack' | 'cover';
  /** Ilustración animada y su color de fondo. */
  art: ComponentType;
  artBg: string;
}

const SLIDES: Slide[] = [
  {
    art: RibbonArt,
    artBg: '#FFF1F2',
    layout: 'cover',
    title: 'Transmisión del VIH',
    lead: 'Cómo se transmite, cómo no y cómo cuidarte.',
    cover: true,
  },
  {
    art: RoutesArt,
    artBg: '#F8FAFC',
    layout: 'stack',
    title: 'Solo hay 3 vías',
  },
  {
    art: FluidsArt,
    artBg: '#FFF1F2',
    layout: 'stack',
    title: '¿Qué líquidos lo transmiten?',
    lead: 'Solo si entran al cuerpo por una herida o una mucosa.',
  },
  {
    art: RiskArt,
    artBg: '#FFF7ED',
    layout: 'stack',
    title: '¿Cuándo hay riesgo?',
  },
  {
    art: SafeArt,
    artBg: '#F0FDF4',
    layout: 'stack',
    title: 'En la vida diaria no hay riesgo',
    items: [
      { tone: 'emerald', text: 'Abrazos, besos y dar la mano' },
      { tone: 'emerald', text: 'Compartir vasos o comida' },
      { tone: 'emerald', text: 'Baños, piscinas y mosquitos' },
    ],
  },
  {
    art: FactorsArt,
    artBg: '#F8FAFC',
    layout: 'flip',
    title: '¿Qué cambia el riesgo?',
    columns: [
      { heading: 'Lo aumenta', tone: 'rose', mark: 'up', items: ['Otras ITS', 'Heridas', 'No hacerse la prueba'] },
      { heading: 'Lo reduce', tone: 'emerald', mark: 'down', items: ['Condón', 'Tratamiento', 'Hacerse la prueba'] },
    ],
  },
  {
    art: QuizArt,
    artBg: '#FFF1F2',
    layout: 'cover',
    title: '¿Mito o realidad?',
    lead: '10 situaciones. Tú decides.',
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

function Mark({ kind, color }: { kind: MarkKind; color: string }) {
  const paths: Record<MarkKind, string> = {
    check: 'M5 12.5L9.5 17L19 7.5',
    cross: 'M7 7L17 17M17 7L7 17',
    up: 'M12 19V5M6 11L12 5L18 11',
    down: 'M12 5V19M6 13L12 19L18 13',
    dot: '',
  };
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: color }}>
      {kind !== 'dot' && (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d={paths[kind]} stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
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

function SlideText({ slide }: { slide: Slide }) {
  const center = slide.layout === 'cover';
  const row = slide.layout === 'stack';
  return (
    <motion.div
      variants={list}
      initial="hidden"
      animate="show"
      className={`w-full ${center ? 'text-center' : ''}`}
    >
      <motion.h2
        variants={rise}
        className={`text-balance font-black tracking-[-0.045em] ${
          slide.cover ? 'text-[38px] leading-[1] sm:text-[64px]' : 'text-[30px] leading-[1.04] sm:text-[44px]'
        }`}
      >
        {slide.title}
      </motion.h2>
      {slide.lead && (
        <motion.p variants={rise} className={`mt-4 lg:max-w-[460px] ${center ? "mx-auto" : ""} text-pretty text-[17px] font-medium leading-[1.45] text-[#475569] sm:text-[20px]`}>
          {slide.lead}
        </motion.p>
      )}

      {slide.items && (
        <ul className={row ? 'mt-4 flex flex-wrap gap-x-7 gap-y-3' : 'mt-7 space-y-4'}>
          {slide.items.map((item) => (
            <motion.li key={item.text} variants={rise} className="flex items-center gap-3.5">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: TONES[item.tone] }} />
              <span className="text-[18px] font-bold leading-snug tracking-[-0.015em] sm:text-[21px]">{item.text}</span>
            </motion.li>
          ))}
        </ul>
      )}

      {slide.columns && (
        <div className="mt-7 grid grid-cols-2 gap-6">
          {slide.columns.map((col) => (
            <motion.div key={col.heading} variants={rise}>
              <h3 className="flex items-center gap-2.5 text-[17px] font-extrabold tracking-[-0.02em] sm:text-[19px]" style={{ color: TONES[col.tone] }}>
                <Mark kind={col.mark} color={TONES[col.tone]} />
                {col.heading}
              </h3>
              <ul className="mt-3.5 space-y-2.5">
                {col.items.map((item) => (
                  <li key={item} className="text-[16px] font-bold leading-snug text-[#0F172A] sm:text-[18px]">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function SlideBody({ slide }: { slide: Slide }) {
  const Art = slide.art;

  if (slide.layout === 'cover') {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-8" style={{ background: slide.artBg }}>
        <div className="h-[34vh] w-full max-w-[760px] lg:h-[46vh]">
          <Art />
        </div>
        <div className="max-w-[680px]">
          <SlideText slide={slide} />
        </div>
      </div>
    );
  }

  if (slide.layout === 'stack') {
    return (
      <div className="flex min-h-full flex-col lg:h-full">
        <div className="px-5 pb-2 pt-6 sm:px-10 lg:px-12 lg:pt-10">
          <SlideText slide={slide} />
        </div>
        <div className="flex flex-1 flex-col p-2.5 sm:p-3 lg:min-h-0">
          <div className="relative min-h-[54vh] flex-1 overflow-hidden rounded-[22px] lg:min-h-0" style={{ background: slide.artBg }}>
            <div className="absolute inset-0">
              <Art />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const flip = slide.layout === 'flip';
  return (
    <div className={`grid min-h-full ${flip ? 'lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)]' : 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)]'}`}>
      <div className={`order-2 flex items-start lg:items-center px-5 pb-6 pt-4 sm:px-10 sm:pb-10 lg:py-10 ${flip ? 'lg:order-2 lg:pl-8 lg:pr-12' : 'lg:order-1 lg:pl-12 lg:pr-6'}`}>
        <SlideText slide={slide} />
      </div>
      <div className={`order-1 p-2.5 sm:p-3 ${flip ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="h-[36vh] overflow-hidden rounded-[22px] lg:h-full" style={{ background: slide.artBg }}>
          <Art />
        </div>
      </div>
    </div>
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
        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:block">
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
              className="absolute inset-0 overflow-y-auto rounded-[28px] border border-[rgba(15,23,42,0.08)] bg-white shadow-[0_10px_40px_rgba(15,23,42,0.07)]"
            >
              <SlideBody slide={slide} />
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
