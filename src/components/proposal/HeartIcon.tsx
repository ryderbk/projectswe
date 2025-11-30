import { cn } from '@/lib/utils';

interface HeartIconProps {
  className?: string;
  animated?: boolean;
  filled?: boolean;
  size?: number;
}

export const HeartIcon = ({
  className,
  animated = false,
  filled = true,
  size = 24,
}: HeartIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        'text-primary',
        animated && 'animate-heartbeat',
        className
      )}
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
};

export const AnimatedHeartSVG = ({ className }: { className?: string }) => {
  return (
    <svg
      className={cn('w-full h-full', className)}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(0, 100%, 74%)" />
          <stop offset="100%" stopColor="hsl(350, 100%, 70%)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M50 88C50 88 12 60 12 35C12 20 24 10 38 10C44 10 50 14 50 14C50 14 56 10 62 10C76 10 88 20 88 35C88 60 50 88 50 88Z"
        fill="url(#heartGradient)"
        filter="url(#glow)"
        className="animate-heartbeat origin-center"
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      />
    </svg>
  );
};
