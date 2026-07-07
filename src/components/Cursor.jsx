import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/scroll";

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [labelText, setLabelText] = useState("");
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const dotX = gsap.quickTo(dotRef.current, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dotRef.current, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ringRef.current, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ringRef.current, "y", { duration: 0.45, ease: "power3.out" });

    const onMove = (e) => {
      setVisible(true);
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };
    const onOver = (e) => {
      const target = e.target.closest("[data-cursor]");
      if (target) {
        setLabelText(target.getAttribute("data-cursor") || "");
        setActive(true);
      }
    };
    const onOut = (e) => {
      if (e.target.closest("[data-cursor]")) setActive(false);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  const hidden = visible ? undefined : { opacity: 0 };

  return (
    <>
      <div ref={dotRef} className="cursor" style={hidden} aria-hidden="true" />
      <div
        ref={ringRef}
        className={`cursor-ring${active ? " is-active" : ""}`}
        style={hidden}
        aria-hidden="true"
      >
        <span>{labelText}</span>
      </div>
    </>
  );
}
