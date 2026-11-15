import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { Person } from '../art/Person';

export function SocialContactScenario() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = gsap.context(() => {
      gsap.set('#social-heart', {
        opacity: 0.25,
        scale: 0.8,
        transformOrigin: 'center center',
      });
      gsap.set('#social-heart-two', {
        opacity: 0,
        scale: 0.6,
        transformOrigin: 'center center',
      });

      const lean = gsap.timeline({
        repeat: -1,
        yoyo: true,
        repeatDelay: 1.1,
        defaults: {
          duration: 1.7,
          ease: 'sine.inOut',
          transformOrigin: '50% 100%',
        },
      });

      lean
        .to('#social-a', { rotation: 7, x: 8 }, 0)
        .to('#social-b', { rotation: -7, x: -8 }, 0)
        .to('#social-heart', { opacity: 0.95, scale: 1, duration: 0.5 }, 1.1)
        .to('#social-heart-two', { opacity: 0.8, scale: 1, duration: 0.45 }, 1.45);

      gsap.to('#social-heart', {
        y: -9,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('#social-heart-two', {
        y: -7,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.4,
      });

      gsap.to('#steam-a, #steam-b', {
        y: -12,
        opacity: 0.25,
        duration: 1.9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.35,
      });

      gsap.to('#social-a, #social-b', {
        y: -2,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.4,
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="flex h-full w-full items-center justify-center px-4 py-2">
      <svg
        viewBox="0 0 1200 600"
        className="h-full w-full select-none"
        role="img"
        aria-label="Dos amigos sonrientes se abrazan junto a una mesa con tazas, cubiertos y fruta compartida."
        preserveAspectRatio="xMidYMid meet"
      >
        <circle cx="600" cy="300" r="222" fill="#FFFBEB" />
        <circle cx="380" cy="280" r="170" fill="#FFF1F2" />
        <circle cx="820" cy="280" r="170" fill="#EFF6FF" />
        <circle cx="176" cy="212" r="12" fill="#FCD34D" opacity="0.75" />
        <circle cx="1034" cy="182" r="14" fill="#93C5FD" opacity="0.65" />
        <circle cx="1064" cy="380" r="9" fill="#FDA4AF" opacity="0.7" />

        <g id="social-b">
          <Person
            x={706}
            y={530}
            scale={0.98}
            flip
            skin="#8C5A3C"
            hair="#111827"
            shirt="#10B981"
            lower="#1E293B"
            hairStyle="curly"
            look="left"
            expression="grin"
          />
        </g>
        <g id="social-a">
          <Person
            x={494}
            y={530}
            scale={0.98}
            skin="#E8B48C"
            hair="#78350F"
            shirt="#F59E0B"
            lower="#334155"
            hairStyle="bob"
            look="right"
            expression="grin"
          />
        </g>

        <g id="social-heart">
          <path
            d="M 0 12 C -20 -2 -18 -20 -6 -20 C 0 -20 4 -15 6 -11 C 9 -16 14 -20 20 -19 C 33 -17 33 0 12 14 Z"
            transform="translate(600 96)"
            fill="#FB7185"
          />
        </g>
        <g id="social-heart-two">
          <path
            d="M 0 8 C -13 -1 -12 -13 -4 -13 C 0 -13 3 -10 4 -7 C 6 -10 9 -13 13 -12 C 21 -11 21 0 8 9 Z"
            transform="translate(660 58) scale(0.8)"
            fill="#F97316"
          />
        </g>

        <ellipse cx="600" cy="540" rx="310" ry="24" fill="#F1F5F9" />

        <g transform="translate(0 -70)">
          <g>
          <rect x="322" y="488" width="556" height="26" rx="13" fill="#FEF3C7" stroke="#1E293B" strokeWidth="2.6" />
          <rect x="322" y="507" width="556" height="13" rx="6.5" fill="#FCD34D" stroke="#1E293B" strokeWidth="2.6" />
          <rect x="366" y="520" width="18" height="44" rx="8" fill="#F59E0B" stroke="#1E293B" strokeWidth="2.4" />
          <rect x="816" y="520" width="18" height="44" rx="8" fill="#F59E0B" stroke="#1E293B" strokeWidth="2.4" />
        </g>

        <g>
          <rect x="432" y="442" width="48" height="47" rx="13" fill="#FB7185" stroke="#1E293B" strokeWidth="2.5" />
          <path d="M 480 454 C 496 454 496 476 480 476" fill="none" stroke="#1E293B" strokeWidth="2.5" />
          <path d="M 448 451 C 454 460 458 460 464 451" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.7" />
        </g>
        <g>
          <rect x="720" y="442" width="48" height="47" rx="13" fill="#2563EB" stroke="#1E293B" strokeWidth="2.5" />
          <path d="M 720 454 C 704 454 704 476 720 476" fill="none" stroke="#1E293B" strokeWidth="2.5" />
          <path d="M 736 451 C 742 460 746 460 752 451" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.7" />
        </g>

        <path
          id="steam-a"
          d="M 456 432 C 446 416 466 405 456 388"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          id="steam-b"
          d="M 744 432 C 734 416 754 405 744 388"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        <g>
          <ellipse cx="600" cy="476" rx="58" ry="14" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.4" />
          <circle cx="578" cy="464" r="13" fill="#F97316" stroke="#1E293B" strokeWidth="2" />
          <circle cx="600" cy="459" r="14" fill="#EF4444" stroke="#1E293B" strokeWidth="2" />
          <circle cx="622" cy="464" r="12" fill="#84CC16" stroke="#1E293B" strokeWidth="2" />
          <path d="M 600 445 C 604 438 612 437 616 440 C 609 446 604 447 600 445 Z" fill="#16A34A" stroke="#1E293B" strokeWidth="1.6" />
        </g>

        </g>
      </svg>
    </div>
  );
}
