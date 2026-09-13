import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const submit = (e) => {
    e.preventDefault();
    toast.success('Message sent. We will get back to you shortly.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <h2 className="h4 mb-3">Contact us</h2>
      <form onSubmit={submit} className="card card-civic p-4">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input required className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" required className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="mb-3">
          <label className="form-label">Message</label>
          <textarea required rows={4} className="form-control" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
        <button className="btn btn-civic">Send message</button>
      </form>
    </div>
  );
}
