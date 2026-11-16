import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SCENARIOS, type Answer } from '../data/scenarios';
import { MosquitoScenario } from './scenarios/MosquitoScenario';
import { SocialContactScenario } from './scenarios/SocialContactScenario';
import { BloodborneScenario } from './scenarios/BloodborneScenario';
import { SexualRiskScenario } from './scenarios/SexualRiskScenario';
import { MotherChildScenario } from './scenarios/MotherChildScenario';
import { HygieneScenario } from './scenarios/HygieneScenario';
import { AppearanceScenario } from './scenarios/AppearanceScenario';
import { HivAidsScenario } from './scenarios/HivAidsScenario';

const SCENE_ART = [
  MosquitoScenario,
  SocialContactScenario,
  BloodborneScenario,
  SexualRiskScenario,
  MotherChildScenario,
  HygieneScenario,
  AppearanceScenario,
  HivAidsScenario,
];

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 10H16M11 5L16 10L11 15"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RestartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.2 6.4A5.7 5.7 0 1 0 13 10.5M13.2 2.6V6.7H9.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5L9.5 17L19 7.5"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="#EF4444"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

const STORAGE_KEY = 'mito-realidad-progreso';

interface Progress {
  index: number;
  answer: Answer | null;
  results: boolean[];
  finished: boolean;
}

/** Progreso guardado: recargar la página no reinicia la actividad. */
function loadProgress(): Progress {
  const empty: Progress = { index: 0, answer: null, results: [], finished: false };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Progress | null;
    if (saved && Number.isInteger(saved.index) && saved.index >= 0 && saved.index < SCENARIOS.length) {
      return { ...empty, ...saved };
    }
  } catch {
    /* sin almacenamiento disponible: se empieza de cero */
  }
  return empty;
}

