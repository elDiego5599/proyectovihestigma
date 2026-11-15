import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { Person } from '../art/Person';

export function SexualRiskScenario() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = gsap.context(() => {
      gsap.set('#couple-a-motion', {
        rotation: 4,
        transformOrigin: '50% 100%',
      });
      gsap.set('#couple-b-motion', {
        rotation: -4,
        transformOrigin: '50% 100%',
      });
      gsap.set('#condom-slash-group', { opacity: 0 });
      gsap.set('#condom-slash', { strokeDasharray: 220, strokeDashoffset: 220 });

      gsap.to('#couple-a-motion', {
        rotation: 1.5,
        y: -2,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('#couple-b-motion', {
        rotation: -1.5,
        y: -2,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('#condom-icon', {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.risk-dot', {
        scale: 1.16,
        duration: 0.85,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.22,
        transformOrigin: 'center center',
      });
      gsap.to('#amber-burst', {
        scale: 1.1,
        opacity: 0.75,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        transformOrigin: 'center center',
      });

      const slash = gsap.timeline({ repeat: -1, repeatDelay: 3.2 });
      slash
        .to('#condom-slash-group', { opacity: 1, duration: 0.25 }, 0.4)
        .to('#condom-slash', { strokeDashoffset: 0, duration: 0.75, ease: 'power2.inOut' }, 0.5)
        .set('#condom-slash', { strokeDashoffset: 220 }, 4.6);
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="flex h-full w-full items-center justify-center px-4 py-2">
      <svg
        viewBox="0 0 1200 600"
        className="h-full w-full select-none"
        role="img"
        aria-label="Una pareja abrazada junto a un preservativo tachado y partículas de riesgo, con una señal ámbar de otra infección de transmisión sexual."
        preserveAspectRatio="xMidYMid meet"
      >
        <circle cx="600" cy="300" r="230" fill="#FFF1F2" />
        <circle cx="410" cy="280" r="175" fill="#EFF6FF" />
        <circle cx="800" cy="290" r="170" fill="#FFFBEB" />
        <circle cx="170" cy="188" r="13" fill="#FDA4AF" opacity="0.6" />
        <circle cx="1040" cy="204" r="14" fill="#FCD34D" opacity="0.6" />

        <g id="couple-b-motion">
          <Person
            x={742}
            y={530}
            scale={1}
            flip
            skin="#F2C9A4"
            hair="#B45309"
            shirt="#F59E0B"
            lower="#1E293B"
            hairStyle="bob"
            look="left"
            expression="smile"
          />
        </g>
        <g id="couple-a-motion">
          <Person
            x={458}
            y={530}
            scale={1}
            skin="#8C5A3C"
            hair="#111827"
            shirt="#2563EB"
            lower="#334155"
            hairStyle="long"
            look="right"
            expression="smile"
          />
        </g>

        <ellipse cx="600" cy="536" rx="270" ry="20" fill="#F1F5F9" />

        <g transform="translate(600 398) scale(0.8)">
          <g id="condom-icon">
            <ellipse cx="0" cy="82" rx="66" ry="12" fill="#0F172A" opacity="0.06" />
            <path
              d="M -34 -38 C -34 -76 34 -76 34 -38 L 34 30 C 34 48 18 58 0 58 C -18 58 -34 48 -34 30 Z"
              fill="#DBEAFE"
              stroke="#1E293B"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <circle cx="0" cy="-70" r="10" fill="#BFDBFE" stroke="#1E293B" strokeWidth="3" />
            <path d="M -18 -30 C -12 -46 10 -50 20 -40" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeOpacity="0.8" strokeLinecap="round" />
            <rect x="-47" y="38" width="94" height="27" rx="13.5" fill="#60A5FA" stroke="#1E293B" strokeWidth="3" />
            <path d="M -30 45 H 30 M -24 57 H 24" stroke="#1D4ED8" strokeWidth="2.4" strokeLinecap="round" strokeOpacity="0.55" />
          </g>
          <g id="condom-slash-group">
            <circle r="96" fill="none" stroke="#F43F5E" strokeWidth="7" />
            <line
              id="condom-slash"
              x1="-64"
              y1="64"
              x2="64"
              y2="-64"
              stroke="#F43F5E"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </g>
        </g>

        <g transform="translate(334 250)">
          <circle className="risk-dot" r="14" fill="#F43F5E" fillOpacity="0.22" stroke="#F43F5E" strokeWidth="2.4" />
          <g stroke="#F43F5E" strokeWidth="2.2" strokeLinecap="round">
            <path d="M 0 -21 V -28 M 0 21 V 28 M -21 0 H -28 M 21 0 H 28" />
          </g>
        </g>
        <g transform="translate(864 252)">
          <g id="amber-burst" transform="translate(0 0)">
            <path
              d="M 0 -42 L 7 -16 L 33 -27 L 18 -3 L 44 7 L 17 15 L 27 41 L 3 23 L -11 46 L -16 20 L -43 28 L -25 5 L -46 -9 L -19 -12 L -27 -40 L -4 -21 L 8 -45 Z"
              fill="#F59E0B"
              fillOpacity="0.15"
              stroke="#F59E0B"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
          </g>
          <circle className="risk-dot" r="14" fill="#F43F5E" fillOpacity="0.22" stroke="#F43F5E" strokeWidth="2.4" />
          <circle r="5" fill="#F43F5E" />
        </g>
        <g transform="translate(966 420)">
          <circle className="risk-dot" r="12" fill="#F43F5E" fillOpacity="0.22" stroke="#F43F5E" strokeWidth="2.2" />
          <circle r="4.2" fill="#F43F5E" />
        </g>
      </svg>
    </div>
  );
}
