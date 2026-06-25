import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/getErrorMessage';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (formError) setFormError('');
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) {
      next.email = 'Email or username is required';
    } else if (form.email.includes('@') && !EMAIL_REGEX.test(form.email)) {
      // Only validate email format when it looks like an email (contains @)
      next.email = 'Enter a valid email address';
    }
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await login(form.email.trim(), form.password);
      // Role-based redirect: admin → /admin, user → original destination
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(redirectTo === '/admin' ? '/dashboard' : redirectTo, { replace: true });
      }
    } catch (err) {
      setFormError(getErrorMessage(err, 'Invalid credentials'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Sign in</h1>
          <p>Enter your email / username and password to sign in.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {formError && (
            <div className="form-banner" role="alert">
              {formError}
            </div>
          )}

          <div className="field">
            <label htmlFor="email">
              Email / Username<span className="required">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="username"
              placeholder="Email or username"
              value={form.email}
              onChange={handleChange}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="field">
            <label htmlFor="password">
              Password<span className="required">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.password)}
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute', right: 10, top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', padding: 2, display: 'flex',
                }}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
            {!submitting && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account? <Link to="/signup">Sign up here</Link>
        </div>
      </div>
    </div>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 7 11 7a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
