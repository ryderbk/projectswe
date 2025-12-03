import React, { useEffect, useRef, useState } from "react";
import { AnimatedHeartSVG } from "./HeartIcon";

interface HandwrittenLetterProps {
  onContinue?: () => void;
}

export default function HandwrittenLetter({ onContinue }: HandwrittenLetterProps) {
  const [visible, setVisible] = useState(false);
  const mountedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Reveal only once (strict mode safe) and wait two frames to avoid flash
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Soft romantic gradient background (same as TenThings) */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(30 100% 97%) 0%, hsl(350 100% 96%) 60%, hsl(30 100% 97%) 100%)",
        }}
        aria-hidden
      />

      {/* Content card */}
      <div
        ref={containerRef}
        className={`relative z-10 max-w-2xl w-full text-center transition-all duration-[550ms] ease-[cubic-bezier(.2,.9,.2,1)]
          transform ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-[0.992]"}`}
      >
        <div className="glass-card p-10 rounded-2xl shadow-xl">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-6">A Letter For You 🤍</h1>

          <article
            className="prose prose-lg prose-amber mx-auto leading-relaxed text-left"
            // handwritten style font-family (use a fallback stack if Indie Flower isn't loaded)
            style={{ fontFamily: "'Indie Flower', 'Segoe UI Historic', 'Segoe UI', sans-serif" } as React.CSSProperties}
          >
            <p className="text-xl md:text-2xl tracking-tight">
              Hii di chellam <span className="inline-block">😘</span>... Epadi irukkaa{" "}
              <span className="text-sm opacity-80">(letter la adhan summa kekuren😜)</span>
            </p>

            <p>
              Idha naa unakagavye paathu paathu panirken, Ella words um from my heart grammar mattum gpt😅. Unakku pudichirku nu
              namburen😉
            </p>

            <p>
              Un birthday kye oru letter eludhanum nu nenachen but time kedaikala. Ipo enakku thonuradha indha digital letter la
              soldren😊
            </p>

            <p>
              Indha leave la naa unna romba rommbbaaa miss pandren thangam😞.... Leave seekaram mudinja nallarukkum😅. Namma munnadi
              mari konjikardhu ila... adha miss pandren, unnoda smile🤍, meesai🤪, holding your hands, travelling with you, selfies,
              unnoda cute expressions🫶🏼, literally ellamye miss pandren🫂🤍
            </p>

            <p>
              Ipo lam apo apo konjam miss understanding vara mari irukku😕.... Naa edhachu pesi nee hurt aaviyo nu bayama irukku.... Naa
              maximum unna purinjipen.... Oru vela purinjikalana enna asingama thitti puriya veii ma😤. Purila nah vitudadha. Unnoda
              happiness enakku romba mukkiyam adhukaga naa enna venalum pannuven🫂😌
            </p>

            <p>
              Naa pesuradhu epomye correct indra mari unakku feel aagudhu nu nenaikiren. But adhu ennoda thappu ila unnoda overthinking ah
              nu therila. Kandippa namma adha manifest pannalam❤️‍🩹
            </p>

            <p>
              Unakku enna thonuchu naalum enkitta open ah pesu ma. Naa kepen. Nee evlo pesinalum kepen💗. Sila neram un mood theriyama
              naa kalaipen... But mind la vechikoo naa ennaikkum unna hurt pannanum ndra intension la pesa maaten🫂🫂🫂
            </p>

            <p>
              Naa unkitta epomye ego paaka maaten😌. Neeyum apdi dhan nu namburen. When there is a problem it should be the "problem vs
              us" not "you vs me" (reels la dhan paathen but unmai) idha nalla purinjiko
            </p>

            <p>
              Nee pandra sila vishiyam enakku hurt aagudhu dhan ila nu solala. May be you think you are toxic. But for me you are
              perfect🤌🏼✨
            </p>

            <p>
              Naa epomye unkudavye iruppen🫂. Neeyum iruppa nu namburen🤍
            </p>

            <p>Make sure you make me blush everyday😁. I love blushing because of you🥰.</p>

            <p className="text-lg md:text-xl font-semibold mt-4">I Love You Infinity🤍</p>
            <p>Let us hold our hands forever🫂🤍</p>

            <div className="mt-6 flex items-center gap-3">
              <AnimatedHeartSVG className="w-7 h-7" />
              <span className="text-sm opacity-90">This is Your Mr.kumarrr🫶🏼 (balli🥲) for My Panda Bomma🐼.</span>
            </div>
          </article>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => {
                // subtle pressed effect, then continue
                if (containerRef.current) containerRef.current.style.transform = "scale(0.995)";
                setTimeout(() => onContinue && onContinue(), 260);
              }}
              className="btn-romantic inline-flex items-center gap-2 px-5 py-2 rounded-xl shadow-sm text-sm font-medium transition-transform active:scale-95"
            >
              Continue ❤️
            </button>

            <button
              onClick={() => setVisible(false)}
              className="text-xs opacity-80 hover:opacity-100 mt-3 sm:mt-0"
              aria-label="Dismiss letter"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
