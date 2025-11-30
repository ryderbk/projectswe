import { useEffect, useState } from 'react';

interface CinematicTransitionProps {
  onComplete: () => void;
  duration?: number;
}

export const CinematicTransition = ({ 
  onComplete, 
  duration = 1500 
}: CinematicTransitionProps) => {
  const [phase, setPhase] = useState<'bloom' | 'fade'>('bloom');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase('fade');
    }, duration * 0.6);

    const timer2 = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [duration, onComplete]);

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none"
      role="presentation"
      aria-hidden="true"
    >
      {/* Radial bloom effect */}
      <div 
        className={`absolute inset-0 transition-all ${
          phase === 'bloom' 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-150'
        }`}
        style={{
          background: 'radial-gradient(circle at center, hsl(350 100% 93%) 0%, hsl(0 100% 74% / 0.3) 40%, transparent 70%)',
          transitionDuration: `${duration * 0.6}ms`,
          transitionTimingFunction: 'ease-out',
        }}
      />

      {/* Soft white fade */}
      <div 
        className={`absolute inset-0 bg-background transition-opacity ${
          phase === 'fade' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transitionDuration: `${duration * 0.4}ms`,
          transitionTimingFunction: 'ease-in-out',
        }}
      />
    </div>
  );
};
