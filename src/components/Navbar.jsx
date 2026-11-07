import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { Close, Menu } from './Icons';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/get-involved', label: 'Get involved' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand" aria-label="Poly Learning Foundation — home">
          <Logo className="brand-mark" />
          <span className="brand-text">
            Poly Learning Foundation
            <small>Non-profit organization</small>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Main">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/get-involved#apply" className="btn btn-grad btn-sm nav-cta">
          Join us
        </Link>

        <button className="nav-toggle" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
          {open ? <Close /> : <Menu />}
        </button>
      </div>

      <nav id="mobile-nav" className={`nav-panel${open ? ' open' : ''}`} aria-label="Mobile">
        {LINKS.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} tabIndex={open ? 0 : -1}>
            {l.label}
          </NavLink>
        ))}
        <Link to="/get-involved#apply" className="btn btn-grad" tabIndex={open ? 0 : -1}>
          Join us
        </Link>
      </nav>
    </header>
  );
}
