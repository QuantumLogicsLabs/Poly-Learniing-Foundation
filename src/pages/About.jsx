import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { ArrowRight } from '../components/Icons';
import { useTitle } from '../lib/hooks';

const CYCLE = [
  { accent: 'var(--gold)', title: 'Learn', text: 'Anyone can start on PolyCode, Digital Logics Studio or Calculus Runtime.' },
  { accent: 'var(--pink)', title: 'Practise', text: 'Challenges, labs and projects turn knowledge into skill.' },
  { accent: 'var(--violet)', title: 'Contribute', text: 'Learners help write lessons, train AI tutors and build features.' },
  { accent: 'var(--cyan)', title: 'Work', text: 'Contributors grow into the roles the platforms created.' },
];

const VALUES = [
  { title: 'People before profit', text: 'As a non-profit, every decision is judged by one question: does it help more people learn and find meaningful work?' },
  { title: 'Invent, don’t wait', text: 'Instead of waiting for jobs to appear, we design platforms whose growth creates new roles by design.' },
  { title: 'Learning is the entry ticket', text: 'You don’t need a degree or connections to start. You need curiosity — and our platforms supply the rest.' },
  { title: 'Grow the next person', text: 'Everyone who joins is expected to help train whoever comes after them. That is how the loop keeps turning.' },
];

const FAQ = [
  { q: 'Is Poly Learning Foundation a non-profit?', a: 'Yes. Poly Learning Foundation is a non-profit organization. Our purpose is to help people learn and to create work for them — not to generate profit for owners.' },
  { q: 'What does “we invent jobs” mean?', a: 'Each platform we build needs people to keep it running and growing: course authors, AI trainers, security researchers, lab designers, maintainers and teachers. We design those roles deliberately, then train learners to fill them.' },
  { q: 'Do I need experience to apply for a role?', a: 'No. Every role comes with a path that starts with learning on one of our platforms. Tell us where you are today and we will suggest the first steps.' },
  { q: 'How can organizations help?', a: 'Schools can use our platforms with their students, companies can sponsor roles or mentor learners, and donors can fund new platforms. Get in touch through the contact page.' },
  { q: 'Which projects does the foundation run?', a: 'Today: PolyCode (programming), Digital Logics Studio (digital logic and circuits) and Calculus Runtime (university mathematics). More platforms — and more roles — are on the way.' },
];

export default function About() {
  useTitle('About');
  return (
    <>
      <section className="page-hero">
        <div className="bg-grid" />
        <div className="glow glow-gold" />
        <div className="glow glow-violet" />
        <div className="container">
          <div className="page-hero-inner">
            <span className="eyebrow">About the foundation</span>
            <h1>
              A non-profit that <span className="grad-text">invents jobs.</span>
            </h1>
            <p>
              Poly Learning Foundation started from a simple observation: the best way to get someone into meaningful work is to build something
              that needs them — and then teach them how to do it.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split" style={{ alignItems: 'start', gap: 'clamp(28px, 5vw, 64px)' }}>
          <Reveal>
            <span className="eyebrow">Our mission</span>
            <h2 style={{ marginTop: 16, fontSize: 'clamp(28px, 3.6vw, 42px)' }}>Create the work. Then open the door to it.</h2>
          </Reveal>
          <Reveal className="prose" delay={100}>
            <p>
              Most organizations help people compete for jobs that already exist. We think there is a bigger opportunity one step earlier:
              <strong> creating new work in the first place</strong>.
            </p>
            <p>
              So we build learning platforms. Each one teaches a valuable subject — programming, digital logic, university mathematics — and each
              one needs people to grow it: authors, mentors, engineers, researchers and teachers. Those are real roles, and they exist because the
              platform does.
            </p>
            <p>
              Because we are a <strong>non-profit organization</strong>, those roles go to the people who learned on our platforms. Learners become
              contributors, contributors become professionals, and professionals train the next learners.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section-alt" id="how-it-works">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">How it works</span>
            <h2>The loop that creates jobs</h2>
            <p>Every project we run follows the same four steps — and every person who completes them helps the next one start.</p>
          </Reveal>
          <div className="cycle">
            {CYCLE.map((c, i) => (
              <Reveal key={c.title} className="card cycle-step" delay={i * 90} style={{ '--accent': c.accent }}>
                <b>0{i + 1}</b>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">What we believe</span>
            <h2>Our values</h2>
          </Reveal>
          <div className="feature-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', '--accent': 'var(--violet)' }}>
            {VALUES.map((v, i) => (
              <Reveal key={v.title} className="card feature" delay={(i % 4) * 70}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" id="faq">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">FAQ</span>
            <h2>Questions people ask us</h2>
          </div>
          <div className="faq">
            {FAQ.map((f) => (
              <details key={f.q} className="card">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/get-involved" className="btn btn-grad">Get involved <ArrowRight /></Link>
            <Link to="/contact" className="btn btn-ghost">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
