import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <div className="card card-civic p-4">
        <h2 className="h4 mb-3">{t('login')}</h2>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" required className="form-control" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" required className="form-control" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Link to="/forgot-password" className="small">Forgot password?</Link>
          </div>
          <button className="btn btn-civic w-100" disabled={loading}>
            {loading ? 'Signing in…' : t('login')}
          </button>
        </form>
        <p className="mt-3 text-center small">
          No account? <Link to="/register">{t('register')}</Link>
        </p>
      </div>
    </div>
  );
}
