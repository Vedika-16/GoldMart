import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      setStatus('error');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1200);
  };

  return (
    <section className="newsletter-section container">
      <div className="newsletter-card glass-panel">
        <Mail className="newsletter-icon" size={36} />

        <h2>
          Stay in the <span className="gold-text">Golden Loop</span>
        </h2>

        {status !== 'success' ? (
          <>
            <p>
              Subscribe to receive exclusive offers, gold market insights, and early access to our newest collections.
            </p>

            <form className="newsletter-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                aria-label="Email address"
                id="newsletter-email"
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={status === 'loading'}
                id="newsletter-submit"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>

            {status === 'error' && (
              <p className="newsletter-error">{errorMsg}</p>
            )}

            <p className="newsletter-disclaimer">
              No spam, ever. Unsubscribe anytime with a single click.
            </p>
          </>
        ) : (
          <div className="newsletter-success">
            <div className="newsletter-success-icon">
              <CheckCircle size={28} />
            </div>
            <h3>You're In!</h3>
            <p>Welcome to the LUXEGOLD inner circle. Expect golden surprises soon.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
