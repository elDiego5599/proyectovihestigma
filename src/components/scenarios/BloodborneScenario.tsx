import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { Person } from '../art/Person';

export function BloodborneScenario() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = gsap.context(() => {
      gsap.set('#syringe-motion', { x: 500, y: 282, opacity: 0 });
      gsap.set('#syringe-fluid', { attr: { width: 0 } });
      gsap.set('#drop-a, #drop-b', {
        scale: 0.35,
        opacity: 0,
        transformOrigin: 'center center',
      });

      gsap.to('#blood-a, #blood-b', {
        y: -2,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.35,
      });

      const sequence = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.7,
        defaults: { ease: 'power2.inOut' },
      });

      sequence
        .to('#syringe-motion', { opacity: 1, duration: 0.3 })
        .to('#syringe-fluid', { attr: { width: 92 }, duration: 0.85 }, 0.15)
        .to('#drop-a', { scale: 1, opacity: 1, duration: 0.25 }, 0.3)
        .to('#drop-a', { opacity: 0, duration: 0.3 }, 0.95)
        .to('#syringe-motion', { x: 930, duration: 1.45 }, 1.25)
        .to('#syringe-fluid', { attr: { width: 0 }, duration: 0.7 }, 2.55)
        .to('#drop-b', { scale: 1, opacity: 1, duration: 0.25 }, 2.8)
        .to('#drop-b', { opacity: 0, duration: 0.35 }, 3.25)
        .to('#syringe-motion', { opacity: 0, duration: 0.4 }, 3.8);
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="flex h-full w-full items-center justify-center px-4 py-2">
      <svg
        viewBox="0 0 1200 600"
        className="h-full w-full select-none"
        role="img"
        aria-label="Dos personas con el brazo extendido y una jeringa con sangre que pasa de un brazo al otro sin cambiar la aguja."
        preserveAspectRatio="xMidYMid meet"
      >
        <circle cx="270" cy="290" r="215" fill="#FFF1F2" />
        <circle cx="930" cy="290" r="215" fill="#EFF6FF" />
        <circle cx="600" cy="290" r="185" fill="#F8FAFC" />
        <circle cx="174" cy="196" r="13" fill="#FDA4AF" opacity="0.65" />
        <circle cx="1040" cy="172" r="12" fill="#93C5FD" opacity="0.7" />

        <g id="blood-a">
          <Person
            x={260}
            y={530}
            scale={1.02}
            skin="#E8B48C"
            hair="#3F2A1D"
            shirt="#F59E0B"
            lower="#1E293B"
            hairStyle="bun"
            pose="open"
            look="right"
            expression="calm"
          />
        </g>
        <g id="blood-b">
          <Person
            x={940}
            y={530}
            scale={1.02}
            flip
            skin="#8C5A3C"
            hair="#111827"
            shirt="#10B981"
            lower="#334155"
            hairStyle="curly"
            pose="open"
            look="left"
            expression="calm"
          />
        </g>

        <ellipse cx="490" cy="300" rx="58" ry="24" fill="#F43F5E" opacity="0.08" />
        <ellipse cx="840" cy="300" rx="58" ry="24" fill="#F43F5E" opacity="0.08" />

        <g id="syringe-motion">
          <line x1="-110" y1="0" x2="0" y2="0" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
          <path d="M -110 0 L -96 -6 L -96 6 Z" fill="#CBD5E1" stroke="#1E293B" strokeWidth="1.6" />
          <rect x="-10" y="-11" width="24" height="22" rx="5" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2.4" />
          <rect x="12" y="-26" width="120" height="52" rx="12" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.8" />
          <rect
            id="syringe-fluid"
            x="22"
            y="-16"
            width="0"
            height="32"
            rx="7"
            fill="#F43F5E"
          />
          <path d="M 30 -18 V 18 M 44 -18 V 18 M 58 -18 V 18 M 72 -18 V 18 M 86 -18 V 18 M 100 -18 V 18 M 114 -18 V 18" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.65" />
          <rect x="128" y="-9" width="56" height="18" rx="9" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2.2" />
          <rect x="122" y="-31" width="10" height="62" rx="5" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2.2" />
          <rect x="182" y="-26" width="11" height="52" rx="5.5" fill="#E2E8F0" stroke="#1E293B" strokeWidth="2.2" />
        </g>

        <circle id="drop-a" cx="392" cy="300" r="10" fill="#F43F5E" stroke="#BE123C" strokeWidth="2" />
        <circle id="drop-b" cx="822" cy="300" r="10" fill="#F43F5E" stroke="#BE123C" strokeWidth="2" />

        <g>
          <circle cx="600" cy="112" r="30" fill="#FFF7ED" stroke="#F59E0B" strokeWidth="2" />
          <path d="M 600 96 V 116" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
          <circle cx="600" cy="128" r="3.2" fill="#F59E0B" />
        </g>
      </svg>
    </div>
  );
}
