import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import InquiryForm from '../components/InquiryForm';
import RoleCard from '../components/RoleCard';
import Reveal from '../components/Reveal';
import { ErrorNote, SkeletonList } from '../components/States';
import { ArrowRight, Briefcase, Cap, Handshake, Users } from '../components/Icons';
import { useApi, useTitle } from '../lib/hooks';
import { PROJECT_META } from '../lib/meta';

const WAYS = [
  { icon: Cap, accent: 'var(--gold)', title: 'Learn', text: 'Start on any of our platforms. Every role begins with learning.', to: '/projects', cta: 'Pick a platform' },
  { icon: Briefcase, accent: 'var(--violet)', title: 'Train into a role', text: 'Choose a job we invented and follow its path from learner to professional.', to: '#roles', cta: 'Browse roles' },
  { icon: Users, accent: 'var(--cyan)', title: 'Volunteer', text: 'Already skilled? Mentor learners, review work or help build the platforms.', to: '#apply', cta: 'Offer your time' },
  { icon: Handshake, accent: 'var(--pink)', title: 'Partner or support', text: 'Schools, companies and donors help us create more roles for more people.', to: '/contact', cta: 'Talk to us' },
];

export default function GetInvolved() {
  useTitle('Get involved');
  const roles = useApi('/roles');
  const [params, setParams] = useSearchParams();
  const selectedRole = params.get('role') || '';
  const [filter, setFilter] = useState('all');

  const visible = useMemo(
    () => (roles.data || []).filter((r) => filter === 'all' || r.project === filter),
    [roles.data, filter]
  );

  const apply = (slug) => {
    setParams({ role: slug }, { replace: true, preventScrollReset: true });
    document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <section className="page-hero">
        <div className="bg-grid" />
        <div className="glow glow-gold" />
        <div className="glow glow-violet" />
        <div className="container">
          <div className="page-hero-inner">
            <span className="eyebrow">Get involved</span>
            <h1>
              The jobs here didn’t exist <span className="grad-text">until we invented them.</span>
            </h1>
            <p>
              Each of our platforms creates new work. Pick a role, learn on our platforms, contribute alongside our team, and grow into the job.
              Already experienced? Volunteer and help the next person through.
            </p>
            <div className="hero-actions">
              <a href="#roles" className="btn btn-primary">Browse roles <ArrowRight /></a>
              <a href="#apply" className="btn btn-ghost">Apply or volunteer</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="pillars" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {WAYS.map(({ icon: Icon, ...w }, i) => (
              <Reveal key={w.title} className="card pillar" delay={i * 70} style={{ '--accent': w.accent, display: 'flex', flexDirection: 'column' }}>
                <div className="pillar-icon"><Icon /></div>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
                {w.to.startsWith('#') ? (
                  <a href={w.to} className="link-arrow" style={{ marginTop: 'auto', paddingTop: 18 }}>{w.cta} <ArrowRight /></a>
                ) : (
                  <Link to={w.to} className="link-arrow" style={{ marginTop: 'auto', paddingTop: 18 }}>{w.cta} <ArrowRight /></Link>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" id="roles" aria-labelledby="roles-title">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Roles we’ve invented</span>
            <h2 id="roles-title">Find the work that fits you</h2>
            <p>Every role lists the skills that help and the path we’ll walk with you to get there. No role requires you to already be an expert.</p>
          </div>
          <div className="filters" role="group" aria-label="Filter roles by project">
            {[['all', 'All roles'], ...Object.entries(PROJECT_META).map(([slug, m]) => [slug, m.name])].map(([value, label]) => (
              <button key={value} type="button" className="filter-btn" aria-pressed={filter === value} onClick={() => setFilter(value)}>
                {label}
              </button>
            ))}
          </div>
          {roles.loading && <SkeletonList count={3} height={360} className="roles-grid" />}
          {roles.error && <ErrorNote error={roles.error} onRetry={roles.retry} what="our roles" />}
          {roles.data && (
            <div className="roles-grid">
              {visible.map((r) => (
                <RoleCard key={r.slug} role={r} onApply={apply} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section" id="apply" aria-labelledby="apply-title">
        <div className="container contact-grid">
          <div>
            <span className="eyebrow">Apply or volunteer</span>
            <h2 id="apply-title" style={{ marginTop: 16, fontSize: 'clamp(30px, 4vw, 46px)' }}>Start your path</h2>
            <p className="muted" style={{ marginTop: 16 }}>Tell us a little about yourself. A real person reads every message.</p>
            <ol className="role-path" style={{ marginTop: 28, '--accent': 'var(--violet)', padding: 22, gap: 14 }}>
              <li><strong>Tell us about you</strong> — what you know today and what you want to do.</li>
              <li><strong>Get a learning path</strong> — we point you to the right courses and first tasks.</li>
              <li><strong>Contribute and grow</strong> — work alongside our team until the role is yours.</li>
            </ol>
          </div>
          <div className="card form-card">
            <InquiryForm types={['apply', 'volunteer', 'learner']} roles={roles.data || []} role={selectedRole} initialType={selectedRole ? 'apply' : undefined} />
          </div>
        </div>
      </section>
    </>
  );
}
