import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 460 }}>
      <div className="card card-civic p-4">
        <h2 className="h4 mb-3">{t('register')}</h2>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Full name</label>
            <input required className="form-control" value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" required className="form-control" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input className="form-control" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" required minLength={8} className="form-control" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button className="btn btn-civic w-100" disabled={loading}>
            {loading ? 'Creating account…' : t('register')}
          </button>
        </form>
        <p className="mt-3 text-center small">
          Already have an account? <Link to="/login">{t('login')}</Link>
        </p>
      </div>
    </div>
  );
}
