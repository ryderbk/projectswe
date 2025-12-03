import { HeartIcon } from './HeartIcon';

interface LandingStageProps {
  onContinue: () => void;
}

export const LandingStage = ({ onContinue }: LandingStageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">

      {/* Soft romantic background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(30 100% 97%) 0%, hsl(350 100% 96%) 60%, hsl(30 100% 97%) 100%)",
        }}
        aria-hidden
      />

      {/* Content */}
      <div 
        className="relative z-10 glass-card rounded-2xl p-8 md:p-12 max-w-md w-full text-center animate-scale-in"
        role="main"
        aria-labelledby="landing-title"
      >
        {/* Decorative hearts */}
        <div className="flex justify-center gap-2 mb-6">
          <HeartIcon size={20} className="text-coral-light animate-float" />
          <HeartIcon size={28} className="text-primary animate-float-slow" />
          <HeartIcon size={20} className="text-coral-light animate-float-delayed" />
        </div>

        <h1 
          id="landing-title"
          className="font-serif text-hero text-foreground mb-4"
        >
          A Little Something For You{' '}
          <span className="inline-block" role="img" aria-label="heart">❤️</span>
        </h1>

        <p className="text-muted-foreground text-lg mb-8">
          (Can we go ma? I promise it's worth it.)
        </p>

        <button
          onClick={onContinue}
          className="btn-romantic group"
          aria-label="Continue to see the surprise"
        >
          <span className="flex items-center gap-2">
            Click Me
            <span 
              className="text-xl group-hover:scale-125 transition-transform duration-200"
              role="img" 
              aria-label="sparkle"
            >
              ✨
            </span>
          </span>
        </button>

        {/* Subtle line */}
        <div className="mt-8 flex justify-center">
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default LandingStage;
