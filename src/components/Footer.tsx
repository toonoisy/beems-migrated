import { Link } from 'react-router-dom';
import './Footer.css';

interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

// Social links, phone/email/address and the privacy & accessibility links
// mirror what was published in the original Wix site's footer. The
// original social icons pointed at Wix's own placeholder profiles rather
// than a real BEEMS account — replace these hrefs with the organisation's
// actual profiles once they exist.
const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Facebook', href: '#', icon: 'M13.5 9H16V6h-2.5C11.6 6 10 7.6 10 9.5V11H8v3h2v7h3v-7h2.4l.6-3H13v-1.2c0-.5.4-.8.9-.8Z' },
  { label: 'Instagram', href: '#', icon: 'M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2ZM16.9 5.5a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM21 7.6a5.4 5.4 0 0 0-1.5-3.8 5.4 5.4 0 0 0-3.8-1.5c-1.5-.1-6-.1-7.5 0a5.4 5.4 0 0 0-3.8 1.5A5.4 5.4 0 0 0 3 7.6c-.1 1.5-.1 6 0 7.5a5.4 5.4 0 0 0 1.5 3.8 5.4 5.4 0 0 0 3.8 1.5c1.5.1 6 .1 7.5 0a5.4 5.4 0 0 0 3.8-1.5 5.4 5.4 0 0 0 1.5-3.8c.1-1.5.1-6 0-7.5Zm-1.9 9.1a3.6 3.6 0 0 1-2 2c-1.4.6-4.8.4-6.1.4s-4.7.1-6.1-.4a3.6 3.6 0 0 1-2-2c-.6-1.4-.4-4.8-.4-6.1s-.1-4.7.4-6.1a3.6 3.6 0 0 1 2-2c1.4-.6 4.8-.4 6.1-.4s4.7-.1 6.1.4a3.6 3.6 0 0 1 2 2c.6 1.4.4 4.8.4 6.1s.2 4.7-.4 6.1Z' },
  { label: 'X', href: '#', icon: 'M17.5 3h3l-6.6 7.5L21.5 21h-6l-4.7-6.1L5.3 21H2.3l7-8-7.5-10h6.2l4.3 5.6L17.5 3Zm-1 16.2h1.7L7.6 4.7H5.8l10.7 14.5Z' },
  { label: 'TikTok', href: '#', icon: 'M16.5 3h-3v11.4a2.6 2.6 0 1 1-2.6-2.6c.2 0 .5 0 .7.1V8.8a5.7 5.7 0 1 0 4.9 5.6V9c1.1.8 2.4 1.2 3.8 1.2V7.2c-1.6 0-3-.9-3.8-2.2V3Z' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            C-BEEMS
          </Link>
          <p>Helping Indian immigrant families in Australia care for their children.</p>
          <ul className="footer__social" aria-label="Social media">
            {SOCIAL_LINKS.map((s) => (
              <li key={s.label}>
                <a href={s.href} aria-label={s.label} target="_blank" rel="noreferrer noopener">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d={s.icon} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/videos">Videos</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Contact</h4>
          <ul>
            <li><a href="tel:123-456-7890">123-456-7890</a></li>
            <li><a href="mailto:info@mysite.com">info@mysite.com</a></li>
            <li>500 Terry Francine Street, 6th Floor, San Francisco, CA 94158</li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/accessibility">Accessibility Statement</Link></li>
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>&copy; {year} BEEMS. All rights reserved.</p>
      </div>
    </footer>
  );
}
