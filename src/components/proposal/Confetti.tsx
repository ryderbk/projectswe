import { useEffect, useRef } from 'react';

interface ConfettiPiece {
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  speedX: number;
  speedY: number;
  gravity: number;
}

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

export const Confetti = ({ active, duration = 3000 }: ConfettiProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiRef = useRef<ConfettiPiece[]>([]);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colors = [
      'hsl(0, 100%, 74%)',    // coral
      'hsl(350, 100%, 85%)',  // blush
      'hsl(45, 100%, 70%)',   // gold
      'hsl(0, 0%, 100%)',     // white
      'hsl(330, 100%, 80%)',  // pink
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create confetti pieces
    const createConfetti = (): ConfettiPiece => ({
      x: Math.random() * canvas.width,
      y: -20,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      speedX: (Math.random() - 0.5) * 8,
      speedY: Math.random() * 3 + 2,
      gravity: 0.1,
    });

    // Initialize confetti
    for (let i = 0; i < 80; i++) {
      const piece = createConfetti();
      piece.y = Math.random() * -200;
      confettiRef.current.push(piece);
    }

    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confettiRef.current.forEach((piece) => {
        piece.y += piece.speedY;
        piece.x += piece.speedX;
        piece.speedY += piece.gravity;
        piece.rotation += piece.rotationSpeed;

        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rotation);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size / 3);
        ctx.restore();
      });

      // Remove pieces that are off screen
      confettiRef.current = confettiRef.current.filter(p => p.y < canvas.height + 50);

      if (elapsed < duration || confettiRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      animate();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      confettiRef.current = [];
    };
  }, [active, duration]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden="true"
    />
  );
};
