'use client';

import { useEffect, useRef, useState } from 'react';
import { Users, Star, Award, Clock } from 'lucide-react';

const stats = [
  { icon: Users, value: 5000, suffix: '+', label: 'Happy Patients', color: 'text-teal-600' },
  { icon: Star, value: 4.9, suffix: '/5', label: 'Average Rating', color: 'text-amber-500', decimal: true },
  { icon: Award, value: 15, suffix: '+', label: 'Years Experience', color: 'text-cyan-600' },
  { icon: Clock, value: 98, suffix: '%', label: 'On-Time Appointments', color: 'text-emerald-600' },
];

function Counter({ target, suffix, decimal, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = decimal
              ? Math.round(target * eased * 10) / 10
              : Math.round(target * eased);
            setCount(current);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, decimal]);

  return (
    <span ref={ref}>
      {decimal ? count.toFixed(1) : count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="relative py-20 bg-white border-b border-slate-100 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-cyan-50/30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map(({ icon: Icon, value, suffix, label, color, decimal }) => (
            <div
              key={label}
              className="group flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-7 h-7 ${color}`} strokeWidth={1.75} />
              </div>
              <p className={`text-4xl font-black ${color} mb-1`}>
                <Counter target={value} suffix={suffix} decimal={decimal} />
              </p>
              <p className="text-slate-500 text-sm font-semibold leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
