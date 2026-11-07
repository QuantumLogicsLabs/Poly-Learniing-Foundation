import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <Link to="/" className="brand">
              <Logo className="brand-mark" />
              <span className="brand-text">Poly Learning Foundation</span>
            </Link>
            <p>
              A non-profit organization that invents jobs. We build learning platforms, design the new roles each one creates, and train
              people to fill them.
            </p>
          </div>
          <div>
            <h4>Projects</h4>
            <ul>
              <li><Link to="/projects/polycode">PolyCode</Link></li>
              <li><Link to="/projects/digital-logics-studio">Digital Logics Studio</Link></li>
              <li><Link to="/projects/calculus-runtime">Calculus Runtime</Link></li>
            </ul>
          </div>
          <div>
            <h4>Foundation</h4>
            <ul>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/about#how-it-works">How we invent jobs</Link></li>
              <li><Link to="/about#faq">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4>Take part</h4>
            <ul>
              <li><Link to="/get-involved">Roles we've invented</Link></li>
              <li><Link to="/get-involved#apply">Apply or volunteer</Link></li>
              <li><Link to="/contact">Partner or donate</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} Poly Learning Foundation. A non-profit organization.</span>
          <span>Learn. Build. Invent the work.</span>
        </div>
      </div>
    </footer>
  );
}
