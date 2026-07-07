import { useEffect, useRef } from "react";
import { gsap } from "../lib/scroll";
import { ABOUT, SITE } from "../data/content";

export default function About({ ready, lenis }) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!ready) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const fades = rootRef.current.querySelectorAll(".fade-up");
      if (reduced) {
        gsap.set(fades, { opacity: 1, y: 0 });
        return;
      }
      gsap.utils.toArray(fades).forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 78%" },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section id="about" ref={rootRef} className="about" aria-label="About Tiffany Gu">
      <div className="about__grid">
        <span className="label about__label">About</span>
        <div className="about__copy">
          {ABOUT.map((html) => (
            <p
              key={html.slice(0, 24)}
              className="fade-up"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ))}
          <div className="about__actions fade-up">
            <button className="btn" onClick={() => lenis?.scrollTo("#work", { duration: 1.6 })}>
              View Work
            </button>
            <a className="btn btn--navy" href={SITE.emailHref}>
              Contact Me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
