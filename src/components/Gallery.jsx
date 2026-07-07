import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { PROJECTS } from "../data/content";
import ProjectModal from "./ProjectModal";

// three.js + troika only ship to desktop visitors, as their own chunk
const ArcStage = lazy(() => import("./ArcStage"));

const DESKTOP_QUERY = "(min-width: 900px)";

export default function Gallery({ ready, lenis }) {
  const sectionRef = useRef(null);
  const [open, setOpen] = useState(null);
  const [desktop, setDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e) => setDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <section id="work" ref={sectionRef} className="work" aria-label="Selected work">
      <div className="work__pin">
        <div className="section-head work__head">
          <h2>
            Selected <em>Work</em>
          </h2>
          <span className="label">A curated walk — four rooms</span>
        </div>

        {desktop ? (
          <Suspense fallback={<div className="stage" />}>
            <ArcStage sectionRef={sectionRef} lenis={lenis} ready={ready} onOpen={setOpen} />
          </Suspense>
        ) : (
          <div className="work__track">
            {PROJECTS.map((p) => (
              <article
                key={p.id}
                className="card"
                data-cursor="Open"
                onClick={() => setOpen(p)}
                onKeyDown={(e) => e.key === "Enter" && setOpen(p)}
                tabIndex={0}
                role="button"
                aria-label={`${p.title} — ${p.tag}`}
              >
                <div className="card__frame">
                  <img src={p.image} alt={p.tag} loading="eager" />
                  <div className="card__veil" />
                  <span className="card__open">View</span>
                </div>
                <div className="card__meta">
                  <div>
                    <h3 className="card__title">{p.title}</h3>
                    <div className="label card__tag">{p.tag}</div>
                  </div>
                  <span className="card__index">{p.index}</span>
                </div>
              </article>
            ))}
            <div className="work__end">
              <span className="label">Tiffany Gu — Selected Work</span>
            </div>
          </div>
        )}
      </div>

      <ProjectModal project={open} onClose={() => setOpen(null)} lenis={lenis} />
    </section>
  );
}
