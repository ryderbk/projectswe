import { useState, useEffect, useRef } from "react";
import song2Path from "@/assets/Song2.mp3";

interface AudioControllerProps {
  audioPath?: string;
}

export const AudioController = ({ audioPath }: AudioControllerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audio2Ref = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<1 | 2>(1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioPath) return;

    const audio1 = new Audio(audioPath);
    const audio2 = new Audio(song2Path);
    audioRef.current = audio1;
    audio2Ref.current = audio2;
    
    audio1.volume = 0.4;
    audio2.volume = 0.4;
    audio2.loop = true;

    audio1.addEventListener("ended", () => {
      setCurrentSong(2);
      audio2.play().catch(() => {});
    });

    const tryPlay = () => {
      audio1
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          const enableOnClick = () => {
            audio1.play().then(() => {
              setIsPlaying(true);
              document.removeEventListener("click", enableOnClick);
            });
          };
          document.addEventListener("click", enableOnClick);
        });
    };

    tryPlay();

    return () => {
      audio1.pause();
      audio2.pause();
      audioRef.current = null;
      audio2Ref.current = null;
    };
  }, [audioPath]);

  if (!audioPath) return null;

  return null;
};
