import { useState, useEffect, useRef } from "react";
import song2Path from "@/assets/Song2.mp3";
import song3Path from "@/assets/Song3.mp3";

interface AudioControllerProps {
  audioPath?: string;
}

export const AudioController = ({ audioPath }: AudioControllerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audio2Ref = useRef<HTMLAudioElement | null>(null);
  const audio3Ref = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<1 | 2 | 3>(1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioPath) return;

    const audio1 = new Audio(audioPath);
    const audio2 = new Audio(song2Path);
    const audio3 = new Audio(song3Path);
    audioRef.current = audio1;
    audio2Ref.current = audio2;
    audio3Ref.current = audio3;
    
    audio1.volume = 0.4;
    audio2.volume = 0.4;
    audio3.volume = 0.4;
    audio3.loop = true;

    audio1.addEventListener("ended", () => {
      setCurrentSong(2);
      audio2.play().catch(() => {});
    });

    audio2.addEventListener("ended", () => {
      setCurrentSong(3);
      audio3.play().catch(() => {});
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
      audio3.pause();
      audioRef.current = null;
      audio2Ref.current = null;
      audio3Ref.current = null;
    };
  }, [audioPath]);

  if (!audioPath) return null;

  return null;
};
