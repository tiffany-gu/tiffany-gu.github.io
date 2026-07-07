import { SITE } from "../data/content";

export default function Loader({ progress, done }) {
  const pct = Math.min(100, Math.round(progress * 100));

  return (
    <div className={`loader${done ? " is-done" : ""}`} aria-hidden={done}>
      <div className="loader__mark">
        <div className="loader__name">{SITE.name}</div>
        <div className="label loader__role">{SITE.role}</div>
      </div>
      <div className="loader__count">
        {pct}
        <sup>%</sup>
      </div>
      <div className="loader__bar">
        <i style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
