import { useEffect, useState } from "react";

const LINKS = [
  { label: "Work", target: "#work" },
  { label: "Research", target: "#research" },
  { label: "About", target: "#about" },
  { label: "Contact", target: "#contact" },
];

export default function Nav({ lenis }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!lenis) return;
    let last = 0;
    const onScroll = ({ scroll }) => {
      // hide when travelling down past the hero top, reveal on any upward intent
      setHidden(scroll > last + 2 && scroll > window.innerHeight * 0.5);
      if (Math.abs(scroll - last) > 2) last = scroll;
    };
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  const go = (e, target) => {
    e.preventDefault();
    lenis?.scrollTo(target, { duration: 1.6 });
  };

  return (
    <header className={`nav${hidden ? " nav--hidden" : ""}`}>
      <a
        className="nav__logo"
        href="#top"
        onClick={(e) => go(e, 0)}
        aria-label="Tiffany Gu — back to top"
      >
        TG
      </a>
      <nav className="nav__links" aria-label="Primary">
        {LINKS.map((l) => (
          <a
            key={l.label}
            className="nav__link"
            href={l.target}
            onClick={(e) => go(e, l.target)}
          >
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
