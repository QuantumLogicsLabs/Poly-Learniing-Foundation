import { Link, useParams } from 'react-router-dom';
import { BrowserFrame, ProjectCard } from '../components/ProjectShowcase';
import RoleCard from '../components/RoleCard';
import Reveal from '../components/Reveal';
import { ErrorNote, SkeletonList } from '../components/States';
import { ArrowRight, Check, ExternalLink, Layers } from '../components/Icons';
import { useApi, useTitle } from '../lib/hooks';
import NotFound from './NotFound';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, loading, error, retry } = useApi(`/projects/${slug}`);
  const all = useApi('/projects');
  useTitle(project?.name || 'Project');

  if (error?.status === 404) return <NotFound />;
  if (loading || error) {
    return (
      <section className="section">
        <div className="container">
          {loading ? <SkeletonList count={1} height={460} /> : <ErrorNote error={error} onRetry={retry} what="this project" />}
        </div>
      </section>
    );
  }

  const others = (all.data || []).filter((p) => p.slug !== project.slug);

  return (
    <>
      <section className="page-hero detail-hero" style={{ '--accent': project.accent }}>
        <div className="bg-grid" />
        <div className="glow glow-accent" />
        <div className="container detail-grid" style={{ position: 'relative' }}>
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link to="/projects">Projects</Link> <span aria-hidden="true">/</span> <span>{project.name}</span>
            </nav>
            <h1 style={{ marginTop: 18, fontSize: 'clamp(38px, 5.4vw, 60px)' }}>{project.name}</h1>
            <p style={{ marginTop: 12, fontSize: 20, color: '#dfe5f5', fontWeight: 500 }}>{project.tagline}</p>
            <p style={{ marginTop: 14, color: 'var(--muted)' }}>{project.summary}</p>
            <div className="hero-actions" style={{ marginTop: 26 }}>
              {project.url && (
                <a href={project.url} target="_blank" rel="noreferrer" className="btn btn-primary">
                  Open {project.name} <ExternalLink />
                </a>
              )}
              <a href="#roles" className="btn btn-ghost">Roles it creates</a>
            </div>
            <p style={{ marginTop: 22 }}>
              <span className="status-pill">{project.status === 'live' ? 'Live now' : project.status}</span>
            </p>
          </div>
          <BrowserFrame project={project} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">About the platform</span>
            <h2>What learners can do</h2>
            <p>{project.description}</p>
          </Reveal>
          <div className="feature-grid" style={{ '--accent': project.accent }}>
            {project.features?.map((f, i) => (
              <Reveal key={f.title} className="card feature" delay={(i % 3) * 80}>
                <div className="feature-icon"><Check /></div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container split">
          <div className="card panel">
            <h3>Inside {project.name}</h3>
            <div className="component-list">
              {project.components?.map((c) => (
                <div key={c.name} className="card component" style={{ background: 'rgba(255,255,255,.02)' }}>
                  <h4>{c.name}</h4>
                  <p>{c.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card panel" style={{ '--accent': project.accent }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Layers width={20} height={20} /> Built with</h3>
            <div className="chips">
              {project.stack?.map((s) => (
                <span key={s} className="chip chip-accent">{s}</span>
              ))}
            </div>
            <p style={{ marginTop: 22, color: 'var(--muted)' }}>
              Each technology here is a skill the roles below put to work — and part of the path we help learners follow into them.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="roles">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Jobs {project.name} creates</span>
            <h2>Train into one of these roles</h2>
            <p>Start as a learner on {project.name}, then grow along the path to doing the work yourself.</p>
          </Reveal>
          <div className="roles-grid">
            {project.roles?.map((r) => (
              <RoleCard key={r.slug} role={r} />
            ))}
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">More from the foundation</span>
              <h2>Our other projects</h2>
            </div>
            <div className={`project-grid${others.length === 2 ? ' two' : ''}`}>
              {others.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
            <div className="section-foot">
              <Link to="/projects" className="link-arrow">All projects <ArrowRight /></Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
