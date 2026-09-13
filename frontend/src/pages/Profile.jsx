import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function Profile() {
  const [me, setMe] = useState(null);
  const [passwords, setPasswords] = useState({ newPassword: '' });

  useEffect(() => {
    api.get('/users/me').then((res) => setMe(res.data)).catch(() => {});
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/me', me);
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('file', file);
    const res = await api.post('/files/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    setMe({ ...me, profilePhotoUrl: res.data.url });
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/me/password', passwords);
      toast.success('Password changed');
      setPasswords({ newPassword: '' });
    } catch {
      toast.error('Failed to change password');
    }
  };

  if (!me) return <div className="container py-4">Loading…</div>;

  return (
    <div className="container py-4" style={{ maxWidth: 560 }}>
      <h2 className="h4 mb-3">My profile</h2>
      <form onSubmit={saveProfile} className="card card-civic p-4 mb-4">
        {me.profilePhotoUrl && (
          <img src={me.profilePhotoUrl} alt="profile" style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' }} className="mb-3" />
        )}
        <div className="mb-3">
          <label className="form-label">Profile photo</label>
          <input type="file" accept="image/*" className="form-control" onChange={uploadPhoto} />
        </div>
        <div className="mb-3">
          <label className="form-label">Full name</label>
          <input className="form-control" value={me.fullName || ''} onChange={(e) => setMe({ ...me, fullName: e.target.value })} />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input className="form-control" value={me.phone || ''} onChange={(e) => setMe({ ...me, phone: e.target.value })} />
        </div>
        <button className="btn btn-civic">Save changes</button>
      </form>

      <form onSubmit={changePassword} className="card card-civic p-4">
        <h6 className="mb-3">Change password</h6>
        <div className="mb-3">
          <label className="form-label">New password</label>
          <input type="password" minLength={8} required className="form-control" value={passwords.newPassword}
            onChange={(e) => setPasswords({ newPassword: e.target.value })} />
        </div>
        <button className="btn btn-civic-outline">Update password</button>
      </form>
    </div>
  );
}
