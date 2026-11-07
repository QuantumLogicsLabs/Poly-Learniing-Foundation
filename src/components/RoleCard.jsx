import { Link } from 'react-router-dom';
import { projectMeta } from '../lib/meta';
import { ArrowRight } from './Icons';

export default function RoleCard({ role, onApply, compact = false }) {
  const meta = projectMeta(role.project);
  return (
    <article className="card role-card" style={{ '--accent': meta.accent }}>
      <div className="role-top">
        <span className="role-project">{meta.name}</span>
        <span className="role-track">{role.track}</span>
      </div>
      <h3>{role.title}</h3>
      <p>{role.summary}</p>
      {!compact && role.pathway?.length > 0 && (
        <div>
          <p className="role-path-label">Your path into this role</p>
          <ol className="role-path" style={{ marginTop: 10 }}>
            {role.pathway.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}
      {!compact && role.skills?.length > 0 && (
        <div className="chips" aria-label="Helpful skills">
          {role.skills.map((s) => (
            <span key={s} className="chip">{s}</span>
          ))}
        </div>
      )}
      {onApply ? (
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => onApply(role.slug)}>
          Apply for this role <ArrowRight />
        </button>
      ) : (
        <Link to={`/get-involved?role=${role.slug}#apply`} className="btn btn-ghost btn-sm">
          Apply for this role <ArrowRight />
        </Link>
      )}
    </article>
  );
}