export function SimulationScreen() {
  const [initial] = useState(loadProgress);
  const [index, setIndex] = useState(initial.index);
  const [answer, setAnswer] = useState<Answer | null>(initial.answer);
  const [results, setResults] = useState<boolean[]>(initial.results);
  const [finished, setFinished] = useState(initial.finished);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ index, answer, results, finished }));
    } catch {
      /* ignorar */
    }
  }, [index, answer, results, finished]);

  const meta = SCENARIOS[index];
  const SceneArt = SCENE_ART[index];
  const isLast = index === SCENARIOS.length - 1;
  const isResolved = answer !== null;
  const isCorrect = isResolved && answer === meta.answer;

  const handleAnswer = (choice: Answer) => {
    if (answer) return;
    setAnswer(choice);
    setResults((prev) => {
      const next = [...prev];
      next[index] = choice === meta.answer;
      return next;
    });
  };

  const handleNext = () => {
    setAnswer(null);
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex((current) => current + 1);
  };

  const handleRestart = () => {
    setAnswer(null);
    setResults([]);
    setFinished(false);
    setIndex(0);
  };

  // Atajos de teclado: M = mito, R = realidad, Enter = continuar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (finished) {
        if (key === 'enter') handleRestart();
        return;
      }
      if (!answer && key === 'm') handleAnswer('mito');
      else if (!answer && key === 'r') handleAnswer('realidad');
      else if (answer && key === 'enter') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const score = results.filter(Boolean).length;

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#F0F4F8] text-[#0F172A]">
      {/* Header editorial con Mito o Realidad en alto contraste y presencia real */}
      <header className="relative flex h-16 shrink-0 items-center justify-between border-b border-[rgba(15,23,42,0.08)] bg-white px-4 sm:px-12 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        {/* Lado izquierdo: indicador de pasos */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 sm:gap-1.5" aria-hidden="true">
            {SCENARIOS.map((scenario, dotIndex) => (
              <span
                key={scenario.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  dotIndex === index && !finished
                    ? `w-5 sm:w-7 ${results[dotIndex] === undefined ? 'bg-[#2563EB]' : results[dotIndex] ? 'bg-[#10B981]' : 'bg-[#F43F5E]'}`
                    : results[dotIndex] === true
                      ? 'w-2 sm:w-3.5 bg-[#10B981]'
                      : results[dotIndex] === false
                        ? 'w-2 sm:w-3.5 bg-[#F43F5E]'
                        : 'w-2 sm:w-3.5 bg-[#CBD5E1]'
                }`}
              />
            ))}
          </div>
          <span className="hidden text-[13px] font-bold tracking-tight text-[#475569] sm:inline">
            {index + 1} / {SCENARIOS.length}
          </span>
        </div>

        {/* Centro absoluto: Título nítido, prominente y con autoridad visual */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="whitespace-nowrap text-[17px] font-black tracking-[-0.035em] text-[#0F172A] sm:text-[22px]">
            Mito o Realidad
          </h1>
        </div>

        {/* Lado derecho: botón reiniciar */}
        <div className="flex items-center">
          <motion.button
            type="button"
            onClick={handleRestart}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', duration: 0.22, bounce: 0 }}
            aria-label="Reiniciar"
            className="flex h-9 items-center gap-2 rounded-xl border border-[rgba(15,23,42,0.14)] bg-white px-2.5 sm:px-3.5 text-[12.5px] font-bold text-[#334155] shadow-xs transition-colors hover:border-[#0F172A] hover:text-[#0F172A]"
          >
            <RestartIcon />
            <span className="hidden sm:inline">Reiniciar</span>
          </motion.button>
        </div>
      </header>

      {finished ? (
        <main className="flex min-h-0 flex-1 items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0 }}
            className="w-full max-w-[520px] rounded-3xl border border-[rgba(15,23,42,0.08)] bg-white p-10 text-center shadow-[0_8px_40px_rgba(15,23,42,0.08)]"
          >
            <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#64748B]">Tu resultado</p>
            <p className="mt-3 text-[64px] font-black leading-none tracking-[-0.04em] text-[#0F172A]">
              {score}
              <span className="text-[#94A3B8]">/{SCENARIOS.length}</span>
            </p>
            <p className="mx-auto mt-4 max-w-[380px] text-pretty text-[16px] font-medium leading-[1.45] text-[#334155]">
              {score === SCENARIOS.length
                ? 'Perfecto. Conoces bien cómo se transmite y cómo no se transmite el VIH.'
                : score >= SCENARIOS.length / 2
                  ? 'Muy bien. Repasa las que fallaste: la información correcta frena el estigma.'
                  : 'Buen comienzo. Vuelve a intentarlo: entender el VIH ayuda a cuidarte y a no discriminar.'}
            </p>
            <div className="mt-6 flex justify-center gap-2">
              {results.map((ok, i) => (
                <span key={i} className={`h-2.5 w-8 rounded-full ${ok ? 'bg-[#10B981]' : 'bg-[#F43F5E]'}`} />
              ))}
            </div>
            <motion.button
              type="button"
              onClick={handleRestart}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.2, bounce: 0 }}
              className="mx-auto mt-8 flex h-[54px] items-center justify-center gap-2.5 rounded-xl bg-[#0F172A] px-8 text-[15px] font-bold text-white hover:bg-[#1E293B]"
            >
              <RestartIcon />
              Jugar de nuevo
            </motion.button>
          </motion.div>
        </main>
      ) : (
      <main className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-hidden px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:justify-between sm:gap-0 sm:px-10">
        {/* Contenedor visual del escenario con iluminación limpia */}
        <div className="relative flex aspect-[1100/480] w-full max-w-[1240px] flex-none items-center justify-center sm:aspect-auto sm:h-full sm:max-h-[64vh] sm:flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={meta.id}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ type: 'spring', duration: 0.35, bounce: 0 }}
              className="h-full w-full"
            >
              <SceneArt isResolved={isResolved} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tarjeta de interacción: misma altura en pregunta, acierto y error */}
        <div className="w-full max-w-[1100px] shrink-0 sm:pt-3">
          <div className="relative grid min-h-[168px] overflow-hidden rounded-3xl border border-[rgba(15,23,42,0.08)] bg-white px-6 py-5 sm:px-8 shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
            {/* Ambos estados ocupan la misma celda: la tarjeta mide siempre lo del más alto */}
                <motion.div
                  aria-hidden={isResolved}
                  initial={false}
                  animate={{ opacity: isResolved ? 0 : 1, y: isResolved ? -6 : 0 }}
                  transition={{ type: 'spring', duration: 0.28, bounce: 0 }}
                  className={`col-start-1 row-start-1 flex flex-col justify-between gap-4 ${isResolved ? 'pointer-events-none' : ''}`}
                >
                  <h2 className="min-w-0 text-pretty text-[18px] font-extrabold leading-[1.3] tracking-[-0.02em] text-[#0F172A] sm:text-[21px]">
                    {meta.statement}
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {(['mito', 'realidad'] as const).map((choice) => (
                      <motion.button
                        key={choice}
                        type="button"
                        onClick={() => handleAnswer(choice)}
                        tabIndex={isResolved ? -1 : 0}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', duration: 0.18, bounce: 0 }}
                        className="flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#E2E8F0] bg-[#F8FAFC] text-[15px] font-black uppercase tracking-[0.04em] text-[#0F172A] transition-colors hover:border-[#94A3B8] hover:bg-white"
                      >
                        {choice}
                        <kbd className="hidden rounded-md sm:inline border border-[#CBD5E1] bg-white px-1.5 py-0.5 text-[11px] font-bold text-[#64748B]">
                          {choice === 'mito' ? 'M' : 'R'}
                        </kbd>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
                <motion.div
                  aria-hidden={!isResolved}
                  initial={false}
                  animate={{ opacity: isResolved ? 1 : 0, y: isResolved ? 0 : 6 }}
                  transition={{ type: 'spring', duration: 0.28, bounce: 0 }}
                  className={`col-start-1 row-start-1 flex flex-col justify-between gap-4 ${isResolved ? '' : 'pointer-events-none'}`}
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        isCorrect ? 'bg-[#10B981]' : 'border-2 border-[rgba(239,68,68,0.2)] bg-[#FEF2F2]'
                      }`}
                    >
                      {isCorrect ? <CheckIcon /> : <CrossIcon />}
                    </span>
                    <div className="min-w-0">
                      <h2
                        className={`text-[18px] font-extrabold leading-tight tracking-[-0.02em] ${
                          isCorrect ? 'text-[#065F46]' : 'text-[#991B1B]'
                        }`}
                      >
                        {isCorrect ? '¡Correcto! ' : 'Incorrecto: '}
                        <span className="text-[#0F172A]">
                          {meta.answer === 'mito' ? 'es un mito.' : 'es realidad.'}
                        </span>
                      </h2>
                      <p className="mt-1 text-pretty text-[14.5px] font-medium leading-[1.45] text-[#334155]">
                        {meta.feedback}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    type="button"
                    onClick={handleNext}
                    tabIndex={isResolved ? 0 : -1}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', duration: 0.2, bounce: 0 }}
                    className="flex h-[54px] w-full shrink-0 items-center justify-center gap-2.5 rounded-2xl bg-[#0F172A] px-6 text-[15px] font-bold tracking-tight text-white hover:bg-[#1E293B]"
                  >
                    {isLast ? 'Ver resultado' : 'Siguiente'}
                    <ArrowIcon />
                  </motion.button>
                </motion.div>
          </div>
        </div>
      </main>
      )}
    </div>
  );
}
