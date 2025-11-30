import { useState, useEffect, useRef } from "react";

interface AudioControllerProps {
  audioPath?: string;
}

export const AudioController = ({ audioPath }: AudioControllerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioPath) return;

    const audio = new Audio(audioPath);
    audioRef.current = audio;
    audio.loop = true;
    audio.volume = 0.4;

    // Try autoplay immediately
    const tryPlay = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay blocked → wait for first click anywhere
          const enableOnClick = () => {
            audio.play().then(() => {
              setIsPlaying(true);
              document.removeEventListener("click", enableOnClick);
            });
          };
          document.addEventListener("click", enableOnClick);
        });
    };

    tryPlay();

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [audioPath]);

  if (!audioPath) return null;

  return null; // no buttons, no UI — just autoplay
};
