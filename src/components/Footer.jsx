import { FOOTER_LINKS, SITE } from "../data/content";

export default function Footer() {
  return (
    <footer id="contact" className="footer" aria-label="Contact">
      <div className="footer__cta">
        <span className="label">Have a problem worth building for?</span>
        <br />
        <a className="footer__mail" href={SITE.emailHref}>
          {SITE.email}
        </a>
      </div>
      <div className="footer__row">
        <nav className="footer__links" aria-label="Profiles">
          {FOOTER_LINKS.map((l) => (
            <a
              key={l.label}
              className="footer__link"
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noreferrer" : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <span className="footer__fine">© 2026 Tiffany Gu — Built as a quiet gallery</span>
      </div>
      <div className="footer__name" aria-hidden="true">
        Tiffany Gu
      </div>
    </footer>
  );
}
