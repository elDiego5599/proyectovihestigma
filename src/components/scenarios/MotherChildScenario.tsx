import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { Person } from '../art/Person';

export function MotherChildScenario() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = gsap.context(() => {
      gsap.set('#mtc-glow', {
        opacity: 0.55,
        scale: 0.9,
        transformOrigin: 'center center',
      });
      gsap.set('#mtc-heart', { opacity: 0, scale: 0.5, transformOrigin: 'center center' });
      gsap.set('#mtc-heart-two', { opacity: 0, scale: 0.5, transformOrigin: 'center center' });

      gsap.to('#mtc-mother-motion', {
        y: -4,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('#mtc-glow', {
        opacity: 0.95,
        scale: 1.04,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('#mtc-shield-motion', {
        y: -6,
        rotation: 2,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('#mtc-bottle-motion', {
        y: -4,
        rotation: -2,
        duration: 2.1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.mtc-spark', {
        scale: 1.3,
        opacity: 0.4,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.25,
        transformOrigin: 'center center',
      });

      const hearts = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
      hearts
        .to('#mtc-heart', { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)' })
        .to('#mtc-heart', { y: -18, duration: 2.2, ease: 'sine.out' }, 0.5)
        .to('#mtc-heart', { opacity: 0, duration: 0.6 }, 2.1)
        .to('#mtc-heart-two', { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.6)' }, 0.9)
        .to('#mtc-heart-two', { y: -14, duration: 1.8, ease: 'sine.out' }, 1.4)
        .to('#mtc-heart-two', { opacity: 0, duration: 0.5 }, 2.7)
        .set('#mtc-heart', { y: 0 }, 3)
        .set('#mtc-heart-two', { y: 0 }, 3);
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="flex h-full w-full items-center justify-center px-4 py-2">
      <svg
        viewBox="0 0 1200 600"
        className="h-full w-full select-none"
        role="img"
        aria-label="Una mujer embarazada sostiene su vientre con cariño junto a un escudo médico verde y un biberón. La transmisión maternoinfantil se puede prevenir."
        preserveAspectRatio="xMidYMid meet"
      >
        <circle cx="470" cy="310" r="235" fill="#FFF1F2" />
        <circle cx="852" cy="292" r="205" fill="#ECFDF5" />
        <circle cx="640" cy="300" r="150" fill="#F8FAFC" />
        <circle cx="214" cy="196" r="13" fill="#FDA4AF" opacity="0.6" />
        <circle cx="1052" cy="184" r="14" fill="#6EE7B7" opacity="0.6" />
        <circle cx="1084" cy="408" r="9" fill="#FDA4AF" opacity="0.6" />

        <ellipse id="mtc-glow" cx="474" cy="380" rx="92" ry="92" fill="#FDA4AF" opacity="0.55" />

        <g id="mtc-mother-motion">
          <Person
            x={474}
            y={538}
            scale={1.12}
            skin="#C98A5E"
            hair="#3F2A1D"
            shirt="#0D9488"
            lower="#2563EB"
            hairStyle="bun"
            pose="belly"
            pregnant
            skirt
            expression="smile"
            look="right"
          />
        </g>

        <g transform="translate(760 300)">
          <g id="mtc-shield-motion">
            <path
              d="M 0 -128 C 44 -106 86 -100 118 -106 L 118 -18 C 118 52 72 100 0 128 C -72 100 -118 52 -118 -18 L -118 -106 C -86 -100 -44 -106 0 -128 Z"
              fill="#ECFDF5"
              stroke="#10B981"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M 0 -95 C 30 -80 60 -76 82 -80 L 82 -16 C 82 38 50 76 0 98 C -50 76 -82 38 -82 -16 L -82 -80 C -60 -76 -30 -80 0 -95 Z"
              fill="#FFFFFF"
              stroke="#A7F3D0"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M 0 -34 V 34"
              fill="none"
              stroke="#10B981"
              strokeWidth="15"
              strokeLinecap="round"
            />
            <path
              d="M -30 0 H 30"
              fill="none"
              stroke="#10B981"
              strokeWidth="15"
              strokeLinecap="round"
            />
            <path
              d="M -40 -70 C -18 -84 20 -84 40 -70"
              fill="none"
              stroke="#6EE7B7"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
          <g className="mtc-spark">
            <circle cx="-140" cy="-78" r="6" fill="#10B981" opacity="0.7" />
          </g>
          <g className="mtc-spark">
            <circle cx="146" cy="40" r="5" fill="#34D399" opacity="0.8" />
          </g>
          <g className="mtc-spark">
            <circle cx="-118" cy="96" r="4" fill="#6EE7B7" opacity="0.8" />
          </g>
        </g>

        <g transform="translate(1004 470)">
          <g id="mtc-bottle-motion">
            <ellipse cx="0" cy="64" rx="46" ry="9" fill="#0F172A" opacity="0.07" />
            <rect x="-34" y="-22" width="68" height="80" rx="20" fill="#FDE68A" stroke="#1E293B" strokeWidth="3" />
            <rect x="-22" y="6" width="44" height="40" rx="10" fill="#FEF3C7" stroke="#1E293B" strokeWidth="2.4" />
            <rect x="-20" y="-58" width="40" height="36" rx="10" fill="#E0F2FE" stroke="#1E293B" strokeWidth="2.6" />
            <path d="M -20 -34 H 20" stroke="#BAE6FD" strokeWidth="3" />
            <rect x="-15" y="-74" width="30" height="20" rx="8" fill="#F9A8D4" stroke="#1E293B" strokeWidth="2.6" />
            <path d="M -7 -80 H 7" stroke="#1E293B" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M -26 14 C -18 8 -10 8 -4 12" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeOpacity="0.7" strokeLinecap="round" />
          </g>
        </g>

        <g transform="translate(594 148)">
          <g id="mtc-heart">
            <path
              d="M 0 26 C -44 -2 -38 -44 -13 -44 C 0 -44 8 -34 12 -25 C 18 -34 28 -44 41 -42 C 70 -38 70 0 26 31 Z"
              fill="#FB7185"
              stroke="#1E293B"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d="M -18 -22 C -12 -30 -2 -31 2 -26" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeOpacity="0.7" strokeLinecap="round" />
          </g>
        </g>
        <g transform="translate(660 100) scale(0.66)">
          <g id="mtc-heart-two">
            <path
              d="M 0 26 C -44 -2 -38 -44 -13 -44 C 0 -44 8 -34 12 -25 C 18 -34 28 -44 41 -42 C 70 -38 70 0 26 31 Z"
              fill="#F59E0B"
              stroke="#1E293B"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </g>
        </g>

        <g fill="none" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" opacity="0.85">
          <path d="M 344 132 C 358 122 374 122 388 132" />
          <path d="M 306 108 C 318 100 332 100 344 108" />
        </g>
      </svg>
    </div>
  );
}
