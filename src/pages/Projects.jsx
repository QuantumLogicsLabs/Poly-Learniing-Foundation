import { Link } from 'react-router-dom';
import ProjectShowcase from '../components/ProjectShowcase';
import { ErrorNote, SkeletonList } from '../components/States';
import { ArrowRight } from '../components/Icons';
import { useApi, useTitle } from '../lib/hooks';

export default function Projects() {
  useTitle('Projects');
  const { data, loading, error, retry } = useApi('/projects');

  return (
    <>
      <section className="page-hero">
        <div className="bg-grid" />
        <div className="glow glow-gold" />
        <div className="glow glow-violet" />
        <div className="container">
          <div className="page-hero-inner">
            <span className="eyebrow">Our projects</span>
            <h1>
              Platforms people learn on. <span className="grad-text">Places people work.</span>
            </h1>
            <p>
              Every Poly Learning Foundation project is two things at once: a learning platform for anyone who wants to grow, and a workplace
              for the people we train to build it.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading && <SkeletonList count={3} height={420} className="showcase" />}
          {error && <ErrorNote error={error} onRetry={retry} what="our projects" />}
          {data && <ProjectShowcase projects={data} />}
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="card cta-band">
            <div>
              <h2>Every platform needs people.</h2>
              <p>Course authors, AI trainers, security researchers, lab designers, maintainers — see the roles each project creates.</p>
            </div>
            <div>
              <Link to="/get-involved" className="btn btn-grad">Explore the roles <ArrowRight /></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
