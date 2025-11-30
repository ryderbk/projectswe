import { useEffect, useRef, useState } from "react";
import { FloatingHearts } from "./FloatingHearts";

interface HandwrittenLetterProps {
  onContinue?: () => void;
}

export default function HandwrittenLetter({ onContinue }: HandwrittenLetterProps) {
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const SMOOTH = 550;

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
  }, []);

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

      <div
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
                  lineHeight: "1.9rem",
                  color: "#333",
                  maxWidth: "none",
                }}
              >
                <p className="mb-4">
                  Hii di chellam 😘... Epadi irukkaa{" "}
                  <span className="text-sm opacity-80">(letter la adhan summa kekuren😜)</span>
                </p>

                <p className="mb-4">
                  Idha naa unakagavye paathu paathu panirken… Ella words um from my heart.
                  Grammar mattum gpt😅. Unakku pudichirku nu namburen😉
                </p>

                <p className="mb-4">
                  Un birthday kye letter eludha nenachen… but time kedaikala. Ipo enakku thonuradha
                  indha digital letter la soldren😊
                </p>

                <p className="mb-4">
                  Indha leave la naa unna romba rommbbaaa miss pandren thangam😞…  
                  Namma munnadi mari konjikardhu ila…  
                  Unnoda smile🤍, meesai🤪, holding your hands, travelling, selfies, cute expressions🫶🏼…  
                  Literally ellamye miss pandren🫂🤍
                </p>

                <p className="mb-4">
                  Ipo lam konjam misunderstandings vara mari irukku😕…  
                  Naa edhachu pesi nee hurt aaviyo nu bayama irukku…  
                  Naa maximum unna purinjipen…  
                  Oru vela purinjikalana… enna asingama thitti puriya veii ma😤.  
                  Purila na vitudadha. Un happiness dhaan enakku mukkiyam🫂😌
                </p>

                <p className="mb-4">
                  Naa pesuradhu epomye correct illa nu unakku feel aagudhu…  
                  But adhu ennoda thappu illa… innoru vela overthinking ah nu therila.  
                  Kandippa namma adha correct pannalam❤️‍🩹
                </p>

                <p className="mb-4">
                  Unakku enna thonuchu naalum enkitta open ah pesu ma…  
                  Naa kepen… Nee evlo pesinalum naa romba santhosama kepen💗  
                  Sila neram un mood puriyama naa kalaipen…  
                  But mind la vechiko… naa ennaikkum unna hurt panna nu decide pannave maaten🫂🫂🫂
                </p>

                <p className="mb-4">
                  Naa unkitta epomye ego paaka maaten😌…  
                  Neeyum apdi dhan nu namburen.  
                  “Problem vs Us”… not “You vs Me”.
                </p>

                <p className="mb-4">
                  Nee pandra sila vishiyam enakku hurt aagudhu nu solala…  
                  But for me… you are perfect🤌🏼✨
                </p>

                <p className="mb-4">
                  Naa epomye un kooda dhaan iruppen🫂…  
                  Neeyum iruppa nu namburen🤍
                </p>

                <p className="mb-4">
                  Make sure you make me blush everyday😁… I love blushing because of you🥰
                </p>

                <p className="text-2xl font-semibold mt-6 mb-2">
                  I Love You Infinity🤍
                </p>

                <p className="text-xl mb-6">Let us hold our hands forever🫂🤍</p>

                <div className="flex items-center gap-4 mb-6">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-pink-100">
                    ❤️
                  </span>
                  <span style={{ fontSize: "1.125rem" }}>
                    — Your Mr.kumarrr🫶🏼 (balli🥲) for My Panda Bomma🐼
                  </span>
                </div>
              </article>

              {/* BUTTON AT THE END */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setMounted(false);
                    setTimeout(() => onContinue && onContinue(), 180);
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
