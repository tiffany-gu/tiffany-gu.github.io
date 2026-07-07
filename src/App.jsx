import { useEffect, useRef, useState } from "react";
import { createSmoothScroll, ScrollTrigger } from "./lib/scroll";
import { preloadImages } from "./lib/preload";
import { FRAMES, PROJECTS, PILLARS } from "./data/content";
import Loader from "./components/Loader";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import Pillars from "./components/Pillars";
import About from "./components/About";
import Footer from "./components/Footer";
import Grain from "./components/Grain";
import Cursor from "./components/Cursor";

export default function App() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [lenis, setLenis] = useState(null);
  const framesRef = useRef([]);

  useEffect(() => {
    const smooth = createSmoothScroll();
    setLenis(smooth.lenis);
    smooth.lenis.stop();
    window.scrollTo(0, 0);

    const frameUrls = Array.from({ length: FRAMES.count }, (_, i) => FRAMES.path(i));
    const stills = [...PROJECTS.map((p) => p.image), ...PILLARS.map((p) => p.image)];
    let cancelled = false;

    preloadImages([...frameUrls, ...stills], (p) => {
      if (!cancelled) setProgress(p);
    }).then((loaded) => {
      if (cancelled) return;
      framesRef.current = frameUrls.map((u) => loaded.get(u)).filter(Boolean);
      // let the loader show its final frame, then open the doors
      setTimeout(() => {
        if (cancelled) return;
        setReady(true);
        smooth.lenis.start();
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, 450);
    });

    return () => {
      cancelled = true;
      smooth.destroy();
    };
  }, []);

  return (
    <div className={`app${ready ? " is-ready" : ""}`}>
      <Loader progress={progress} done={ready} />
      <Nav lenis={lenis} />
      <main>
        <Hero framesRef={framesRef} ready={ready} />
        <Gallery ready={ready} lenis={lenis} />
        <Pillars ready={ready} />
        <About ready={ready} lenis={lenis} />
      </main>
      <Footer />
      <Grain />
      <Cursor />
    </div>
  );
}
