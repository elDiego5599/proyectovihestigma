import { useState } from 'react';
import { SCENARIOS, type Answer } from '../data/scenarios';
import { MosquitoScenario } from './scenarios/MosquitoScenario';
import { SocialContactScenario } from './scenarios/SocialContactScenario';
import { BloodborneScenario } from './scenarios/BloodborneScenario';
import { SexualRiskScenario } from './scenarios/SexualRiskScenario';
import { MotherChildScenario } from './scenarios/MotherChildScenario';
import { HygieneScenario } from './scenarios/HygieneScenario';

const SCENE_ART = [
  MosquitoScenario,
  SocialContactScenario,
  BloodborneScenario,
  SexualRiskScenario,
  MotherChildScenario,
  HygieneScenario,
];

function ArrowIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M3 10H16M11 5L16 10L11 15"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RestartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M13.2 6.4A5.7 5.7 0 1 0 13 10.5M13.2 2.6V6.7H9.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckMark() {
  return (
    <span className="pop-in flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald">
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
        <path
          className="check-path"
          d="M7 15.5L12.5 21L23 9.5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function CrossMark() {
  return (
    <span className="pop-in flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-coral-soft">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <path
          d="M8 8L20 20M20 8L8 20"
          fill="none"
          stroke="#F43F5E"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function SimulationScreen() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<Answer | null>(null);

  const meta = SCENARIOS[index];
  const SceneArt = SCENE_ART[index];
  const isLast = index === SCENARIOS.length - 1;
  const status = answer === null ? 'question' : answer === meta.answer ? 'correct' : 'wrong';

  const handleAnswer = (choice: Answer) => {
    if (answer) return;
    setAnswer(choice);
  };

  const handleNext = () => {
    setAnswer(null);
    setIndex((current) => (current + 1) % SCENARIOS.length);
  };

  const handleRestart = () => {
    setAnswer(null);
    setIndex(0);
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white">
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-line px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-coral text-[18px] font-extrabold leading-none text-white">
            ?
          </span>
          <h1 className="truncate text-[16px] font-extrabold tracking-[-0.02em] text-ink">
            Mito o Realidad
          </h1>
          <span aria-hidden="true" className="hidden h-4 w-px bg-line md:block" />
          <p className="hidden truncate text-[13px] font-medium text-soft md:block">
            VIH: transmisión y prevención
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
            {SCENARIOS.map((scenario, dotIndex) => (
              <span
                key={scenario.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  dotIndex === index
                    ? 'w-7 bg-coral'
                    : dotIndex < index
                      ? 'w-7 bg-emerald'
                      : 'w-7 bg-line'
                }`}
              />
            ))}
          </div>
          <p className="whitespace-nowrap text-[13px] font-semibold text-body">
            Escenario <span className="tabular-nums">{index + 1}</span> de 6
          </p>
          <span aria-hidden="true" className="h-4 w-px bg-line" />
          <button
            type="button"
            onClick={handleRestart}
            className="flex h-9 items-center gap-2 rounded-xl border border-line px-3 text-[12.5px] font-semibold text-body transition-colors hover:border-ink hover:text-ink"
          >
            <RestartIcon />
            Reiniciar
          </button>
        </div>
      </header>

      <main className="relative min-h-0 flex-1 overflow-hidden bg-[#FCFDFE]">
        <div key={meta.id} className="soft-fade h-full w-full">
          <SceneArt />
        </div>
      </main>

      <section
        aria-live="polite"
        className={`flex h-[30vh] min-h-[248px] max-h-[310px] shrink-0 border-t-2 px-5 transition-colors duration-300 sm:px-8 ${
          status === 'correct'
            ? 'border-emerald bg-emerald-soft'
            : status === 'wrong'
              ? 'border-coral bg-coral-soft'
              : 'border-line bg-white'
        }`}
      >
        <div className="mx-auto flex h-full w-full max-w-[1280px] items-center">
          {status === 'question' ? (
            <div className="flex w-full flex-col justify-center gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div className="min-w-0 flex-1">
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-coral" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-coral">
                    Mito o realidad
                  </p>
                </div>
                <h2 className="max-w-[840px] text-pretty text-[clamp(1.2rem,1.7vw,1.55rem)] font-bold leading-[1.28] tracking-[-0.02em] text-ink">
                  {meta.statement}
                </h2>
              </div>

              <div className="flex shrink-0 gap-3">
                <button
                  type="button"
                  onClick={() => handleAnswer('mito')}
                  className="h-[66px] w-[164px] rounded-2xl border-2 border-coral bg-white text-[17px] font-extrabold tracking-[0.02em] text-coral transition-colors hover:bg-coral-soft active:translate-y-px"
                >
                  MITO
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswer('realidad')}
                  className="h-[66px] w-[164px] rounded-2xl border-2 border-cobalt bg-white text-[17px] font-extrabold tracking-[0.02em] text-cobalt transition-colors hover:bg-[#EFF6FF] active:translate-y-px"
                >
                  REALIDAD
                </button>
              </div>
            </div>
          ) : status === 'correct' ? (
            <div className="panel-in flex w-full items-center justify-between gap-6">
              <div className="flex min-w-0 items-center gap-5">
                <CheckMark />
                <div className="min-w-0">
                  <h2 className="text-[clamp(1.5rem,2.2vw,2rem)] font-extrabold leading-none tracking-[-0.03em] text-emerald">
                    Acertaste
                  </h2>
                  <p className="mt-2 text-[14px] font-medium text-body">
                    La respuesta era{' '}
                    <span className="font-bold uppercase text-ink">
                      {meta.answer === 'mito' ? 'mito' : 'realidad'}
                    </span>
                    .
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="flex h-[58px] shrink-0 items-center gap-3 rounded-2xl bg-emerald px-6 text-[15px] font-bold text-white transition-colors hover:bg-[#0EA271] active:translate-y-px"
              >
                {isLast ? 'Volver al inicio' : 'Siguiente escenario'}
                <ArrowIcon />
              </button>
            </div>
          ) : (
            <div className="panel-in flex w-full items-center justify-between gap-6">
              <div className="flex min-w-0 items-start gap-5">
                <CrossMark />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h2 className="text-[clamp(1.3rem,1.9vw,1.7rem)] font-extrabold leading-none tracking-[-0.03em] text-coral">
                      Incorrecto
                    </h2>
                    <span className="rounded-full border border-coral/30 bg-white px-3 py-1 text-[12px] font-bold uppercase tracking-[0.06em] text-coral">
                      La respuesta es {meta.answer}
                    </span>
                  </div>
                  <p className="mt-2.5 max-w-[820px] text-pretty text-[14.5px] leading-[1.45] text-body">
                    {meta.feedback}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="flex h-[58px] shrink-0 items-center gap-3 rounded-2xl bg-ink px-6 text-[15px] font-bold text-white transition-colors hover:bg-[#1E293B] active:translate-y-px"
              >
                {isLast ? 'Volver al inicio' : 'Siguiente escenario'}
                <ArrowIcon />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
