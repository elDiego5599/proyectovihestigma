import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { Person } from '../art/Person';

export function HygieneScenario() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = gsap.context(() => {
      gsap.set('.hyg-sweat', { opacity: 0, y: -14, scale: 0.7, transformOrigin: 'center center' });
      gsap.set('#hyg-tear', { opacity: 0, y: -6, scale: 0.7, transformOrigin: 'center center' });
      gsap.set('#hyg-tap-drop', { opacity: 0, y: -10, scale: 0.7, transformOrigin: 'center center' });
      gsap.set('#hyg-ripple', { opacity: 0, scale: 0.4, transformOrigin: 'center center' });

      gsap.to('#hyg-runner-motion', {
        y: -6,
        rotation: 1.2,
        duration: 0.62,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        transformOrigin: '50% 100%',
      });

      gsap.to('.hyg-sweat', {
        opacity: 1,
        y: 26,
        scale: 1,
        duration: 1.15,
        repeat: -1,
        repeatDelay: 0.35,
        ease: 'power1.in',
        stagger: 0.28,
      });

      gsap.to('#hyg-tear', {
        opacity: 1,
        y: 20,
        duration: 1.6,
        repeat: -1,
        repeatDelay: 1.5,
        ease: 'power1.in',
        delay: 0.7,
      });

      gsap.to('#hyg-tap-drop', {
        opacity: 1,
        y: 42,
        duration: 0.85,
        repeat: -1,
        repeatDelay: 0.9,
        ease: 'power2.in',
      });
      gsap.to('#hyg-ripple', {
        opacity: 0.55,
        scale: 1.5,
        duration: 1.1,
        repeat: -1,
        repeatDelay: 0.65,
        ease: 'power1.out',
        delay: 0.8,
      });

      gsap.to('#hyg-towel', {
        rotation: 1.4,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        transformOrigin: '50% 0%',
      });

      gsap.to('#hyg-mirror-shine', {
        opacity: 0.9,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
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
        aria-label="Una persona hace ejercicio y suda. A su lado hay un baño limpio con lavamanos, espejo y toalla. El sudor y los baños públicos no transmiten el VIH."
        preserveAspectRatio="xMidYMid meet"
      >
        <circle cx="360" cy="300" r="228" fill="#FFFBEB" />
        <circle cx="880" cy="304" r="232" fill="#EFF6FF" />
        <circle cx="300" cy="176" r="13" fill="#FCD34D" opacity="0.55" />
        <circle cx="1084" cy="166" r="12" fill="#93C5FD" opacity="0.6" />

        <g id="hyg-runner-motion">
          <Person
            x={368}
            y={540}
            scale={1.12}
            skin="#8C5A3C"
            hair="#111827"
            shirt="#F59E0B"
            lower="#2563EB"
            hairStyle="curly"
            pose="run"
            shorts
            stride
            expression="grin"
            look="right"
          />
        </g>

        <g transform="translate(26 6)">
          <g id="hyg-tear">
            <path
              d="M 320 178 C 320 178 310 192 310 199 C 310 204 314 208 320 208 C 326 208 330 204 330 199 C 330 192 320 178 320 178 Z"
              fill="#7DD3FC"
              stroke="#0284C7"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </g>
        </g>

        <g className="hyg-sweat">
          <path
            d="M 262 132 C 262 132 251 148 251 156 C 251 162 256 166 262 166 C 268 166 273 162 273 156 C 273 148 262 132 262 132 Z"
            fill="#BAE6FD"
            stroke="#0284C7"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
        <g className="hyg-sweat">
          <path
            d="M 432 196 C 432 196 422 210 422 217 C 422 222 426 226 432 226 C 438 226 442 222 442 217 C 442 210 432 196 432 196 Z"
            fill="#BAE6FD"
            stroke="#0284C7"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
        <g className="hyg-sweat">
          <path
            d="M 236 268 C 236 268 227 280 227 286 C 227 291 231 294 236 294 C 241 294 245 291 245 286 C 245 280 236 268 236 268 Z"
            fill="#BAE6FD"
            stroke="#0284C7"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
        <g className="hyg-sweat">
          <path
            d="M 486 316 C 486 316 477 328 477 334 C 477 339 481 342 486 342 C 491 342 495 339 495 334 C 495 328 486 316 486 316 Z"
            fill="#BAE6FD"
            stroke="#0284C7"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>

        <g>
          <g stroke="#DBEAFE" strokeWidth="2" opacity="0.85">
            <path d="M 754 176 H 1006 M 754 236 H 1006 M 754 296 H 1006 M 754 356 H 1006" />
            <path d="M 814 140 V 392 M 874 140 V 392 M 934 140 V 392" />
          </g>

          <rect x="768" y="118" width="224" height="164" rx="22" fill="#FFFFFF" stroke="#2563EB" strokeWidth="5" />
          <rect x="786" y="136" width="188" height="128" rx="13" fill="#DBEAFE" stroke="#1E293B" strokeWidth="2.4" />
          <path
            id="hyg-mirror-shine"
            d="M 816 246 L 872 152"
            stroke="#FFFFFF"
            strokeWidth="14"
            strokeOpacity="0.6"
            strokeLinecap="round"
          />
          <path d="M 892 246 L 930 184" stroke="#FFFFFF" strokeWidth="7" strokeOpacity="0.45" strokeLinecap="round" />

          <rect x="770" y="368" width="344" height="24" rx="12" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.6" />
          <path
            d="M 784 392 C 784 438 806 462 854 470 L 1030 470 C 1078 462 1100 438 1100 392 Z"
            fill="#FFFFFF"
            stroke="#1E293B"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <ellipse cx="942" cy="418" rx="120" ry="34" fill="#E0F2FE" stroke="#1E293B" strokeWidth="2.4" />
          <ellipse cx="942" cy="422" rx="88" ry="22" fill="#BAE6FD" />
          <path d="M 1010 424 A 68 18 0 0 0 874 424" fill="none" stroke="#7DD3FC" strokeWidth="4" strokeLinecap="round" />

          <rect x="1012" y="470" width="58" height="58" rx="10" fill="#F8FAFC" stroke="#1E293B" strokeWidth="2.6" />
          <rect x="826" y="520" width="232" height="18" rx="9" fill="#F1F5F9" stroke="#1E293B" strokeWidth="2.6" />

          <path
            d="M 940 366 V 332 C 940 316 924 314 918 326"
            fill="none"
            stroke="#1E293B"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 902 330 V 344"
            fill="none"
            stroke="#1E293B"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <rect x="888" y="344" width="28" height="10" rx="5" fill="#60A5FA" stroke="#1E293B" strokeWidth="2" />
          <circle id="hyg-tap-drop" cx="902" cy="360" r="6" fill="#7DD3FC" stroke="#0284C7" strokeWidth="1.6" />
          <ellipse id="hyg-ripple" cx="902" cy="420" rx="18" ry="6" fill="none" stroke="#38BDF8" strokeWidth="2.6" />

          <g transform="translate(600 232)">
            <g id="hyg-towel">
            <rect x="-10" y="-6" width="188" height="9" rx="4.5" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2" />
            <path
              d="M 6 0 L 8 152 C 8 160 18 164 28 164 C 38 164 48 160 48 152 L 50 0 Z"
              fill="#34D399"
              stroke="#1E293B"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path d="M 16 34 H 42 M 16 52 H 42 M 16 70 H 42" stroke="#ECFDF5" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.75" />
            <path
              d="M 62 0 L 64 138 C 64 146 72 150 81 150 C 90 150 98 146 98 138 L 100 0 Z"
              fill="#60A5FA"
              stroke="#1E293B"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path d="M 72 28 H 90 M 72 44 H 90 M 72 60 H 90" stroke="#EFF6FF" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.8" />
            </g>
          </g>
        </g>

        <g fill="none" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" opacity="0.85">
          <path d="M 588 108 C 602 98 618 98 632 108" />
          <path d="M 626 136 C 638 128 652 128 664 136" />
        </g>
      </svg>
    </div>
  );
}
