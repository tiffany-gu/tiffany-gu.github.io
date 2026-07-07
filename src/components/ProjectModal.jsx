import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "../lib/scroll";

export default function ProjectModal({ project, onClose, lenis }) {
  const rootRef = useRef(null);
  const closeRef = useRef(null);
  // keep the last project mounted while the exit animation plays
  const [shown, setShown] = useState(null);

  useEffect(() => {
    if (project) setShown(project);
  }, [project]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !shown) return;

    const scrim = root.querySelector(".modal__scrim");
    const panel = root.querySelector(".modal__panel");
    const media = root.querySelector(".modal__media img");
    const body = root.querySelectorAll(".modal__body > *");

    if (project) {
      lenis?.stop();
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.set(root, { visibility: "visible" })
        .to(scrim, { opacity: 1, duration: 0.5 }, 0)
        .fromTo(panel, { xPercent: 101 }, { xPercent: 0, duration: 0.85, ease: "power4.out" }, 0.05)
        .fromTo(media, { scale: 1.18 }, { scale: 1, duration: 1.3 }, 0.1)
        .fromTo(
          body,
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.06 },
          0.3
        );
      closeRef.current?.focus();
      return () => tl.kill();
    }

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        gsap.set(root, { visibility: "hidden" });
        setShown(null);
      },
    });
    tl.to(panel, { xPercent: 101, duration: 0.65 }, 0).to(
      scrim,
      { opacity: 0, duration: 0.5 },
      0.1
    );
    lenis?.start();
    return () => tl.kill();
  }, [project, shown, lenis]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!shown) return null;

  // portal to <body>: the gallery section is pinned (transformed) by
  // ScrollTrigger, which would otherwise trap this fixed overlay in a
  // lower stacking context beneath the nav
  return createPortal(
    <div
      ref={rootRef}
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label={shown.title}
    >
      <div className="modal__scrim" onClick={onClose} />
      <div className="modal__panel">
        <button ref={closeRef} className="modal__close" onClick={onClose}>
          Close
        </button>
        <div className="modal__media">
          <img src={shown.image} alt={shown.tag} />
        </div>
        <div className="modal__body">
          <span className="modal__index">{shown.index}</span>
          <h3 className="modal__title">{shown.title}</h3>
          <p>
            <strong style={{ fontWeight: 400, color: "var(--navy)" }}>{shown.intro}</strong>
          </p>
          {shown.paragraphs.map((text) => (
            <p key={text.slice(0, 24)}>{text}</p>
          ))}
          <dl className="modal__facts">
            {shown.facts.map(([term, detail]) => (
              <div key={term}>
                <dt className="label">{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>,
    document.body
  );
}
