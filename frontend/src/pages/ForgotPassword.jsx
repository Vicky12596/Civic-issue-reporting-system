import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/auth/forgot-password?email=${encodeURIComponent(email)}`);
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <div className="card card-civic p-4">
        <h2 className="h4 mb-3">Reset your password</h2>
        {sent ? (
          <p>If that email exists in our system, a reset link has been sent.</p>
        ) : (
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" required className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button className="btn btn-civic w-100">Send reset link</button>
          </form>
        )}
      </div>
    </div>
  );
}
