import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/videos', label: 'Videos' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(useLocation().pathname);
  const location = useLocation();

  if (location.pathname !== lastPath) {
    setLastPath(location.pathname);
    if (open) setOpen(false);
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <span className="navbar__mark">C</span>
          <span>C-BEEMS</span>
        </NavLink>

        <button
          type="button"
          className={`navbar__toggle ${open ? 'is-open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar__links ${open ? 'is-open' : ''}`} aria-label="Primary">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? 'is-active' : '')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
