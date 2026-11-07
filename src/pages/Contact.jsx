import InquiryForm from '../components/InquiryForm';
import { useTitle } from '../lib/hooks';

const REASONS = [
  { title: 'Partner with us', text: 'Bring our platforms to your classroom, sponsor a role, or mentor learners from your company.' },
  { title: 'Support the mission', text: 'Donations fund new platforms and the training paths behind every role we create.' },
  { title: 'Ask anything', text: 'Questions about our projects, the foundation, or how to start learning — we read every message.' },
];

export default function Contact() {
  useTitle('Contact');
  return (
    <>
      <section className="page-hero">
        <div className="bg-grid" />
        <div className="glow glow-gold" />
        <div className="glow glow-violet" />
        <div className="container">
          <div className="page-hero-inner">
            <span className="eyebrow">Contact</span>
            <h1>
              Let’s create work <span className="grad-text">together.</span>
            </h1>
            <p>Whether you want to learn, partner, support or simply say hello — send us a message and we’ll reply by email.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-aside">
            {REASONS.map((r) => (
              <div key={r.title} className="card">
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </div>
            ))}
          </div>
          <div className="card form-card">
            <InquiryForm types={['general', 'partner', 'donate', 'volunteer', 'learner']} />
            <p className="muted" style={{ marginTop: 16, fontSize: 14 }}>
              Applying for a role? Use the <a href="/get-involved#apply" style={{ textDecoration: 'underline' }}>application form</a> so you can pick the role.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
