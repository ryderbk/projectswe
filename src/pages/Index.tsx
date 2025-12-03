import React, { useState, useEffect } from "react";
import { ProposalApp } from "@/components/proposal/ProposalApp";
import couplePhoto from "@/assets/couple-photo.jpg";
import bgMusic from "@/assets/Song.mp3";
import bgMusic2 from "@/assets/Song2.mp3";
import envelopeImage from "@/assets/envelope.png";
import { preloadAllMedia } from "@/utils/mediaPreloader";

import { InitialSetup } from "@/components/InitialSetup";

const Index = () => {
  // whether the user passed the initial setup
  const [setupDone, setSetupDone] = useState(false);

  // Preload all critical assets immediately when Index mounts
  useEffect(() => {
    preloadAllMedia([
      couplePhoto,
      envelopeImage,
      bgMusic,
      bgMusic2,
    ]);
  }, []);

  // optional: store whether fullscreen was requested/succeeded
  const [fullscreenWasRequested, setFullscreenWasRequested] = useState<boolean | null>(null);

  const handleContinue = (opts?: { fullscreenRequested: boolean }) => {
    setFullscreenWasRequested(opts?.fullscreenRequested ?? false);
    setSetupDone(true);
  };

  return (
    <>
      {!setupDone ? (
        // show the new initial setup page first
        <InitialSetup onContinue={handleContinue} />
      ) : (
        // once done, render your existing app unchanged
        <main id="main-content">
          <ProposalApp photoPath={couplePhoto} audioPath={bgMusic} />
        </main>
      )}
    </>
  );
};

export default Index;
