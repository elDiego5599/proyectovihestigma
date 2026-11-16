import { useId, useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { gsap } from '../../lib/gsap';

export const STAGE_W = 1100;
export const STAGE_H = 480;

/**
 * Marco común de todas las escenas: un plano medio recortado con esquinas redondeadas,
 * fondo propio y un borde interior sutil. Los personajes se cortan en el borde inferior.
 */
export function Stage({
  label,
  background,
  children,
  defs,
}: {
  label: string;
  background: ReactNode;
  children: ReactNode;
  defs?: ReactNode;
}) {
  const clipId = `stage-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <svg
      viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
      className="h-full w-full select-none"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <clipPath id={clipId}>
          <rect width={STAGE_W} height={STAGE_H} rx="28" />
        </clipPath>
        {defs}
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {background}
        {children}
      </g>
      <rect
        x="0.75"
        y="0.75"
        width={STAGE_W - 1.5}
        height={STAGE_H - 1.5}
        rx="27.5"
        fill="none"
        stroke="#0F172A"
        strokeOpacity="0.08"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Monta las animaciones GSAP de una escena dentro de un contexto que se revierte al desmontar.
 * Con movimiento reducido, no se anima nada y la escena queda en su estado de reposo.
 */
export function useSceneAnimation(build: () => void): RefObject<HTMLDivElement | null> {
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(build, rootRef);
    return () => ctx.revert();
    // build es estable por escena
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return rootRef;
}

/** Revela las etiquetas explicativas (`.reveal`) cuando el usuario ya respondió. */
export function useReveal(rootRef: RefObject<HTMLDivElement | null>, isResolved?: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = root.querySelectorAll('.reveal');
    if (!targets.length) return;
    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: isResolved ? 1 : 0 });
      return;
    }
    gsap.to(targets, {
      opacity: isResolved ? 1 : 0,
      y: isResolved ? 0 : 8,
      duration: isResolved ? 0.45 : 0.2,
      stagger: isResolved ? 0.12 : 0,
      ease: 'power3.out',
    });
  }, [rootRef, isResolved]);
}

export function SceneRoot({
  rootRef,
  children,
}: {
  rootRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}) {
  return (
    <div ref={rootRef} className="flex h-full w-full items-center justify-center">
      {children}
    </div>
  );
}
