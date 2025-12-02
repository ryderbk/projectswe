import { useEffect, useRef, useState } from "react";
import { FloatingHearts } from "./FloatingHearts";
import { FloatingSparkles } from "./FloatingSparkles";
import { EnvelopeOpening } from "./EnvelopeOpening";
import { captureAndDownload } from "./screenshotUtils";

interface HandwrittenLetterProps {
  onContinue?: () => void;
}

export default function HandwrittenLetter({ onContinue }: HandwrittenLetterProps) {
  const [mounted, setMounted] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const mountedRef = useRef(false);
  const SMOOTH = 550;

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
  }, []);

  if (!showLetter) {
    return (
      <>
        <FloatingHearts />
        <FloatingSparkles />
        <EnvelopeOpening
          onOpen={() => {
            setShowLetter(true);
          }}
        />
      </>
    );
  }

  return (
    <div className="h-screen w-screen flex items-start justify-center pt-8 pb-8 relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(30 100% 97%) 0%, hsl(350 100% 96%) 60%, hsl(30 100% 97%) 100%)",
        }}
      />

      <FloatingHearts />
      <FloatingSparkles />

      <div
        id="letter-container"
        className="relative z-10 w-[96vw]"
        style={{
          transition: `opacity ${SMOOTH}ms ease, transform ${SMOOTH}ms ease`,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(14px)",
        }}
      >
        <h1 className="font-serif text-4xl md:text-5xl text-foreground text-center mb-6">
          A Letter For You 🤍
        </h1>

        {/* GLASS CARD */}
        <div
          className="handwritten-card mx-auto"
          style={{
            height: "calc(100vh - 120px)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",

            // 🌟 TRUE GLASS MORPHISM STYLE
            background: "rgba(255, 255, 255, 0.35)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",

            borderRadius: "28px",
            border: "1.5px solid rgba(255, 255, 255, 0.4)",
            boxShadow:
              "0 20px 40px rgba(0,0,0,0.08), inset 0 0 40px rgba(255,255,255,0.25)",
          }}
        >
          {/* SCROLL CONTENT AREA */}
          <div
            className="handwritten-scroll"
            style={{
              flex: "1 1 auto",
              overflowY: "auto",
              padding: "2.5rem",

              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>
              {`
                .handwritten-scroll::-webkit-scrollbar { display: none; }
              `}
            </style>

            {/* FLEX COLUMN so button stays at bottom when content is short */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100%",
                justifyContent: "space-between",
              }}
            >
              {/* LETTER CONTENT */}
              <article
                className="prose mx-auto"
                style={{
                  fontFamily:
                    "'Indie Flower', 'Segoe UI Historic', 'Segoe UI', sans-serif",
                  fontSize: "1.28rem",
                  lineHeight: "2.4rem",
                  wordSpacing: "0.15rem",
                  color: "#333",
                  maxWidth: "none",
                }}
              >
                <p>
                  Hii Swethu ma🤍! Eppadi irukku naa panna website? Unakagavye paathu paathu pannen😅. Actual ah un birthday ku indha mari edhachu pannalam nu nenachen aana time ila apo. I hope you loved it❤️. And indha letter la ennoda mind la irukkardha soldren. Namma meet panni romba naal aagudhu laa. I miss you so much chellam🫂. Unnoda Smile😊, Eyes✨, Cute expressions🤗, Holding your hands💗, Meesai😂, Class time eye contacts🫶, Literally elamye miss pandren ma🫂. College epo reopen pannuvanga nu irukku😁. Ipo lam namma munna mari pesika nu feel aagudhu😔. Sila neram misunderstandings varudhu. Enakku unkuda fight pannanum nu endha intention um ila da🙃. Naa sila neram un mood puriyama veladuven but oru naalum unna hurt pannanum nu nenachadhilla di💓. Naa epomye correct ndra mari pesuren nu unakku thonudhu la, thappu nah thappu nu sollu naa correct pannipen. Oru vela naa theriyama edhachu pannita enna asingama thitti puriya vei ma. Don't take it to your mind ma☹️. Nee edho overthink pandra nu nenaikiren. Yosikadha nu solla maaten, But apadi edhachu irundha enkitta open ah sollu ma. Edha irundhalum sollu naa purinjipen🫂🤍. Naa maximum unna purinjika dhan try pannitu dhan irukken. Purila nah apdye vitutadha ma, puriya vei🫂. Enna prechana vandhalum ego paaka maaten😌. Indha mari prechana edhachu varum bothu enakku oru reel niyabagam varum "It is not You vs Me, it is US vs the problem", Idhu correct laa. Nee pandra sila vishiyam enakku hurt aagudhu dhan, ila nu solala, But you are perfect for me ma🤌✨. Adhukku nu hurt pannitye irukadha, konjam achu paavam paaru😅. Life la yaaru vittu koduthu adjust pannikirangalo avanga dha strong couples ku kelvi patturken. Nammalum adhye mari iruppom nu namburen💖. Make sure you make me blush everyday😁. And this is your lovely Mr. Kumarrr (Balli🦎😑) for my cute little Panda Bomma🐼🤍.
                </p>
              </article>

              {/* BUTTON AT THE END */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    captureAndDownload("letter-container", "my-letter.png");
                    setTimeout(() => {
                      setMounted(false);
                      setTimeout(() => onContinue && onContinue(), SMOOTH);
                    }, 100);
                  }}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl shadow text-lg bg-white/40 hover:bg-white/60 transition-all"
                  style={{
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.5)",
                  }}
                >
                  Continue ❤️
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
