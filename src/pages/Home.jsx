import { Link } from 'react-router-dom';
import HeroFilm from '../components/HeroFilm';
import ProjectShowcase from '../components/ProjectShowcase';
import RoleCard from '../components/RoleCard';
import Reveal from '../components/Reveal';
import SubscribeForm from '../components/SubscribeForm';
import { ErrorNote, SkeletonList } from '../components/States';
import { ArrowRight, Briefcase, Cap, Code, Gift, Heart, Target } from '../components/Icons';
import { useApi, useTitle } from '../lib/hooks';

export const STEPS = [
  { accent: 'var(--gold)', icon: Code, title: 'Build free platforms', text: 'We create learning platforms anyone with a browser can use — no fees, no gatekeeping.' },
  { accent: 'var(--violet)', icon: Briefcase, title: 'Create new roles', text: 'Every platform needs course authors, mentors, engineers and maintainers. Those are new jobs.' },
  { accent: 'var(--cyan)', icon: Cap, title: 'Train people for them', text: 'Learners grow into those roles step by step — first contributors, then professionals.' },
];

const PILLARS = [
  { accent: 'var(--pink)', icon: Heart, title: 'Non-profit by design', text: 'Poly Learning Foundation exists for its mission, not for shareholders. What we build serves learners first.' },
  { accent: 'var(--gold)', icon: Gift, title: 'Free to learn', text: 'Our platforms are built so that anyone, anywhere, can start learning without paying to get through the door.' },
  { accent: 'var(--cyan)', icon: Target, title: 'Jobs as the outcome', text: 'We measure success by the people we train and the work they go on to do — not by revenue.' },
];

export default function Home() {
  useTitle();
  const projects = useApi('/projects');
  const roles = useApi('/roles');
  const roleCount = roles.data?.length;

  return (
    <>
      {/* ---------------- Hero with the foundation film ---------------- */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="bg-grid" />
        <div className="glow glow-gold" />
        <div className="glow glow-violet" />
        <div className="glow glow-cyan" />
        <div className="container hero-stack">
          <div className="hero-copy">
            <span className="badge"><Heart /> A non-profit organization</span>
            <h1 id="hero-title">
              We don’t find jobs.
              <br />
              <span className="grad-text">We invent them.</span>
            </h1>
            <p className="hero-lead">
              <strong>Poly Learning Foundation</strong> builds learning platforms — <strong>PolyCode</strong>, <strong>Digital Logics Studio</strong> and{' '}
              <strong>Calculus Runtime</strong> — and turns every one of them into new kinds of work that our learners are trained to do.
            </p>
            <div className="hero-actions">
              <Link to="/projects" className="btn btn-primary">Explore our projects <ArrowRight /></Link>
              <Link to="/get-involved" className="btn btn-ghost">See the jobs we’ve invented</Link>
            </div>
          </div>
          <HeroFilm />
          <ul className="hero-facts">
            <li><b>3</b> live learning platforms</li>
            <li><b>{roleCount ?? 9}</b> new roles invented</li>
            <li><b>100+</b> courses on PolyCode</li>
            <li><b>1</b> mission: create work</li>
          </ul>
        </div>
      </section>

      {/* ---------------- Non-profit pillars ---------------- */}
      <section className="section section-alt" aria-labelledby="np-title">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">Non-profit organization</span>
            <h2 id="np-title">A foundation built to create work, not profit</h2>
            <p>Most organizations help people find jobs that already exist. We go one step earlier: we create the work itself, then open the door to it.</p>
          </Reveal>
          <div className="pillars">
            {PILLARS.map(({ icon: Icon, ...p }, i) => (
              <Reveal key={p.title} className="card pillar" delay={i * 90} style={{ '--accent': p.accent }}>
                <div className="pillar-icon"><Icon /></div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- How we invent jobs ---------------- */}
      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">How we invent jobs</span>
            <h2 id="how-title">Learning that turns into work</h2>
            <p>The same loop runs inside every project we launch.</p>
          </Reveal>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} className="step" delay={i * 120} style={{ '--accent': s.accent }}>
                <div className="step-num">0{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- Projects ---------------- */}
      <section className="section section-alt" id="projects" aria-labelledby="projects-title">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Our projects</span>
            <h2 id="projects-title">Three platforms. Each one a source of new jobs.</h2>
            <p>PolyCode teaches programming, Digital Logics Studio teaches how computers think, and Calculus Runtime teaches the mathematics behind it all.</p>
          </Reveal>
          {projects.loading && <SkeletonList count={3} height={420} className="showcase" />}
          {projects.error && <ErrorNote error={projects.error} onRetry={projects.retry} what="our projects" />}
          {projects.data && <ProjectShowcase projects={projects.data} />}
        </div>
      </section>

      {/* ---------------- Roles ---------------- */}
      <section className="section" aria-labelledby="roles-title">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Jobs we’ve invented</span>
            <h2 id="roles-title">Roles that didn’t exist until we built the platform</h2>
            <p>Each role comes with a path: you learn on our platforms, contribute to them, and grow into the job.</p>
          </Reveal>
          {roles.loading && <SkeletonList count={3} height={240} className="roles-grid" />}
          {roles.error && <ErrorNote error={roles.error} onRetry={roles.retry} what="our roles" />}
          {roles.data && (
            <div className="roles-grid">
              {roles.data.slice(0, 6).map((r, i) => (
                <Reveal key={r.slug} delay={(i % 3) * 80} style={{ display: 'grid' }}>
                  <RoleCard role={r} compact />
                </Reveal>
              ))}
            </div>
          )}
          <div className="section-foot">
            <Link to="/get-involved" className="btn btn-ghost">See every role and how to apply <ArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="section-tight">
        <div className="container">
          <Reveal className="card cta-band">
            <div>
              <span className="eyebrow">Join the foundation</span>
              <h2 style={{ marginTop: 14 }}>
                Learn with us. <span className="grad-text">Then work with us.</span>
              </h2>
              <p>Get occasional updates on new platforms, new roles and new ways to take part. No spam — unsubscribe any time.</p>
            </div>
            <SubscribeForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
