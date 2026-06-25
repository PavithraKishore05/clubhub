import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/getErrorMessage';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (formError) setFormError('');
  };

  const handleRoleChange = (role) => {
    setForm((prev) => ({ ...prev, role }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    else if (form.name.trim().length < 2) next.name = 'Name must be at least 2 characters';

    if (!form.email.trim()) next.email = 'Email is required';
    else if (!EMAIL_REGEX.test(form.email)) next.email = 'Enter a valid email address';

    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters';

    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await signup(form.name.trim(), form.email.trim(), form.password, 'user');
      navigate('/', { replace: true });
    } catch (err) {
      setFormError(getErrorMessage(err, 'Could not create your account'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create an account</h1>
          <p>Enter your details below to get started.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {formError && (
            <div className="form-banner" role="alert">
              {formError}
            </div>
          )}

          <div className="field">
            <label htmlFor="name">
              Name<span className="required">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={handleChange}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="field">
            <label htmlFor="email">
              Email<span className="required">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="mail@domain.com"
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
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">
              Confirm password<span className="required">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
              aria-invalid={Boolean(errors.confirmPassword)}
            />
            {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
          </div>

<button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Sign up'}
            {!submitting && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}
