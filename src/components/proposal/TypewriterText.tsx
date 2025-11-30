import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

export const TypewriterText = ({
  text,
  speed = 50,
  delay = 0,
  className = '',
  onComplete,
}: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setDisplayedText(text);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let index = 0;

    const startTyping = () => {
      const typeChar = () => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
          timeoutId = setTimeout(typeChar, speed);
        } else {
          setIsComplete(true);
          onComplete?.();
        }
      };

      timeoutId = setTimeout(typeChar, delay);
    };

    startTyping();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text, speed, delay, onComplete]);

  // Blink cursor
  useEffect(() => {
    if (isComplete) {
      const blinkInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);

      // Stop blinking after a while
      const stopTimeout = setTimeout(() => {
        clearInterval(blinkInterval);
        setShowCursor(false);
      }, 3000);

      return () => {
        clearInterval(blinkInterval);
        clearTimeout(stopTimeout);
      };
    }
  }, [isComplete]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && <span className="typewriter-cursor" />}
      {isComplete && showCursor && <span className="typewriter-cursor" />}
    </span>
  );
};
