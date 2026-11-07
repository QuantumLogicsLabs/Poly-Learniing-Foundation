import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { useTitle } from '../lib/hooks';

export default function NotFound() {
  useTitle('Page not found');
  return (
    <section className="section" style={{ textAlign: 'center', minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
      <div className="container">
        <Logo className="brand-mark" style={{ width: 72, height: 72, margin: '0 auto' }} />
        <h1 style={{ marginTop: 28, fontSize: 'clamp(34px, 5vw, 54px)' }}>This page hasn’t been invented yet.</h1>
        <p className="muted" style={{ marginTop: 16 }}>The link may be broken, or the page may have moved.</p>
        <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">Back to home</Link>
          <Link to="/projects" className="btn btn-ghost">See our projects</Link>
        </div>
      </div>
    </section>
  );
}
