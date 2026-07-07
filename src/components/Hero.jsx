import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/scroll";
import { SITE } from "../data/content";

const WORDS = ["Tiffany", "Gu"];

export default function Hero({ framesRef, ready }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const titleRef = useRef(null);

  /* ---------- canvas frame drawing ---------- */
  const frameIndex = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx2d = canvas.getContext("2d");

    const draw = () => {
      const frames = framesRef.current;
      const img = frames[Math.min(frameIndex.current, frames.length - 1)];
      if (!img) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const vw = img.naturalWidth;
      const vh = img.naturalHeight;
      ctx2d.clearRect(0, 0, cw, ch);

      // Cover the canvas, but never blow the object up more than ~28% past
      // width-fit (the laptop occupies the middle half of the frame, so a
      // side-crop of up to 22% keeps it whole on any viewport). The object
      // sits slightly low to leave headroom for the display type.
      const fitW = cw / vw;
      const scale = Math.min(Math.max(fitW, ch / vh), fitW * 1.28);
      const dw = vw * scale;
      const dh = vh * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2 + ch * 0.07;

      // fill exposed bands by stretching the film's own edge rows, so the
      // junction is continuous by construction and keeps the vignette
      if (dy > 0) {
        ctx2d.drawImage(img, 0, 6, vw, 4, 0, 0, cw, dy + 2);
      }
      if (dy + dh < ch) {
        ctx2d.drawImage(img, 0, vh - 10, vw, 4, 0, dy + dh - 2, cw, ch - (dy + dh) + 2);
      }
      ctx2d.drawImage(img, dx, dy, dw, dh);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      draw();
    };

    canvas._draw = draw;
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [framesRef]);

  /* ---------- scroll choreography ---------- */
  useEffect(() => {
    if (!ready) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    canvas._draw?.();

    const ctx = gsap.context(() => {
      const title = titleRef.current;

      if (reduced) {
        gsap.set(sectionRef.current.querySelectorAll(".hero__letter"), {
          y: 0,
          rotate: 0,
        });
        frameIndex.current = Math.max(0, framesRef.current.length - 1);
        canvas._draw?.();
        return;
      }

      const letters = sectionRef.current.querySelectorAll(".hero__letter");
      const state = { f: 0 };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      // laptop film scrubs across the whole hero
      tl.to(
        state,
        {
          f: 1,
          duration: 1,
          onUpdate: () => {
            const frames = framesRef.current;
            if (!frames.length) return;
            const next = Math.round(state.f * (frames.length - 1));
            if (next !== frameIndex.current) {
              frameIndex.current = next;
              canvas._draw?.();
            }
          },
        },
        0
      );

      // the name tracks in letter by letter
      tl.to(
        letters,
        {
          y: 0,
          rotate: 0,
          duration: 0.3,
          stagger: 0.036,
          ease: "power3.out",
        },
        0.04
      );

      // a slow cinematic push-in as the machine opens
      tl.fromTo(
        canvas.parentElement,
        { scale: 1, transformOrigin: "50% 46%" },
        { scale: 1.06, duration: 1, ease: "none" },
        0
      );

      // the name settles upward as the sculpture takes the stage
      tl.to(title, { y: "-7vh", duration: 0.3, ease: "power2.inOut" }, 0.7);
    }, sectionRef);

    return () => ctx.revert();
  }, [ready, framesRef]);

  /* ---------- markup ---------- */
  let letterCount = 0;

  return (
    <section id="top" ref={sectionRef} className="hero" aria-label="Introduction">
      <div className="hero__sticky">
        <h1 ref={titleRef} className="hero__title">
          <span className="visually-hidden-text" style={{ position: "absolute", left: "-9999px" }}>
            {SITE.name}
          </span>
          {WORDS.map((word, w) => (
            <span key={word} className="hero__word" aria-hidden="true">
              {word.split("").map((ch) => {
                letterCount += 1;
                return (
                  <span key={`${w}-${letterCount}`} className="hero__letter-mask">
                    <span className="hero__letter">{ch}</span>
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <div className="hero__canvas" aria-hidden="true">
          <canvas ref={canvasRef} />
        </div>

        <p className="hero__sub">
          <span className="label">{SITE.role}</span>
          {SITE.subtitle}
        </p>

        <div className="hero__cue" aria-hidden="true">
          <span className="label">Scroll</span>
          <span className="hero__cue-line" />
        </div>
      </div>
    </section>
  );
}
