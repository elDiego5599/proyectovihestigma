import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';
import { Person } from '../art/Person';
import { Tag } from '../art/Tag';

export function MosquitoScenario() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = gsap.context(() => {
      gsap.set('#mosquito', { x: 414, y: 266, opacity: 0, scale: 1.15 });
      gsap.set('#bite-a, #bite-b', {
        scale: 0.25,
        opacity: 0,
        transformOrigin: 'center center',
      });
      gsap.set('#safe-ring', {
        opacity: 0,
        scale: 0.82,
        transformOrigin: 'center center',
      });

      gsap.to('#mosquito-wing-a, #mosquito-wing-b', {
        scaleY: 0.32,
        rotation: -9,
        transformOrigin: 'center center',
        duration: 0.08,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('#person-a-motion, #person-b-motion', {
        y: -3,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.35,
      });

      const flight = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.5,
        defaults: { ease: 'power2.inOut' },
      });

      flight
        .to('#mosquito', { opacity: 1, duration: 0.35 })
        .to('#bite-a', { scale: 2.4, opacity: 0.9, duration: 0.3 }, 0.2)
        .to('#bite-a', { opacity: 0, duration: 0.4 }, 0.5)
        .to(
          '#mosquito',
          {
            duration: 2.3,
            motionPath: {
              path: [
                { x: 414, y: 266 },
                { x: 500, y: 150 },
                { x: 620, y: 118 },
                { x: 786, y: 266 },
              ],
              curviness: 1.35,
            },
          },
          0.5,
        )
        .to('#bite-b', { scale: 2.4, opacity: 0.9, duration: 0.3 }, 2.6)
        .to('#bite-b', { opacity: 0, duration: 0.4 }, 2.9)
        .to(
          '#safe-ring',
          { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' },
          2.9,
        )
        .to('#mosquito', { opacity: 0, duration: 0.5 }, 3.5)
        .to('#safe-ring', { opacity: 0, duration: 0.6 }, 4.2);
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <div ref={rootRef} className="flex h-full w-full items-center justify-center px-4 py-2">
      <svg
        viewBox="0 0 1200 600"
        className="h-full w-full select-none"
        role="img"
        aria-label="Dos personas conversando. Un mosquito vuela de una persona con VIH a otra persona, pero no transmite el virus."
        preserveAspectRatio="xMidYMid meet"
      >
        <circle cx="310" cy="290" r="225" fill="#FFF1F2" />
        <circle cx="900" cy="290" r="225" fill="#EFF6FF" />
        <circle cx="600" cy="300" r="160" fill="#F8FAFC" />
        <circle cx="246" cy="178" r="14" fill="#FDA4AF" opacity="0.55" />
        <circle cx="986" cy="210" r="11" fill="#93C5FD" opacity="0.7" />
        <circle cx="1064" cy="342" r="16" fill="#BFDBFE" opacity="0.6" />

        <g id="safe-ring">
          <circle
            cx="900"
            cy="292"
            r="192"
            fill="#ECFDF5"
            fillOpacity="0.7"
            stroke="#10B981"
            strokeWidth="3"
            strokeOpacity="0.55"
          />
          <circle cx="900" cy="100" r="9" fill="#10B981" opacity="0.65" />
          <circle cx="742" cy="166" r="7" fill="#10B981" opacity="0.5" />
          <circle cx="1052" cy="404" r="7" fill="#10B981" opacity="0.5" />
        </g>

        <g id="person-a-motion">
          <Person
            x={310}
            y={520}
            scale={1.05}
            skin="#C98A5E"
            hair="#1F2937"
            shirt="#F97316"
            lower="#1E293B"
            hairStyle="short"
            pose="open"
            look="right"
            expression="smile"
          />
        </g>
        <g id="person-b-motion">
          <Person
            x={900}
            y={520}
            scale={1.05}
            flip
            skin="#F2C9A4"
            hair="#7C3F1D"
            shirt="#2563EB"
            lower="#334155"
            hairStyle="bob"
            pose="open"
            look="left"
            expression="smile"
          />
        </g>

        <Tag x={310} y={544} label="Vive con VIH" tone="coral" />
        <Tag x={900} y={544} label="Sin VIH" tone="cobalt" />

        <circle id="bite-a" cx="414" cy="266" r="20" fill="none" stroke="#F43F5E" strokeWidth="3" />
        <circle id="bite-b" cx="786" cy="266" r="20" fill="none" stroke="#2563EB" strokeWidth="3" />

        <g id="mosquito">
          <g fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round">
            <path d="M -16 8 L -34 26 L -40 30" />
            <path d="M -4 9 L -8 30 L -14 34" />
            <path d="M 10 7 L 22 26 L 30 28" />
          </g>
          <ellipse
            id="mosquito-wing-b"
            cx="-4"
            cy="-16"
            rx="26"
            ry="10"
            fill="#BAE6FD"
            fillOpacity="0.85"
            stroke="#0284C7"
            strokeWidth="1.6"
          />
          <ellipse
            id="mosquito-wing-a"
            cx="6"
            cy="-14"
            rx="29"
            ry="10"
            fill="#E0F2FE"
            fillOpacity="0.95"
            stroke="#0284C7"
            strokeWidth="1.6"
          />
          <ellipse cx="-18" cy="3" rx="22" ry="9" fill="#94A3B8" stroke="#1E293B" strokeWidth="2.2" />
          <ellipse cx="-20" cy="2" rx="10" ry="4" fill="#22D3EE" opacity="0.35" />
          <ellipse cx="7" cy="0" rx="12" ry="10" fill="#64748B" stroke="#1E293B" strokeWidth="2.2" />
          <circle cx="23" cy="0" r="8" fill="#1E293B" />
          <circle cx="25" cy="-2" r="3" fill="#38BDF8" />
          <line x1="29" y1="3" x2="56" y2="16" stroke="#1E293B" strokeWidth="2.6" strokeLinecap="round" />
        </g>

        <g fill="none" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" opacity="0.9">
          <path d="M 548 76 C 562 66 578 66 592 76" />
          <path d="M 642 90 C 654 82 668 82 680 90" />
        </g>
      </svg>
    </div>
  );
}
