import { useState } from 'react';
import { api } from '../lib/api';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ state: 'sending', message: '' });
    try {
      const res = await api.post('/subscribers', { email });
      setStatus({ state: 'ok', message: res.message });
      setEmail('');
    } catch (err) {
      setStatus({ state: 'error', message: err.details?.email || err.message });
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor="subscribe-email" className="visually-hidden">Email address</label>
      <div className="subscribe">
        <input
          id="subscribe-email"
          className="input"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn btn-grad" disabled={status.state === 'sending'}>
          {status.state === 'sending' ? 'Subscribing…' : 'Get updates'}
        </button>
      </div>
      <div aria-live="polite" style={{ marginTop: status.message ? 14 : 0 }}>
        {status.message && <p className={`form-status ${status.state === 'ok' ? 'ok' : 'error'}`}>{status.message}</p>}
      </div>
    </form>
  );
}
