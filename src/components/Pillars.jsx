import { useEffect, useRef } from "react";
import { gsap } from "../lib/scroll";
import { PILLARS } from "../data/content";

export default function Pillars({ ready }) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!ready) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.utils.toArray(rootRef.current.querySelectorAll(".pillar")).forEach((el) => {
        const media = el.querySelector(".pillar__media");
        const img = el.querySelector(".pillar__media img");
        const fades = el.querySelectorAll(".fade-up");

        if (reduced) {
          gsap.set(fades, { opacity: 1, y: 0 });
          gsap.set(media, { clipPath: "inset(0% 0 0 0)" });
          gsap.set(img, { scale: 1 });
          return;
        }

        gsap.to(fades, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 64%" },
        });

        gsap.fromTo(
          media,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.4,
            ease: "power4.inOut",
            scrollTrigger: { trigger: el, start: "top 60%" },
          }
        );

        gsap.fromTo(
          img,
          { scale: 1.14, yPercent: -4 },
          {
            scale: 1,
            yPercent: 4,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section id="research" ref={rootRef} className="pillars" aria-label="Research pillars">
      <div className="section-head">
        <h2>
          Research, <em>three ways</em>
        </h2>
        <span className="label">The pillars beneath the work</span>
      </div>
      {PILLARS.map((p, i) => (
        <article key={p.no} className="pillar">
          <span className="pillar__no fade-up">Pillar {p.no}</span>
          <div className="pillar__body">
            <h3 className="fade-up">{p.title}</h3>
            <p className="fade-up">{p.copy}</p>
            <div className="pillar__keys fade-up">
              {p.keys.map((k) => (
                <span key={k}>{k}</span>
              ))}
            </div>
          </div>
          <div className="pillar__media">
            <img src={p.image} alt={p.alt} loading={i === 0 ? "eager" : "lazy"} />
          </div>
        </article>
      ))}
    </section>
  );
}
