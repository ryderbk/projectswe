import { useState, useCallback, useEffect } from "react";
import { LandingStage } from "./LandingStage";
import { Timeline } from "./Timeline";
import { MemoryCarousel } from "./MemoryCarousel";
import { ReasonsForever } from "./ReasonsForever";
import { ThreeWords } from "./ThreeWords";
import { QuizPage } from "./QuizPage";
import { PickOne } from "./PickOne";
import { SpinWheel } from "./SpinWheel";
import { PrayerPage } from "./PrayerPage";
import { VowPage } from "./VowPage";
import { ProposalRevealStage } from "./ProposalRevealStage";
import { FinalStage } from "./FinalStage";
import { AudioController } from "./AudioController";
import HandwrittenLetter from "./HandwrittenLetter";
import memoryA from "@/assets/memories/a.png";
import memoryB from "@/assets/memories/b.png";
import memoryC from "@/assets/memories/c.png";
import memoryD from "@/assets/memories/D.jpg";
import memoryE from "@/assets/memories/e.png";
import memoryF from "@/assets/memories/F.jpg";
import memoryG from "@/assets/memories/g.png";
import memoryH from "@/assets/memories/H.mp4";
import memoryI from "@/assets/memories/I.mp4";
import memoryJ from "@/assets/memories/J.mp4";
import memoryK from "@/assets/memories/K.mp4";

type Stage =
  | "landing"
  | "timeline"
  | "memorycarousel"
  | "reasonsforever"
  | "threewords"
  | "quiz"
  | "pickone"
  | "spinwheel"
  | "prayer"
  | "vow"
  | "handwritten"
  | "proposal"
  | "final";

interface ProposalAppProps {
  photoPath?: string;
  audioPath?: string;
  startStage?: Stage;
}

export const ProposalApp = ({
  photoPath = "/placeholder.svg",
  audioPath,
  startStage = "landing",
}: ProposalAppProps) => {
  const [stage, setStage] = useState<Stage>(startStage);

  // Memory carousel photos in alphabetical order
  const memories = [
    memoryA,
    memoryB,
    memoryC,
    memoryD,
    memoryE,
    memoryF,
    memoryG,
    memoryH,
    memoryI,
    memoryJ,
    memoryK,
  ];

  // Random captions for each memory
  const memoryCaptions = [
    "Every moment with you is a treasure I hold close to my heart.",
    "You make ordinary days feel extraordinary.",
    "In your eyes, I found my home.",
    "Laughter is our love language.",
    "Together, we paint the world in colors.",
    "You are my greatest adventure.",
    "Every smile with you is a memory I'll cherish forever.",
    "Our story is my favorite song.",
    "You make my heart skip a beat.",
    "In a world full of chaos, you're my peace.",
    "Forever isn't long enough with you.",
  ];

  // Flow handlers (updated: PickOne -> SpinWheel)
  const handleLandingContinue = useCallback(() => setStage("timeline"), []);
  const handleTimelineContinue = useCallback(() => setStage("memorycarousel"), []);
  const handleMemoryCarouselContinue = useCallback(() => setStage("reasonsforever"), []);
  const handleReasonsForeverContinue = useCallback(() => setStage("threewords"), []);
  const handleThreeWordsContinue = useCallback(() => setStage("quiz"), []);
  const handleQuizContinue = useCallback(() => setStage("pickone"), []);
  const handlePickOneContinue = useCallback(() => setStage("spinwheel"), []);
  const handleSpinWheelContinue = useCallback(() => setStage("prayer"), []);
  const handlePrayerContinue = useCallback(() => setStage("vow"), []);
  // New: after Vow -> show HandwrittenLetter
  const handleVowContinue = useCallback(() => setStage("handwritten"), []);
  // Handwritten -> ProposalRevealStage
  const handleHandwrittenContinue = useCallback(() => setStage("proposal"), []);
  const handleProposalAccept = useCallback(() => {
    // transition to final stage
    setStage("final");
  }, []);
  const handleFinalDone = useCallback(() => {
    /* final end — you can route elsewhere or show a share UI */
  }, []);

  // Create stage handlers mapping
  const stageHandlers: Record<Stage, () => void> = {
    landing: handleLandingContinue,
    timeline: handleTimelineContinue,
    memorycarousel: handleMemoryCarouselContinue,
    reasonsforever: handleReasonsForeverContinue,
    threewords: handleThreeWordsContinue,
    quiz: handleQuizContinue,
    pickone: handlePickOneContinue,
    spinwheel: handleSpinWheelContinue,
    prayer: handlePrayerContinue,
    vow: handleVowContinue,
    handwritten: handleHandwrittenContinue,
    proposal: handleProposalAccept,
    final: handleFinalDone,
  };

  // Keyboard navigation: Enter triggers focused button, Shift skips to next stage
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const activeButton = document.querySelector("button:focus") as
          | HTMLButtonElement
          | null;
        if (activeButton) activeButton.click();
      }
      // Shift key skips to next stage (for preview)
      if (e.shiftKey && e.key === "Shift") {
        const handler = stageHandlers[stage];
        if (handler) handler();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stage, stageHandlers]);

  // Numeric stage mapping for AudioController (tweak if you want different audio behaviour)
  const stageNumber = {
    landing: 1,
    timeline: 2,
    memorycarousel: 2,
    reasonsforever: 2,
    threewords: 2,
    quiz: 2,
    pickone: 2,
    spinwheel: 2,
    prayer: 2,
    vow: 3,
    handwritten: 3,
    proposal: 3,
    final: 4,
  }[stage];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {stage === "landing" && <LandingStage onContinue={handleLandingContinue} />}

      {stage === "timeline" && <Timeline onContinue={handleTimelineContinue} />}

      {stage === "memorycarousel" && (
        <MemoryCarousel onContinue={handleMemoryCarouselContinue} photos={memories} captions={memoryCaptions} />
      )}

      {stage === "reasonsforever" && <ReasonsForever onContinue={handleReasonsForeverContinue} />}

      {stage === "threewords" && <ThreeWords onContinue={handleThreeWordsContinue} />}

      {stage === "quiz" && <QuizPage onContinue={handleQuizContinue} />}

      {stage === "pickone" && <PickOne onContinue={handlePickOneContinue} />}

      {stage === "spinwheel" && <SpinWheel onContinue={handleSpinWheelContinue} />}

      {stage === "prayer" && <PrayerPage onContinue={handlePrayerContinue} />}

      {stage === "vow" && <VowPage onContinue={handleVowContinue} />}

      {stage === "handwritten" && <HandwrittenLetter onContinue={handleHandwrittenContinue} />}

      {stage === "proposal" && <ProposalRevealStage onAccept={handleProposalAccept} />}

      {stage === "final" && <FinalStage photoPath={photoPath} />}

      {/* Audio controller */}
      {audioPath && <AudioController audioPath={audioPath} />}

      {/* accessibility skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg z-50"
      >
        Skip to content
      </a>
    </div>
  );
};

export default ProposalApp;
