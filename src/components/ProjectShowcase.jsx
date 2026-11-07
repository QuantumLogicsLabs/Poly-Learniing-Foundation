import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { ArrowRight, ExternalLink } from './Icons';
import { hostOf } from '../lib/meta';

export function BrowserFrame({ project }) {
  return (
    <div className="browser">
      <div className="browser-bar" aria-hidden="true">
        <i /><i /><i />
        <span className="browser-url">{hostOf(project.url)}</span>
      </div>
      <img src={project.image} alt={`Screenshot of ${project.name}`} loading="lazy" width="1200" height="750" />
    </div>
  );
}

// Large alternating rows: screenshot + story for each platform.
export default function ProjectShowcase({ projects }) {
  return (
    <div className="showcase">
      {projects.map((p, i) => (
        <Reveal as="article" key={p.slug} className="card showcase-item" style={{ '--accent': p.accent }}>
          <div className="showcase-copy">
            <span className="project-index">
              <b>0{i + 1}</b> / 0{projects.length} · {p.status === 'live' ? 'Live platform' : p.status}
            </span>
            <h3>{p.name}</h3>
            <p className="showcase-tagline">{p.tagline}</p>
            <p className="summary">{p.summary}</p>
            <div className="chips">
              {p.highlights?.map((h) => (
                <span key={h} className="chip chip-accent">{h}</span>
              ))}
            </div>
            <div className="showcase-actions">
              <Link to={`/projects/${p.slug}`} className="btn btn-primary">
                Learn more <ArrowRight />
              </Link>
              {p.url && (
                <a href={p.url} target="_blank" rel="noreferrer" className="btn btn-ghost">
                  Visit live site <ExternalLink />
                </a>
              )}
            </div>
          </div>
          <div className="showcase-media">
            <BrowserFrame project={p} />
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.slug}`} className="card project-card" style={{ '--accent': project.accent }}>
      <img src={project.image} alt="" loading="lazy" width="1200" height="750" />
      <div className="project-card-body">
        <h3>{project.name}</h3>
        <p>{project.tagline}</p>
        <span className="link-arrow">
          Explore {project.name} <ArrowRight />
        </span>
      </div>
    </Link>
  );
}
