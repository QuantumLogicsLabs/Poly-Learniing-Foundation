import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { projectMeta } from '../lib/meta';

export const INQUIRY_TYPES = {
  apply: { label: 'Apply for a role', hint: 'Train into a job we invented' },
  volunteer: { label: 'Volunteer', hint: 'Give a few hours a week' },
  learner: { label: 'Start learning', hint: 'Get help choosing a path' },
  partner: { label: 'Partner with us', hint: 'Schools, companies, NGOs' },
  donate: { label: 'Support us', hint: 'Fund the mission' },
  general: { label: 'Something else', hint: 'Questions & ideas' },
};

const EMPTY = { name: '', email: '', organization: '', message: '', website: '' };

/**
 * One form for every way of getting in touch. Posts to POST /api/inquiries.
 * `types` limits which options are offered; `role` preselects a role (type "apply").
 */
export default function InquiryForm({ types = Object.keys(INQUIRY_TYPES), roles = [], initialType, role: initialRole = '' }) {
  const [type, setType] = useState(initialType || types[0]);
  const [role, setRole] = useState(initialRole);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  // Follow role changes coming from "Apply for this role" buttons.
  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
      if (types.includes('apply')) setType('apply');
    }
  }, [initialRole]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ state: 'sending', message: '' });
    setErrors({});
    try {
      const payload = { ...values, type, role: type === 'apply' ? role : undefined };
      const res = await api.post('/inquiries', payload);
      setStatus({ state: 'ok', message: res.message });
      setValues(EMPTY);
    } catch (err) {
      setErrors(err.details || {});
      setStatus({ state: 'error', message: err.message });
    }
  }

  const fieldClass = (name) => `field${errors[name] ? ' has-error' : ''}`;
  const errorFor = (name) =>
    errors[name] ? <span id={`${name}-error`} className="field-error">{errors[name]}</span> : null;
  const showOrg = type === 'partner' || type === 'donate';

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      {types.length > 1 && (
        <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
          <legend style={{ fontSize: 14, fontWeight: 600, color: '#dbe1f1', marginBottom: 8 }}>I'd like to…</legend>
          <div className="type-picker">
            {types.map((t) => (
              <label key={t} className="type-option">
                <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} />
                <span>
                  {INQUIRY_TYPES[t].label}
                  <small>{INQUIRY_TYPES[t].hint}</small>
                </span>
              </label>
            ))}
          </div>
          {errorFor('type')}
        </fieldset>
      )}

      {type === 'apply' && (
        <div className={fieldClass('role')}>
          <label htmlFor="inq-role">Role</label>
          <select id="inq-role" className="select" value={role} onChange={(e) => { setRole(e.target.value); setErrors((er) => ({ ...er, role: undefined })); }} aria-invalid={!!errors.role} aria-describedby={errors.role ? 'role-error' : undefined}>
            <option value="">Choose a role…</option>
            {roles.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.title} — {projectMeta(r.project).name}
              </option>
            ))}
          </select>
          {errorFor('role')}
        </div>
      )}

      <div className="form-row">
        <div className={fieldClass('name')}>
          <label htmlFor="inq-name">Your name</label>
          <input id="inq-name" className="input" autoComplete="name" value={values.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />
          {errorFor('name')}
        </div>
        <div className={fieldClass('email')}>
          <label htmlFor="inq-email">Email</label>
          <input id="inq-email" className="input" type="email" autoComplete="email" value={values.email} onChange={set('email')} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
          {errorFor('email')}
        </div>
      </div>

      {showOrg && (
        <div className={fieldClass('organization')}>
          <label htmlFor="inq-org">Organization <span className="hint">(optional)</span></label>
          <input id="inq-org" className="input" autoComplete="organization" value={values.organization} onChange={set('organization')} />
        </div>
      )}

      <div className={fieldClass('message')}>
        <label htmlFor="inq-message">
          {type === 'apply' ? 'Tell us about yourself and why this role' : 'Message'}
        </label>
        <textarea id="inq-message" className="textarea" value={values.message} onChange={set('message')} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined}
          placeholder={type === 'apply' ? 'What you know already, what you want to learn, and how much time you have.' : 'How can we help?'} />
        {errorFor('message')}
      </div>

      {/* Honeypot for bots - hidden from people and screen readers. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="inq-website">Website</label>
        <input id="inq-website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
      </div>

      <div aria-live="polite">
        {status.message && <p className={`form-status ${status.state === 'ok' ? 'ok' : 'error'}`}>{status.message}</p>}
      </div>

      <button className="btn btn-grad btn-block" disabled={status.state === 'sending'}>
        {status.state === 'sending' ? 'Sending…' : type === 'apply' ? 'Send application' : 'Send message'}
      </button>
    </form>
  );
}
